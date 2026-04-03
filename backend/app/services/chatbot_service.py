"""
chatbot_service.py
Acts as a facade for the modularized chatbot engine.
Delegates calls to sub-modules in the 'chatbot/' directory.
"""

# Re-export key functions from the modularized engine
from .chatbot.data_handler import get_student_info, get_student_rows
from .chatbot.engine import handle_query

# Backward compatibility: ensure any controller importing handle_query or get_student_info works
__all__ = ["handle_query", "get_student_info", "get_student_rows"]
