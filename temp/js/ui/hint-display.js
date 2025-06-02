// Hint Display
function HintDisplay() {
    this.hintContainer = null;
    
    this.showHint = function(hintText) {
        if (!this.hintContainer) {
            this.hintContainer = document.createElement("div");
            this.hintContainer.className = "hint-container";
            document.querySelector(".scenario-box").appendChild(this.hintContainer);
        }
        
        this.hintContainer.innerHTML = '<div class="hint">💡 ' + hintText + '</div>';
        this.hintContainer.classList.add("slide-in");
    };
    
    this.hideHint = function() {
        if (this.hintContainer) {
            this.hintContainer.innerHTML = "";
        }
    };

    this.show = function(hintText) {
        this.showHint(hintText);
    };
    
    this.showError = function(errorText) {
        this.showHint("❌ " + errorText);
    };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HintDisplay: HintDisplay };
} else if (typeof window !== 'undefined') {
    window.HintDisplay = HintDisplay;
}
