// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation link highlighting
    highlightCurrentPage();
    
    // Enhanced animation for content boxes on page load
    animateContentBoxes();
    
    // Initialize image functionality
    initImageControls();

    // Add hover effects
    addHoverEffects();
    
    // Initialize content management functionality
    initContentManagement();
});

/**
 * Highlights the current page in the navigation menu
 */
function highlightCurrentPage() {
    // Get current page path
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Loop through each link and check if it matches current page
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref === pageName || 
            (pageName === '' && linkHref === 'index.html')) {
            // Add active styling to current page link
            link.style.fontWeight = 'bold';
            link.style.color = '#004d99';
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Apply subtle fade-in and slide-up animation to content boxes
 */
function animateContentBoxes() {
    const contentBoxes = document.querySelectorAll('.content-box');
    
    contentBoxes.forEach((box, index) => {
        // Set initial state
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        
        // Apply smooth transition
        box.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        // Stagger the animations
        setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
}

/**
 * Add hover effects to interactive elements
 */
function addHoverEffects() {
    // Add hover effect to navigation items
    const navItems = document.querySelectorAll('nav ul li a');
    navItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            this.style.transition = 'color 0.3s ease';
        });
    });
    
    // Add hover effect to content boxes
    const contentBoxes = document.querySelectorAll('.content-box');
    contentBoxes.forEach(box => {
        box.addEventListener('mouseover', function() {
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
        });
        
        box.addEventListener('mouseout', function() {
            this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
        });
    });
}

/**
 * Initialize content management functionality
 */
function initContentManagement() {
    // Make article titles editable
    makeElementsEditable('h2', saveArticleTitle);
    
    // Make article paragraphs editable
    makeElementsEditable('.article-content p', saveArticleContent);
    
    // Make company name editable
    makeElementsEditable('.footer-left h3', saveCompanyName);
    
    // Make company description editable
    makeElementsEditable('.footer-left p:first-of-type', saveCompanyDescription);
}

/**
 * Make elements editable with double-click
 */
function makeElementsEditable(selector, saveCallback) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
        // Add editable attribute
        element.setAttribute('title', 'Double-click to edit');
        
        // Add double-click event listener
        element.addEventListener('dblclick', function() {
            // Make element editable
            element.contentEditable = true;
            element.focus();
            
            // Add styling to show it's being edited
            element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            element.style.padding = '5px';
            element.style.borderRadius = '4px';
            
            // Add blur event to save when done editing
            element.addEventListener('blur', function() {
                // Make no longer editable
                element.contentEditable = false;
                
                // Remove styling
                element.style.backgroundColor = '';
                element.style.padding = '';
                
                // Save the content
                saveCallback(element, index);
            }, { once: true });
            
            // Save when Enter is pressed (but allow multiline in paragraphs)
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey && element.tagName !== 'P') {
                    e.preventDefault();
                    element.blur();
                }
            });
        });
    });
}

/**
 * Save article title to server
 */
function saveArticleTitle(element, index) {
    const title = element.textContent;
    
    // Save to server
    saveToServer('title', index, title);
    
    // Show notification
    showNotification('Title updated');
}

/**
 * Save article content to server
 */
function saveArticleContent(element, index) {
    // Determine which article this paragraph belongs to
    const articleElement = element.closest('.article-content');
    const articles = document.querySelectorAll('.article-content');
    const articleIndex = Array.from(articles).indexOf(articleElement);
    
    // Get all paragraphs in this article
    const paragraphs = articleElement.querySelectorAll('p');
    const content = Array.from(paragraphs).map(p => p.outerHTML).join('');
    
    // Save to server
    saveToServer('content', articleIndex, content);
    
    // Show notification
    showNotification('Content updated');
}

/**
 * Save company name to server
 */
function saveCompanyName(element, index) {
    const name = element.textContent;
    
    // Save to server
    saveToServer('company', 0, name, 'name');
    
    // Show notification
    showNotification('Company name updated');
}

/**
 * Save company description to server
 */
function saveCompanyDescription(element, index) {
    const description = element.textContent;
    
    // Save to server
    saveToServer('company', 0, description, 'description');
    
    // Show notification
    showNotification('Company description updated');
}

/**
 * Show a notification when content is saved
 */
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('save-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'save-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // Hide after delay
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 2000);
}

/**
 * Save content to server
 */
function saveToServer(type, index, value, field = null) {
    // Prepare data
    const data = {
        type: type,
        index: index,
        value: value
    };
    
    // Add field for company data
    if (field) {
        data.field = field;
    }
    
    // Send to server
    fetch('../includes/save-content.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Error saving content:', data.message);
            showNotification('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error saving content:', error);
        showNotification('Error saving content');
    });
}

/**
 * Initialize image control functionality for all image containers
 */
