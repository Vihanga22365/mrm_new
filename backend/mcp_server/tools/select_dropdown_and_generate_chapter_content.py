from websocket_server import enqueue_websocket_message


def select_dropdown_and_generate_chapter_content(dropdown_value: str) -> dict:
    """
    Enqueue a frontend task sequence that selects a chapter dropdown value and
    triggers chapter content generation.

    Args:
        dropdown_value: Target chapter value shown in the UI dropdown.

    Returns:
        dict: Success/error metadata for MCP tool response.
    """
    if not isinstance(dropdown_value, str) or not dropdown_value.strip():
        return {
            "success": False,
            "source": "select_dropdown_and_generate_chapter_content",
            "data": None,
            "message": "dropdown_value must be a non-empty string.",
        }

    selected_value = dropdown_value.strip()
    task = [
        {
            "step": "SELECT_TARGET_CHAPTER_DROPDOWN",
            "action_type": "select_value",
            "value": selected_value,
        },
        {
            "step": "GENERATE_CHAPTER_CONTENT",
            "action_type": "click_button",
            "value": None,
        },
    ]

    enqueue_websocket_message(
        {
            "side": "left",
            "task": task,
            "section": "select_section",
            "sub_section": None,
            "respone": None,
        }
    )

    return {
        "success": True,
        "source": "select_dropdown_and_generate_chapter_content",
        "data": {
            "dropdown_value": selected_value,
            "task": task,
        },
        "message": "Dropdown selection and generate action queued successfully.",
    }