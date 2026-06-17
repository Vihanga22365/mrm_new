"""Tools module for the MCP Server."""

from .web_search_tool import web_search_tool
from .analyze_document_tool import analyze_document_tool
from .select_dropdown_and_generate_chapter_content import select_dropdown_and_generate_chapter_content
from .review_document_tool import review_document_tool
from .ask_review_from_ai_agent import ask_review_from_ai_agent

__all__ = [
    'web_search_tool',
    'analyze_document_tool',
    'select_dropdown_and_generate_chapter_content',
    'review_document_tool',
    'ask_review_from_ai_agent'

]
