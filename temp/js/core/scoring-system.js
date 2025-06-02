
// ===== CORE/SCORING-SYSTEM.JS =====
class ScoringSystem {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.totalScore = 0;
        this.possibleScore = 0;
        this.answerHistory = [];
        this.performanceByType = {
            logic: { correct: 0, total: 0 },
            emotion: { correct: 0, total: 0 },
            balanced: { correct: 0, total: 0 },
            agenda: { correct: 0, total: 0 }
        };
    }
    
    evaluateAnswer(userAnswer, scenario) {
        var weights = scenario.answerWeights;
        var score = weights[userAnswer] || 0;
        
        // Track performance by type
        var correctType = scenario.correctAnswer;
        this.performanceByType[correctType].total++;
        
        if (score === 100) {
            this.performanceByType[correctType].correct++;
            this.totalScore += 1;
        }
        
        this.possibleScore += 1;
        
        // Determine feedback level
        var feedbackLevel;
        if (score === 100) {
            feedbackLevel = 'perfect';
        } else if (score >= 80) {
            feedbackLevel = 'close';
        } else if (score >= 50) {
            feedbackLevel = 'partial';
        } else {
            feedbackLevel = 'wrong';
        }
        
        var feedback = this.getFeedbackMessage(feedbackLevel, userAnswer, scenario);
        
        this.answerHistory.push({
            scenarioId: scenario.id,
            userAnswer,
            score,
            feedbackLevel
        });
        
        return {
            score,
            feedbackLevel,
            feedback,
            explanation: this.getExplanation(userAnswer, scenario)
        };
    }
    
    getFeedbackMessage(level, userAnswer, scenario) {
        const messages = {
            perfect: {
                emoji: '🎉',
                text: 'Perfect!',
                detail: 'You correctly identified the primary issue.'
            },
            close: {
                emoji: '😊',
                text: 'Almost there!',
                detail: this.getCloseExplanation(userAnswer, scenario)
            },
            partial: {
                emoji: '🤔',
                text: 'Keep thinking...',
                detail: 'You identified a secondary issue, but missed the main one.'
            },
            wrong: {
                emoji: '😢',
                text: 'Study harder!',
                detail: 'This answer misses the key elements of the argument.'
            }
        };
        
        return messages[level];
    }
    
    getCloseExplanation(userAnswer, scenario) {
        var correct = scenario.correctAnswer;
        
        var explanations = {
            'emotion-agenda': 'Manipulation often uses emotional appeals, so you\'re on the right track!',
            'agenda-emotion': 'You spotted the emotional manipulation, which often indicates a hidden agenda!',
            'logic-agenda': 'Weak logic often serves a hidden purpose - good eye!',
            'agenda-logic': 'You noticed the logical flaws that support their agenda!',
            'balanced-logic': 'You recognized the logical elements, though this argument is actually well-balanced.',
            'balanced-emotion': 'You noticed the emotional elements, though they\'re appropriately balanced here.'
        };
        
        var key = userAnswer + '-' + correct;
        return explanations[key] || 'You\'re close - consider the primary characteristic of this argument.';
    }
    
    getExplanation(userAnswer, scenario) {
        // Return the full analysis for the correct answer
        return scenario.analysis[scenario.correctAnswer]?.explanation || scenario.wisdom;
    }
    
    getTotalScore() {
        return this.totalScore;
    }
    
    getAccuracy() {
        if (this.possibleScore === 0) return 0;
        return Math.round((this.totalScore / this.possibleScore) * 100);
    }
    
    getPerformanceBreakdown() {
        var breakdown = {};
        
        Object.keys(this.performanceByType).forEach(function(type) {
            var data = this.performanceByType[type];
            breakdown[type] = data.total > 0 
                ? Math.round((data.correct / data.total) * 100)
                : 50; // Default if not tested
        }.bind(this));
        
        return breakdown;
    }
    
    getBadge() {
        var accuracy = this.getAccuracy();
        
        if (accuracy === 100) {
            return {
                emoji: '💎',
                title: 'Phuzzy Diamond Master',
                message: 'Perfect score! You have mastered Phuzzy thinking!'
            };
        } else if (accuracy >= 66) {
            return {
                emoji: '🥇',
                title: 'Phuzzy Gold Guardian',
                message: 'Excellent work! You see through most manipulation.'
            };
        } else if (accuracy >= 33) {
            return {
                emoji: '🥈',
                title: 'Phuzzy Silver Scout',
                message: 'Good job! Keep practicing your Phuzzy thinking.'
            };
        } else {
            return {
                emoji: '🥉',
                title: 'Phuzzy Bronze Cub',
                message: 'Nice start! There\'s room to grow your skills.'
            };
        }
    }
}
// Export for global usage
if (typeof window !== 'undefined') {
    window.ScoringSystem = ScoringSystem;
}
