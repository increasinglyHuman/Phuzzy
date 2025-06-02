// ===== CORE/SCENARIO-MANAGER.JS =====
class ScenarioManager {
    constructor(config) {
        this.apiEndpoint = config.apiEndpoint;
        this.scenarios = [];
        this.loadedScenarios = new Map();
    }
    
    async loadScenarios(count = 10) {
        try {
            // In production, this would fetch from API
            // For now, load from JSON
            const response = await fetch('./data/scenarios.json');
            const data = await response.json();
            
            // Shuffle and select scenarios
            const shuffled = this.shuffleArray([...data.scenarios]);
            this.scenarios = shuffled.slice(0, count);
            
            // Pre-process scenarios
            this.scenarios.forEach(scenario => {
                this.loadedScenarios.set(scenario.id, scenario);
            });
            
            return this.scenarios;
        } catch (error) {
            console.error('Failed to load scenarios:', error);
            // Fallback to embedded scenarios if needed
            return this.getEmbeddedScenarios(count);
        }
    }
    
    getNextScenario(completedIds) {
        return this.scenarios.find(s => !completedIds.includes(s.id));
    }
    
    getScenarioById(id) {
        return this.loadedScenarios.get(id);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Fallback embedded scenarios (subset)
    getEmbeddedScenarios(count) {
        // Would include minimal scenarios for offline
        return [];
    }
}

export { ScenarioManager };
