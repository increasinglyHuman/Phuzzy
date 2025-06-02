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
            '</div>' +
            
            '<div class="wisdom-panel">' +
                '<div class="wisdom-header">' +
                    '<span class="bear-emoji">🦉</span>' +
                    '<span class="bear-name">Wisdom Bear\'s Analysis</span>' +
                '</div>' +
                '<div class="wisdom-content" id="wisdom-content">' +
                    'Analyzing the balance between logic and emotion...' +
                '</div>' +
                '<div class="balance-section">' +
                    '<h3>Logic ↔ Emotion Balance</h3>' +
                    '<div class="balance-meter">' +
                        '<div class="balance-indicator" id="balance-indicator" style="left: 50%">' +
                            '<span class="balance-icon" id="balance-icon">⚖️</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="balance-labels">' +
                        '<span>🧠 Pure Logic</span>' +
                        '<span>⚖️ Balanced</span>' +
                        '<span>💖 Pure Emotion</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            
            '<div class="manipulation-warning" id="manipulation-warning">' +
                '<strong style="font-size: 1.2em;">🚨 Manipulation Alert!</strong>' +
                '<div id="manipulation-text" style="margin-top: 8px; font-size: 1.05em;"></div>' +
            '</div>';
    }
    
    showDualBearAnalysis(scenario) {
        // Make analysis visible
        var analysisGrid = this.container.querySelector('.analysis-grid');
        if (analysisGrid) {
            analysisGrid.classList.add('visible');
        }
        
        // Start bear animations
        document.getElementById('logic-bear').classList.add('thinking');
        document.getElementById('emotion-bear').classList.add('thinking');
        
        // Store scenario data for scroll-triggered animations
        this.currentScenario = scenario;
        this.animationsTriggered = false;
        
        // Set up scroll listener for dramatic reveals
        this.setupScrollTrigger();
        
        // Stop thinking animation after a moment - user will scroll to see results
        setTimeout(function() {
            document.getElementById('logic-bear').classList.remove('thinking');
            document.getElementById('emotion-bear').classList.remove('thinking');
        }, 2000);
        
        // Note: Animations and integrations now triggered by scroll
        // This creates suspense as user scrolls down to reveal analysis
    }
    
    animateMeter(meterId, value, delay) {
        setTimeout(function() {
            var meter = document.getElementById(meterId);
            var valueSpan = document.getElementById(meterId.replace('-meter', '-value'));
            
            if (meter && valueSpan) {
                // Ensure meter starts at 0% (force reflow)
                meter.style.width = '0%';
                meter.offsetHeight; // Force reflow
                
                // Now animate to target width
                meter.style.width = (value * 10) + '%';
                valueSpan.textContent = value + '/10';
            }
        }, delay);
    }
    
    displayFactors(containerId, factors) {
        var container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        var self = this;
        factors.forEach(function(factor, index) {
            setTimeout(function() {
                var factorDiv = document.createElement('div');
                factorDiv.className = 'factor-item';
                // Convert factor keys to display text with icons
                var displayText = self.convertFactorToDisplayText(factor, containerId);
                factorDiv.innerHTML = displayText;
                container.appendChild(factorDiv);
            }, 200 * (index + 1)); // Stagger the factor appearance
        });
    }
    
    convertFactorToDisplayText(factor, containerId) {
        // If factor already contains emoji or starts with emoji, use as-is
        if (factor.match(/^[\u{1F600}-\u{1F64F}]|^[\u{1F300}-\u{1F5FF}]|^[\u{1F680}-\u{1F6FF}]|^[\u{1F1E0}-\u{1F1FF}]|^[\u{2600}-\u{26FF}]|^[\u{2700}-\u{27BF}]/u) || factor.includes('✓') || factor.includes('🚫')) {
            return factor;
        }
        
        // Logic factor conversions
        var logicFactors = {
            'qualified-expert': '✓ Qualified expert source',
            'specific-data': '✓ Specific study data shared', 
            'acknowledges-limits': '✓ Acknowledges limitations',
            'mentions-alternatives': '✓ Mentions alternatives',
            'weak-evidence': '🚫 Weak or missing evidence',
            'zero-evidence': '🚫 Zero evidence of threat',
            'biased-source': '📱 Questionable source reliability',
            'facebook-source': '📱 "Read on Facebook" source',
            'hidden-agenda': '💰 Hidden sales agenda',
            'hidden-sales': '💰 Hidden sales agenda',
            'speculation': '😱 Pure speculation',
            'pure-speculation': '😱 Pure speculation',
            'cherry-picked': '🍒 Cherry-picked sample',
            'cherry-picked-sample': '🍒 Cherry-picked sample',
            'contradicts-evidence': '❌ Contradicts vast evidence',
            'industry-funded': '🏭 Likely industry-funded source',
            'dubious-institute': '🏭 Dubious "institute" source',
            'logical-fallacy': '🤔 Logical fallacy detected',
            'natural-good-fallacy': '🤔 "Natural = good" fallacy'
        };
        
        // Emotion factor conversions  
        var emotionFactors = {
            'harvard-credibility': '🎓 Harvard credibility appeal',
            'aging-concern': '⏰ Aging concerns trigger',
            'hope-solution': '💊 Hope for solution',
            'professional-trust': '🤝 Professional trust appeal',
            'child-safety': '🚸 Child safety panic',
            'child-safety-panic': '🚸 Child safety panic',
            'police-narrative': '🚔 "Police won\'t help" narrative',
            'police-wont-help': '🚔 "Police won\'t help" narrative',
            'us-vs-them': '👥 Us vs. them mentality',
            'urgency-pressure': '⚡ URGENT pressure tactics',
            'urgent-pressure': '⚡ URGENT!!! pressure',
            'body-shame': '😢 Body shame activation',
            'relationship-insecurity': '👰 Relationship insecurity',
            'beauty-anxiety': '💃 Beauty standard anxiety',
            'economic-fear': '💰 Economic fear tactics',
            'superiority-complex': '🐑 "Wake up" superiority appeal',
            'wake-up-superiority': '🐑 "Wake up" superiority',
            'anti-establishment': '🏴 Anti-establishment appeal',
            'theyre-lying': '😤 "They\'re lying to you"'
        };
        
        // Check logic factors first
        if (containerId === 'logic-factors' && logicFactors[factor]) {
            return logicFactors[factor];
        }
        
        // Check emotion factors
        if (containerId === 'emotion-factors' && emotionFactors[factor]) {
            return emotionFactors[factor];
        }
        
        // Fallback: convert kebab-case to readable text
        return '• ' + factor.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    setupScrollTrigger() {
        var self = this;
        
        // Remove any existing scroll listener
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
        }
        
        this.scrollListener = function() {
            try {
                if (self.animationsTriggered) return;
                
                // Check if bear analysis section is in view
                var analysisGrid = self.container.querySelector('.analysis-grid');
                if (!analysisGrid) return;
                
                var rect = analysisGrid.getBoundingClientRect();
                var triggerPoint = window.innerHeight * 0.7; // Trigger when 70% visible
                
                if (rect.top < triggerPoint) {
                    self.animationsTriggered = true;
                    self.triggerStaggeredAnimations();
                    window.removeEventListener('scroll', self.scrollListener);
                    self.scrollListener = null; // Clear reference
                }
            } catch (error) {
                console.warn('Scroll listener error:', error);
                // Remove faulty listener to prevent blocking
                window.removeEventListener('scroll', self.scrollListener);
                self.scrollListener = null;
            }
        };
        
        window.addEventListener('scroll', this.scrollListener);
    }
    
    triggerStaggeredAnimations() {
        var scenario = this.currentScenario;
        if (!scenario) return;
        
        var self = this;
        
        // Staggered dramatic reveals - Logic Bear first
        setTimeout(function() {
            console.log('🧠 Logic Bear begins analysis...');
            document.getElementById('logic-bear').classList.add('thinking');
            self.animateMeter('evidence-meter', scenario.analysis.logic.scores.evidence, 0);
        }, 200);
        
        setTimeout(function() {
            self.animateMeter('logic-meter', scenario.analysis.logic.scores.consistency, 0);
        }, 800);
        
        setTimeout(function() {
            self.animateMeter('source-meter', scenario.analysis.logic.scores.source, 0);
        }, 1400);
        
        setTimeout(function() {
            self.animateMeter('agenda-meter', scenario.analysis.logic.scores.agenda, 0);
            document.getElementById('logic-bear').classList.remove('thinking');
            self.displayFactors('logic-factors', scenario.analysis.logic.indicators);
        }, 2000);
        
        // Emotion Bear starts after Logic Bear finishes
        setTimeout(function() {
            console.log('💖 Emotion Bear begins analysis...');
            document.getElementById('emotion-bear').classList.add('thinking');
            self.animateMeter('fear-meter', scenario.analysis.emotion.scores.fear, 0);
        }, 2800);
        
        setTimeout(function() {
            self.animateMeter('belonging-meter', scenario.analysis.emotion.scores.belonging, 0);
        }, 3400);
        
        setTimeout(function() {
            self.animateMeter('pride-meter', scenario.analysis.emotion.scores.pride, 0);
        }, 4000);
        
        setTimeout(function() {
            self.animateMeter('emotion-agenda-meter', scenario.analysis.emotion.scores.manipulation, 0);
            document.getElementById('emotion-bear').classList.remove('thinking');
            self.displayFactors('emotion-factors', scenario.analysis.emotion.triggers);
        }, 4600);
        
        // Wisdom Bear integration
        setTimeout(function() {
            console.log('🦉 Wisdom Bear synthesizes...');
            self.showWisdomBearIntegration(scenario);
            self.updateBalanceIndicator(scenario);
        }, 5400);
        
        // Manipulation check
        setTimeout(function() {
            self.checkForManipulation(scenario);
        }, 6000);
    }
    
    showWisdomBearIntegration(scenario) {
        var wisdomContent = document.getElementById('wisdom-content');
        if (wisdomContent) {
            // Use the scenario's wisdom text if available, otherwise fallback to generated text
            var integration = scenario.wisdom || this.getWisdomIntegration(scenario);
            wisdomContent.textContent = integration;
        }
    }
    
    getWisdomIntegration(scenario) {
        var correctAnswer = scenario.correctAnswer;
        
        if (correctAnswer === 'emotion') {
            return 'Classic emotional manipulation combining trust networks with body insecurity. The "doctor husband" detail adds false authority while urgent scarcity drives quick decisions. Real medical weight loss never promises 30 pounds in a month safely.';
        } else if (correctAnswer === 'logic') {
            return 'Weak logical foundation built on anecdotes and assumptions. The argument dismisses expert opinions without evidence and proposes extreme solutions based on limited personal experiences.';
        } else if (correctAnswer === 'balanced') {
            return 'Well-structured argument with solid data and cost analysis. Acknowledges potential confounding factors while maintaining focus on measurable outcomes and student success metrics.';
        } else {
            return 'Hidden agenda detected through selective data presentation and inflammatory language. The source may have financial or ideological motivations that compromise objective analysis.';
        }
    }
    
    updateBalanceIndicator(scenario) {
        var logicTotal = Object.values(scenario.analysis.logic.scores).reduce(function(a, b) { return a + b; }, 0) / 4;
        var emotionTotal = Object.values(scenario.analysis.emotion.scores).reduce(function(a, b) { return a + b; }, 0) / 4;
        
        // Balance calculation: 0% = Pure Logic (left), 100% = Pure Emotion (right)
        var balance = (emotionTotal / (logicTotal + emotionTotal)) * 100;
        var indicator = document.getElementById('balance-indicator');
        var icon = document.getElementById('balance-icon');
        
        
        if (indicator && icon) {
            indicator.style.left = balance + '%';
            
            if (balance < 30) {
                icon.textContent = '🧠';
                icon.title = 'Logic-heavy argument';
            } else if (balance > 70) {
                icon.textContent = '💖';
                icon.title = 'Emotion-heavy argument';
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
        
        if (manipulationScore > 6 && warning && text) {
            text.textContent = 'High manipulation detected! This argument heavily relies on emotional triggers rather than solid evidence.';
            warning.style.display = 'block';
            warning.classList.add('visible');
        } else if (warning) {
            warning.style.display = 'none';
            warning.classList.remove('visible');
        }
    }
    
    reset() {
        // Clean up scroll listener
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
        }
        
        // Reset animation state
        this.animationsTriggered = false;
        this.currentScenario = null;
        
        // Reset meters
        var meters = ['evidence-meter', 'logic-meter', 'source-meter', 'agenda-meter', 
                     'fear-meter', 'belonging-meter', 'pride-meter', 'emotion-agenda-meter'];
        
        meters.forEach(function(meterId) {
            var meter = document.getElementById(meterId);
            var valueSpan = document.getElementById(meterId.replace('-meter', '-value'));
            if (meter) {
                meter.style.width = '0%';
            }
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
        var warning = document.getElementById('manipulation-warning');
        if (warning) {
            warning.style.display = 'none';
            warning.classList.remove('visible');
        }
        
        // Reset balance
        document.getElementById('balance-indicator').style.left = '50%';
        document.getElementById('balance-icon').textContent = '⚖️';
        
        // Reset wisdom content
        var wisdomContent = document.getElementById('wisdom-content');
        if (wisdomContent) {
            wisdomContent.textContent = 'Analyzing the balance between logic and emotion...';
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BearAnalysis: BearAnalysis };
} else if (typeof window !== 'undefined') {
    window.BearAnalysis = BearAnalysis;
}