# Phuzzy Microgame API Specification

## Overview
The Phuzzy Microgame API enables mini-games to communicate with the main Phuzzy Think Tank game, primarily for earning honey pots through engaging educational activities.

## Architecture

### Communication Flow
```
Main Game (Parent)
    ↕️ postMessage API
Microgame (iframe)
```

### Security Considerations
- All microgames run in sandboxed iframes
- Origin validation required for all messages
- No direct DOM access between frames
- Honey pot earnings are validated server-side

## API Messages

### 1. Initialization

#### Parent → Microgame
```javascript
{
    type: "MICROGAME_INIT",
    data: {
        gameId: "logic-puzzle-001",
        userId: "user-uuid",
        config: {
            difficulty: 2,
            theme: "phuzzy",
            soundEnabled: true,
            maxHoneyReward: 3
        }
    }
}
```

#### Microgame → Parent (Acknowledgment)
```javascript
{
    type: "MICROGAME_READY",
    data: {
        gameId: "logic-puzzle-001",
        version: "1.0.0",
        features: ["honey-earning", "progressive-difficulty"]
    }
}
```

### 2. Game State Updates

#### Microgame → Parent
```javascript
{
    type: "GAME_STATE_UPDATE",
    data: {
        state: "playing", // "loading", "playing", "paused", "completed", "error"
        progress: 0.75,   // 0-1 progress indicator
        score: 450
    }
}
```

### 3. Honey Pot Earning

#### Microgame → Parent (Honey Earned)
```javascript
{
    type: "HONEY_EARNED",
    data: {
        amount: 2,
        reason: "completed-logic-puzzle",
        metadata: {
            difficulty: 3,
            timeSpent: 120, // seconds
            accuracy: 0.85
        }
    }
}
```

#### Parent → Microgame (Confirmation)
```javascript
{
    type: "HONEY_EARNED_CONFIRMED",
    data: {
        totalHoney: 5,
        earnedThisSession: 2
    }
}
```

### 4. Error Handling

#### Either Direction
```javascript
{
    type: "ERROR",
    data: {
        code: "INVALID_HONEY_AMOUNT",
        message: "Honey amount exceeds maximum allowed",
        severity: "warning" // "info", "warning", "error"
    }
}
```

### 5. User Actions

#### Parent → Microgame
```javascript
{
    type: "USER_ACTION",
    data: {
        action: "pause", // "pause", "resume", "restart", "quit"
        timestamp: 1234567890
    }
}
```

### 6. Analytics Events

#### Microgame → Parent
```javascript
{
    type: "ANALYTICS_EVENT",
    data: {
        event: "level_complete",
        properties: {
            level: 3,
            score: 850,
            hintsUsed: 1,
            perfectClear: false
        }
    }
}
```

## Implementation Examples

### Microgame Implementation
```javascript
class PhuzzyMicrogameClient {
    constructor() {
        this.gameId = null;
        this.parentOrigin = 'https://www.p0qp0q.com';
        this.initializeMessageHandler();
    }
    
    initializeMessageHandler() {
        window.addEventListener('message', (event) => {
            if (event.origin !== this.parentOrigin) return;
            
            switch (event.data.type) {
                case 'MICROGAME_INIT':
                    this.handleInit(event.data.data);
                    break;
                case 'USER_ACTION':
                    this.handleUserAction(event.data.data);
                    break;
                case 'HONEY_EARNED_CONFIRMED':
                    this.handleHoneyConfirmation(event.data.data);
                    break;
            }
        });
    }
    
    handleInit(data) {
        this.gameId = data.gameId;
        this.config = data.config;
        
        // Initialize game with config
        this.setupGame();
        
        // Send ready signal
        this.sendMessage('MICROGAME_READY', {
            gameId: this.gameId,
            version: '1.0.0',
            features: ['honey-earning']
        });
    }
    
    earnHoney(amount, reason, metadata = {}) {
        this.sendMessage('HONEY_EARNED', {
            amount,
            reason,
            metadata
        });
    }
    
    sendMessage(type, data) {
        parent.postMessage({
            type,
            data,
            gameId: this.gameId,
            timestamp: Date.now()
        }, this.parentOrigin);
    }
}
```

