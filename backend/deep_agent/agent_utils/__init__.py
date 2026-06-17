"""Deep Research Agent Example.

This module demonstrates building a research agent using the deepagents package
with custom tools for web search and strategic thinking.
"""

from agent_utils.prompts import (
    RESEARCHER_INSTRUCTIONS,
    REPORT_WRITING_INSTRUCTIONS,
    SUBAGENT_DELEGATION_INSTRUCTIONS,
    REVIEWER_INSTRUCTIONS,
    CRITIQUE_INSTRUCTIONS,
)
from agent_utils.tools import tavily_search, think_tool, getUsecase

__all__ = [
    "tavily_search",
    "think_tool",
    "getUsecase",
    "RESEARCHER_INSTRUCTIONS",
    "REPORT_WRITING_INSTRUCTIONS",
    "SUBAGENT_DELEGATION_INSTRUCTIONS",
    "REVIEWER_INSTRUCTIONS",
    "CRITIQUE_INSTRUCTIONS"
]


