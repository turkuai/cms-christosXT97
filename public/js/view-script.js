// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sync between admin and view pages
    initViewSync();
    
    // Apply animations
    animateContentBoxes();
});

/**
 * Initialize the synchronization between admin changes and view page
 */
function initViewSync() {
    // Check if there's saved content in localStorage
    loadContentFromStorage();
    
    // Set up event listener for storage changes (for real-time updates)
    window.addEventListener('storage', function(e) {
        // When admin page makes changes, update the view
        if (e.key && e.key.startsWith('cms_')) {
            loadContentFromStorage();
        }
    });
}

/**
 * Load content from localStorage (where admin page saves changes)
 */
function loadContentFromStorage() {
    // Article 1
    updateArticleContent('article-title-1', 'cms_article_1_title');
    updateArticleContent('article-content-1', 'cms_article_1_content');
    updateArticleImage('article-image-1', 'cms_article_1_image');
    
    // Article 2
    updateArticleContent('article-title-2', 'cms_article_2_title');
    updateArticleContent('article-content-2', 'cms_article_2_content');
    updateArticleImage('article-image-2', 'cms_article_2_image');
}

/**
 * Update article text content if it exists in storage
 */
function updateArticleContent(elementId, storageKey) {
    const element = document.getElementById(elementId);
    const savedContent = localStorage.getItem(storageKey);
    
    if (element && savedContent) {
        // For titles, update text content directly
        if (elementId.includes('title')) {
            element.textContent = savedContent;
        } 
        // For content, it might contain HTML
        else {
            element.innerHTML = savedContent;
        }
    }
}

/**
 * Update article image if it exists in storage
 */
function updateArticleImage(elementId, storageKey) {
    const element = document.getElementById(elementId);
    const savedImageUrl = localStorage.getItem(storageKey);
    
    if (element && savedImageUrl) {
        element.style.backgroundImage = `url('${savedImageUrl}')`;
        // Remove empty state
        element.classList.add('has-image');
    } else if (element) {
        // Reset to empty state
        element.style.backgroundImage = '';
        element.classList.remove('has-image');
    }
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