# ===== SEPARATOR: src/fuzzy_logic/__init__.py =====

"""
Fuzzy logic engine for human-like reasoning and confidence assessment.
Where bears learn to think in shades of gray rather than black and white.
"""

from .confidence_engine import FuzzyBearConfidence
from .membership_functions import BearMembershipFunction
from .linguistic_variables import BearLinguisticVariable

__all__ = ['FuzzyBearConfidence', 'BearMembershipFunction', 'BearLinguisticVariable']
