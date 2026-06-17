from websocket_server import enqueue_websocket_message


def ask_review_from_ai_agent(additional_instruction: str, id: int) -> dict:
    """
    Enqueue frontend actions to fill additional instruction and click
    Ask Review Agent for a specific review comment index.

    Args:
        additional_instruction: Instruction text for the selected comment.
        id: Target comment index (starts from 0).

    Returns:
        dict: Success/error metadata for MCP tool response.
    """
    if not isinstance(additional_instruction, str):
        return {
            "success": False,
            "source": "ask_review_from_ai_agent",
            "data": None,
            "message": "additional_instruction must be a string.",
        }

    if not isinstance(id, int) or id < 0:
        return {
            "success": False,
            "source": "ask_review_from_ai_agent",
            "data": None,
            "message": "id must be an integer starting from 0.",
        }

    task = [
        {
            "step": "SELECT_ADDITIONAL_INSTRUCTION",
            "action_type": "select_value",
            "value": additional_instruction,
        },
        {
            "step": "ASK_REVIEW_AGENT",
            "action_type": "click_button",
            "value": id,
        },
    ]

    enqueue_websocket_message(
        {
            "side": "left",
            "task": task,
            "section": "review_document",
            "sub_section": id,
            "respone": None,
        }
    )

    return {
        "success": True,
        "source": "ask_review_from_ai_agent",
        "data": {
            "id": id,
            "additional_instruction": additional_instruction,
            "task": task,
        },
        "message": "Review automation task queued successfully.",
    }
