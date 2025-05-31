#!/bin/bash

echo "🐻 Setting up Phuzzy - Fuzzy Logic Virtual Bear Development Team"
echo "================================================================"

# Check if running on Raspberry Pi
if grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
    echo "✅ Raspberry Pi detected - Perfect bear habitat!"
    PI_SETUP=true
else
    echo "💻 Running on standard system - Bear-compatible environment"
    PI_SETUP=false
fi

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+')
if [[ $(echo "$PYTHON_VERSION >= 3.11" | bc -l) -eq 1 ]]; then
    echo "✅ Python $PYTHON_VERSION detected - Bears approve!"
else
    echo "⚠️  Python 3.11+ recommended for optimal bear performance"
fi

# Create virtual environment for bears
echo "🐍 Setting up Python bear environment"
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies for bears
echo "📦 Installing Python packages for bear intelligence"
cat > requirements.txt << 'EOF'
# Core bear dependencies
numpy>=1.21.0
scipy>=1.7.0
scikit-fuzzy>=0.4.2
matplotlib>=3.5.0

# Bear web interfaces
flask>=2.0.0
fastapi>=0.70.0
uvicorn>=0.15.0

# Bear data management
pyyaml>=6.0
python-dotenv>=0.19.0
requests>=2.25.0

# Bear system monitoring
psutil>=5.8.0

# Bear development tools
pytest>=6.2.0
black>=21.0.0
flake8>=4.0.0
mypy>=0.910

# Bear documentation
jupyter>=1.0.0
notebook>=6.4.0

# Bear communication
websockets>=10.0
EOF

pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Create necessary directories for bear operations
echo "📁 Creating bear directory structure"
mkdir -p data/{training_data,memory_dumps,performance_logs,research_datasets}
mkdir -p docs/media/{architecture-diagrams,screenshots,videos,bear-photos}
mkdir -p chronicles/assets/{code-examples,diagrams,videos,bear-documentation}
mkdir -p src/{agents,fuzzy_logic,memory,communication,workflows,monitoring,utils}
mkdir -p tests/{test_agents,test_fuzzy_logic,test_memory,test_communication}
mkdir -p config examples hardware community research

# Create bear-specific subdirectories
mkdir -p data/bear_profiles
mkdir -p docs/media/phuzzy-bear-gallery
mkdir -p src/bear_utilities

# Initialize configuration files for bears
echo "⚙️ Setting up bear configuration"

# Create bear agent configuration
cat > config/bear_agent_config.yaml << 'EOF'
# Phuzzy Bear Agent Configuration
bear_agents:
  alice:
    type: "coordinator"
    personality: "wise_leader"
    energy_level: 0.9
    specializations: ["project_management", "conflict_resolution", "team_coordination"]
    
  bob:
    type: "developer" 
    personality: "creative_problem_solver"
    energy_level: 0.85
    specializations: ["coding", "architecture", "optimization"]
    
  charlie:
    type: "tester"
    personality: "detail_oriented"
    energy_level: 0.8
    specializations: ["quality_assurance", "validation", "bug_detection"]

bear_system:
  max_energy_level: 1.0
  energy_decay_rate: 0.05
  rest_recovery_rate: 0.3
  collaboration_bonus: 0.1
  
fuzzy_logic:
  confidence_levels: ["very_low", "low", "medium", "high", "very_high"]
  membership_function_type: "triangular"
  defuzzification_method: "centroid"
  
memory:
  working_memory_capacity: 7
  episodic_memory_retention_days: 30
  semantic_memory_consolidation_threshold: 0.7
EOF

# Create fuzzy logic configuration for bears
cat > config/fuzzy_bear_logic_config.yaml << 'EOF'
# Fuzzy Logic Configuration for Bear Reasoning
linguistic_variables:
  bear_confidence:
    range: [0, 10]
    terms:
      very_uncertain: [0, 0, 2]
      uncertain: [1, 3, 5] 
      somewhat_confident: [3, 5, 7]
      confident: [5, 7, 9]
      very_confident: [7, 10, 10]
      
  bear_evidence_quality:
    range: [0, 10]
    terms:
      poor: [0, 0, 3]
      fair: [2, 4, 6]
      good: [4, 6, 8]
      excellent: [6, 8, 10]
      
  bear_urgency:
    range: [0, 10]
    terms:
      low: [0, 0, 3]
      medium: [2, 5, 8]
      high: [6, 10, 10]
      
