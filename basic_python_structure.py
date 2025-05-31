# src/__init__.py
"""
Phuzzy - Fuzzy Logic Virtual Development Team

A revolutionary approach to AI agent development using fuzzy logic
for human-like reasoning and decision-making.
"""

__version__ = "0.1.0"
__author__ = "Allen Partridge"
__email__ = "allen@phuzzy.dev"

# src/agents/__init__.py
"""
Agent implementations for the Phuzzy virtual development team.

Agents:
- Alice: Coordinator and project manager
- Bob: Developer and implementation specialist  
- Charlie: Tester and quality assurance
"""

from .base_agent import BaseAgent
from .alice_coordinator import AliceCoordinator
from .bob_developer import BobDeveloper  
from .charlie_tester import CharlieTester

__all__ = ['BaseAgent', 'AliceCoordinator', 'BobDeveloper', 'CharlieTester']

# src/agents/base_agent.py
"""
Base agent class providing core functionality for all Phuzzy agents.
"""

import logging
import time
from datetime import datetime
from typing import Dict, Any, Optional
from abc import ABC, abstractmethod

from ..fuzzy_logic import FuzzyConfidence
from ..memory import WorkingMemory, EpisodicMemory
from ..communication import MessageBus


class BaseAgent(ABC):
    """
    Base class for all Phuzzy agents.
    
    Provides core functionality:
    - Fuzzy logic reasoning
    - Memory management
    - Inter-agent communication
    - Performance monitoring
    """
    
    def __init__(self, name: str, agent_type: str):
        self.name = name
        self.agent_type = agent_type
        self.agent_id = f"{agent_type}_{name}_{int(time.time())}"
        
        # Initialize core systems
        self.fuzzy_engine = FuzzyConfidence()
        self.working_memory = WorkingMemory(capacity=7)  # Miller's magic number
        self.episodic_memory = EpisodicMemory(agent_id=self.agent_id)
        self.message_bus = MessageBus()
        
        # Performance tracking
        self.start_time = datetime.now()
        self.decision_count = 0
        self.active = True
        
        # Logging
        self.logger = logging.getLogger(f"phuzzy.{self.agent_type}.{self.name}")
        self.logger.info(f"🐻 {self.name} ({self.agent_type}) is awakening...")
    
    @abstractmethod
    def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a task using agent-specific logic."""
        pass
    
    @abstractmethod
    def get_capabilities(self) -> Dict[str, float]:
        """Return agent capabilities with confidence scores."""
        pass
    
    def assess_confidence(self, claim: str, evidence: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assess confidence in a claim using fuzzy logic.
        
        Args:
            claim: The statement to evaluate
            evidence: Supporting evidence with quality metrics
            
        Returns:
            Fuzzy confidence assessment with linguistic description
        """
        return self.fuzzy_engine.evaluate(claim, evidence)
    
    def remember(self, event: Dict[str, Any], confidence: float = 1.0):
        """Store an event in episodic memory with confidence tracking."""
        memory_entry = {
            'event': event,
            'timestamp': datetime.now().isoformat(),
            'confidence': confidence,
            'agent_id': self.agent_id
        }
        self.episodic_memory.store(memory_entry)
    
    def send_message(self, recipient: str, message_type: str, content: Dict[str, Any]):
        """Send a message to another agent."""
        message = {
            'sender': self.agent_id,
            'recipient': recipient,
            'type': message_type,
            'content': content,
            'timestamp': datetime.now().isoformat()
        }
        self.message_bus.send(message)
        self.logger.debug(f"📤 Sent {message_type} message to {recipient}")
    
    def get_status(self) -> Dict[str, Any]:
        """Return current agent status and performance metrics."""
        uptime = datetime.now() - self.start_time
        
        return {
            'agent_id': self.agent_id,
            'name': self.name,
            'type': self.agent_type,
            'active': self.active,
            'uptime_seconds': uptime.total_seconds(),
            'decision_count': self.decision_count,
            'memory_usage': {
                'working_memory_items': len(self.working_memory.items),
                'episodic_memory_entries': self.episodic_memory.count()
            }
        }

# src/agents/alice_coordinator.py
"""
Alice - The Coordinator Agent

Alice specializes in project management, task assignment, and conflict resolution.
She uses fuzzy logic to make nuanced decisions about resource allocation and
priority management.
"""

from typing import Dict, Any, List
from .base_agent import BaseAgent


