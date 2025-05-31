# ===== SEPARATOR: src/agents/__init__.py =====

"""
Bear agent implementations for the Phuzzy virtual development team.

Bear Agents:
- Alice Bear: Coordinator and project manager 🐻👑
- Bob Bear: Developer and implementation specialist 🐻💻
- Charlie Bear: Tester and quality assurance 🐻🔍
"""

from .base_agent import BaseBearAgent
from .alice_coordinator import AliceBearCoordinator
from .bob_developer import BobBearDeveloper  
from .charlie_tester import CharlieBearTester

__all__ = ['BaseBearAgent', 'AliceBearCoordinator', 'BobBearDeveloper', 'CharlieBearTester']
