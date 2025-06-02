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
            'share-instagram': function() { self.shareToInstagram(); },
            'share-linkedin': function() { self.shareToLinkedIn(); },
            'share-copy': function() { self.copyShareLink(); }
        };
        
        console.log('SocialSharing init() called'); // Debug
        
        Object.keys(buttons).forEach(function(id) {
            var button = document.getElementById(id);
            console.log('Looking for button:', id, 'Found:', !!button); // Debug
            if (button) {
                button.addEventListener('click', function(e) {
                    console.log('Button clicked:', id); // Debug
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
            text: '🐻 I earned ' + badge + ' ' + title + ' with ' + score + ' RIZ in Phuzzy\'s Think Tank! Can you balance logic and emotion better than me? 🧠💖\n\n🎮 Play at: ' + this.gameUrl
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
    
    shareToInstagram() {
        var data = this.getShareData();
        var self = this;
        
        // Instagram doesn't have a direct web sharing API like Facebook/LinkedIn
        // We'll generate the image and show instructions to save and share
        this.generateShareImage().then(function(imageBlob) {
            if (imageBlob) {
                // Create download link for the image
                var link = document.createElement('a');
                link.href = URL.createObjectURL(imageBlob);
                link.download = 'phuzzy-results-instagram.png';
                link.click();
                
                // Show Instagram sharing instructions
                setTimeout(function() {
                    alert('📱 Image saved! Open Instagram, create a new post, and select the downloaded image.\n\nSuggested caption:\n\n' + data.text + '\n\n#PhuzzyThinkTank #CriticalThinking #BalancedThinking');
                }, 500);
            }
        }).catch(function(error) {
            console.error('Error generating Instagram image:', error);
            alert('📱 To share on Instagram: Take a screenshot of your results and post with:\n\n' + data.text + '\n\n#PhuzzyThinkTank');
        });
        
        this.trackShare('instagram');
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
        console.log('Copy link clicked!'); // Debug
        var data = this.getShareData();
        var self = this;
        
        // Generate screenshot and show sharing dialog
        this.generateShareImage().then(function(imageBlob) {
            console.log('Image generated, showing dialog...'); // Debug
            self.showSharingDialog(data, imageBlob);
            self.trackShare('copy');
        }).catch(function(error) {
            console.error('Error generating image:', error);
            // Fallback to simple text copy
            navigator.clipboard.writeText(data.text).then(function() {
                self.showCopySuccess();
            });
        });
    }
    
    showSharingDialog(data, imageBlob) {
        console.log('Creating sharing dialog...', data, imageBlob); // Debug
        
        // Create modal dialog with image and text
        var modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        var modalContent = document.createElement('div');
        modalContent.className = 'share-modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        `;
        
        // Add image preview
        if (imageBlob) {
            var img = document.createElement('img');
            img.src = URL.createObjectURL(imageBlob);
            img.style.cssText = `
                width: 100%;
                max-width: 400px;
                border-radius: 10px;
                margin-bottom: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            `;
            modalContent.appendChild(img);
        }
        
        // Add share text
        var shareText = document.createElement('p');
        shareText.textContent = data.text;
        shareText.style.cssText = `
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
        `;
        modalContent.appendChild(shareText);
        
        // Add buttons
        var buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        `;
        
        // Copy text button
        var copyTextBtn = this.createShareButton('📋 Copy Text', () => {
            navigator.clipboard.writeText(data.text).then(() => {
                this.showCopySuccess();
                modal.remove();
            });
        });
        
        // Copy image button (if supported)
        if (imageBlob && navigator.clipboard && navigator.clipboard.write) {
            var copyImageBtn = this.createShareButton('🖼️ Copy Image', () => {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': imageBlob })
                ]).then(() => {
                    this.showCopySuccess('Image copied!');
                    modal.remove();
                });
            });
            buttonContainer.appendChild(copyImageBtn);
        }
        
        // Download image button
        if (imageBlob) {
            var downloadBtn = this.createShareButton('💾 Save Image', () => {
                var link = document.createElement('a');
                link.href = URL.createObjectURL(imageBlob);
                link.download = 'phuzzy-results.png';
                link.click();
                modal.remove();
            });
            buttonContainer.appendChild(downloadBtn);
        }
        
        buttonContainer.appendChild(copyTextBtn);
        
        // Close button
        var closeBtn = this.createShareButton('✖️ Close', () => {
            modal.remove();
        });
        closeBtn.style.backgroundColor = '#f56565';
        buttonContainer.appendChild(closeBtn);
        
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }
    
    createShareButton(text, onClick) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        button.addEventListener('click', onClick);
        button.addEventListener('mouseover', function() {
            button.style.background = '#2563eb';
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseout', function() {
            button.style.background = '#3b82f6';
            button.style.transform = 'translateY(0)';
        });
        return button;
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
    
    showCopySuccess(message) {
        var button = document.getElementById('share-copy');
        if (!button) return;
        
        var successMessage = message || 'Copied!';
        var originalHTML = button.innerHTML;
        button.innerHTML = '<span>✅</span> ' + successMessage;
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
    
    // Generate share image
    generateShareImage() {
        console.log('Generating share image...'); // Debug
        
        return new Promise((resolve) => {
            try {
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
                console.log('Share data:', data); // Debug
                
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
                canvas.toBlob(function(blob) {
                    console.log('Canvas converted to blob:', blob); // Debug
                    resolve(blob);
                }, 'image/png');
                
            } catch (error) {
                console.error('Error in generateShareImage:', error);
                resolve(null);
            }
        });
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SocialSharing: SocialSharing };
} else if (typeof window !== 'undefined') {
    window.SocialSharing = SocialSharing;
}