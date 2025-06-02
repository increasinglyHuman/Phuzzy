// ===== UI/BEAR-ANALYSIS.JS =====
class BearAnalysis {
    constructor(container) {
        this.container = container;
        this.setupHTML();
    }
    
    setupHTML() {
        this.container.innerHTML = 
            '<div class="analysis-grid">' +
                '<div class="bear-panel logic-panel">' +
                    '<div class="bear-header">' +
                        '<span class="bear-emoji thinking" id="logic-bear">🧠</span>' +
                        '<span class="bear-name logic-name">Logic Bear</span>' +
                    '</div>' +
                    
                    '<div class="metric">' +
                        '<div class="metric-label">Evidence Quality</div>' +
                        '<div class="meter-container">' +
                            '<div class="meter-fill logic-fill" id="evidence-meter" style="width: 0%">' +
                                '<span class="meter-value" id="evidence-value">0/10</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="metric">' +
                        '<div class="metric-label">Logical Consistency</div>' +
                        '<div class="meter-container">' +
                            '<div class="meter-fill logic-fill" id="logic-meter" style="width: 0%">' +
                                '<span class="meter-value" id="logic-value">0/10</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="metric">' +
                        '<div class="metric-label">Source Reliability</div>' +
                        '<div class="meter-container">' +
                            '<div class="meter-fill logic-fill" id="source-meter" style="width: 0%">' +
                                '<span class="meter-value" id="source-value">0/10</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="metric">' +
                        '<div class="metric-label">Hidden Agenda Risk</div>' +
                        '<div class="meter-container">' +
                            '<div class="meter-fill logic-fill" id="agenda-meter" style="width: 0%">' +
                                '<span class="meter-value" id="agenda-value">0/10</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="factors-list">' +
                        '<h4>Logical Issues Found:</h4>' +
                        '<div id="logic-factors"></div>' +
                    '</div>' +
                '</div>' +
                
                '<div class="bear-panel emotion-panel">' +
                    '<div class="bear-header">' +
                        '<span class="bear-emoji thinking" id="emotion-bear">💖</span>' +
                        '<span class="bear-name emotion-name">Emotion Bear</span>' +
                    '</div>' +
                    
                    '<div class="metric">' +
                        '<div class="metric-label">Fear/Safety Appeal</div>' +
                        '<div class="meter-container">' +
                            '<div class="meter-fill emotion-fill" id="fear-meter" style="width: 0%">' +
                                '<span class="meter-value" id="fear-value">0/10</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="metric">' +
                        '<div class="metric-label">Belonging/Identity</div>' +
                        '<div class="meter-container">' +
                            '<div class="meter-fill emotion-fill" id="belonging-meter" style="width: 0%">' +
                                '<span class="meter-value" id="belonging-value">0/10</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="metric">' +
                        '<div class="metric-label">Pride/Status Appeal</div>' +
                        '<div class="meter-container">' +
                            '<div class="meter-fill emotion-fill" id="pride-meter" style="width: 0%">' +
                                '<span class="meter-value" id="pride-value">0/10</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="metric">' +
                        '<div class="metric-label">Emotional Manipulation Risk</div>' +
                        '<div class="meter-container">' +
                            '<div class="meter-fill emotion-fill" id="emotion-agenda-meter" style="width: 0%">' +
                                '<span class="meter-value" id="emotion-agenda-value">0/10</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div class="factors-list">' +
                        '<h4>Emotional Triggers Detected:</h4>' +
                        '<div id="emotion-factors"></div>' +
                    '</div>' +
                '</div>' +
                
                '<div class="balance-section">' +
                    '<div class="balance-bar">' +
                        '<div class="balance-track">' +
                            '<div class="balance-indicator" id="balance-indicator">' +
                                '<span class="balance-icon" id="balance-icon">⚖️</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="balance-labels">' +
                            '<span class="bear-name">Wisdom Bear\'s Integration</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                
                '<div class="manipulation-warning" id="manipulation-warning">' +
                    '<strong style="font-size: 1.2em;">🚨 Manipulation Alert!</strong>' +
                    '<div id="manipulation-text" style="margin-top: 8px; font-size: 1.05em;"></div>' +
                '</div>' +
            '</div>';
    }
    