bear_rules:
  - if: ["evidence_quality is poor", "urgency is low"]
    then: "confidence is very_uncertain"
    operator: "OR"
    
  - if: ["evidence_quality is good", "urgency is medium"] 
    then: "confidence is confident"
    operator: "AND"
    
  - if: ["evidence_quality is excellent", "urgency is high"]
    then: "confidence is very_confident" 
    operator: "AND"
EOF

# Create monitoring configuration for bear health
cat > config/bear_monitoring_config.yaml << 'EOF'
# Bear System Monitoring Configuration
monitoring:
  update_interval_seconds: 5
  log_level: "INFO"
  metrics_retention_days: 7
  
performance_thresholds:
  max_response_time_ms: 500
  max_memory_usage_mb: 512
  max_cpu_usage_percent: 80
  min_bear_energy_level: 0.2
  
alerts:
  low_bear_energy: 0.3
  high_memory_usage: 400
  slow_response_time: 1000
  
dashboard:
  port: 8080
  refresh_rate_seconds: 2
  show_bear_moods: true
  show_fuzzy_confidence_charts: true
EOF

# Set up monitoring dashboard for bears
if [ "$PI_SETUP" = true ]; then
    echo "🔧 Configuring Raspberry Pi specific settings for bears"
    
    # Enable SSH for remote bear management
    sudo systemctl enable ssh
    
    # Optimize GPU memory split for bear AI
    if ! grep -q "gpu_mem=16" /boot/config.txt; then
        echo "gpu_mem=16" | sudo tee -a /boot/config.txt
    fi
    
    # Create bear systemd service for auto-start
    cat > bear_agents.service << 'EOF'
[Unit]
Description=Phuzzy Bear Agents Service
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/phuzzy-dev
Environment=PATH=/home/pi/phuzzy-dev/venv/bin
ExecStart=/home/pi/phuzzy-dev/venv/bin/python -m src.agents.alice_coordinator
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    echo "📝 Bear service file created - install with: sudo cp bear_agents.service /etc/systemd/system/"
fi

# Create initial bear documentation
echo "📚 Creating initial bear documentation"

cat > README_BEARS.md << 'EOF'
# 🐻 Meet the Phuzzy Bear Team

## Our Bear Agents

### Alice Bear 🐻👑 (Coordinator)
- **Personality**: Wise Leader
- **Specialties**: Project management, team coordination, conflict resolution
- **Bear Wisdom**: "A good plan today is better than a perfect plan tomorrow"

### Bob Bear 🐻💻 (Developer) 
- **Personality**: Creative Problem Solver
- **Specialties**: Coding, system architecture, optimization
- **Bear Motto**: "There's always a more elegant solution hiding in the code"

### Charlie Bear 🐻🔍 (Tester)
- **Personality**: Detail Oriented
- **Specialties**: Quality assurance, validation, bug detection  
- **Bear Philosophy**: "A bug found early saves nine bugs later"

## Bear Care Instructions

1. **Monitor bear energy levels** - Bears need rest to perform optimally
2. **Check bear moods** - Happy bears make better decisions
3. **Provide clear tasks** - Bears work best with well-defined objectives
4. **Celebrate bear successes** - Positive reinforcement improves bear performance
5. **Learn from bear mistakes** - Bears grow wiser through experience

## Bear Communication Protocol

Bears communicate using fuzzy confidence levels:
- 🐻😰 "Very uncertain bear" (0-2)
- 🐻🤔 "Thoughtful bear" (3-5)  
- 🐻😊 "Confident bear" (6-8)
- 🐻🎉 "Very confident bear" (9-10)

Remember: Bears are naturally collaborative and will always try to help each other succeed!
EOF

