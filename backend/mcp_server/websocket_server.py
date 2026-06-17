import asyncio
import queue
import threading
from typing import Any

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect


app = FastAPI(title="MCP WebSocket Server")
_active_connections: set[WebSocket] = set()
_broadcast_queue: queue.Queue[dict[str, Any]] = queue.Queue()
_server_started = False


@app.on_event("startup")
async def startup_event() -> None:
    asyncio.create_task(_broadcast_dispatcher())


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    _active_connections.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        _active_connections.discard(websocket)


async def _broadcast_dispatcher() -> None:
    while True:
        payload = await asyncio.to_thread(_broadcast_queue.get)
        disconnected: list[WebSocket] = []

        for connection in list(_active_connections):
            try:
                await connection.send_json(payload)
            except Exception:
                disconnected.append(connection)

        for connection in disconnected:
            _active_connections.discard(connection)


def enqueue_websocket_message(payload: dict[str, Any]) -> None:
    _broadcast_queue.put(payload)


def start_websocket_server(host: str = "0.0.0.0", port: int = 8354) -> None:
    global _server_started
    if _server_started:
        return

    def _run() -> None:
        uvicorn.run(app, host=host, port=port, log_level="info")

    thread = threading.Thread(target=_run, daemon=True)
    thread.start()
    _server_started = True
