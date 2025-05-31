#!/usr/bin/env python3
"""
Hello Fuzzy Bear - Your first Phuzzy agent!
Demonstrates basic fuzzy logic reasoning with bear personality.
"""

import numpy as np
import time
from datetime import datetime

try:
    import skfuzzy as fuzz
    from skfuzzy import control as ctrl
except ImportError:
    print("🐻 Oh no! scikit-fuzzy not found. Please run: pip install scikit-fuzzy")
    exit(1)


class HelloFuzzyBearAgent:
    """A simple bear agent that demonstrates fuzzy logic reasoning 🐻"""
    
    def __init__(self, name="PhuzzyBear"):
        self.name = name
        self.setup_fuzzy_bear_system()
        print(f"🐻 {self.name} is awakening with fuzzy bear logic...")
    
    def setup_fuzzy_bear_system(self):
        """Create a simple fuzzy logic system for bear confidence assessment"""
        
        # Define input variables (what bears consider)
        self.evidence_quality = ctrl.Antecedent(np.arange(0, 11, 1), 'evidence_quality')
        self.source_reliability = ctrl.Antecedent(np.arange(0, 11, 1), 'source_reliability')
        
        # Define output variable (bear confidence)
        self.confidence = ctrl.Consequent(np.arange(0, 11, 1), 'confidence')
        
        # Define bear membership functions (how bears think about quality)
        self.evidence_quality['poor'] = fuzz.trimf(self.evidence_quality.universe, [0, 0, 4])
        self.evidence_quality['fair'] = fuzz.trimf(self.evidence_quality.universe, [2, 5, 8])
        self.evidence_quality['excellent'] = fuzz.trimf(self.evidence_quality.universe, [6, 10, 10])
        
        self.source_reliability['unreliable'] = fuzz.trimf(self.source_reliability.universe, [0, 0, 4])
        self.source_reliability['somewhat_reliable'] = fuzz.trimf(self.source_reliability.universe, [2, 5, 8])
        self.source_reliability['very_reliable'] = fuzz.trimf(self.source_reliability.universe, [6, 10, 10])
        
        # Bear confidence levels
        self.confidence['low'] = fuzz.trimf(self.confidence.universe, [0, 0, 4])
        self.confidence['medium'] = fuzz.trimf(self.confidence.universe, [2, 5, 8])
        self.confidence['high'] = fuzz.trimf(self.confidence.universe, [6, 10, 10])
        
        # Define fuzzy bear rules (bear wisdom)
        rule1 = ctrl.Rule(self.evidence_quality['poor'] | self.source_reliability['unreliable'], 
                         self.confidence['low'])
        rule2 = ctrl.Rule(self.evidence_quality['fair'] & self.source_reliability['somewhat_reliable'], 
                         self.confidence['medium'])
        rule3 = ctrl.Rule(self.evidence_quality['excellent'] & self.source_reliability['very_reliable'], 
                         self.confidence['high'])
        
        # Create bear control system
        self.confidence_ctrl = ctrl.ControlSystem([rule1, rule2, rule3])
        self.confidence_sim = ctrl.ControlSystemSimulation(self.confidence_ctrl)
    
    def assess_bear_confidence(self, evidence_score, source_score):
        """Assess confidence using fuzzy bear logic"""
        
        # Input values to bear brain
        self.confidence_sim.input['evidence_quality'] = evidence_score
        self.confidence_sim.input['source_reliability'] = source_score
        
        # Let the bear think
        self.confidence_sim.compute()
        
        confidence_value = self.confidence_sim.output['confidence']
        
        # Convert to bear linguistic description
        if confidence_value <= 3:
            linguistic = "low bear confidence"
        elif confidence_value <= 7:
            linguistic = "medium bear confidence" 
        else:
            linguistic = "high bear confidence"
            
        return {
            'numeric': confidence_value,
            'linguistic': linguistic,
            'timestamp': datetime.now().isoformat(),
            'bear_mood': self._get_bear_mood(confidence_value)
        }
    
    def _get_bear_mood(self, confidence):
        """Get bear's emotional state based on confidence"""
        if confidence <= 3:
            return "😟 worried bear"
        elif confidence <= 5:
            return "🤔 thoughtful bear"
        elif confidence <= 7:
            return "😊 content bear"
        else:
            return "🎉 excited bear"
    
    def think_aloud_like_bear(self, topic):
        """Demonstrate fuzzy bear reasoning about a topic"""
        
        print(f"\n🤔 {self.name} is thinking about: {topic}")
        
        # Simulate bear evidence assessment (in real system, this would be complex)
        evidence_score = np.random.uniform(3, 9)
        source_score = np.random.uniform(4, 8)
        
        confidence = self.assess_bear_confidence(evidence_score, source_score)
        
        print(f"   🔍 Evidence Quality: {evidence_score:.1f}/10")
        print(f"   📚 Source Reliability: {source_score:.1f}/10")
        print(f"   → Bear Confidence: {confidence['numeric']:.2f}/10 ({confidence['linguistic']})")
        print(f"   🐻 {confidence['bear_mood']}")
        
        # Fuzzy bear reasoning explanation
        if confidence['numeric'] < 4:
            explanation = "This bear needs more honey... er, evidence before deciding."
        elif confidence['numeric'] < 7:
            explanation = "This seems reasonable to this bear, but let's investigate further."
        else:
            explanation = "This bear is quite confident! Time to move forward!"
            
        print(f"   💭 {explanation}")
        
        return confidence


def main():
    """Test the fuzzy logic bear agent"""
    
    print("=" * 60)
    print("🐻 Welcome to Phuzzy - Where Bears Think Fuzzily!")
    print("=" * 60)
    
    # Create bear agent
    bear_agent = HelloFuzzyBearAgent("Phuzzy")
    
    # Test bear reasoning on various topics
    bear_topics = [
        "The code will work on the first try",
        "Fuzzy logic helps AI think more like humans",
        "Bears make excellent software developers",
        "This Raspberry Pi can run sophisticated AI",
        "Coffee improves bear productivity"
    ]
    
    for topic in bear_topics:
        bear_agent.think_aloud_like_bear(topic)
        time.sleep(1)  # Pause for dramatic bear effect
    
    print("\n" + "=" * 60)
    print("✨ Your fuzzy logic bear AI platform is ready!")
    print("🐻 Next step: Check out the chronicles for the full journey!")
    print("=" * 60)


if __name__ == "__main__":
    main()