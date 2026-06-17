from contextlib import asynccontextmanager
from datetime import datetime, timezone
import json
import uuid
import os
from typing import Any

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain_core.messages import AIMessage
from agentic_application.agents import create_supervisor_agent
from agentic_application.utils import setup_logger


# Setup logger
logger = setup_logger(__name__)

ALLOWED_ORIGINS = ["*"]

sessions: dict[str, dict[str, Any]] = {}


class CreateSessionRequest(BaseModel):
    session_id: str | None = None
    session_variables: dict[str, Any] | None = None


class CreateSessionResponse(BaseModel):
    session_id: str
    created_at: str
    session_variables: dict[str, Any] | None = None


class RunAgentRequest(BaseModel):
    message: str = Field(..., min_length=1)


class RunAgentResponse(BaseModel):
    session_id: str
    response: str
    created_at: str


def _build_session_context_message(session_variables: dict[str, Any]) -> str | None:
    if not session_variables:
        return None

    user_name = session_variables.get("userName")
    # user_position = session_variables.get("userPosition")

    context_lines = ["Use the following session context while responding:"]
    if user_name:
        context_lines.append(f"- userName: {user_name}")
    # if user_position:
    #     context_lines.append(f"- userPosition: {user_position}")

    context_lines.append(
        f"- all_session_variables: {json.dumps(session_variables, ensure_ascii=False)}"
    )

    return "\n".join(context_lines)


def _message_to_text(content: Any) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and "text" in item:
                parts.append(str(item["text"]))
            else:
                parts.append(str(item))
        return "\n".join(parts).strip()
    return str(content)


def _extract_latest_ai_text(result: dict[str, Any]) -> str:
    messages = result.get("messages", [])
    for message in reversed(messages):
        if isinstance(message, AIMessage):
            return _message_to_text(message.content)
        if getattr(message, "type", "") == "ai":
            return _message_to_text(getattr(message, "content", ""))
    return ""


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing LangChain agent with MCP tools...")
    supervisor_agent, mcp_client = await create_supervisor_agent()
    app.state.agent = supervisor_agent
    app.state.mcp_client = mcp_client
    logger.info("LangChain agent initialized successfully")
    yield

logger.info("Initializing FastAPI application...")
app = FastAPI(title="Agentic Backend", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("FastAPI application initialized successfully")


@app.post("/sessions", response_model=CreateSessionResponse)
async def create_session(request: CreateSessionRequest | None = None) -> CreateSessionResponse:
    payload = request or CreateSessionRequest()
    session_id = payload.session_id or str(uuid.uuid4())
    if session_id in sessions:
        raise HTTPException(status_code=409, detail="Session already exists")

    sessions[session_id] = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "session_variables": payload.session_variables or {},
    }
    created_at = datetime.now(timezone.utc).isoformat()
    return CreateSessionResponse(
        session_id=session_id,
        created_at=created_at,
        session_variables=sessions[session_id]["session_variables"],
    )


@app.post("/sessions/{session_id}/run", response_model=RunAgentResponse)
async def run_agent_in_session(session_id: str, request: RunAgentRequest) -> RunAgentResponse:
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session_variables = sessions[session_id].get("session_variables", {})
    run_messages: list[dict[str, str]] = []
    context_message = _build_session_context_message(session_variables)
    if context_message:
        run_messages.append({"role": "system", "content": context_message})
    run_messages.append({"role": "user", "content": request.message})

    result = await app.state.agent.ainvoke(
        {"messages": run_messages},
        config={"configurable": {"thread_id": session_id}},
    )
    response_text = _extract_latest_ai_text(result)

    if not response_text:
        response_text = "No response generated."

    created_at = datetime.now(timezone.utc).isoformat()

    return RunAgentResponse(
        session_id=session_id,
        response=response_text,
        created_at=created_at,
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8350))
    logger.info(f"Starting server on host 0.0.0.0, port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)