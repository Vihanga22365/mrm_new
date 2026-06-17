import os
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
if OPENAI_API_KEY:
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY


def _clean_env(value: str) -> str:
    return value.replace("\r", "").replace("\n", "").strip()

# MCP Server Configuration
# Local default is localhost:8351.
# In deployment, MCP_SERVER_HOST can be full URL (e.g. https://...run.app).
MCP_SERVER_URL = _clean_env(os.getenv('MCP_SERVER_URL', ''))
MCP_SERVER_HOST = _clean_env(os.getenv('MCP_SERVER_HOST', 'localhost'))
MCP_SERVER_PORT = _clean_env(os.getenv('MCP_SERVER_PORT', '8351'))

if MCP_SERVER_URL:
    MCP_SERVER_URL = MCP_SERVER_URL.rstrip('/')
    if not MCP_SERVER_URL.endswith('/mcp'):
        MCP_SERVER_URL = f"{MCP_SERVER_URL}/mcp"
elif MCP_SERVER_HOST.startswith(('http://', 'https://')):
    parsed = urlparse(MCP_SERVER_HOST)
    is_local_host = parsed.hostname in {'localhost', '127.0.0.1'}
    if parsed.scheme == 'https' and is_local_host:
        host_with_port = parsed.netloc or parsed.path
        MCP_SERVER_URL = f"http://{host_with_port}".rstrip('/')
    else:
        MCP_SERVER_URL = MCP_SERVER_HOST.rstrip('/')
    if not MCP_SERVER_URL.endswith('/mcp'):
        MCP_SERVER_URL = f"{MCP_SERVER_URL}/mcp"
else:
    MCP_SERVER_URL = f"http://{MCP_SERVER_HOST}:{MCP_SERVER_PORT}/mcp"


# Model configurations
OPENAI_MODEL_NAME = os.getenv("OPENAI_MODEL_NAME", "gpt-4.1-mini")
OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0.2"))

# Tool Filter Configurations for Bank Loan Processing System
# These configurations define which MCP tools each agent can access

# Supervisor Agent - Coordinates the workflow, no specific tools needed
SUPERVISOR_AGENT_TOOLS = [
    tool_name.strip()
    for tool_name in os.getenv(
        "SUPERVISOR_AGENT_TOOLS",
        "analyze_document_tool,select_dropdown_and_generate_chapter_content, review_document_tool, ask_review_from_ai_agent",
    ).split(",")
    if tool_name.strip()
]


