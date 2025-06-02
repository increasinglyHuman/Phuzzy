// ===== UI/SOCIAL-SHARING.JS =====
class SocialSharing {
    constructor() {
        this.gameUrl = 'https://www.p0qp0q.com/thinkTank/';
        this.gameTitle = "Phuzzy's Think Tank";
    }
    
    init() {
        // Bind social buttons
        var self = this;
        var buttons = {
            'share-facebook': function() { self.shareToFacebook(); },
            'share-twitter': function() { self.shareToTwitter(); },
            'share-linkedin': function() { self.shareToLinkedIn(); },
            'share-copy': function() { self.copyShareLink(); }
        };
        
        Object.keys(buttons).forEach(function(id) {
            var button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    buttons[id]();
                });
            }
        });
    }
    
    getShareData() {
        var badgeEl = document.getElementById('final-badge');
        var titleEl = document.getElementById('badge-title');
        var scoreEl = document.getElementById('final-score');
        var accuracyEl = document.getElementById('accuracy-percent');
        
        var badge = badgeEl ? badgeEl.textContent : '🏆';
        var title = titleEl ? titleEl.textContent : 'Phuzzy Thinker';
        var score = scoreEl ? scoreEl.textContent : '0/0';
        var accuracy = accuracyEl ? accuracyEl.textContent : '0%';
        
        return {
            badge: badge,
            title: title,
            score: score,
            accuracy: accuracy,
            text: '🐻 I earned ' + badge + ' ' + title + ' with ' + score + ' RIZ in Phuzzy\'s Think Tank! Can you balance logic and emotion better than me? 🧠💖'
        };
    }
    
    shareToFacebook() {
        var data = this.getShareData();
        var url = encodeURIComponent(this.gameUrl);
        var quote = encodeURIComponent(data.text);
        
        window.open(
            'https://www.facebook.com/sharer/sharer.php?u=' + url + '&quote=' + quote,
            '_blank',
            'width=600,height=400'
        );
        
        this.trackShare('facebook');
    }
    
    shareToTwitter() {
        var data = this.getShareData();
        var text = encodeURIComponent(data.text);
        var url = encodeURIComponent(this.gameUrl);
        var hashtags = encodeURIComponent('PhuzzyThinkTank,CriticalThinking,BalancedThinking');
        
        window.open(
            'https://twitter.com/intent/tweet?text=' + text + '&url=' + url + '&hashtags=' + hashtags,
            '_blank',
            'width=600,height=400'
        );
        
        this.trackShare('twitter');
    }
    
    shareToLinkedIn() {
        var data = this.getShareData();
        var url = encodeURIComponent(this.gameUrl);
        
        // LinkedIn sharing works best with just URL
        window.open(
            'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
            '_blank',
            'width=600,height=400'
        );
        
        this.trackShare('linkedin');
    }
    
    copyShareLink() {
        var data = this.getShareData();
        var shareText = data.text + '\n\n🎮 Play at: ' + this.gameUrl;
        var self = this;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText).then(function() {
                self.showCopySuccess();
                self.trackShare('copy');
            }).catch(function(err) {
                // Fallback for older browsers
                self.fallbackCopy(shareText);
            });
        } else {
            // Fallback for older browsers
            this.fallbackCopy(shareText);
        }
    }
    
    fallbackCopy(text) {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position: fixed; left: -999999px;';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
            this.trackShare('copy');
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy. Please select and copy manually:\n\n' + text);
        }
        
        document.body.removeChild(textArea);
    }
    
    showCopySuccess() {
        var button = document.getElementById('share-copy');
        if (!button) return;
        
        var originalHTML = button.innerHTML;
        button.innerHTML = '<span>✅</span> Copied!';
        button.style.background = '#48bb78';
        
        setTimeout(function() {
            button.innerHTML = originalHTML;
            button.style.background = '';
        }, 2000);
    }
    
    trackShare(platform) {
        // Track sharing analytics
        if (window.gtag) {
            window.gtag('event', 'share', {
                method: platform,
                content_type: 'game_result',
                item_id: 'phuzzy_think_tank'
            });
        }
    }
    
    // Generate share image (for future implementation)
    generateShareImage() {
        var canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 630;
        var ctx = canvas.getContext('2d');
        
        // Background
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add game title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("🐻 Phuzzy's Think Tank", canvas.width / 2, 100);
        
        // Add score data
        var data = this.getShareData();
        ctx.font = '150px Arial';
        ctx.fillText(data.badge, canvas.width / 2, 280);
        
        ctx.font = 'bold 48px Arial';
        ctx.fillText(data.title, canvas.width / 2, 380);
        
        ctx.font = '36px Arial';
        ctx.fillText('Score: ' + data.score + ' • Accuracy: ' + data.accuracy, canvas.width / 2, 450);
        
        // Add tagline
        ctx.font = '32px Arial';
        ctx.fillText('Can you balance logic and emotion better?', canvas.width / 2, 540);
        
        // Convert to blob
        return new Promise(function(resolve) {
            canvas.toBlob(function(blob) {
                resolve(blob);
            }, 'image/png');
        });
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SocialSharing: SocialSharing };
} else if (typeof window !== 'undefined') {
    window.SocialSharing = SocialSharing;
}