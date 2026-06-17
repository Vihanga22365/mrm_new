@echo off
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

echo Starting Deep Agent, MCP Server, Reception Agent, and Frontend...

start "Deep Agent" cmd /k "cd /d ""%ROOT%\backend\deep_agent"" && call .venv\Scripts\activate.bat && uv run python main.py"
start "MCP Server" cmd /k "cd /d ""%ROOT%\backend\mcp_server"" && call .venv\Scripts\activate.bat && uv run python main.py"
start "Reception Agent" cmd /k "cd /d ""%ROOT%\backend\reception_agent"" && call .venv\Scripts\activate.bat && uv run python main.py"
start "Frontend" cmd /k "cd /d ""%ROOT%\frontend"" && ng serve"

echo All start commands launched.
echo Close this window or press any key to exit.
pause >nul

endlocal
