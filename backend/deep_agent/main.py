import os

import json
import asyncio
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd

# Load environment variables from .env file (looking in current and parent directories)
load_dotenv()

from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.responses import StreamingResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage, AIMessage

from models import AnalyzeRequest, GenerateRequest, ReviewRequest, CommentReviewRequest
from research_deep_agent import ResearchDeepAgent
from agent_utils.tools import current_usecase_context
from deepagents.backends.utils import file_data_to_string
from docx_utils import convert_markdown_to_docx
from io import BytesIO


import os

# Global storage for generated files
generated_files_content = {}

app = FastAPI(title="MRM Agent Backend")

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agent
agent = ResearchDeepAgent()

@app.get("/", response_class=HTMLResponse)
async def serve_ui():
    """Serve the single page UI."""
    html_path = Path("sample_ui.html")
    if html_path.exists():
        return html_path.read_text(encoding="utf-8")
    return "<h1>UI file not found</h1>"

@app.get("/report")
async def get_report():
    """Returns the generated final report."""
    report_path = Path("final_report.md")
    if report_path.exists():
        content = report_path.read_text(encoding="utf-8")
        return {"status": "success", "content": content}
    return {"status": "error", "message": "Report not found"}

@app.get("/download-docx")
async def download_report_docx():
    """
    Converts and downloads the final report as a DOCX file.
    """
    report_path = Path("final_report.md")
    content = ""
    
    # Check memory first (if we want the latest generated content even if not saved to disk yet)
    # But usually final_report.md is the source of truth for the download button
    if report_path.exists():
        content = report_path.read_text(encoding="utf-8")
    elif "final_report.md" in generated_files_content:
        content = generated_files_content["final_report.md"]
    
    if not content:
        return {"status": "error", "message": "Report not found"}

    # Convert to DOCX
    docx_stream = convert_markdown_to_docx(content)
    
    headers = {
        'Content-Disposition': 'attachment; filename="final_report.docx"'
    }
    
    return StreamingResponse(docx_stream, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers=headers)

@app.get("/generated-content/{file_name}")
async def get_generated_content(file_name: str):
    """
    Returns the content of a generated file from memory or disk.
    Priority: Memory (generated_files_content) -> Disk.
    """
    # 1. Try memory
    if file_name in generated_files_content:
        return {"status": "success", "content": generated_files_content[file_name]}
    
    # 2. Try disk
    path = Path(file_name)
    if path.exists():
        content = path.read_text(encoding="utf-8")
        return {"status": "success", "content": content}
        
    return {"status": "error", "message": f"File '{file_name}' not found"}

@app.post("/analyze")
async def analyze_document(request: AnalyzeRequest):
    """
    Analyzes the structure and usecase.
    Parses the Markdown structure to extract chapters and descriptions.
    """
    import re
    
    # Simple markdown parser to extract H2 headers (##) as chapters
    # and the text following them as description.
    chapters_data = []
    
    # Split by H2 headers
    # Regex to find lines starting with ##
    # We'll normalize newlines first
    structure_text = (request.structure_content or "").strip()
    if structure_text:
        content = structure_text.replace('\r\n', '\n')
    else:
        structure_file = Path("../docs/document_stucture.md")
        if not structure_file.exists():
            raise HTTPException(status_code=400, detail="No structure content in request and '../docs/document_stucture.md' not found")
        content = structure_file.read_text(encoding="utf-8").replace('\r\n', '\n')
    
    # Find all chapters: ## Chapter Title \n Description
    matches = list(re.finditer(r'^##\s+(.+)$', content, re.MULTILINE))
    
    for i in range(len(matches)):
        start_match = matches[i]
        chapter_title = start_match.group(1).strip()
        
        # Get content until next H2 or end of string
        start_index = start_match.end()
        end_index = matches[i+1].start() if i + 1 < len(matches) else len(content)
        
        description_text = content[start_index:end_index].strip()
        
        # Clean up description (remove H3 headers if we only want main description, 
        # or keep them if they are part of the detailed instructions)
        # For now, we keep everything as context/description
        
        chapters_data.append({
            "title": chapter_title,
            "description": description_text
        })

    # If no headers found, fallback
    if not chapters_data:
         chapters_data = [{"title": "General", "description": "No structure detected."}]

    return {
        "status": "success",
        "message": "Files analyzed successfully",
        "chapters": chapters_data
    }

