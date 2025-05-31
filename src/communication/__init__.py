# ===== SEPARATOR: src/communication/__init__.py =====

"""
Inter-bear communication protocols.
Because collaborative bears need to talk to each other with fuzzy confidence.
"""

from .message_bus import BearMessageBus
from .protocols import BearCommunicationProtocol
from .validation import BearMessageValidator

__all__ = ['BearMessageBus', 'BearCommunicationProtocol', 'BearMessageValidator']
