// ===== UI/BEAR-ANALYSIS.JS =====
class BearAnalysis {
    constructor(container) {
        this.container = container;
        this.setupHTML();
    }
    
    setupHTML() {
        this.container.innerHTML = "
            <div class="analysis-grid">
                <div class="bear-panel logic-panel">
                    <div class="bear-header">
                        <span class="bear-emoji thinking" id="logic-bear">🧠</span>
                        <span class="bear-name logic-name">Logic Bear</span>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-label">Evidence Quality</div>
                        <div class="meter-container">
                            <div class="meter-fill logic-fill" id="evidence-meter" style="width: 0%">
                                <span class="meter-value" id="evidence-value">0/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-label">Logical Consistency</div>
                        <div class="meter-container">
                            <div class="meter-fill logic-fill" id="logic-meter" style="width: 0%">
                                <span class="meter-value" id="logic-value">0/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-label">Source Reliability</div>
                        <div class="meter-container">
                            <div class="meter-fill logic-fill" id="source-meter" style="width: 0%">
                                <span class="meter-value" id="source-value">0/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-label">Hidden Agenda Risk</div>
                        <div class="meter-container">
                            <div class="meter-fill logic-fill" id="agenda-meter" style="width: 0%">
                                <span class="meter-value" id="agenda-value">0/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="factors-list">
                        <h4>Logical Issues Found:</h4>
                        <div id="logic-factors"></div>
                    </div>
                </div>
                
                <div class="bear-panel emotion-panel">
                    <div class="bear-header">
                        <span class="bear-emoji thinking" id="emotion-bear">💖</span>
                        <span class="bear-name emotion-name">Emotion Bear</span>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-label">Fear/Safety Appeal</div>
                        <div class="meter-container">
                            <div class="meter-fill emotion-fill" id="fear-meter" style="width: 0%">
                                <span class="meter-value" id="fear-value">0/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-label">Belonging/Identity</div>
                        <div class="meter-container">
                            <div class="meter-fill emotion-fill" id="belonging-meter" style="width: 0%">
                                <span class="meter-value" id="belonging-value">0/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-label">Pride/Status Appeal</div>
                        <div class="meter-container">
                            <div class="meter-fill emotion-fill" id="pride-meter" style="width: 0%">
                                <span class="meter-value" id="pride-value">0/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-label">Emotional Manipulation Risk</div>
                        <div class="meter-container">
                            <div class="meter-fill emotion-fill" id="emotion-agenda-meter" style="width: 0%">
                                <span class="meter-value" id="emotion-agenda-value">0/10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="factors-list">
                        <h4>Emotional Triggers Detected:</h4>
                        <div id="emotion-factors"></div>
                    </div>
                </div>
            </div>
            
            <div class="wisdom-panel">
                <div class="wisdom-header">
                    <span class="bear-emoji">🦉</span>
                    <span class="bear-name">Wisdom Bear's Integration</span>
                </div>
                <div class="wisdom-content" id="wisdom-content">
                    Analyzing the balance between logic and emotion...
                </div>
                
                <div class="balance-meter">
                    <div class="balance-label">Logic ↔ Emotion Balance</div>
                    <div class="balance-visual">
                        <div class="balance-indicator" id="balance-indicator" style="left: 50%">
                            <span id="balance-icon">⚖️</span>
                        </div>
                    </div>
                    <div class="balance-labels">
                        <span>🧠 Pure Logic</span>
                        <span>⚖️ Balanced</span>
                        <span>💖 Pure Emotion</span>
                    </div>
                </div>
                
                <div class="manipulation-warning" id="manipulation-warning">
                    <strong style="font-size: 1.2em;">🚨 Manipulation Alert!</strong>
                    <div id="manipulation-text" style="margin-top: 8px; font-size: 1.05em;"></div>
                </div>
            </div>
        ";
    }
    
