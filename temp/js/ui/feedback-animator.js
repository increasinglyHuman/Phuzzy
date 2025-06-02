// Feedback Animator
class FeedbackAnimator {
    constructor() {
        this.container = document.getElementById("game-content");
    }
    
    showFeedback(isCorrect, message) {
        const feedback = document.createElement("div");
        feedback.className = "feedback " + (isCorrect ? "correct" : "incorrect") + " fade-in";
        feedback.textContent = message;
        this.container.appendChild(feedback);
        
        setTimeout(function() { feedback.remove(); }, 3000);
    }
    
    showResult(feedbackLevel, message) {
        // Show different reactions based on performance with short, punchy text
        if (feedbackLevel === "perfect") {
            this.createSparkleExplosion();
            this.showBearReactionWithText("🎉", "PERFECT!");
        } else if (feedbackLevel === "close") {
            this.showBearReactionWithText("👏", "SO CLOSE!");
        } else if (feedbackLevel === "partial") {
            this.showBearReactionWithText("🎓", "NICE TRY!");
        } else {
            this.showBearReactionWithText("😢", "TRY AGAIN!");
        }
    }
    
    createSparkle(x, y) {
        const sparkles = ['✨', '💫', '⭐', '🌟'];
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }
    
    createSparkleExplosion() {
        const scoreTracker = document.getElementById('score-tracker');
        if (!scoreTracker) return;
        
        const rect = scoreTracker.getBoundingClientRect();
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
                const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 50;
                this.createSparkle(x, y);
            }, i * 100);
        }
    }
    
    showBearReaction(emoji) {
        const bear = document.createElement('div');
        bear.className = 'bear-reaction';
        bear.textContent = emoji;
        bear.style.fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif';
        document.body.appendChild(bear);
        
        setTimeout(() => bear.remove(), 1500);
    }
    
    showBearReactionWithText(emoji, text) {
        // Show big emoji first (same as original bear reaction)
        const bear = document.createElement('div');
        bear.className = 'bear-reaction';
        bear.textContent = emoji;
        bear.style.fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif';
        document.body.appendChild(bear);
        
        // Show explanatory text below after a brief delay
        setTimeout(() => {
            const textPopup = document.createElement('div');
            textPopup.className = 'bear-explanation-text';
            textPopup.textContent = text;
            textPopup.style.cssText = `
                position: fixed;
                top: 65%;
                left: 50%;
                transform: translateX(-50%);
                z-index: 210;
                background: white;
                padding: 15px 30px;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                font-size: 2.2em;
                font-weight: 800;
                color: #2d3748;
                text-align: center;
                pointer-events: none;
                letter-spacing: 2px;
                animation: textSlideUp 4s ease-out forwards;
            `;
            document.body.appendChild(textPopup);
            
            // Remove text popup (3x longer for reading)
            setTimeout(() => textPopup.remove(), 3600);
        }, 600); // Show text 600ms after emoji appears
        
        // Remove emoji (also extended so it doesn't disappear while text is still showing)
        setTimeout(() => bear.remove(), 4000);
    }
    
    showScoreIncrease(points = 1) {
        // Create floating coins/bears based on points earned
        this.createFloatingRewards(points);
        
        // Make score tracker swell to "catch" the rewards
        const scoreTracker = document.getElementById('score-tracker');
        if (scoreTracker) {
            scoreTracker.classList.add('score-collecting');
            setTimeout(() => {
                scoreTracker.classList.remove('score-collecting');
            }, 2000);
        }
        
        // Trigger sparkle explosion for score increase
        this.createSparkleExplosion();
    }
    
    createFloatingRewards(points) {
        // Choose reward icons based on points
        let rewardIcon;
        if (points === 3) {
            rewardIcon = '🏆'; // Gold trophy for perfect
        } else if (points === 2) {
            rewardIcon = '🥈'; // Silver for close
        } else if (points === 1) {
            rewardIcon = '🥉'; // Bronze for partial
        } else {
            return; // No rewards for 0 points
        }
        
        // Get score tracker position for targeting
        const scoreTracker = document.getElementById('score-tracker');
        if (!scoreTracker) return;
        
        const targetRect = scoreTracker.getBoundingClientRect();
        
        // Create multiple floating rewards
        for (let i = 0; i < points; i++) {
            setTimeout(() => {
                this.createSingleFloatingReward(rewardIcon, targetRect, i + 1, points);
            }, i * 300); // Stagger by 300ms each
        }
    }
    
    createSingleFloatingReward(icon, targetRect, rewardIndex, totalPoints) {
        const reward = document.createElement('div');
        reward.className = 'floating-reward';
        reward.textContent = icon;
        
        // Start position (bottom center of screen)
        const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        const startY = window.innerHeight - 100;
        
        // Target position (score tracker)
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;
        
        // Calculate curve control point (high arc)
        const midX = (startX + targetX) / 2;
        const midY = Math.min(startY, targetY) - 150; // Arc 150px above the line
        
        // Create unique animation name
        const animationName = `curvedFlight-${Date.now()}-${rewardIndex}`;
        
        // Create curved path keyframes
        const keyframes = `
            @keyframes ${animationName} {
                0% {
                    left: ${startX}px;
                    top: ${startY}px;
                    transform: scale(0.5) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    left: ${midX}px;
                    top: ${midY}px;
                    transform: scale(1) rotate(180deg);
                    opacity: 1;
                }
                100% {
                    left: ${targetX}px;
                    top: ${targetY}px;
                    transform: scale(1.2) rotate(360deg);
                    opacity: 0.8;
                }
            }
        `;
        
        // Inject keyframes into document
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        reward.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${startY}px;
            font-size: 3em;
            z-index: 2000;
            pointer-events: none;
            font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
            animation: ${animationName} 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            transform-origin: center;
        `;
        
        document.body.appendChild(reward);
        
        // Remove elements and trigger score tick after animation
        setTimeout(() => {
            reward.remove();
            style.remove(); // Clean up the keyframes
            this.tickUpScore(rewardIndex, totalPoints);
        }, 1600);
    }
    
    tickUpScore(currentTick, totalTicks) {
        const scoreElement = document.getElementById('user-score');
        if (!scoreElement) return;
        
        // Get current score and increment it visually
        let currentScore = parseInt(scoreElement.textContent) || 0;
        scoreElement.textContent = currentScore + 1;
        
        // Add tick animation
        scoreElement.classList.add('score-tick');
        
        // Visual feedback with golden color
        scoreElement.style.transform = 'scale(1.2)';
        scoreElement.style.color = '#f6d365';
        scoreElement.style.fontWeight = 'bold';
        
        setTimeout(() => {
            scoreElement.classList.remove('score-tick');
            scoreElement.style.transform = 'scale(1)';
            scoreElement.style.color = '';
            scoreElement.style.fontWeight = '';
        }, 200);
        
        // If this is the final tick, add extra celebration
        if (currentTick === totalTicks) {
            setTimeout(() => {
                scoreElement.classList.add('score-pulse');
                setTimeout(() => {
                    scoreElement.classList.remove('score-pulse');
                }, 600);
            }, 100);
        }
    }
}

// Export for global usage
if (typeof window !== 'undefined') {
    window.FeedbackAnimator = FeedbackAnimator;
}