async def stream_agent_execution(prompt: str, agent_instance=None):
    """
    Generator that streams agent events.
    Information flows:
    - Thinking logs (tool calls, thoughts)
    - Final output
    """
    print("stream_agent_execution")
    
    # Use provided agent or fallback to global default
    target_agent = agent_instance if agent_instance else agent.agent

    # 1. Set Context
    # We use running event loop to ensure context var is propagated if async
    token = current_usecase_context.set(prompt)
    
    try:
        # 2. Run Agent
        # We assume the agent is a LangGraph compiled graph
        inputs = {"messages": [HumanMessage(content=prompt)]}
        
        async for event in target_agent.astream_events(inputs, version="v1", config={"recursion_limit": 100}):


            event_type = event["event"]
            # print(f"DEBUG: Received event {event_type} from {event.get('name')}")
            
            # Filter and format events for the UI
            if event_type == "on_chat_model_stream":
                if agent_instance:
                    content = event["data"]["chunk"].content
                    if content:
                        yield json.dumps({
                            "type": "token", 
                            "content": content
                        }) + "\n"

            elif event_type == "on_chat_model_end":
                # We use streaming so we might not need this unless for final consolidation
                pass
            
            elif event_type == "on_tool_start":
                tool_name = event["name"]
                input_str = str(event["data"].get("input"))
                yield json.dumps({
                    "type": "log", 
                    "content": f"> [TOOL] Starting {tool_name}..."
                }) + "\n"
                
            elif event_type == "on_tool_end":
                tool_name = event["name"]
                
                if tool_name == "write_file":
                    try:
                        input_data = event.get("data", {}).get("input", {})
                        file_path = input_data.get("file_path")
                        content = input_data.get("content")
                        if file_path and content:
                            # Remove leading slash if present
                            if file_path.startswith("/"):
                                file_path = file_path[1:]
                            generated_files_content[file_path] = content
                            print(f"Stored {file_path} in runtime memory")
                    except Exception as e:
                        print(f"Error capturing write_file content: {e}")
                output = event["data"].get("output")
                # If think_tool, we show the thought
                if tool_name == "think_tool":
                    # Parse reflection if possible or just show generic
                    yield json.dumps({
                        "type": "log", 
                        "content": f"> [THOUGHT] {str(output)[:100]}..." 
                    }) + "\n"
                else:
                    yield json.dumps({
                        "type": "log", 
                        "content": f"> [TOOL] {tool_name} completed."
                    }) + "\n"
                    
    except asyncio.CancelledError:
        print("Client disconnected, cancelling agent execution")
        # We can perform any cleanup here if needed
        raise # Re-raise to let FastAPI/Uvicorn know it was cancelled
    except Exception as e:
        yield json.dumps({
            "type": "error",
            "content": str(e)
        }) + "\n"
    finally:
        yield json.dumps({
                        "type": "complete",
                        "content": "Agent has completed the report generation."
                    }) + "\n"
        current_usecase_context.reset(token)

def get_full_usecase_context():
    try:
        df = pd.read_csv("../docs/usecase.csv")
        if df.empty:
            raise ValueError("usecase.csv is empty")
        # Use the first row as the selected usecase
        # Use all rows: combine Category -> Description into a single dict (concatenate duplicates)
        row = {}
        for _, r in df.iterrows():
            cat = str(r.get("Category", "")).strip()
            desc = "" if pd.isna(r.get("Description")) else str(r.get("Description"))
            if not cat:
                continue
            if cat in row and row[cat]:
                row[cat] = row[cat] + " " + desc
            else:
                row[cat] = desc
        # Format usecase details as XML-like fields inside the <usecase> tag
        lines = []
        for k, v in row.items():
            tag = str(k).strip().replace(" ", "_")
            val = str(v)
            lines.append(f"<{tag}>{val}</{tag}>")
        usecase_block = "\n".join(lines)
    except Exception as e:
        usecase_block = f"<error>Could not read usecase.csv: {e}</error>"
        print(usecase_block)
    return usecase_block

@app.post("/generate")
async def generate_chapter(request: GenerateRequest):
    """
    Generates the chapter content using the agent.
    Streams newline-delimited JSON.
    """
    
    # Construct the prompt as per the notebook logic
    # In the notebook: 
    # userPrompt = f"Generate a \"{chapter}\" based on:..."
    
    
    content=f"""your task as following:
    <Topic>{request.chapter}</Topic>
    <Description>{request.chapter_description}</Description>
    <Usecase>{get_full_usecase_context()}</Usecase>
    """
    
    return StreamingResponse(
        stream_agent_execution(content),
        media_type="application/x-ndjson"
    )

@app.post("/review")
async def review_document(request: ReviewRequest):
    """
    Reviews the document using CritiqueDeepAgent.
    Streams newline-delimited JSON.
    """
    from critique_deep_agent import CritiqueDeepAgent
    
    # Initialize Critique Agent on demand (or could be global)
    critique_agent = CritiqueDeepAgent()
    
    # Context Construction
    task_input = {
        "document_content": request.document_content,
        "usecase_content": request.usecase_content,
        "technical_content": request.technical_content or "No technical documentation provided."
    }
    
    # Construct prompt for the agent (similar to invoke method but passed to stream)
    prompt = f"""
    Here is the document to review:
    <Document>
    {task_input['document_content']}
    </Document>

    Here is the usecase context:
    <Usecase>
    {task_input['usecase_content']}
    </Usecase>
    
    Here is the technical context:
    <TechnicalContext>
    {task_input['technical_content']}
    </TechnicalContext>

    Please review the document and provide a critique.
    """

    return StreamingResponse(
        stream_agent_execution(prompt, agent_instance=critique_agent.agent),
        media_type="application/x-ndjson"
    )

