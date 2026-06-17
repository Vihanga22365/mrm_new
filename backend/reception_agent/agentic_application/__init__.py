# Load environment configuration first
from . import config

from .agents import (
    create_supervisor_agent,
)
from .prompts import (
    SUPERVISOR_AGENT_INSTRUCTION,
    SUPERVISOR_AGENT_DESCRIPTION,
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

__all__ = [
    'create_supervisor_agent',
    'app',
    'SUPERVISOR_AGENT_INSTRUCTION',
    'SUPERVISOR_AGENT_DESCRIPTION',
]
