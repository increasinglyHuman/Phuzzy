# ===== SEPARATOR: src/workflows/__init__.py =====

"""
Bear workflow orchestration and task management.
Helping bears work together on complex projects with fuzzy coordination.
"""

from .task_manager import BearTaskManager
from .coordination import BearCoordinator
from .execution_engine import BearExecutionEngine

__all__ = ['BearTaskManager', 'BearCoordinator', 'BearExecutionEngine']
