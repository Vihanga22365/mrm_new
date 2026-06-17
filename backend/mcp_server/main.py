from mcp.server.fastmcp import FastMCP
from mcp.server.transport_security import TransportSecuritySettings
from websocket_server import start_websocket_server
from tools import (
    web_search_tool,
    analyze_document_tool,
    review_document_tool,
    ask_review_from_ai_agent,
    select_dropdown_and_generate_chapter_content,
)

mcp = FastMCP(
    "StatefulServer",
    stateless_http=True,
    transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False),
)
mcp.settings.host = "0.0.0.0"
mcp.settings.port = 8351

# Register all tools with the MCP server
mcp.tool()(web_search_tool)
mcp.tool()(analyze_document_tool)
mcp.tool()(review_document_tool)
mcp.tool()(ask_review_from_ai_agent)
mcp.tool()(select_dropdown_and_generate_chapter_content)


if __name__ == "__main__":
    start_websocket_server(host="0.0.0.0", port=8354)
    print("Starting MCP server on http://0.0.0.0:8351")
    print("Starting WebSocket server on ws://0.0.0.0:8354/ws")
    mcp.run(transport="streamable-http")
