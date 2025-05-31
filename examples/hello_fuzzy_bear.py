#!/usr/bin/env python3
"""
Hello Fuzzy Bear - Your first Phuzzy agent!
Demonstrates basic fuzzy logic reasoning with bear personality.
"""

import numpy as np
import time
from datetime import datetime

# Better error handling that shows what's actually missing
try:
    import skfuzzy as fuzz
    from skfuzzy import control as ctrl
except ImportError as e:
    print(f"🐻 Missing dependency: {e}")
    print("Please install required packages:")
    print("  pip install scikit-fuzzy numpy scipy matplotlib")
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
        
        # Auto-generate membership functions (this ensures full coverage)
        self.evidence_quality.automf(3, names=['poor', 'fair', 'excellent'])
        self.source_reliability.automf(3, names=['unreliable', 'somewhat_reliable', 'very_reliable'])
        self.confidence.automf(3, names=['low', 'medium', 'high'])
        
        # Define comprehensive fuzzy bear rules
        rules = []
        
        # Low confidence rules
        rules.append(ctrl.Rule(self.evidence_quality['poor'] & self.source_reliability['unreliable'], 
                              self.confidence['low']))
        rules.append(ctrl.Rule(self.evidence_quality['poor'] & self.source_reliability['somewhat_reliable'], 
                              self.confidence['low']))
        rules.append(ctrl.Rule(self.evidence_quality['fair'] & self.source_reliability['unreliable'], 
                              self.confidence['low']))
        
        # Medium confidence rules
        rules.append(ctrl.Rule(self.evidence_quality['poor'] & self.source_reliability['very_reliable'], 
                              self.confidence['medium']))
        rules.append(ctrl.Rule(self.evidence_quality['fair'] & self.source_reliability['somewhat_reliable'], 
                              self.confidence['medium']))
        rules.append(ctrl.Rule(self.evidence_quality['excellent'] & self.source_reliability['unreliable'], 
                              self.confidence['medium']))
        
        # High confidence rules
        rules.append(ctrl.Rule(self.evidence_quality['fair'] & self.source_reliability['very_reliable'], 
                              self.confidence['high']))
        rules.append(ctrl.Rule(self.evidence_quality['excellent'] & self.source_reliability['somewhat_reliable'], 
                              self.confidence['high']))
        rules.append(ctrl.Rule(self.evidence_quality['excellent'] & self.source_reliability['very_reliable'], 
                              self.confidence['high']))
        
        # Create bear control system with all rules
        self.confidence_ctrl = ctrl.ControlSystem(rules)
        self.confidence_sim = ctrl.ControlSystemSimulation(self.confidence_ctrl)
    
    def assess_bear_confidence(self, evidence_score, source_score):
        """Assess confidence using fuzzy bear logic"""
        
        # Ensure inputs are within valid range
        evidence_score = np.clip(evidence_score, 0, 10)
        source_score = np.clip(source_score, 0, 10)
        
        # Input values to bear brain
        self.confidence_sim.input['evidence_quality'] = evidence_score
        self.confidence_sim.input['source_reliability'] = source_score
        
        # Let the bear think
        try:
            self.confidence_sim.compute()
            confidence_value = self.confidence_sim.output['confidence']
        except Exception as e:
            print(f"   🐻 Bear intuition needed: {e}")
            # Fallback to simple average
            confidence_value = (evidence_score + source_score) / 2
        
        # Convert to bear linguistic description
        if confidence_value <= 3.3:
            linguistic = "low bear confidence"
        elif confidence_value <= 6.6:
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
        if confidence <= 2.5:
            return "😟 worried bear"
        elif confidence <= 5:
            return "🤔 thoughtful bear"
        elif confidence <= 7.5:
            return "😊 content bear"
        else:
            return "🎉 excited bear"
    
    def think_aloud_like_bear(self, topic):
        """Demonstrate fuzzy bear reasoning about a topic"""
        
        print(f"\n🤔 {self.name} is thinking about: {topic}")
        
        # Simulate bear evidence assessment (in real system, this would be complex)
        evidence_score = np.random.uniform(2, 9)
        source_score = np.random.uniform(2, 9)
        
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
        "Caffiene improves bear productivity"
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