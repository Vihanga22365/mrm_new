import os

import requests
from websocket_server import enqueue_websocket_message

# Base URL of the deep_agent backend. Defaults to localhost for local runs;
# in Docker it is set to http://deep_agent:9090 via the MRM_BACKEND_URL env var.
MRM_BACKEND_URL = os.getenv("MRM_BACKEND_URL", "http://localhost:9090").rstrip("/")


def review_document_tool() -> dict:
    """
    Call the local review API to extract document comments.

    Returns:
        dict: API response wrapped with success/error metadata.
    """
    api_url = f"{MRM_BACKEND_URL}/extract-comments"

    try:
        response = requests.post(api_url, timeout=30)
        response.raise_for_status()

        api_response = response.json()
        enqueue_websocket_message(
            {
                "side": "left",
                "task": None,
                "section": "review_document",
                "sub_section": None,
                "respone": api_response,
            }
        )

        return {
            "success": True,
            "source": "review_document_api",
            "data": api_response,
            "message": "Successfully reviewed document.",
        }
    except requests.exceptions.RequestException as e:
        enqueue_websocket_message(
            {
                "side": "left",
                "task": None,
                "section": "review_document",
                "sub_section": None,
                "respone": {"error": str(e)},
            }
        )
        return {
            "success": False,
            "source": "review_document_api",
            "data": None,
            "message": f"Error calling review document API: {str(e)}",
        }
    except ValueError:
        enqueue_websocket_message(
            {
                "side": "left",
                "task": None,
                "section": "review_document",
                "sub_section": None,
                "respone": {"error": "Review API returned a non-JSON response."},
            }
        )
        return {
            "success": False,
            "source": "review_document_api",
            "data": None,
            "message": "Review API returned a non-JSON response.",
        }
