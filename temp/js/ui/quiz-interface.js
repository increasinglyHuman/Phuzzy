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
    }
    
    bindEvents() {
        // Answer selection
        this.elements.answerOptions.forEach(function(option) {
            option.addEventListener('click', function() { this.selectAnswer(option); }.bind(this));
        }.bind(this));
        
        // Submit button
        this.elements.submitButton.addEventListener('click', function() { this.submitAnswer(); }.bind(this));
        
        // Honey pot button
        this.elements.honeyPotButton.addEventListener('click', function() { this.useHoneyPot(); }.bind(this));
        
        // Next button
        this.elements.nextButton.addEventListener('click', function() { this.nextScenario(); }.bind(this));
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
        
        this.hasAnswered = true;
        this.elements.submitButton.disabled = true;
        this.elements.honeyPotButton.disabled = true;
        
        // Get evaluation from game engine
        var evaluation = this.gameEngine.submitAnswer(this.selectedAnswer);
        
        // Show feedback
        await this.showFeedback(evaluation);
        
        // Update score if correct
        if (evaluation.score === 100) {
            this.updateScoreDisplay();
            this.feedbackAnimator.showScoreIncrease();
        }
        
        // Show analysis after delay
        setTimeout(function() {
            this.showAnalysis();
        }.bind(this), 2000);
    }
    
    async showFeedback(evaluation) {
        await this.feedbackAnimator.showResult(
            evaluation.feedbackLevel, 
            evaluation.feedback
        );
    }
    
    showAnalysis() {
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
        var scenarios = this.gameEngine.scenariosCompleted.length;
        
        this.elements.userScore.textContent = score;
        this.elements.totalScenarios.textContent = scenarios;
        
        // Show score tracker if hidden
        if (!this.elements.scoreTracker.classList.contains('visible')) {
            this.elements.scoreTracker.classList.add('visible');
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
        });
    }
    
    displayEndGame(stats) {
        // Hide game content
        this.elements.gameContent.style.display = 'none';
        
        // Show end game screen
        this.elements.endGame.classList.add('visible');
        
        // Update final stats
        this.elements.finalScore.textContent = stats.totalScore + '/' + stats.scenariosCompleted;
        this.elements.accuracyPercent.textContent = stats.accuracy + '%';
        this.elements.honeyUsed.textContent = stats.honeyPotsUsed + '/' + this.gameEngine.config.honeyPotsPerRound;
        
        // Display badge
        var badge = stats.badge;
        this.elements.finalBadge.textContent = badge.emoji;
        this.elements.badgeTitle.textContent = badge.title;
        this.elements.badgeMessage.textContent = badge.message;
        
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
        var colors = ['#5a67d8', '#ed64a6', '#f6e05e', '#4299e1', '#f6ad55'];
        var endGame = this.elements.endGame;
        
        for (var i = 0; i < 50; i++) {
            setTimeout(function() {
                var confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
                endGame.appendChild(confetti);
                
                setTimeout(function() { confetti.remove(); }, 5000);
            }, i * 50);
        }
    }
}

// Export for global usage
if (typeof window !== 'undefined') {
    window.QuizInterface = QuizInterface;
}