@app.post("/review-comment")
async def review_comment(request: CommentReviewRequest):
    """
    Reviews a specific comment using ReviewDeepAgent.
    Streams newline-delimited JSON.
    """
    from review_deep_agent import ReviewDeepAgent
    
    # Initialize Review Agent
    review_agent = ReviewDeepAgent()
    
    # Construct input for the agent
    inputs = {
        "report_content": request.report_text,
        "comment": request.comment_text,
        "additional_instructions": request.additional_instructions or ""
    }
    
    # We can reuse the `stream_agent_execution` if we construct a prompt.
    # However, ReviewDeepAgent.astream_events customizes the prompt internally!
    # So we should call review_agent.astream_events directly.
    # But `stream_agent_execution` expects a prompt string and builds the message itself.
    # Let's adapt `stream_agent_execution` OR write a new streamer for this agent.
    
    # The ReviewDeepAgent.astream_events method ALREADY constructs the prompt from inputs.
    # So we should use a custom streamer that delegates to review_agent.astream_events(inputs).
    
    async def stream_review_agent():
        print("stream_review_agent")
        try:
            async for event in review_agent.astream_events(inputs, version="v1"):
                event_type = event["event"]
                
                if event_type == "on_chat_model_stream":
                    content = event["data"]["chunk"].content
                    if content:
                        yield json.dumps({
                            "type": "token", 
                            "content": content
                        }) + "\n"
                
                elif event_type == "on_tool_start":
                    tool_name = event["name"]
                    yield json.dumps({
                        "type": "log", 
                        "content": f"> [TOOL] Starting {tool_name}..."
                    }) + "\n"
                    
                elif event_type == "on_tool_end":
                    tool_name = event["name"]
                    output = event["data"].get("output")
                    if tool_name == "think_tool":
                        yield json.dumps({
                            "type": "log", 
                            "content": f"> [THOUGHT] {str(output)[:100]}..." 
                        }) + "\n"
                    else:
                        yield json.dumps({
                            "type": "log", 
                            "content": f"> [TOOL] {tool_name} completed."
                        }) + "\n"
                        
        except Exception as e:
            yield json.dumps({
                "type": "error",
                "content": str(e)
            }) + "\n"
        finally:
             yield json.dumps({
                "type": "complete",
                "content": "Review completed."
            }) + "\n"

    return StreamingResponse(
        stream_review_agent(),
        media_type="application/x-ndjson"
    )

@app.post("/extract-comments")
async def extract_comments_endpoint():
    """
    Extracts comments from the pre-loaded review document at docs/existing_content.docx.
    Returns an empty comments list if the file does not exist yet.
    """
    from docx_utils import extract_comments_from_docx

    docs_dir = Path(__file__).resolve().parent.parent / "docs"
    review_doc_path = docs_dir / "existing_content.docx"

    if not review_doc_path.exists():
        return {"comments": [], "message": "existing_content.docx not found in the docs folder."}

    content = review_doc_path.read_bytes()
    file_stream = BytesIO(content)

    comments = extract_comments_from_docx(file_stream)

    return {"comments": comments}

@app.post("/uplaod_document")
async def upload_document(document_name: str = Form(...), document: UploadFile = File(...)):
    """
    Uploads a document to the docs folder.
    If same file name exists, it is replaced; different file names are kept.
    """
    try:
        docs_dir = Path(__file__).resolve().parent.parent / "docs"
        docs_dir.mkdir(parents=True, exist_ok=True)

        safe_name = Path(document_name).name
        if not safe_name:
            raise HTTPException(status_code=400, detail="Invalid document_name")

        uploaded_ext = Path(document.filename or "").suffix.lower()
        requested_ext = Path(safe_name).suffix.lower()

        if uploaded_ext:
            if requested_ext and requested_ext != uploaded_ext:
                raise HTTPException(
                    status_code=400,
                    detail=f"File type mismatch. document_name has '{requested_ext}' but uploaded file is '{uploaded_ext}'."
                )
            if not requested_ext:
                safe_name = f"{safe_name}{uploaded_ext}"

        target_path = docs_dir / safe_name

        if target_path.exists() and target_path.is_file():
            target_path.unlink()

        content = await document.read()
        target_path.write_bytes(content)

        return {
            "status": "success",
            "message": f"Document '{safe_name}' uploaded successfully",
            "path": str(target_path)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9090, timeout_keep_alive=300)
