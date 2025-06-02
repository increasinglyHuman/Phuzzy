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
    
    showResult(isCorrect, message) {
        this.showFeedback(isCorrect, message);
    }
}

// Export for global usage
if (typeof window !== 'undefined') {
    window.FeedbackAnimator = FeedbackAnimator;
}