function initImageControls() {
    const imageContainers = document.querySelectorAll('.image-container');
    
    imageContainers.forEach((container, index) => {
        const placeholder = container.querySelector('.placeholder-image');
        const urlInput = container.querySelector('.image-url-input');
        const addBtn = container.querySelector('.add-image-btn');
        const deleteBtn = container.querySelector('.delete-image-btn');
        
        // Add image button click event
        addBtn.addEventListener('click', () => {
            const imageUrl = urlInput.value.trim();
            if (imageUrl) {
                // Show loading indicator
                placeholder.style.backgroundImage = '';
                placeholder.classList.add('loading');
                placeholder.innerHTML = '<div class="loading-spinner"></div>';
                
                // Create a new image element to test the URL
                const testImage = new Image();
                testImage.onload = function() {
                    // Successfully loaded the image
                    placeholder.innerHTML = '';
                    placeholder.classList.remove('loading');
                    
                    // Determine optimal display method based on image dimensions
                    const aspectRatio = this.width / this.height;
                    
                    if (aspectRatio > 1.5 || aspectRatio < 0.67) {
                        // Very wide or tall image - use contain
                        placeholder.style.backgroundSize = 'contain';
                    } else {
                        // More standard proportions - use cover for better aesthetics
                        placeholder.style.backgroundSize = 'cover';
                    }
                    
                    // Set the background image with a fade-in effect
                    placeholder.style.opacity = '0';
                    setTimeout(() => {
                        placeholder.style.backgroundImage = `url('${imageUrl}')`;
                        placeholder.classList.add('has-image');
                        placeholder.style.opacity = '1';
                    }, 50);
                    
                    // Show delete button with animation
                    deleteBtn.style.display = 'block';
                    deleteBtn.style.opacity = '0';
                    setTimeout(() => {
                        deleteBtn.style.opacity = '1';
                    }, 300);
                    
                    // Clear input field
                    urlInput.value = '';
                    
                    // Add success feedback
                    addBtn.textContent = 'Image Added!';
                    addBtn.style.backgroundColor = '#e0f7e0';
                    addBtn.style.borderColor = '#a3d9a3';
                    addBtn.style.color = '#2e7d32';
                    
                    // Save to server
                    saveToServer('image', index, imageUrl);
                    
                    // Show notification
                    showNotification('Image updated');
                    
                    setTimeout(() => {
                        addBtn.textContent = 'Add Image';
                        addBtn.style.backgroundColor = '';
                        addBtn.style.borderColor = '';
                        addBtn.style.color = '';
                    }, 1500);
                };
                
                testImage.onerror = function() {
                    // Failed to load the image
                    placeholder.innerHTML = '';
                    placeholder.classList.remove('loading');
                    
                    // Show error feedback
                    urlInput.style.borderColor = '#ff6b6b';
                    urlInput.style.backgroundColor = '#fff0f0';
                    
                    addBtn.textContent = 'Invalid URL';
                    addBtn.style.backgroundColor = '#ffe0e0';
                    addBtn.style.borderColor = '#ffb0b0';
                    addBtn.style.color = '#cc0000';
                    
                    setTimeout(() => {
                        urlInput.style.borderColor = '';
                        urlInput.style.backgroundColor = '';
                        
                        addBtn.textContent = 'Add Image';
                        addBtn.style.backgroundColor = '';
                        addBtn.style.borderColor = '';
                        addBtn.style.color = '';
                    }, 2000);
                };
                
                // Start loading the test image
                testImage.src = imageUrl;
            } else {
                // Highlight empty input
                urlInput.style.borderColor = '#ff6b6b';
                urlInput.style.backgroundColor = '#fff0f0';
                
                setTimeout(() => {
                    urlInput.style.borderColor = '';
                    urlInput.style.backgroundColor = '';
                }, 2000);
            }
        });
        
        // Delete image button click event
        deleteBtn.addEventListener('click', () => {
            // Fade out image first
            placeholder.style.opacity = '0';
            
            setTimeout(() => {
                // Remove the background image
                placeholder.style.backgroundImage = '';
                placeholder.classList.remove('has-image');
                
                // Fade image back in (now showing the X placeholder)
                placeholder.style.opacity = '1';
                
                // Hide delete button
                deleteBtn.style.opacity = '0';
                setTimeout(() => {
                    deleteBtn.style.display = 'none';
                }, 300);
                
                // Add feedback
                addBtn.textContent = 'Image Removed';
                setTimeout(() => {
                    addBtn.textContent = 'Add Image';
                }, 1500);
                
                // Save to server (empty string to remove)
                saveToServer('image', index, '');
                
                // Show notification
                showNotification('Image removed');
            }, 300);
        });
        
        // Also allow adding image by pressing Enter in the input field
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
        
        // Add focus effects to input
        urlInput.addEventListener('focus', () => {
            urlInput.style.borderColor = '#0066cc';
            urlInput.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
        });
        
        urlInput.addEventListener('blur', () => {
            urlInput.style.borderColor = '';
            urlInput.style.boxShadow = '';
        });
    });
}