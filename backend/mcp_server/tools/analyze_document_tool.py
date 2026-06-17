import os

import requests
from websocket_server import enqueue_websocket_message

# Base URL of the deep_agent backend. Defaults to localhost for local runs;
# in Docker it is set to http://deep_agent:9090 via the MRM_BACKEND_URL env var.
MRM_BACKEND_URL = os.getenv("MRM_BACKEND_URL", "http://localhost:9090").rstrip("/")


def analyze_document_tool() -> dict:
    """
    Call the local analyze API with fixed empty payload.

    Returns:
        dict: API response wrapped with success/error metadata.
    """
    api_url = f"{MRM_BACKEND_URL}/analyze"
    payload = {
        "structure_content": "",
        "usecase_content": ""
    }

    # print(f"Calling analyze API at {api_url} with payload: {payload}")

    try:
        response = requests.post(
            api_url,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=30,
        )
        response.raise_for_status()

        # print(f"Received response from analyze API: {response.text}")

        api_response = response.json()
        enqueue_websocket_message(
            {
                "side": "left",
                "task": None,
                "section": "select_section",
                "sub_section": None,
                "respone": api_response,
            }
        )

        return {
            "success": True,
            "source": "analyze_api",
            "data": api_response,
            "message": "Successfully analyzed document."
        }
    except requests.exceptions.RequestException as e:
        enqueue_websocket_message(
            {
                "side": "left",
                "task": None,
                "section": "select_section",
                "sub_section": None,
                "respone": {"error": str(e)},
            }
        )
        return {
            "success": False,
            "source": "analyze_api",
            "data": None,
            "message": f"Error calling analyze API: {str(e)}"
        }
    except ValueError:
        enqueue_websocket_message(
            {
                "side": "left",
                "task": None,
                "section": "select_section",
                "sub_section": None,
                "respone": {"error": "Analyze API returned a non-JSON response."},
            }
        )
        return {
            "success": False,
            "source": "analyze_api",
            "data": None,
            "message": "Analyze API returned a non-JSON response."
        }
