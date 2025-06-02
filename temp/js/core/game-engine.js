// ===== CORE/GAME-ENGINE.JS =====

// ES5 compatible - objects will be available globally
// import { ScenarioManager } from './scenario-manager.js';
// import { ScoringSystem } from './scoring-system.js';
// import { HoneyPotManager } from './honey-pot-manager.js';
// import { AnalyticsTracker } from '../utils/analytics-tracker.js';

class PhuzzyGameEngine {
    constructor(config = {}) {
        this.config = {
            scenariosPerRound: config.scenariosPerRound || 10,
            honeyPotsPerRound: config.honeyPotsPerRound || 3,
            apiEndpoint: config.apiEndpoint || '/api/scenarios',
            ...config
        };
        
        this.scenarioManager = new window.ScenarioManager(this.config);
        this.scoringSystem = new window.ScoringSystem();
        this.honeyPotManager = new window.HoneyPotManager(this.config.honeyPotsPerRound);
        this.analyticsTracker = new window.AnalyticsTracker();
        this.uiController = null; // Set by UI layer
        
        this.currentScenario = null;
        this.scenariosCompleted = [];
        this.userAnswers = [];
        this.gameState = 'loading';
    }
    
    async initialize() {
        try {
            this.gameState = 'loading';
            await this.scenarioManager.loadScenarios(this.config.scenariosPerRound);
            this.gameState = 'ready';
            return true;
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.gameState = 'error';
            return false;
        }
    }
    
    async startGame() {
        if (this.gameState !== 'ready') {
            throw new Error('Game not ready. Call initialize() first.');
        }
        
        this.gameState = 'playing';
        this.scenariosCompleted = [];
        this.userAnswers = [];
        this.scoringSystem.reset();
        this.honeyPotManager.reset();
        
        await this.loadNextScenario();
    }
    
    async loadNextScenario() {
        const nextScenario = this.scenarioManager.getNextScenario(this.scenariosCompleted);
        
        if (!nextScenario) {
            this.endGame();
            return;
        }
        
        this.currentScenario = nextScenario;
        this.analyticsTracker.trackScenarioStart(nextScenario.id);
        
        if (this.uiController) {
            this.uiController.displayScenario(nextScenario);
        }
    }
    
    submitAnswer(userAnswer) {
        if (!this.currentScenario || this.gameState !== 'playing') {
            throw new Error('No active scenario to answer');
        }
        
        const evaluation = this.scoringSystem.evaluateAnswer(
            userAnswer,
            this.currentScenario
        );
        
        this.userAnswers.push({
            scenarioId: this.currentScenario.id,
            userAnswer: userAnswer,
            correctAnswer: this.currentScenario.correctAnswer,
            score: evaluation.score,
            feedback: evaluation.feedback
        });
        
        this.scenariosCompleted.push(this.currentScenario.id);
        
        this.analyticsTracker.trackAnswer({
            scenarioId: this.currentScenario.id,
            userAnswer: userAnswer,
            correct: evaluation.score === 100,
            timeSpent: Date.now() - this.analyticsTracker.scenarioStartTime
        });
        
        return evaluation;
    }
    
    useHoneyPot() {
        if (!this.currentScenario) {
            throw new Error('No active scenario');
        }
        
        const hint = this.honeyPotManager.useHoneyPot(this.currentScenario);
        this.analyticsTracker.trackHoneyPotUse(this.currentScenario.id);
        
        return hint;
    }
    
    endGame() {
        this.gameState = 'ended';
        
        const finalStats = {
            totalScore: this.scoringSystem.getTotalScore(),
            accuracy: this.scoringSystem.getAccuracy(),
            scenariosCompleted: this.scenariosCompleted.length,
            honeyPotsUsed: this.honeyPotManager.getUsedCount(),
            performance: this.scoringSystem.getPerformanceBreakdown(),
            badge: this.scoringSystem.getBadge()
        };
        
        this.analyticsTracker.trackGameComplete(finalStats);
        
        if (this.uiController) {
            this.uiController.displayEndGame(finalStats);
        }
        
        return finalStats;
    }
    
    // Microgame integration
    registerMicrogame(iframeId, gameType) {
        var iframe = document.getElementById(iframeId);
        if (!iframe) {
            throw new Error('Iframe with id ' + iframeId + ' not found');
        }
        
        window.addEventListener('message', function(event) {
            if (event.source !== iframe.contentWindow) return;
            
            if (event.data.type === 'HONEY_EARNED') {
                this.honeyPotManager.add(event.data.amount);
                this.analyticsTracker.trackMicrogameComplete({
                    gameType: gameType,
                    honeyEarned: event.data.amount
                });
            }
        }.bind(this));
    }
}

// Export for global usage
if (typeof window !== 'undefined') {
    window.PhuzzyGameEngine = PhuzzyGameEngine;
}