    showDualBearAnalysis(scenario) {
        // Start bear animations
        document.getElementById('logic-bear').classList.add('thinking');
        document.getElementById('emotion-bear').classList.add('thinking');
        
        // Animate logic meters
        var self = this;
        setTimeout(function() {
            self.animateMeter('evidence-meter', scenario.analysis.logic.scores.evidence, 0);
            self.animateMeter('logic-meter', scenario.analysis.logic.scores.consistency, 200);
            self.animateMeter('source-meter', scenario.analysis.logic.scores.source, 400);
            self.animateMeter('agenda-meter', scenario.analysis.logic.scores.agenda, 600);
            self.displayFactors('logic-factors', scenario.analysis.logic.indicators);
            document.getElementById('logic-bear').classList.remove('thinking');
        }, 1000);
        
        // Animate emotion meters
        setTimeout(function() {
            self.animateMeter('fear-meter', scenario.analysis.emotion.scores.fear, 0);
            self.animateMeter('belonging-meter', scenario.analysis.emotion.scores.belonging, 200);
            self.animateMeter('pride-meter', scenario.analysis.emotion.scores.pride, 400);
            self.animateMeter('emotion-agenda-meter', scenario.analysis.emotion.scores.manipulation, 600);
            self.displayFactors('emotion-factors', scenario.analysis.emotion.triggers);
            document.getElementById('emotion-bear').classList.remove('thinking');
        }, 1500);
        
        // Show wisdom analysis
        setTimeout(function() {
            document.getElementById('wisdom-content').textContent = scenario.wisdom;
            
            // Calculate averages
            var logicAvg = (
                scenario.analysis.logic.scores.evidence + 
                scenario.analysis.logic.scores.consistency + 
                scenario.analysis.logic.scores.source
            ) / 3;
            
            var emotionAvg = (
                scenario.analysis.emotion.scores.fear + 
                scenario.analysis.emotion.scores.belonging + 
                scenario.analysis.emotion.scores.pride
            ) / 3;
            
            // Animate balance indicator
            var balance = self.calculateBalance(logicAvg, emotionAvg);
            document.getElementById('balance-indicator').style.left = balance + '%';
            
            // Update balance icon
            var icon = balance < 30 ? '🧠' : balance > 70 ? '💖' : '⚖️';
            document.getElementById('balance-icon').textContent = icon;
            
            // Show manipulation warning if needed
            var manipWarning = document.getElementById('manipulation-warning');
            if (scenario.analysis.logic.scores.agenda > 7 || scenario.analysis.emotion.scores.manipulation > 7) {
                document.getElementById('manipulation-text').textContent = 
                    self.getManipulationText(scenario.correctAnswer);
                manipWarning.style.display = 'block';
            } else {
                manipWarning.style.display = 'none';
            }
        }, 3000);
    }
    
    animateMeter(elementId, value, delay) {
        if (typeof delay === 'undefined') delay = 0;
        var element = document.getElementById(elementId);
        var valueElement = document.getElementById(elementId.replace('-meter', '-value'));
        
        setTimeout(function() {
            element.style.width = (value * 10) + '%';
            if (valueElement) {
                valueElement.textContent = value + '/10';
            }
        }, delay);
    }
    
    displayFactors(containerId, factors) {
        var container = document.getElementById(containerId);
        container.innerHTML = '';
        
        var factorMap = {
            // Logic indicators
            'cherry-picked': '🍒 Cherry-picked examples',
            'no-evidence': '🚫 No evidence provided',
            'anecdotal': '📖 Only anecdotal evidence',
            'false-urgency': '⏰ False urgency created',
            'dismissed-experts': '🎓 Dismisses expert opinion',
            'conspiracy': '🕵️ Conspiracy thinking',
            'strong-data': '✓ Strong statistical evidence',
            'credible-source': '✓ Credible sources cited',
            'acknowledges-limits': '✓ Acknowledges limitations',
            
            // Emotion triggers
            'child-safety': '👶 Child safety fears',
            'fomo': '😰 FOMO pressure',
            'guilt': '😔 Guilt manipulation',
            'us-vs-them': '👥 Us vs them mentality',
            'lifestyle-envy': '🏝️ Lifestyle envy',
            'protective-instinct': '🛡️ Protective instinct',
            'hope': '🌟 Hope/optimism appeal',
            'community': '🤝 Community belonging',
            'empowerment': '💪 Empowerment feeling'
        };
        
        factors.forEach(function(factor, index) {
            setTimeout(function() {
                var item = document.createElement('div');
                item.className = 'factor-item';
                item.innerHTML = factorMap[factor] || factor;
                container.appendChild(item);
            }, 200 * (index + 1));
        });
    }
    
    calculateBalance(logicAvg, emotionAvg) {
        var total = logicAvg + emotionAvg;
        if (total === 0) return 50;
        return (emotionAvg / total) * 100;
    }
    
    getManipulationText(correctAnswer) {
        var texts = {
            emotion: 'Extreme emotional manipulation detected - bypassing critical thinking',
            logic: 'Severe logical flaws used to support hidden agenda',
            agenda: 'Clear profit motive or hidden agenda driving this argument',
            balanced: 'Subtle bias detected despite apparent balance'
        };
        return texts[correctAnswer] || 'Manipulation tactics detected';
    }
    
    reset() {
        // Reset all meters
        var meters = ['evidence', 'logic', 'source', 'agenda', 'fear', 'belonging', 'pride', 'emotion-agenda'];
        meters.forEach(function(type) {
            var meter = document.getElementById(type + '-meter');
            if (meter) meter.style.width = '0%';
            var value = document.getElementById(type + '-value');
            if (value) value.textContent = '0/10';
        });
        
        // Clear factors
        document.getElementById('logic-factors').innerHTML = '';
        document.getElementById('emotion-factors').innerHTML = '';
        
        // Reset bears
        document.getElementById('logic-bear').classList.remove('thinking');
        document.getElementById('emotion-bear').classList.remove('thinking');
        
        // Hide manipulation warning
        document.getElementById('manipulation-warning').style.display = 'none';
        
        // Reset balance
        document.getElementById('balance-indicator').style.left = '50%';
        document.getElementById('balance-icon').textContent = '⚖️';
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BearAnalysis: BearAnalysis };
} else if (typeof window !== 'undefined') {
    window.BearAnalysis = BearAnalysis;
}