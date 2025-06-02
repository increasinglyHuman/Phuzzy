// ===== UI/QUIZ-INTERFACE.JS =====
// Dependencies loaded via global window objects

class QuizInterface {
    constructor(gameEngine, elements) {
        this.gameEngine = gameEngine;
        this.elements = elements;
        this.currentScenario = null;
        this.selectedAnswer = null;
        this.hasAnswered = false;
        
        this.bearAnalysis = new window.BearAnalysis(elements.analysisSection);
        this.feedbackAnimator = new window.FeedbackAnimator();
        this.hintDisplay = new window.HintDisplay();
        
        this.bindEvents();
        this.setupDeveloperHotkeys();
    }
    
    bindEvents() {
        try {
            // Answer selection
            if (this.elements.answerOptions) {
                this.elements.answerOptions.forEach(function(option) {
                    if (option) {
                        option.addEventListener('click', function() { this.selectAnswer(option); }.bind(this));
                    }
                }.bind(this));
            }
            
            // Submit button
            if (this.elements.submitButton) {
                this.elements.submitButton.addEventListener('click', function() { this.submitAnswer(); }.bind(this));
            }
            
            // Honey pot button
            if (this.elements.honeyPotButton) {
                this.elements.honeyPotButton.addEventListener('click', function() { this.useHoneyPot(); }.bind(this));
            }
            
            // Next button
            if (this.elements.nextButton) {
                this.elements.nextButton.addEventListener('click', function() { this.nextScenario(); }.bind(this));
            }
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }
    
    displayScenario(scenario) {
        this.currentScenario = scenario;
        this.selectedAnswer = null;
        this.hasAnswered = false;
        
        // Update UI
        this.elements.scenarioTitle.textContent = scenario.title;
        this.elements.scenarioText.textContent = scenario.text;
        this.elements.claimText.textContent = 'Claim: "' + scenario.claim + '"';
        
        // Update scenario counter
        var scenarioNum = this.gameEngine.scenariosCompleted.length + 1;
        var totalScenarios = this.gameEngine.config.scenariosPerRound;
        this.elements.scenarioCounter.textContent = 'Scenario ' + scenarioNum + ' of ' + totalScenarios;
        
        // Reset UI state
        this.resetAnswerOptions();
        this.elements.submitButton.disabled = true;
        this.elements.nextButton.style.display = 'none';
        this.elements.analysisSection.style.display = 'none';
        this.bearAnalysis.reset();
        
        // Update honey pot display
        this.updateHoneyPotDisplay();
        
        // Update score display
        this.updateScoreDisplay();
    }
    
    selectAnswer(optionElement) {
        if (this.hasAnswered) return;
        
        this.elements.answerOptions.forEach(function(opt) {
            opt.classList.remove('selected');
        });
        
        optionElement.classList.add('selected');
        this.selectedAnswer = optionElement.dataset.value;
        this.elements.submitButton.disabled = false;
    }
    
    async submitAnswer() {
        if (!this.selectedAnswer || this.hasAnswered) return;
        
        try {
            this.hasAnswered = true;
            this.elements.submitButton.disabled = true;
            this.elements.honeyPotButton.disabled = true;
            
            // Get evaluation from game engine
            var evaluation = this.gameEngine.submitAnswer(this.selectedAnswer);
            
            console.log('Evaluation result:', evaluation); // Debug log
            
            // Show feedback
            await this.showFeedback(evaluation);
            
            // If not perfect answer, highlight the correct one for learning
            if (evaluation.feedbackLevel !== 'perfect') {
                this.highlightCorrectAnswer();
            }
            
            // Show score increase animation with points earned
            if (evaluation.points > 0) {
                this.feedbackAnimator.showScoreIncrease(evaluation.points);
                // Update max possible score after animation completes
                setTimeout(() => {
                    this.updateMaxPossibleScore();
                }, 2500);
            } else {
                // No points earned, just update the max possible immediately
                this.updateMaxPossibleScore();
            }
            
            // Show analysis after delay
            setTimeout(function() {
                this.showAnalysis();
            }.bind(this), 2000);
        } catch (error) {
            console.error('Error in submitAnswer:', error);
            // Reset state on error
            this.hasAnswered = false;
            this.elements.submitButton.disabled = false;
            this.elements.honeyPotButton.disabled = false;
        }
    }
    
    async showFeedback(evaluation) {
        await this.feedbackAnimator.showResult(
            evaluation.feedbackLevel, 
            evaluation.feedback
        );
    }
    
    showAnalysis() {
        if (!this.currentScenario) {
            console.error('No current scenario available for analysis');
            return;
        }
        
        this.elements.analysisSection.style.display = 'block';
        this.bearAnalysis.showDualBearAnalysis(this.currentScenario);
        
        // Show next button after animation
        setTimeout(function() {
            this.elements.nextButton.style.display = 'block';
        }.bind(this), 4000);
    }
    
    useHoneyPot() {
        var result = this.gameEngine.useHoneyPot();
        
        if (result.success) {
            this.applyHint(result.hint);
            this.updateHoneyPotDisplay();
        } else {
            this.hintDisplay.showError(result.message);
        }
    }
    
    applyHint(hint) {
        var textElement = this.elements.scenarioText;
        
        // Apply visual hint to scenario text
        textElement.style.backgroundColor = hint.color;
        textElement.style.border = '2px solid ' + hint.borderColor;
        textElement.style.padding = '20px';
        textElement.style.borderRadius = '10px';
        textElement.style.transition = 'all 0.3s ease';
        
        // Show hint message
        this.hintDisplay.show(hint.icon, hint.message);
    }
    
    updateHoneyPotDisplay() {
        var stats = this.gameEngine.honeyPotManager.getStats();
        
        // Update count
        this.elements.honeyPotCount.textContent = stats.available;
        
        // Update visual honey pots
        this.elements.honeyPotIcons.forEach(function(icon, index) {
            if (index >= stats.available) {
                icon.classList.add('used');
            } else {
                icon.classList.remove('used');
            }
        });
        
        // Update button state
        this.elements.honeyPotButton.disabled = stats.available === 0 || this.hasAnswered;
        
        if (stats.available === 0) {
            this.elements.honeyPotButton.innerHTML = '🍯 No Honey Pots Left!';
        } else {
            this.elements.honeyPotButton.innerHTML = '🍯 Use Honey Pot for Hint (' + stats.available + ' left)';
        }
    }
    
    updateScoreDisplay() {
        var score = this.gameEngine.scoringSystem.getTotalScore();
        
        // Show just the positive score, not x/y format
        this.elements.userScore.textContent = score;
        
        // Update progress bar for question progress
        this.updateProgressBar();
        
        // Ensure score tracker stays visible - force it!
        this.elements.scoreTracker.classList.add('visible');
        // Also force opacity and transform in case CSS gets overridden
        this.elements.scoreTracker.style.opacity = '1';
        this.elements.scoreTracker.style.transform = 'translateY(0)';
    }
    
    updateMaxPossibleScore() {
        // Just update progress bar, not the score display
        this.updateProgressBar();
        
        // Ensure score tracker stays visible
        this.elements.scoreTracker.classList.add('visible');
        this.elements.scoreTracker.style.opacity = '1';
        this.elements.scoreTracker.style.transform = 'translateY(0)';
    }
    
    updateProgressBar() {
        var questionsCompleted = this.gameEngine.scenariosCompleted.length;
        var totalQuestions = this.gameEngine.config.scenariosPerRound;
        
        // Update progress bar if it exists
        var progressBar = document.getElementById('question-progress-bar');
        if (progressBar) {
            var progressPercent = (questionsCompleted / totalQuestions) * 100;
            progressBar.style.width = progressPercent + '%';
        }
    }
    
    nextScenario() {
        // Reset hint styling
        var textElement = this.elements.scenarioText;
        textElement.style = '';
        
        // Load next scenario
        this.gameEngine.loadNextScenario();
    }
    
    resetAnswerOptions() {
        this.elements.answerOptions.forEach(function(opt) {
            opt.classList.remove('selected');
            opt.classList.remove('correct-highlight'); // Clear any lingering highlights
        });
    }
    
    highlightCorrectAnswer() {
        if (!this.currentScenario) return;
        
        const correctAnswer = this.currentScenario.correctAnswer;
        
        // Find the correct answer option
        const correctOption = Array.from(this.elements.answerOptions).find(function(option) {
            return option.dataset.value === correctAnswer;
        });
        
        if (correctOption) {
            // Add green flash effect
            correctOption.classList.add('correct-highlight');
            
            // Remove the effect after flashing
            setTimeout(function() {
                correctOption.classList.remove('correct-highlight');
            }, 3000); // 3 seconds of flashing
        }
    }
    
    displayEndGame(stats) {
        // Hide game content
        this.elements.gameContent.style.display = 'none';
        
        // Show end game screen
        this.elements.endGame.classList.add('visible');
        
        // Update final stats - show score vs max possible points
        var maxPossiblePoints = stats.scenariosCompleted * 3; // 3 points per scenario
        this.elements.finalScore.textContent = stats.totalScore + '/' + maxPossiblePoints;
        this.elements.accuracyPercent.textContent = stats.accuracy + '%';
        this.elements.honeyUsed.textContent = stats.honeyPotsUsed + '/' + this.gameEngine.config.honeyPotsPerRound;
        
        // Display badge
        var badge = stats.badge;
        if (badge && this.elements.finalBadge && this.elements.badgeTitle && this.elements.badgeMessage) {
            this.elements.finalBadge.textContent = badge.emoji || '🏆';
            this.elements.badgeTitle.textContent = badge.title || 'Well Done!';
            this.elements.badgeMessage.textContent = badge.message || 'Thanks for playing!';
        }
        
        // Update performance meters
        this.updatePerformanceMeters(stats.performance);
        
        // Create confetti
        this.createConfetti();
    }
    
    updatePerformanceMeters(performance) {
        // Animate performance meters
        setTimeout(function() {
            this.elements.logicPerformance.style.width = performance.logic + '%';
            this.elements.emotionPerformance.style.width = performance.emotion + '%';
            this.elements.balancePerformance.style.width = performance.balanced + '%';
            this.elements.agendaPerformance.style.width = performance.agenda + '%';
        }.bind(this), 1000);
    }
    
    createConfetti() {
        // EPIC CELEBRATION! Multiple waves of confetti and shapes
        this.createConfettiWave(1); // Initial burst
        
        setTimeout(() => {
            this.createConfettiWave(2); // Second wave
        }, 800);
        
        setTimeout(() => {
            this.createConfettiWave(3); // Third wave  
        }, 1600);
        
        // Add floating emoji celebrations
        setTimeout(() => {
            this.createFloatingCelebration();
        }, 1000);
    }
    
    createConfettiWave(waveNumber) {
        var colors = ['#5a67d8', '#ed64a6', '#f6e05e', '#4299e1', '#f6ad55', '#10b981', '#f56565', '#8b5cf6'];
        var shapes = ['circle', 'square', 'triangle', 'star'];
        var endGame = this.elements.endGame;
        
        // More confetti per wave!
        var confettiCount = 80 + (waveNumber * 20); // 80, 100, 120 pieces
        
        for (var i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                var confetti = document.createElement('div');
                var shape = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.className = 'confetti confetti-' + shape;
                
                // Random position
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Varied timing
                confetti.style.animationDelay = Math.random() * 1 + 's';
                confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                
                // Random size variation
                var size = 8 + Math.random() * 8; // 8-16px
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                
                endGame.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 6000);
            }, i * 25); // Faster spawning
        }
    }
    
    createFloatingCelebration() {
        var celebrationEmojis = ['🎉', '🎊', '🥳', '✨', '🌟', '💫', '🎈', '🏆'];
        var endGame = this.elements.endGame;
        
        for (var i = 0; i < 15; i++) {
            setTimeout(() => {
                var emoji = document.createElement('div');
                emoji.className = 'celebration-emoji';
                emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                emoji.style.cssText = `
                    position: absolute;
                    left: ${Math.random() * 80 + 10}%;
                    top: ${Math.random() * 80 + 10}%;
                    font-size: ${2 + Math.random() * 2}em;
                    z-index: 1000;
                    pointer-events: none;
                    font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
                    animation: celebrationFloat ${3 + Math.random() * 2}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                `;
                
                endGame.appendChild(emoji);
                
                setTimeout(() => emoji.remove(), 8000);
            }, i * 200);
        }
    }
    
    setupDeveloperHotkeys() {
        var self = this;
        var keySequence = [];
        
        document.addEventListener('keydown', function(event) {
            // Track last few keys
            keySequence.push(event.key.toLowerCase());
            
            // Keep only last 5 keys
            if (keySequence.length > 5) {
                keySequence.shift();
            }
            
            // Simple sequence: type "party" 
            if (keySequence.join('') === 'party') {
                console.log('🎉 Developer hotkey activated! Time to party with confetti!');
                self.triggerTestEndGame();
                keySequence = []; // Reset
            }
        });
    }
    
    triggerTestEndGame() {
        // Create fake stats for testing
        var testStats = {
            totalScore: 18,
            accuracy: 75,
            scenariosCompleted: 8,
            honeyPotsUsed: 2,
            performance: {
                logic: 80,
                emotion: 70,
                balanced: 85,
                agenda: 65
            },
            badge: {
                emoji: '🥇',
                title: 'Test Champion',
                message: 'You found the secret hotkey!'
            }
        };
        
        this.displayEndGame(testStats);
    }
}

// Export for global usage
if (typeof window !== 'undefined') {
    window.QuizInterface = QuizInterface;
}