### Parent Game Implementation
```javascript
class MicrogameController {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.activeMicrogames = new Map();
        this.initializeMessageHandler();
    }
    
    initializeMessageHandler() {
        window.addEventListener('message', (event) => {
            // Validate origin
            if (!this.isValidMicrogameOrigin(event.origin)) return;
            
            const { type, data, gameId } = event.data;
            
            switch (type) {
                case 'MICROGAME_READY':
                    this.handleMicrogameReady(gameId, data);
                    break;
                case 'HONEY_EARNED':
                    this.handleHoneyEarned(gameId, data);
                    break;
                case 'GAME_STATE_UPDATE':
                    this.handleStateUpdate(gameId, data);
                    break;
                case 'ANALYTICS_EVENT':
                    this.handleAnalytics(gameId, data);
                    break;
            }
        });
    }
    
    loadMicrogame(iframeId, gameType, config = {}) {
        const iframe = document.getElementById(iframeId);
        if (!iframe) throw new Error(`Iframe ${iframeId} not found`);
        
        const gameId = `${gameType}-${Date.now()}`;
        
        // Store reference
        this.activeMicrogames.set(gameId, {
            iframe,
            gameType,
            state: 'loading'
        });
        
        // Send initialization
        iframe.onload = () => {
            iframe.contentWindow.postMessage({
                type: 'MICROGAME_INIT',
                data: {
                    gameId,
                    userId: this.gameEngine.userId,
                    config
                }
            }, '*');
        };
        
        return gameId;
    }
    
    handleHoneyEarned(gameId, data) {
        // Validate earning
        if (!this.validateHoneyEarning(gameId, data)) {
            this.sendError(gameId, 'INVALID_HONEY_AMOUNT');
            return;
        }
        
        // Add honey to main game
        this.gameEngine.honeyPotManager.add(data.amount);
        
        // Send confirmation
        const game = this.activeMicrogames.get(gameId);
        if (game) {
            game.iframe.contentWindow.postMessage({
                type: 'HONEY_EARNED_CONFIRMED',
                data: {
                    totalHoney: this.gameEngine.honeyPotManager.getAvailable(),
                    earnedThisSession: data.amount
                }
            }, '*');
        }
        
        // Track analytics
        this.gameEngine.analyticsTracker.trackMicrogameComplete({
            gameId,
            gameType: game.gameType,
            honeyEarned: data.amount,
            ...data.metadata
        });
    }
    
    validateHoneyEarning(gameId, data) {
        const game = this.activeMicrogames.get(gameId);
        if (!game) return false;
        
        // Check maximum allowed
        const maxReward = game.config?.maxHoneyReward || 3;
        if (data.amount > maxReward) return false;
        
        // Additional validation rules
        return true;
    }
}
```

## Microgame Types

### 1. Logic Puzzles
- Pattern recognition
- Syllogism solving
- Fallacy identification
- Honey Reward: 1-3 based on difficulty

### 2. Emotion Recognition
- Facial expression matching
- Tone analysis
- Manipulation detection
- Honey Reward: 1-2 based on accuracy

### 3. Balance Games
- Argument weighing
- Pro/con analysis
- Evidence evaluation
- Honey Reward: 1-3 based on performance

### 4. Speed Challenges
- Quick decision making
- Bias detection under pressure
- Rapid categorization
- Honey Reward: 1-2 based on speed/accuracy

## Security Guidelines

1. **Origin Validation**
   ```javascript
   const ALLOWED_ORIGINS = [
       'https://www.p0qp0q.com',
       'https://microgames.p0qp0q.com'
   ];
   
   if (!ALLOWED_ORIGINS.includes(event.origin)) {
       return; // Ignore message
   }
   ```

2. **Honey Earning Limits**
   - Maximum 3 honey pots per microgame session
   - Cooldown period between games
   - Server-side validation of all earnings

3. **Data Sanitization**
   - All string data must be sanitized
   - Numeric values must be within expected ranges
   - No execution of arbitrary code

## Testing Framework

```javascript
class MicrogameTestHarness {
    constructor() {
        this.mockParent = new MockParentGame();
        this.testResults = [];
    }
    
    async runTests() {
        await this.testInitialization();
        await this.testHoneyEarning();
        await this.testErrorHandling();
        await this.testStateManagement();
        
        return this.testResults;
    }
    
    async testHoneyEarning() {
        // Test valid earning
        const result1 = await this.mockParent.simulateHoneyEarn(2);
        this.assert(result1.confirmed, 'Valid honey earning confirmed');
        
        // Test invalid earning (too much)
        const result2 = await this.mockParent.simulateHoneyEarn(5);
        this.assert(!result2.confirmed, 'Invalid honey earning rejected');
        
        // Test rapid earning (should be rate limited)
        const result3 = await this.mockParent.simulateRapidEarning();
        this.assert(result3.rateLimited, 'Rapid earning rate limited');
    }
}
```

## Deployment Checklist

- [ ] Origin validation implemented
- [ ] Message schema validated
- [ ] Error handling comprehensive
- [ ] Analytics tracking functional
- [ ] Honey earning limits enforced
- [ ] Cross-browser testing complete
- [ ] Security audit passed
- [ ] Performance benchmarks met