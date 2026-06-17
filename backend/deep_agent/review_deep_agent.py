import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env", override=True)

from langchain_openai import ChatOpenAI
from deepagents import create_deep_agent

from agent_utils.tools import tavily_search, tech_search_tool, think_tool, getUsecase
from agent_utils.prompts import REVIEWER_INSTRUCTIONS

class ReviewDeepAgent:
    def __init__(self, model_name="gpt-4o-mini", temperature=0.0):
        self.model_name = model_name
        self.temperature = temperature
        self.agent = self._create_agent()

    def _create_agent(self):
        # Tools
        tools = [tavily_search, think_tool, getUsecase, tech_search_tool]

        # Initialize Model
        model = ChatOpenAI(model=self.model_name, temperature=self.temperature)

        # Create the agent
        return create_deep_agent(
            model=model,
            tools=tools, 
            system_prompt=REVIEWER_INSTRUCTIONS,
        )

    def invoke(self, inputs, config=None):
        """
        Invoke the agent with the given inputs.
        inputs should look like:
        {
            "task": "Review and update the report based on the comment.",
            "report_content": "...",
            "comment": "..."
        }
        """
        if config is None:
            config = {}
        if "recursion_limit" not in config:
            config["recursion_limit"] = 100
        
        # Construct the prompt for the agent
        additional = inputs.get('additional_instructions', '').strip()
        additional_block = f"""
        Additional instructions from the user:
        <AdditionalInstructions>
        {additional}
        </AdditionalInstructions>
        """ if additional else ""

        task_prompt = f"""
        Here is the report piece:
        <Report>
        {inputs.get('report_content', '')}
        </Report>

        Here is the comment:
        <Comment>
        {inputs.get('comment', '')}
        </Comment>
        {additional_block}
        Please review and revise the report based on the comment above.
        """
        
        return self.agent.invoke({
            "messages": [
                {"role": "user", "content": task_prompt}
            ]
        }, config=config)


    def astream_events(self, inputs, version="v1", config=None):
        """
        Stream events from the agent.
        """
        if config is None:
            config = {}
        if "recursion_limit" not in config:
            config["recursion_limit"] = 100
            
        # Construct the prompt for the agent
        additional = inputs.get('additional_instructions', '').strip()
        additional_block = f"""
        Additional instructions from the user:
        <AdditionalInstructions>
        {additional}
        </AdditionalInstructions>
        """ if additional else ""

        task_prompt = f"""
        Here is the report piece:
        <Report>
        {inputs.get('report_content', '')}
        </Report>

        Here is the comment:
        <Comment>
        {inputs.get('comment', '')}
        </Comment>
        {additional_block}
        Please review and revise the report based on the comment above.
        """
        
        return self.agent.astream_events({
            "messages": [
                {"role": "user", "content": task_prompt}
            ]
        }, version=version, config=config)

if __name__ == "__main__":
    # Test instantiation
    print("Creating ReviewDeepAgent...")
    review_agent = ReviewDeepAgent(model_name="gpt-4o-mini")
    print("Agent created successfully:", review_agent)
