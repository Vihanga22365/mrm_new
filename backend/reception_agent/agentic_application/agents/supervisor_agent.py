from typing import Any
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.checkpoint.memory import MemorySaver
from ..config import MCP_SERVER_URL, OPENAI_MODEL_NAME, OPENAI_TEMPERATURE, SUPERVISOR_AGENT_TOOLS
from ..prompts.supervisor_prompt import SUPERVISOR_AGENT_INSTRUCTION


def _filter_allowed_tools(tools: list[Any]) -> list[Any]:
    if not SUPERVISOR_AGENT_TOOLS:
        return tools
    allowed_tool_names = set(SUPERVISOR_AGENT_TOOLS)
    return [tool for tool in tools if getattr(tool, "name", "") in allowed_tool_names]


async def create_supervisor_agent() -> tuple[Any, MultiServerMCPClient]:
    mcp_client = MultiServerMCPClient(
        {
            "mcp_server": {
                "transport": "http",
                "url": MCP_SERVER_URL,
            }
        }
    )
    tools = await mcp_client.get_tools()
    tools = _filter_allowed_tools(tools)

    model = ChatOpenAI(model=OPENAI_MODEL_NAME, temperature=OPENAI_TEMPERATURE)
    checkpointer = MemorySaver()

    supervisor_agent = create_agent(
        model=model,
        tools=tools,
        system_prompt=SUPERVISOR_AGENT_INSTRUCTION,
        name="supervisor_agent",
        checkpointer=checkpointer,
    )
    return supervisor_agent, mcp_client
