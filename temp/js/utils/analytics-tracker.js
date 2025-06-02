// ===== UTILS/ANALYTICS-TRACKER.JS =====
class AnalyticsTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.events = [];
        this.scenarioStartTime = null;
        this.gameStartTime = Date.now();
    }
    
    generateSessionId() {
        return 'phuzzy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    trackEvent(eventType, data) {
        var event = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            type: eventType,
            data: data
        };
        
        this.events.push(event);
        
        // Send to analytics service if available
        if (window.gtag) {
            var gtag_data = {};
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    gtag_data[key] = data[key];
                }
            }
            gtag_data.session_id = this.sessionId;
            window.gtag('event', eventType, gtag_data);
        }
        
        // Also send to custom analytics endpoint if configured
        if (window.PHUZZY_CONFIG && window.PHUZZY_CONFIG.analyticsEndpoint) {
            this.sendToEndpoint(event);
        }
        
        // Store locally for session replay
        this.saveToLocalStorage(event);
    }
    
    trackScenarioStart(scenarioId) {
        this.scenarioStartTime = Date.now();
        this.trackEvent('scenario_start', { 
            scenarioId: scenarioId,
            scenarioNumber: this.getScenarioCount() + 1
        });
    }
    
    trackAnswer(data) {
        var answer_data = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                answer_data[key] = data[key];
            }
        }
        answer_data.responseTime = data.timeSpent || (Date.now() - this.scenarioStartTime);
        this.trackEvent('answer_submitted', answer_data);
    }
    
    trackHoneyPotUse(scenarioId) {
        this.trackEvent('honey_pot_used', { 
            scenarioId: scenarioId,
            timeIntoScenario: Date.now() - this.scenarioStartTime,
            honeyPotsRemaining: this.getHoneyPotsRemaining()
        });
    }
    
    trackMicrogameComplete(data) {
        var microgame_data = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                microgame_data[key] = data[key];
            }
        }
        microgame_data.timestamp = Date.now();
        this.trackEvent('microgame_complete', microgame_data);
    }
    
    trackGameComplete(stats) {
        var gameDuration = Date.now() - this.gameStartTime;
        var complete_data = {};
        for (var key in stats) {
            if (stats.hasOwnProperty(key)) {
                complete_data[key] = stats[key];
            }
        }
        complete_data.gameDuration = gameDuration;
        complete_data.averageResponseTime = this.calculateAverageResponseTime();
        complete_data.sessionDuration = gameDuration;
        complete_data.eventsCount = this.events.length;
        
        this.trackEvent('game_complete', complete_data);
    }
    
    trackError(error, context) {
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            context,
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }
    
    async sendToEndpoint(event) {
        // Disabled for local development - just log to console
        console.log("Analytics event:", event);
        return;
    }
    
    saveToLocalStorage(event) {
        try {
            var key = 'phuzzy_analytics';
            var stored = localStorage.getItem(key) || '[]';
            var events = JSON.parse(stored);
            
            events.push(event);
            
            // Keep only last 100 events to prevent storage overflow
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem(key, JSON.stringify(events));
        } catch (e) {
            // Ignore storage errors (quota exceeded, etc.)
            console.warn('Analytics storage failed:', e);
        }
    }
    
    // Helper methods
    getScenarioCount() {
        return this.events.filter(e => e.type === 'scenario_start').length;
    }
    
    getHoneyPotsRemaining() {
        var used = this.events.filter(function(e) { return e.type === 'honey_pot_used'; }).length;
        return 3 - used; // Assuming 3 initial honey pots
    }
    
    calculateAverageResponseTime() {
        var answers = this.events.filter(function(e) { return e.type === 'answer_submitted'; });
        if (answers.length === 0) return 0;
        
        var totalTime = answers.reduce(function(sum, event) {
            return sum + (event.data.responseTime || 0);
        }, 0);
        
        return Math.round(totalTime / answers.length);
    }
    
    getSessionStats() {
        return {
            sessionId: this.sessionId,
            eventCount: this.events.length,
            duration: Date.now() - this.gameStartTime,
            scenariosStarted: this.getScenarioCount(),
            honeyPotsUsed: this.events.filter(function(e) { return e.type === 'honey_pot_used'; }).length,
            errors: this.events.filter(function(e) { return e.type === 'error'; }).length
        };
    }
    
    // Export session data for debugging
    exportSession() {
        return {
            sessionId: this.sessionId,
            startTime: this.gameStartTime,
            events: this.events,
            stats: this.getSessionStats()
        };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnalyticsTracker: AnalyticsTracker };
} else if (typeof window !== 'undefined') {
    window.AnalyticsTracker = AnalyticsTracker;
}