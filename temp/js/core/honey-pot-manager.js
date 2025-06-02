// ===== CORE/HONEY-POT-MANAGER.JS =====
class HoneyPotManager {
    constructor(initialCount = 3) {
        this.initialCount = initialCount;
        this.reset();
    }
    
    reset() {
        this.available = this.initialCount;
        this.used = 0;
        this.earnedFromMicrogames = 0;
    }
    
    useHoneyPot(scenario) {
        if (this.available <= 0) {
            return {
                success: false,
                message: 'No honey pots left! Play microgames to earn more.'
            };
        }
        
        this.available--;
        this.used++;
        
        return {
            success: true,
            hint: this.generateHint(scenario),
            remaining: this.available
        };
    }
    
    generateHint(scenario) {
        const strategy = scenario.correctAnswer;
        const hints = {
            emotion: {
                icon: '💖',
                message: 'This argument relies heavily on emotional triggers like fear, guilt, or urgency. Look for dramatic language!',
                color: 'rgba(237, 100, 166, 0.2)',
                borderColor: 'rgba(237, 100, 166, 0.8)'
            },
            logic: {
                icon: '🧠',
                message: 'This argument lacks solid evidence. Look for anecdotes, unsupported claims, or dismissed experts!',
                color: 'rgba(66, 153, 225, 0.2)',
                borderColor: 'rgba(66, 153, 225, 0.8)'
            },
            balanced: {
                icon: '⚖️',
                message: 'This argument presents data and acknowledges limitations. Look for statistics, sources, and nuanced thinking!',
                color: 'rgba(246, 224, 94, 0.2)',
                borderColor: 'rgba(246, 224, 94, 0.8)'
            },
            agenda: {
                icon: '🎯',
                message: 'Someone has something to gain here. Look for sales pitches, urgency tactics, or hidden motives!',
                color: 'rgba(245, 101, 101, 0.2)',
                borderColor: 'rgba(245, 101, 101, 0.8)'
            }
        };
        
        return hints[strategy] || hints.balanced;
    }
    
    add(amount) {
        this.available += amount;
        this.earnedFromMicrogames += amount;
        return this.available;
    }
    
    getAvailable() {
        return this.available;
    }
    
    getUsedCount() {
        return this.used;
    }
    
    getStats() {
        return {
            available: this.available,
            used: this.used,
            earnedFromMicrogames: this.earnedFromMicrogames,
            totalEarned: this.initialCount + this.earnedFromMicrogames
        };
    }
}
export { HoneyPotManager };
