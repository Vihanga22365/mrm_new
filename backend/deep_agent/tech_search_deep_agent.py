from pathlib import Path

from dotenv import load_dotenv
from deepagents import create_deep_agent
from deepagents.backends import FilesystemBackend
from langchain_core.messages import AIMessage

from agent_utils.prompts import TECH_SEARCH_INSTRUCTIONS


load_dotenv(".env", override=True)


class TechSearchDeepAgent:
	def __init__(self, model_name: str = "openai:gpt-4.1"):
		self.model_name = model_name
		self.agent = self._create_agent()

	def _create_agent(self):
		docs_dir = Path(__file__).resolve().parent.parent / "docs"
		return create_deep_agent(
			tools=[],
			model=self.model_name,
			system_prompt=TECH_SEARCH_INSTRUCTIONS,
			backend=FilesystemBackend(root_dir=str(docs_dir), virtual_mode=True),
		)

	def _extract_final_answer(self, result: dict) -> str:
		messages = result.get("messages", [])

		for msg in reversed(messages):
			if isinstance(msg, AIMessage):
				content = msg.content

				if isinstance(content, list):
					for item in content:
						if isinstance(item, dict) and item.get("type") == "text":
							text = item.get("text", "")
							if text:
								return text

				if isinstance(content, str) and content:
					return content

		return "No answer generated."

	def ask(self, question: str) -> str:
		result = self.agent.invoke(
			{"messages": [{"role": "user", "content": question}]}
		)
		return self._extract_final_answer(result)


if __name__ == "__main__":
	tech_agent = TechSearchDeepAgent()
	# answer = tech_agent.ask("What are the model validation methods used in this product?")
	# print(answer)