    showDualBearAnalysis(scenario) {
        // Start bear animations
        document.getElementById('logic-bear').classList.add('thinking');
        document.getElementById('emotion-bear').classList.add('thinking');
        
        // Set delay for realistic thinking time
        var self = this;
        setTimeout(function() {
            self.animateMeter('evidence-meter', scenario.analysis.logic.scores.evidence, 0);
            self.animateMeter('logic-meter', scenario.analysis.logic.scores.consistency, 200);
            self.animateMeter('source-meter', scenario.analysis.logic.scores.source, 400);
            self.animateMeter('agenda-meter', scenario.analysis.logic.scores.agenda, 600);
            self.displayFactors('logic-factors', scenario.analysis.logic.indicators);
            document.getElementById('logic-bear').classList.remove('thinking');
        }, 1000);
        
        setTimeout(function() {
            self.animateMeter('fear-meter', scenario.analysis.emotion.scores.fear, 0);
            self.animateMeter('belonging-meter', scenario.analysis.emotion.scores.belonging, 200);
            self.animateMeter('pride-meter', scenario.analysis.emotion.scores.pride, 400);
            self.animateMeter('emotion-agenda-meter', scenario.analysis.emotion.scores.manipulation, 600);
            self.displayFactors('emotion-factors', scenario.analysis.emotion.triggers);
            document.getElementById('emotion-bear').classList.remove('thinking');
        }, 1500);
        
        // Update balance indicator
        setTimeout(function() {
            self.updateBalanceIndicator(scenario);
        }, 2000);
        
        // Show manipulation warning if needed
        setTimeout(function() {
            self.checkForManipulation(scenario);
        }, 2500);
    }
    
    animateMeter(meterId, value, delay) {
        var self = this;
        setTimeout(function() {
            var meter = document.getElementById(meterId);
            var valueSpan = document.getElementById(meterId.replace('-meter', '-value'));
            
            if (meter && valueSpan) {
                meter.style.width = (value * 10) + '%';
                valueSpan.textContent = value + '/10';
                
                // Add pulse effect
                meter.classList.add('meter-pulse');
                setTimeout(function() {
                    meter.classList.remove('meter-pulse');
                }, 600);
            }
        }, delay);
    }
    
    displayFactors(containerId, factors) {
        var container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        factors.forEach(function(factor) {
            var factorDiv = document.createElement('div');
            factorDiv.className = 'factor-item';
            factorDiv.innerHTML = '• ' + factor.replace(/-/g, ' ');
            container.appendChild(factorDiv);
        });
    }
    
    updateBalanceIndicator(scenario) {
        var logicTotal = Object.values(scenario.analysis.logic.scores).reduce(function(a, b) { return a + b; }, 0) / 4;
        var emotionTotal = Object.values(scenario.analysis.emotion.scores).reduce(function(a, b) { return a + b; }, 0) / 4;
        
        var balance = (logicTotal / (logicTotal + emotionTotal)) * 100;
        var indicator = document.getElementById('balance-indicator');
        var icon = document.getElementById('balance-icon');
        
        if (indicator) {
            indicator.style.left = balance + '%';
            
            if (balance < 30) {
                icon.textContent = '💖';
                icon.title = 'Emotion-heavy argument';
            } else if (balance > 70) {
                icon.textContent = '🧠';
                icon.title = 'Logic-heavy argument';
            } else {
                icon.textContent = '⚖️';
                icon.title = 'Balanced argument';
            }
        }
    }
    
    checkForManipulation(scenario) {
        var manipulationScore = scenario.analysis.emotion.scores.manipulation;
        var warning = document.getElementById('manipulation-warning');
        var text = document.getElementById('manipulation-text');
        
        if (manipulationScore > 7 && warning && text) {
            text.textContent = 'High manipulation detected! This argument heavily relies on emotional triggers rather than solid evidence.';
            warning.style.display = 'block';
            warning.classList.add('pulse-warning');
        }
    }
    
    reset() {
        // Reset meters
        var meters = ['evidence-meter', 'logic-meter', 'source-meter', 'agenda-meter', 
                     'fear-meter', 'belonging-meter', 'pride-meter', 'emotion-agenda-meter'];
        
        meters.forEach(function(meterId) {
            var meter = document.getElementById(meterId);
            var valueSpan = document.getElementById(meterId.replace('-meter', '-value'));
            if (meter) meter.style.width = '0%';
            if (valueSpan) valueSpan.textContent = '0/10';
        });
        
        // Clear factors
        var factorContainers = ['logic-factors', 'emotion-factors'];
        factorContainers.forEach(function(containerId) {
            var container = document.getElementById(containerId);
            if (container) container.innerHTML = '';
        });
        
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