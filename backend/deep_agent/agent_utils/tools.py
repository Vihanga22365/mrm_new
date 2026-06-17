"""Research Tools.

This module provides search and content processing utilities for the research agent,
using Tavily for URL discovery and fetching full webpage content.
"""

import csv
import json
import httpx
from pathlib import Path
from langchain_core.tools import InjectedToolArg, tool
from markdownify import markdownify
from tavily import TavilyClient
from typing_extensions import Annotated, Literal
import contextvars

# ContextVar to store request-specific usecase content
current_usecase_context = contextvars.ContextVar("current_usecase_context", default=None)

tavily_client = TavilyClient()

# Cache for usecase data - loaded once
_usecase_cache = None
_tech_search_agent = None


def fetch_webpage_content(url: str, timeout: float = 10.0) -> str:
    """Fetch and convert webpage content to markdown.

    Args:
        url: URL to fetch
        timeout: Request timeout in seconds

    Returns:
        Webpage content as markdown
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = httpx.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
        return markdownify(response.text)
    except Exception as e:
        return f"Error fetching content from {url}: {str(e)}"


@tool(parse_docstring=True)
def tavily_search(
    query: str,
    max_results: Annotated[int, InjectedToolArg] = 1,
    topic: Annotated[
        Literal["general", "news", "finance"], InjectedToolArg
    ] = "general",
) -> str:
    """Search the web for information on a given query.

    Uses Tavily to discover relevant URLs, then fetches and returns full webpage content as markdown.

    Args:
        query: Search query to execute
        max_results: Maximum number of results to return (default: 1)
        topic: Topic filter - 'general', 'news', or 'finance' (default: 'general')

    Returns:
        Formatted search results with full webpage content
    """
    # Use Tavily to discover URLs
    search_results = tavily_client.search(
        query,
        max_results=max_results,
        topic=topic,
        include_domains=["docs.kore.ai"],
        search_depth="advanced"
    )

    # Fetch full content for each URL
    result_texts = []
    for result in search_results.get("results", []):
        url = result["url"]
        title = result["title"]

        # Fetch webpage content
        content = fetch_webpage_content(url)

        result_text = f"""## {title}
**URL:** {url}

{content}

---
"""
        result_texts.append(result_text)

    # Format final response
    response = f"""🔍 Found {len(result_texts)} result(s) for '{query}':

{chr(10).join(result_texts)}"""

    return response


@tool(parse_docstring=True)
def think_tool(reflection: str) -> str:
    """Tool for strategic reflection on research progress and decision-making.

    Use this tool after each search to analyze results and plan next steps systematically.
    This creates a deliberate pause in the research workflow for quality decision-making.

    When to use:
    - After receiving search results: What key information did I find?
    - Before deciding next steps: Do I have enough to answer comprehensively?
    - When assessing research gaps: What specific information am I still missing?
    - Before concluding research: Can I provide a complete answer now?

    Reflection should address:
    1. Analysis of current findings - What concrete information have I gathered?
    2. Gap assessment - What crucial information is still missing?
    3. Quality evaluation - Do I have sufficient evidence/examples for a good answer?
    4. Strategic decision - Should I continue searching or provide my answer?

    Args:
        reflection: Your detailed reflection on research progress, findings, gaps, and next steps

    Returns:
        Confirmation that reflection was recorded for decision-making
    """
    return f"Reflection recorded: {reflection}"


@tool(parse_docstring=True)
def tech_search_tool(question: str) -> str:
    """Search technical_document.md and return the final answer.

    Args:
        question: User question to find in technical_document.md

    Returns:
        Final answer returned by the technical search agent
    """
    global _tech_search_agent

    try:
        if _tech_search_agent is None:
            from tech_search_deep_agent import TechSearchDeepAgent

            _tech_search_agent = TechSearchDeepAgent()

        return _tech_search_agent.ask(question)
    except Exception as e:
        return f"Error running technical search: {str(e)}"


def _load_usecase_data() -> dict[str, str]:
    """Load usecase.csv and return as a dictionary (cached after first load).
    
    Returns:
        Dictionary with Category as key and Description as value
    """
    global _usecase_cache
    
    # Return cached data if already loaded
    if _usecase_cache is not None:
        return _usecase_cache
    
    csv_path = Path(__file__).parent.parent / "docs" / "usecase.csv"
    
    usecase_dict = {}
    try:
        # Try UTF-8 first, then fall back to other encodings
        encodings = ['utf-8', 'utf-8-sig', 'cp1252', 'latin-1']
        
        for encoding in encodings:
            try:
                with open(csv_path, "r", encoding=encoding) as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        if row and "Category" in row and "Description" in row:
                            usecase_dict[row["Category"]] = row["Description"]
                if usecase_dict:
                    _usecase_cache = usecase_dict
                    return _usecase_cache
            except (UnicodeDecodeError, UnicodeError):
                continue
        
        # If no encoding worked, return error
        if not usecase_dict:
            _usecase_cache = {"error": f"Could not read file with any encoding: {csv_path}"}
    except FileNotFoundError:
        _usecase_cache = {"error": f"File not found: {csv_path}"}
    except Exception as e:
        _usecase_cache = {"error": f"Error loading usecase data: {str(e)}"}
    
    return _usecase_cache


@tool(parse_docstring=True)
def getUsecase() -> str:
    """Get complete usecase information.

    Loads all usecase data from docs/usecase.csv which contains Category and Description columns.
    Returns all usecase details in a formatted text structure that is easy for the agent to read and reference.

    Args:
        No arguments required.

    Returns:
        Formatted usecase details with all categories and descriptions
    """
    # Check for dynamic context first
    dynamic_content = current_usecase_context.get()
    if dynamic_content:
        return f"=== PROVIDED USECASE ===\n\n{dynamic_content}"

    usecase_data = _load_usecase_data()
    
    # Check for errors during loading
    if "error" in usecase_data:
        return f"Error loading usecase data: {usecase_data['error']}"
    
    # Format all usecase details as readable text
    if not usecase_data:
        return "No usecase data available"
    
    formatted_output = "=== USECASE INFORMATION ===\n\n"
    
    for i, (category, description) in enumerate(usecase_data.items(), 1):
        formatted_output += f"{i}. {category}\n"
        formatted_output += f"   {description}\n\n"
    
    return formatted_output