class AliceCoordinator(BaseAgent):
    """
    Alice coordinates the virtual development team.
    
    Specializations:
    - Project planning and task decomposition
    - Resource allocation and scheduling
    - Conflict resolution between agents
    - Quality assurance oversight
    """
    
    def __init__(self, name: str = "Alice"):
        super().__init__(name, "coordinator")
        
        # Alice's specialized capabilities
        self.project_memory = {}
        self.agent_performance_history = {}
        self.current_projects = []
        
        self.logger.info("👑 Alice is ready to coordinate the team")
    
    def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process coordination tasks like project planning and task assignment.
        """
        task_type = task.get('type', 'unknown')
        
        if task_type == 'plan_project':
            return self._plan_project(task)
        elif task_type == 'assign_task':
            return self._assign_task(task)
        elif task_type == 'resolve_conflict':
            return self._resolve_conflict(task)
        else:
            return self._handle_unknown_task(task)
    
    def get_capabilities(self) -> Dict[str, float]:
        """Return Alice's coordination capabilities."""
        return {
            'project_planning': 0.9,
            'task_assignment': 0.85,
            'conflict_resolution': 0.8,
            'resource_management': 0.75,
            'quality_oversight': 0.7,
            'team_communication': 0.95
        }
    
    def _plan_project(self, project: Dict[str, Any]) -> Dict[str, Any]:
        """Break down a project into manageable tasks."""
        # Placeholder for sophisticated project planning logic
        confidence = self.assess_confidence(
            "I can create a good project plan",
            {
                'project_complexity': project.get('complexity', 5),
                'requirements_clarity': project.get('clarity', 7),
                'available_resources': 8
            }
        )
        
        plan = {
            'project_id': f"proj_{int(time.time())}",
            'tasks': [
                {'id': 'task_1', 'description': 'Analysis and design', 'assigned_to': 'bob'},
                {'id': 'task_2', 'description': 'Implementation', 'assigned_to': 'bob'},
                {'id': 'task_3', 'description': 'Testing and validation', 'assigned_to': 'charlie'}
            ],
            'confidence': confidence,
            'coordinator': self.agent_id
        }
        
        self.remember({'action': 'project_planned', 'project': plan}, confidence['numeric'])
        return plan
    
    def _assign_task(self, assignment: Dict[str, Any]) -> Dict[str, Any]:
        """Assign a task to the most suitable agent."""
        # Fuzzy logic for optimal task assignment
        task_requirements = assignment.get('requirements', {})
        available_agents = assignment.get('available_agents', ['bob', 'charlie'])
        
        # Simple assignment logic (to be enhanced with fuzzy matching)
        if 'coding' in str(task_requirements).lower():
            assigned_agent = 'bob'
            confidence = 0.8
        elif 'testing' in str(task_requirements).lower():
            assigned_agent = 'charlie'
            confidence = 0.75
        else:
            assigned_agent = available_agents[0] if available_agents else 'bob'
            confidence = 0.5
        
        result = {
            'task_id': assignment.get('task_id'),
            'assigned_to': assigned_agent,
            'assignment_confidence': confidence,
            'reasoning': f"Based on task requirements, {assigned_agent} is the best fit"
        }
        
        self.send_message(assigned_agent, 'task_assignment', result)
        return result
    
    def _resolve_conflict(self, conflict: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve conflicts between agents using fuzzy logic mediation."""
        # Placeholder for conflict resolution logic
        resolution = {
            'conflict_id': conflict.get('id'),
            'resolution': 'Collaborative compromise based on fuzzy consensus',
            'confidence': 0.7,
            'next_steps': ['Re-evaluate priorities', 'Establish clearer communication']
        }
        
        return resolution
    
    def _handle_unknown_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tasks that don't match known patterns."""
        return {
            'status': 'unknown_task_type',
            'message': f"Alice doesn't know how to handle task type: {task.get('type')}",
            'suggestion': 'Please provide more specific task information'
        }

# src/fuzzy_logic/__init__.py
"""
Fuzzy logic engine for human-like reasoning and confidence assessment.
"""

from .confidence_engine import FuzzyConfidence
from .membership_functions import MembershipFunction
from .linguistic_variables import LinguisticVariable

__all__ = ['FuzzyConfidence', 'MembershipFunction', 'LinguisticVariable']

# src/fuzzy_logic/confidence_engine.py
"""
Core fuzzy logic engine for confidence assessment and reasoning.
"""

import numpy as np
from typing import Dict, Any, List
from datetime import datetime


class FuzzyConfidence:
    """
    Fuzzy logic engine for confidence assessment.
    
    Implements T-norms, T-conorms, and linguistic reasoning
    for human-like confidence evaluation.
    """
    
    def __init__(self):
        self.linguistic_variables = self._init_linguistic_variables()
        self.rules = self._init_rules()
    
    def _init_linguistic_variables(self) -> Dict[str, Any]:
        """Initialize fuzzy linguistic variables for confidence assessment."""
        return {
            'evidence_quality': {
                'poor': (0, 0, 4),
                'fair': (2, 5, 8), 
                'excellent': (6, 10, 10)
            },
            'source_reliability': {
                'unreliable': (0, 0, 4),
                'somewhat_reliable': (2, 5, 8),
                'very_reliable': (6, 10, 10)
            },
            'confidence': {
                'low': (0, 0, 4),
                'medium': (2, 5, 8),
                'high': (6, 10, 10)
            }
        }
    
    def _init_rules(self) -> List[Dict[str, Any]]:
        """Initialize fuzzy rules for confidence assessment."""
        return [
            {
                'conditions': [('evidence_quality', 'poor'), ('source_reliability', 'unreliable')],
                'conclusion': ('confidence', 'low'),
                'operator': 'OR'
            },
            {
                'conditions': [('evidence_quality', 'fair'), ('source_reliability', 'somewhat_reliable')],
                'conclusion': ('confidence', 'medium'),
                'operator': 'AND'
            },
            {
                'conditions': [('evidence_quality', 'excellent'), ('source_reliability', 'very_reliable')],
                'conclusion': ('confidence', 'high'),
                'operator': 'AND'
            }
        ]
    
    def triangular_membership(self, x: float, a: float, b: float, c: float) -> float:
        """Calculate triangular membership function value."""
        if x <= a or x >= c:
            return 0.0
        elif x == b:
            return 1.0
        elif a < x < b:
            return (x - a) / (b - a)
        elif b < x < c:
            return (c - x) / (c - b)
        else:
            return 0.0
    
    def evaluate(self, claim: str, evidence: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate confidence in a claim using fuzzy logic.
        
        Args:
            claim: Statement to evaluate
            evidence: Dictionary with evidence metrics
            
        Returns:
            Fuzzy confidence assessment
        """
        # Extract evidence metrics (default values if not provided)
        evidence_quality = evidence.get('evidence_quality', 5.0)
        source_reliability = evidence.get('source_reliability', 5.0)
        
        # Calculate membership values for inputs
        evidence_memberships = self._calculate_memberships('evidence_quality', evidence_quality)
        source_memberships = self._calculate_memberships('source_reliability', source_reliability)
        
        # Apply fuzzy rules
        confidence_memberships = self._apply_rules(evidence_memberships, source_memberships)
        
        # Defuzzify to get numeric confidence
        numeric_confidence = self._defuzzify(confidence_memberships)
        
        # Convert to linguistic description
        linguistic_confidence = self._get_linguistic_description(numeric_confidence)
        
        return {
            'claim': claim,
            'numeric': numeric_confidence,
            'linguistic': linguistic_confidence,
            'memberships': {
                'evidence': evidence_memberships,
                'source': source_memberships,
                'confidence': confidence_memberships
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_memberships(self, variable: str, value: float) -> Dict[str, float]:
        """Calculate membership values for a linguistic variable."""
        memberships = {}
        
        for term, (a, b, c) in self.linguistic_variables[variable].items():
            membership = self.triangular_membership(value, a, b, c)
            memberships[term] = membership
        
        return memberships
    
    def _apply_rules(self, evidence_mem: Dict[str, float], source_mem: Dict[str, float]) -> Dict[str, float]:
        """Apply fuzzy rules to determine confidence memberships."""
        confidence_mem = {'low': 0.0, 'medium': 0.0, 'high': 0.0}
        
        for rule in self.rules:
            # Calculate rule activation strength
            conditions = rule['conditions']
            operator = rule['operator']
            
            if len(conditions) == 2:
                var1, term1 = conditions[0]
                var2, term2 = conditions[1]
                
                if var1 == 'evidence_quality' and var2 == 'source_reliability':
                    mem1 = evidence_mem[term1]
                    mem2 = source_mem[term2]
                else:
                    mem1 = source_mem[term1]
                    mem2 = evidence_mem[term2]
                
                if operator == 'AND':
                    activation = min(mem1, mem2)  # T-norm (min)
                elif operator == 'OR':
                    activation = max(mem1, mem2)  # T-conorm (max)
                else:
                    activation = min(mem1, mem2)  # Default to AND
            else:
                # Single condition rule
                var, term = conditions[0]
                if var == 'evidence_quality':
                    activation = evidence_mem[term]
                else:
                    activation = source_mem[term]
            
            # Apply rule conclusion
            conclusion_var, conclusion_term = rule['conclusion']
            confidence_mem[conclusion_term] = max(confidence_mem[conclusion_term], activation)
        
        return confidence_mem
    
    def _defuzzify(self, memberships: Dict[str, float]) -> float:
        """Convert fuzzy memberships to numeric confidence using centroid method."""
        # Simplified centroid calculation
        numerator = 0.0
        denominator = 0.0
        
        # Use center values of confidence linguistic terms
        centers = {'low': 2, 'medium': 5, 'high': 8}
        
        for term, membership in memberships.items():
            center = centers[term]
            numerator += center * membership
            denominator += membership
        
        if denominator == 0:
            return 5.0  # Default medium confidence
        
        return numerator