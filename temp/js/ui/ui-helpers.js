// ===== UI/FEEDBACK-ANIMATOR.JS =====
class FeedbackAnimator {
    constructor() {
        this.container = document.body;
    }
    
    async showResult(feedbackLevel, feedback) {
        const reactions = {
            perfect: { emoji: '🎉', size: 'large', duration: 1500 },
            close: { emoji: '😊', size: 'medium', duration: 1200 },
            partial: { emoji: '🤔', size: 'medium', duration: 1200 },
            wrong: { emoji: '😢', size: 'medium', duration: 1200 }
        };
        
        const reaction = reactions[feedbackLevel];
        
        // Create bear reaction
        const bear = document.createElement('div');
        bear.className = `bear-reaction ${reaction.size}`;
        bear.textContent = reaction.emoji;
        bear.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: ' + (reaction.size === 'large' ? '8em' : '6em') + ';
            z-index: 200;
            animation: bearPop ' + reaction.duration + 'ms ease-out forwards;
            pointer-events: none;
        `;
        
        // Create feedback text
        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'feedback-text';
        feedbackEl.style.cssText = `
            position: fixed;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.5em;
            font-weight: bold;
            color: #5a67d8;
            z-index: 201;
            animation: fadeInOut ' + reaction.duration + 'ms ease-out forwards;
            pointer-events: none;
            text-align: center;
            background: white;
            padding: 15px 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        `;
        feedbackEl.innerHTML = '
            <div style="font-size: 1.2em; margin-bottom: 8px;">' + feedback.text + '</div>
            <div style="font-size: 0.9em; color: #666;">' + feedback.detail + '</div>
        ';
        
        // Add to page
        this.container.appendChild(bear);
        this.container.appendChild(feedbackEl);
        
        // Create sparkles for perfect score
        if (feedbackLevel === 'perfect') {
            this.createSparkles(20);
        }
        
        // Clean up after animation
        return new Promise(resolve => {
            setTimeout(() => {
                bear.remove();
                feedbackEl.remove();
                resolve();
            }, reaction.duration);
        });
    }
    
    showScoreIncrease() {
        const scoreTracker = document.getElementById('score-tracker');
        if (!scoreTracker) return;
        
        const rect = scoreTracker.getBoundingClientRect();
        
        // Create +1 animation
        const plusOne = document.createElement('div');
        plusOne.textContent = '+1';
        plusOne.style.cssText = '
            position: fixed;
            left: ' + (rect.left + rect.width / 2) + 'px;
            top: ' + rect.top + 'px;
            font-size: 2em;
            font-weight: bold;
            color: #5a67d8;
            z-index: 250;
            animation: floatUpAndFade 1.5s ease-out forwards;
            pointer-events: none;
        ';
        
        this.container.appendChild(plusOne);
        
        // Create sparkle explosion
        this.createSparkleExplosion(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
        
        setTimeout(() => plusOne.remove(), 1500);
    }
    
    createSparkles(count) {
        var sparkles = ['✨', '💫', '⭐', '🌟'];
        var self = this;
        
        for (var i = 0; i < count; i++) {
            (function(index) {
                setTimeout(function() {
                    var sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                    
                    // Random position around center
                    var angle = (Math.PI * 2 * index) / count;
                    var radius = 150 + Math.random() * 100;
                    var x = window.innerWidth / 2 + Math.cos(angle) * radius;
                    var y = window.innerHeight / 2 + Math.sin(angle) * radius;
                    
                    sparkle.style.cssText = '
                        position: fixed;
                        left: ' + x + 'px;
                        top: ' + y + 'px;
                        font-size: 1.5em;
                        z-index: 150;
                        animation: floatUp 2s ease-out forwards;
                        pointer-events: none;
                    ';
                    
                    self.container.appendChild(sparkle);
                    setTimeout(function() { sparkle.remove(); }, 2000);
                }, index * 50);
            })(i);
        }
    }
    
    createSparkleExplosion(x, y) {
        var self = this;
        for (var i = 0; i < 15; i++) {
            (function(index) {
                setTimeout(function() {
                    var offsetX = (Math.random() - 0.5) * 100;
                    var offsetY = (Math.random() - 0.5) * 50;
                    self.createSparkle(x + offsetX, y + offsetY);
                }, index * 100);
            })(i);
        }
    }
    
    createSparkle(x, y) {
        var sparkles = ['✨', '💫', '⭐', '🌟'];
        var sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.cssText = '
            position: fixed;
            left: ' + x + 'px;
            top: ' + y + 'px;
            font-size: 1.5em;
            z-index: 150;
            animation: floatUp 2s ease-out forwards;
            pointer-events: none;
        ';
        
        this.container.appendChild(sparkle);
        setTimeout(function() { sparkle.remove(); }, 2000);
    }
}

// ===== UI/HINT-DISPLAY.JS =====
class HintDisplay {
    constructor() {
        this.container = document.body;
    }
    
    show(icon, message) {
        var hint = document.createElement('div');
        hint.className = 'hint-indicator';
        hint.style.cssText = '
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            font-size: 3em;
            padding: 20px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 150;
            animation: slideIn 0.5s ease-out;
            max-width: 300px;
        ';
        
        hint.innerHTML = '
            <div style="text-align: center;">' + icon + '</div>
            <div style="font-size: 0.4em; margin-top: 10px; color: #4a5568; line-height: 1.4;">
                ' + message + '
            </div>
        ';
        
        this.container.appendChild(hint);
        
        // Auto-remove after 4 seconds
        setTimeout(function() {
            hint.style.animation = 'slideOut 0.5s ease-out forwards';
            setTimeout(function() { hint.remove(); }, 500);
        }, 4000);
    }
    
    showError(message) {
        var error = document.createElement('div');
        error.className = 'error-message';
        error.style.cssText = '
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 300;
            animation: slideDown 0.3s ease-out;
            box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
        ';
        error.textContent = message;
        
        this.container.appendChild(error);
        
        setTimeout(function() {
            error.style.animation = 'slideUp 0.3s ease-out forwards';
            setTimeout(function() { error.remove(); }, 300);
        }, 3000);
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FeedbackAnimator: FeedbackAnimator, HintDisplay: HintDisplay };
} else if (typeof window !== 'undefined') {
    window.FeedbackAnimator = FeedbackAnimator;
    window.HintDisplay = HintDisplay;
}