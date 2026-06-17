import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env", override=True)

from langchain_openai import ChatOpenAI
from deepagents import create_deep_agent

from agent_utils.tools import tavily_search, tech_search_tool, think_tool, getUsecase
from agent_utils.prompts import (
    RESEARCHER_INSTRUCTIONS,
    REPORT_WRITING_INSTRUCTIONS,
    SUBAGENT_DELEGATION_INSTRUCTIONS,
)

class ResearchDeepAgent:
    #def __init__(self, model_name="gpt-5-mini", temperature=0.0):
    def __init__(self, model_name="gpt-4o-mini", temperature=0.0):
    # def __init__(self, model_name="gpt-4.1", temperature=0.2):
        self.model_name = model_name
        self.temperature = temperature
        self.agent = self._create_agent()

    def _create_agent(self):
        # Tools
        tools = [tavily_search, think_tool, getUsecase, tech_search_tool]

        # Create research sub-agent
        research_sub_agent = {
            "name": "research-agent",
            "description": "Delegate research to the sub-agent researcher. Only give this researcher one topic at a time.",
            "system_prompt": RESEARCHER_INSTRUCTIONS,
            "tools": [tavily_search, think_tool, getUsecase, tech_search_tool],
        }

        # Prepare main instructions
        max_concurrent_research_units = 1
        max_researcher_iterations = 2

        instructions = (
            REPORT_WRITING_INSTRUCTIONS
            + "\n\n"
            + "=" * 80
            + "\n\n"
            + SUBAGENT_DELEGATION_INSTRUCTIONS.format(
                max_concurrent_research_units=max_concurrent_research_units,
                max_researcher_iterations=max_researcher_iterations,
            )
        )

        # Initialize Model
        model = ChatOpenAI(model=self.model_name, temperature=self.temperature)

        # Create the agent
        return create_deep_agent(
            model=model,
            tools=tools, 
            system_prompt=instructions,
            subagents=[research_sub_agent],
        )

    def invoke(self, inputs, config=None):
        """
        Invoke the agent with the given inputs.
        """
        if config is None:
            config = {}
        if "recursion_limit" not in config:
            config["recursion_limit"] = 100
        return self.agent.invoke(inputs, config=config)

    def astream_events(self, inputs, version="v1", config=None):
        """
        Stream events from the agent.
        """
        if config is None:
            config = {}
        if "recursion_limit" not in config:
            config["recursion_limit"] = 100
        return self.agent.astream_events(inputs, version=version, config=config)

if __name__ == "__main__":
    # Test instantiation
    print("Creating ResearchDeepAgent...")
    research_agent = ResearchDeepAgent(model_name="gpt-4o-mini")
    print("Agent created successfully:", research_agent)