# Create example bear interaction script
cat > examples/basic_bear_interaction.py << 'EOF'
#!/usr/bin/env python3
"""
Basic Bear Interaction Example
Demonstrates how to work with Phuzzy bear agents
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.agents.hello_fuzzy_bear import HelloFuzzyBearAgent
import time

def main():
    print("🐻 Phuzzy Bear Interaction Demo")
    print("=" * 40)
    
    # Create a bear agent
    bear = HelloFuzzyBearAgent("DemoBear")
    
    # Demonstrate bear reasoning on different topics
    topics = [
        "This new feature will improve user experience",
        "The current code architecture is scalable",
        "We should deploy this update on Friday",
        "The test coverage is sufficient for release",
        "Bears make excellent software developers"
    ]
    
    print(f"\n🤔 {bear.name} will analyze each topic with fuzzy bear logic:\n")
    
    for i, topic in enumerate(topics, 1):
        print(f"Topic {i}: {topic}")
        result = bear.think_aloud_like_bear(topic)
        
        # Add bear commentary
        if result['numeric'] > 7:
            print(f"   🎉 {bear.name} is enthusiastic about this!")
        elif result['numeric'] > 4:
            print(f"   🤔 {bear.name} sees potential but wants more info")
        else:
            print(f"   😰 {bear.name} suggests caution")
        
        print()  # Add spacing
        time.sleep(1)
    
    print(f"✨ Demo complete! {bear.name} has shared their fuzzy bear wisdom.")
    print("🐻 Remember: The best decisions combine logic with intuition!")

if __name__ == "__main__":
    main()
EOF

chmod +x examples/basic_bear_interaction.py

# Create bear testing script
cat > tests/test_bear_setup.py << 'EOF'
#!/usr/bin/env python3
"""
Test Bear Setup
Validates that all bear systems are working correctly
"""

import unittest
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class TestBearSetup(unittest.TestCase):
    """Test cases for bear system setup"""
    
    def test_fuzzy_logic_import(self):
        """Test that fuzzy logic libraries are available for bears"""
        try:
            import skfuzzy as fuzz
            import numpy as np
            self.assertTrue(True, "🐻 Fuzzy logic libraries loaded successfully!")
        except ImportError as e:
            self.fail(f"🐻❌ Failed to import fuzzy logic libraries: {e}")
    
    def test_bear_agent_creation(self):
        """Test that bear agents can be created"""
        try:
            from src.agents.hello_fuzzy_bear import HelloFuzzyBearAgent
            bear = HelloFuzzyBearAgent("TestBear")
            self.assertIsNotNone(bear, "🐻 Bear agent created successfully!")
            self.assertEqual(bear.name, "TestBear", "🐻 Bear has correct name!")
        except Exception as e:
            self.fail(f"🐻❌ Failed to create bear agent: {e}")
    
    def test_bear_reasoning(self):
        """Test that bear agents can perform fuzzy reasoning"""
        try:
            from src.agents.hello_fuzzy_bear import HelloFuzzyBearAgent
            bear = HelloFuzzyBearAgent("ReasoningTestBear")
            result = bear.assess_bear_confidence(7.5, 8.0)
            
            self.assertIn('numeric', result, "🐻 Bear reasoning returns numeric confidence!")
            self.assertIn('linguistic', result, "🐻 Bear reasoning returns linguistic description!")
            self.assertIn('bear_mood', result, "🐻 Bear reasoning includes mood!")
            
        except Exception as e:
            self.fail(f"🐻❌ Bear reasoning failed: {e}")

if __name__ == '__main__':
    print("🐻 Running Phuzzy Bear Setup Tests")
    print("=" * 40)
    unittest.main(verbosity=2)
EOF

# Create .gitignore for bear project
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment (bear habitat)
venv/
env/
ENV/

# Bear Data
data/memory_dumps/*
data/performance_logs/*
!data/training_data/.gitkeep
!data/memory_dumps/.gitkeep
!data/performance_logs/.gitkeep

# Bear Logs
*.log
logs/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Bear Configuration (keep examples, ignore local configs)
config/*_local.yaml
config/secrets.yaml

# Bear Testing
.coverage
htmlcov/
.pytest_cache/

# Bear Documentation Build
docs/_build/
site/
EOF

# Create placeholder files to maintain directory structure
touch data/training_data/.gitkeep
touch data/memory_dumps/.gitkeep  
touch data/performance_logs/.gitkeep
touch data/research_datasets/.gitkeep

echo "✨ Phuzzy Bear setup complete!"
echo ""
echo "🎉 Next steps for bear development:"
echo "1. 🐍 Activate bear environment: source venv/bin/activate"
echo "2. 🧪 Test bear setup: python tests/test_bear_setup.py"
echo "3. 🐻 Try bear interaction: python examples/basic_bear_interaction.py"
echo "4. 📚 Read bear documentation: cat README_BEARS.md"
echo "5. 🚀 Start Lesson 1: chronicles/phase-1-foundation/lesson-01-hardware-setup.md"
echo ""
echo "🐻 Welcome to the Phuzzy Bear development team!"
echo "   Remember: Sometimes the most logical thing is to embrace the fuzzy! 🤓"