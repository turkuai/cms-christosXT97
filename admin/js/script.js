// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation link highlighting
    highlightCurrentPage();
    
    // Enhanced animation for content boxes on page load
    animateContentBoxes();
    
    // Initialize content management functionality
    initContentManagement();
    
    // Initialize add article functionality
    initAddArticle();
    
    // Initialize edit buttons
    initEditButtons();
    
    // Initialize delete buttons
    initDeleteButtons();
    
    // Initialize modal
    initModal();
    
    // Initialize add social link button
    initAddSocialLink();
    
    // Initialize image controls
    initImageControls();
    
    // Load content from storage on initial load
    loadContentFromStorage();
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
            link.style.color = '#fff';
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
 * Initialize Add Article functionality
 */
function initAddArticle() {
    const addArticleBtn = document.getElementById('add-article-btn');
    
    if (addArticleBtn) {
        addArticleBtn.addEventListener('click', function() {
            addNewArticle();
        });
    }
}

/**
 * Add a new article to the page
 */
function addNewArticle() {
    // Get the articles container
    const articlesContainer = document.getElementById('articles-container');
    
    // Get current number of articles to set next ID
    const currentArticles = articlesContainer.querySelectorAll('.content-box');
    const newArticleId = currentArticles.length;
    
    // Create a new article element
    const newArticle = document.createElement('article');
    newArticle.className = 'content-box new';
    newArticle.dataset.articleId = newArticleId;
    
    // Add article HTML (based on the template but with unique IDs)
    newArticle.innerHTML = `
        <div class="article-header">
            <h2>A title for your new article</h2>
            <div class="article-controls">
                <button class="edit-btn" data-target="article-title" title="Edit Title">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-target="article" title="Delete Article">
                    <i class="fas fa-times-circle"></i>
                </button>
            </div>
        </div>
        <div class="article-content">
            <p>Click to edit this new article content. Double-click any text to edit it directly.</p>
            <button class="edit-btn content-edit-btn" data-target="article-content" title="Edit Content">
                <i class="fas fa-edit"></i>
            </button>
        </div>
        <div class="article-image">
            <div class="image-container">
                <div class="placeholder-image" id="image-placeholder-${newArticleId}"></div>
                <button class="edit-btn image-edit-btn" data-target="article-image" title="Edit Image">
                    <i class="fas fa-edit"></i>
                </button>
                <div class="image-controls">
                    <input type="text" class="image-url-input" placeholder="Enter image URL">
                    <button class="add-image-btn">Add Image</button>
                    <button class="delete-image-btn" style="display:none">Delete</button>
                </div>
            </div>
        </div>
    `;
    
    // Add the new article to the page
    articlesContainer.appendChild(newArticle);
    
    // Initialize image controls for the new article
    const newImageContainer = newArticle.querySelector('.image-container');
    initSingleImageControl(newImageContainer, newArticleId);
    
    // Make title and content editable
    const title = newArticle.querySelector('h2');
    const paragraphs = newArticle.querySelectorAll('p');
    
    // Add double-click listener to the title
    title.setAttribute('title', 'Double-click to edit');
    title.addEventListener('dblclick', function() {
        title.contentEditable = true;
        title.focus();
        title.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        title.style.padding = '5px';
        title.style.borderRadius = '4px';
        
        title.addEventListener('blur', function() {
            title.contentEditable = false;
            title.style.backgroundColor = '';
            title.style.padding = '';
            saveArticleTitle(title, newArticleId);
        }, { once: true });
        
        title.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                title.blur();
            }
        });
    });
    
    // Add double-click listener to paragraphs
    paragraphs.forEach(p => {
        p.setAttribute('title', 'Double-click to edit');
        p.addEventListener('dblclick', function() {
            p.contentEditable = true;
            p.focus();
            p.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            p.style.padding = '5px';
            p.style.borderRadius = '4px';
            
            p.addEventListener('blur', function() {
                p.contentEditable = false;
                p.style.backgroundColor = '';
                p.style.padding = '';
                saveArticleContent(p, newArticleId);
            }, { once: true });
        });
    });
    
    // Add edit button functionality
    initEditButtons(newArticle);
    
    // Add delete button functionality
    initDeleteButtons(newArticle);
    
    // Save the new article structure
    saveNewArticle(newArticleId);
    
    // Show notification
    showNotification('New article added');
    
    // Scroll to the new article
    newArticle.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Save a new article to storage
 */
function saveNewArticle(articleId) {
    // Load current content
    let content = JSON.parse(localStorage.getItem('cmsContent')) || {
        articles: [],
        company: {
            name: 'Your company\'s name',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            copyright: '© 2024, Company\'s name. All rights reserved'
        }
    };
    
    // Add new article
    content.articles.push({
        title: 'A title for your new article',
        content: '<p>Click to edit this new article content. Double-click any text to edit it directly.</p>',
        image: ''
    });
    
    // Save to storage
    localStorage.setItem('cmsContent', JSON.stringify(content));
    
    // Also save to server if available
    saveToServer('newArticle', articleId, {
        title: 'A title for your new article',
        content: '<p>Click to edit this new article content. Double-click any text to edit it directly.</p>',
        image: ''
    });
}

/**
 * Initialize modal for editing content
 */
function initModal() {
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    
    // Close modal when clicking X button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Close modal when clicking cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Handle save button click
    const saveBtn = document.getElementById('save-modal-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const editTarget = modal.dataset.editTarget;
            const articleId = modal.dataset.articleId;
            
            saveModalContent(editTarget, articleId);
        });
    }
}

/**
 * Close the modal
 */
function closeModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none';
}

/**
 * Open the modal with specific edit content
 */
function openModal(title, content, editTarget, articleId = null) {
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Set modal title
    modalTitle.textContent = title;
    
    // Set modal content
    modalBody.innerHTML = content;
    
    // Set data attributes for saving
    modal.dataset.editTarget = editTarget;
    if (articleId !== null) {
        modal.dataset.articleId = articleId;
    }
    
    // Show the modal
    modal.style.display = 'flex';
    
    // Focus the first input
    const firstInput = modalBody.querySelector('input, textarea');
    if (firstInput) {
        firstInput.focus();
    }
}

/**
 * Save content from the modal
 */
function saveModalContent(editTarget, articleId) {
    const modalBody = document.getElementById('modal-body');
    let value, element;
    
    switch (editTarget) {
        case 'article-title':
            value = modalBody.querySelector('#title-input').value;
            element = document.querySelector(`.content-box[data-article-id="${articleId}"] h2`);
            if (element) {
                element.textContent = value;
                saveArticleTitle(element, articleId);
            }
            break;
            
        case 'article-content':
            value = modalBody.querySelector('#content-textarea').value;
            // Convert line breaks to paragraphs
            const paragraphs = value.split('\n\n').filter(p => p.trim() !== '');
            const htmlContent = paragraphs.map(p => `<p>${p}</p>`).join('');
            
            element = document.querySelector(`.content-box[data-article-id="${articleId}"] .article-content`);
            if (element) {
                // Keep the edit button
                const editBtn = element.querySelector('.content-edit-btn');
                
                // Replace content
                element.innerHTML = htmlContent;
                
                // Add back the edit button
                element.appendChild(editBtn);
                
                // Make paragraphs editable
                makeElementsEditable(`.content-box[data-article-id="${articleId}"] .article-content p`, saveArticleContent);
                
                // Save content
                saveArticleContent(element.querySelector('p'), articleId);
            }
            break;
            
        case 'article-image':
            value = modalBody.querySelector('#image-url-input').value;
            const imgContainer = document.querySelector(`.content-box[data-article-id="${articleId}"] .placeholder-image`);
            const deleteBtn = document.querySelector(`.content-box[data-article-id="${articleId}"] .delete-image-btn`);
            
            if (imgContainer && value) {
                // Set image and show delete button
                imgContainer.style.backgroundImage = `url('${value}')`;
                imgContainer.classList.add('has-image');
                if (deleteBtn) deleteBtn.style.display = 'block';
                
                // Save image
                saveToServer('image', articleId, value);
            }
            break;
            
        case 'company-name':
            value = modalBody.querySelector('#company-name-input').value;
            element = document.querySelector('.footer-left h3');
            if (element) {
                // Keep the edit button
                const editBtn = element.querySelector('.edit-btn');
                element.textContent = value;
                element.appendChild(editBtn);
                saveCompanyName(element, 0);
            }
            break;
            
        case 'company-description':
            value = modalBody.querySelector('#company-desc-input').value;
            element = document.querySelector('.footer-left p:first-of-type');
            if (element) {
                // Keep the edit button
                const editBtn = element.querySelector('.edit-btn');
                element.textContent = value;
                element.appendChild(editBtn);
                saveCompanyDescription(element, 0);
            }
            break;
            
        case 'social-link':
            const label = modalBody.querySelector('#link-label-input').value;
            const url = modalBody.querySelector('#link-url-input').value;
            
            if (articleId === 'new') {
                // Add new social link
                addSocialLink(label, url);
            } else {
                // Update existing social link
                const linkElement = document.querySelector(`.footer-right li:nth-child(${parseInt(articleId) + 1}) a`);
                if (linkElement) {
                    linkElement.textContent = label;
                    linkElement.href = url;
                    
                    // Save to storage
                    saveSocialLinks();
                }
            }
            break;
    }
    
    // Close the modal
    closeModal();
    
    // Show notification
    showNotification('Changes saved');
}

/**
 * Initialize edit buttons
 */
function initEditButtons(container = document) {
    const editButtons = container.querySelectorAll('.edit-btn');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const target = this.dataset.target;
            let articleElement = this.closest('.content-box');
            let articleId = articleElement ? articleElement.dataset.articleId : null;
            
            switch (target) {
                case 'article-title':
                    const title = articleElement.querySelector('h2').textContent;
                    openModal('Edit Article Title', `
                        <div class="form-group">
                            <label for="title-input">Title</label>
                            <input type="text" id="title-input" class="form-control" value="${title}">
                        </div>
                    `, target, articleId);
                    break;
                    
                case 'article-content':
                    // Get all paragraphs and combine them
                    const paragraphs = articleElement.querySelectorAll('.article-content p');
                    const content = Array.from(paragraphs).map(p => p.textContent).join('\n\n');
                    
                    openModal('Edit Article Content', `
                        <div class="form-group">
                            <label for="content-textarea">Content</label>
                            <textarea id="content-textarea" class="form-control">${content}</textarea>
                            <small class="form-text">Separate paragraphs with blank lines.</small>
                        </div>
                    `, target, articleId);
                    break;
                    
                case 'article-image':
                    // Get current image URL if any
                    const imgElement = articleElement.querySelector('.placeholder-image');
                    let currentUrl = '';
                    
                    if (imgElement.style.backgroundImage) {
                        // Extract URL from "url('...')" format
                        currentUrl = imgElement.style.backgroundImage.replace(/url\(['"](.+)['"]\)/, '$1');
                    }
                    
                    openModal('Edit Article Image', `
                        <div class="form-group">
                            <label for="image-url-input">Image URL</label>
                            <input type="text" id="image-url-input" class="form-control" value="${currentUrl}">
                        </div>
                    `, target, articleId);
                    break;
                    
                case 'company-name':
                    const companyName = document.querySelector('.footer-left h3').textContent.trim();
                    openModal('Edit Company Name', `
                        <div class="form-group">
                            <label for="company-name-input">Company Name</label>
                            <input type="text" id="company-name-input" class="form-control" value="${companyName}">
                        </div>
                    `, target);
                    break;
                    
                case 'company-description':
                    const companyDesc = document.querySelector('.footer-left p:first-of-type').textContent.trim();
                    openModal('Edit Company Description', `
                        <div class="form-group">
                            <label for="company-desc-input">Company Description</label>
                            <textarea id="company-desc-input" class="form-control">${companyDesc}</textarea>
                        </div>
                    `, target);
                    break;
                    
                case 'facebook-link':
                case 'linkedin-link':
                case 'github-link':
                    const linkElement = this.closest('li').querySelector('a');
                    const linkText = linkElement.textContent;
                    const linkUrl = linkElement.href;
                    const linkIndex = Array.from(document.querySelectorAll('.footer-right li a')).indexOf(linkElement);
                    
                    openModal('Edit Social Link', `
                        <div class="form-group">
                            <label for="link-label-input">Link Label</label>
                            <input type="text" id="link-label-input" class="form-control" value="${linkText}">
                        </div>
                        <div class="form-group">
                            <label for="link-url-input">URL</label>
                            <input type="text" id="link-url-input" class="form-control" value="${linkUrl}">
                        </div>
                    `, 'social-link', linkIndex.toString());
                    break;
                    
                case 'logo':
                    // For simplicity, we'll just change the text of the logo
                    const logoText = document.querySelector('.logo').textContent.trim();
                    openModal('Edit Logo', `
                        <div class="form-group">
                            <label for="logo-text-input">Logo Text</label>
                            <input type="text" id="logo-text-input" class="form-control" value="${logoText}">
                        </div>
                        <p class="form-text">Note: In a production environment, you would upload an image here.</p>
                    `, target);
                    break;
            }
        });
    });
}

/**
 * Initialize delete buttons
 */
function initDeleteButtons(container = document) {
    const deleteButtons = container.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const target = this.dataset.target;
            const element = this.closest(target === 'article' ? '.content-box' : 'li');
            
            if (!element) return;
            
            // Confirm deletion
            if (confirm(`Are you sure you want to delete this ${target}?`)) {
                if (target === 'article') {
                    // Get article ID
                    const articleId = element.dataset.articleId;
                    
                    // Remove from DOM
                    element.remove();
                    
                    // Remove from storage
                    removeArticleFromStorage(articleId);
                    
                    // Show notification
                    showNotification('Article deleted');
                } else if (target.includes('link')) {
                    // Remove social link
                    const linkElement = element.querySelector('a');
                    const linkIndex = Array.from(document.querySelectorAll('.footer-right li a')).indexOf(linkElement);
                    
                    // Remove from DOM
                    element.remove();
                    
                    // Remove from storage
                    removeSocialLinkFromStorage(linkIndex);
                    
                    // Show notification
                    showNotification('Social link removed');
                }
            }
        });
    });
}

/**
 * Initialize add social link functionality
 */
function initAddSocialLink() {
    const addSocialLinkBtn = document.getElementById('add-social-link-btn');
    
    if (addSocialLinkBtn) {
        addSocialLinkBtn.addEventListener('click', function() {
            openModal('Add Social Link', `
                <div class="form-group">
                    <label for="link-label-input">Link Label</label>
                    <input type="text" id="link-label-input" class="form-control" placeholder="e.g. Twitter">
                </div>
                <div class="form-group">
                    <label for="link-url-input">URL</label>
                    <input type="text" id="link-url-input" class="form-control" placeholder="https://...">
                </div>
            `, 'social-link', 'new');
        });
    }
}

/**
 * Add a new social link to the page
 */
function addSocialLink(label, url) {
    const socialLinksContainer = document.querySelector('.footer-right ul');
    const addBtnLi = document.querySelector('.footer-right ul li:last-child');
    
    // Create new list item
    const newLi = document.createElement('li');
    newLi.innerHTML = `
        <a href="${url}" target="_blank">${label}</a>
        <button class="edit-btn" data-target="social-link" title="Edit Social Link">
            <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" data-target="social-link" title="Remove Social Link">
            <i class="fas fa-times-circle"></i>
        </button>
    `;
    
    // Insert before the add button
    socialLinksContainer.insertBefore(newLi, addBtnLi);
    
    // Initialize edit and delete buttons
    initEditButtons(newLi);
    initDeleteButtons(newLi);
    
    // Save to storage
    saveSocialLinks();
    
    // Show notification
    showNotification('Social link added');
}

/**
 * Save social links to storage
 */
function saveSocialLinks() {
    // Get all social links
    const socialLinks = document.querySelectorAll('.footer-right ul li a');
    const links = Array.from(socialLinks).map(link => {
        return {
            label: link.textContent,
            url: link.href
        };
    }).filter(link => link.label && link.url); // Remove add button item
    
    // Save to localStorage
    let content = JSON.parse(localStorage.getItem('cmsContent')) || {};
    content.socialLinks = links;
    localStorage.setItem('cmsContent', JSON.stringify(content));
    
    // Save to server if available
    saveToServer('socialLinks', 0, links);
}

/**
 * Remove a social link from storage
 */
function removeSocialLinkFromStorage(linkIndex) {
    let content = JSON.parse(localStorage.getItem('cmsContent')) || {};
    
    if (content.socialLinks && content.socialLinks.length > linkIndex) {
        content.socialLinks.splice(linkIndex, 1);
        localStorage.setItem('cmsContent', JSON.stringify(content));
        
        // Save to server if available
        saveToServer('removeSocialLink', linkIndex, null);
    }
}

/**
 * Remove an article from storage
 */
function removeArticleFromStorage(articleId) {
    let content = JSON.parse(localStorage.getItem('cmsContent')) || {};
    
    if (content.articles && content.articles.length > articleId) {
        content.articles.splice(articleId, 1);
        localStorage.setItem('cmsContent', JSON.stringify(content));
        
        // Save to server if available
        saveToServer('removeArticle', articleId, null);
        
        // Update article IDs in the DOM
        updateArticleIds();
    }
}

/**
 * Update article IDs in the DOM after deletion
 */
function updateArticleIds() {
    const articles = document.querySelectorAll('.content-box');
    
    articles.forEach((article, index) => {
        article.dataset.articleId = index;
    });
}

/**
 * Save article title to storage
 */
function saveArticleTitle(element, index) {
    const title = element.textContent;
    
    // Save to localStorage
    let content = JSON.parse(localStorage.getItem('cmsContent')) || {
        articles: [],
        company: {
            name: 'Your company\'s name',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            copyright: '© 2024, Company\'s name. All rights reserved'
        }
    };
    
    // Ensure articles array has enough items
    while (content.articles.length <= index) {
        content.articles.push({
            title: '',
            content: '',
            image: ''
        });
    }
    
    content.articles[index].title = title;
    localStorage.setItem('cmsContent', JSON.stringify(content));
    
    // Save to server
    saveToServer('title', index, title);
    
    // Show notification
    showNotification('Title updated');
}

/**
 * Save article content to storage
 */
function saveArticleContent(element, index) {
    // Determine which article this paragraph belongs to
    const articleElement = element.closest('.content-box');
    const articleIndex = articleElement ? parseInt(articleElement.dataset.articleId) : index;
    
    // Get all paragraphs in this article
    const paragraphs = articleElement.querySelectorAll('.article-content p');
    const content = Array.from(paragraphs).map(p => p.outerHTML).join('');
    
    // Save to localStorage
    let cmsContent = JSON.parse(localStorage.getItem('cmsContent')) || {
        articles: [],
        company: {
            name: 'Your company\'s name',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            copyright: '© 2024, Company\'s name. All rights reserved'
        }
    };
    
    // Ensure articles array has enough items
    while (cmsContent.articles.length <= articleIndex) {
        cmsContent.articles.push({
            title: '',
            content: '',
            image: ''
        });
    }
    
    cmsContent.articles[articleIndex].content = content;
    localStorage.setItem('cmsContent', JSON.stringify(cmsContent));
    
    // Save to server
    saveToServer('content', articleIndex, content);
    
    // Show notification
    showNotification('Content updated');
}

/**
 * Save company name to storage
 */
function saveCompanyName(element, index) {
    const name = element.textContent.replace(/\s*<button.*/, '').trim();
    
    // Save to localStorage
    let content = JSON.parse(localStorage.getItem('cmsContent')) || {};
    if (!content.company) {
        content.company = {
            name: 'Your company\'s name',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            copyright: '© 2024, Company\'s name. All rights reserved'
        };
    }
    
    content.company.name = name;
    localStorage.setItem('cmsContent', JSON.stringify(content));
    
    // Save to server
    saveToServer('company', 0, name, 'name');
    
    // Show notification
    showNotification('Company name updated');
}

/**
 * Save company description to storage
 */
function saveCompanyDescription(element, index) {
    const description = element.textContent.replace(/\s*<button.*/, '').trim();
    
    // Save to localStorage
    let content = JSON.parse(localStorage.getItem('cmsContent')) || {};
    if (!content.company) {
        content.company = {
            name: 'Your company\'s name',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            copyright: '© 2024, Company\'s name. All rights reserved'
        };
    }
    
    content.company.description = description;
    localStorage.setItem('cmsContent', JSON.stringify(content));
    
    // Save to server
    saveToServer('company', 0, description, 'description');
    
    // Show notification
    showNotification('Company description updated');
}

/**
 * Load content from storage on page load
 */
function loadContentFromStorage() {
    const content = JSON.parse(localStorage.getItem('cmsContent'));
    
    if (!content) return;
    
    // Load articles
    if (content.articles && content.articles.length > 0) {
        // First clear existing articles
        const articlesContainer = document.getElementById('articles-container');
        articlesContainer.innerHTML = '';
        
        // Add each article
        content.articles.forEach((article, index) => {
            const articleElement = createArticleElement(article, index);
            articlesContainer.appendChild(articleElement);
        });
        
        // Initialize controls for loaded articles
        initEditButtons();
        initDeleteButtons();
        initImageControls();
    }
    
    // Load company info
    if (content.company) {
        const companyNameEl = document.querySelector('.footer-left h3');
        const companyDescEl = document.querySelector('.footer-left p:first-of-type');
        
        if (companyNameEl && content.company.name) {
            // Keep the edit button
            const editBtn = companyNameEl.querySelector('.edit-btn');
            companyNameEl.textContent = content.company.name;
            companyNameEl.appendChild(editBtn);
        }
        
        if (companyDescEl && content.company.description) {
            // Keep the edit button
            const editBtn = companyDescEl.querySelector('.edit-btn');
            companyDescEl.textContent = content.company.description;
            companyDescEl.appendChild(editBtn);
        }
    }
    
    // Load social links
    if (content.socialLinks && content.socialLinks.length > 0) {
        // First clear existing links (except the add button)
        const socialLinksContainer = document.querySelector('.footer-right ul');
        const addBtnLi = document.querySelector('.footer-right ul li:last-child');
        
        // Remove all links
        const linkItems = document.querySelectorAll('.footer-right ul li:not(:last-child)');
        linkItems.forEach(item => item.remove());
        
        // Add each link
        content.socialLinks.forEach((link, index) => {
            const newLi = document.createElement('li');
            newLi.innerHTML = `
                <a href="${link.url}" target="_blank">${link.label}</a>
                <button class="edit-btn" data-target="social-link" title="Edit Social Link">
                    <i class="fas fa-edit"></i>
                </button>
               <button class="delete-btn" data-target="social-link" title="Remove Social Link">
                    <i class="fas fa-times-circle"></i>
                </button>
            `;
            
            // Insert before the add button
            socialLinksContainer.insertBefore(newLi, addBtnLi);
        });
        
        // Initialize buttons for links
        initEditButtons(document.querySelector('.footer-right'));
        initDeleteButtons(document.querySelector('.footer-right'));
    }
}

/**
 * Create a new article element from data
 */
function createArticleElement(article, index) {
    const articleElement = document.createElement('article');
    articleElement.className = 'content-box';
    articleElement.dataset.articleId = index;
    
    articleElement.innerHTML = `
        <div class="article-header">
            <h2>${article.title || 'A title for your article'}</h2>
            <div class="article-controls">
                <button class="edit-btn" data-target="article-title" title="Edit Title">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-target="article" title="Delete Article">
                    <i class="fas fa-times-circle"></i>
                </button>
            </div>
        </div>
        <div class="article-content">
            ${article.content || '<p>Article content goes here.</p>'}
            <button class="edit-btn content-edit-btn" data-target="article-content" title="Edit Content">
                <i class="fas fa-edit"></i>
            </button>
        </div>
        <div class="article-image">
            <div class="image-container">
                <div class="placeholder-image" id="image-placeholder-${index}"${article.image ? ` style="background-image: url('${article.image}')"` : ''}${article.image ? ' class="has-image"' : ''}></div>
                <button class="edit-btn image-edit-btn" data-target="article-image" title="Edit Image">
                    <i class="fas fa-edit"></i>
                </button>
                <div class="image-controls">
                    <input type="text" class="image-url-input" placeholder="Enter image URL">
                    <button class="add-image-btn">Add Image</button>
                    <button class="delete-image-btn" style="display:${article.image ? 'block' : 'none'}">Delete</button>
                </div>
            </div>
        </div>
    `;
    
    // Make title and paragraphs editable
    const title = articleElement.querySelector('h2');
    makeElementEditable(title, saveArticleTitle, index);
    
    const paragraphs = articleElement.querySelectorAll('.article-content p');
    paragraphs.forEach(p => {
        makeElementEditable(p, saveArticleContent, index);
    });
    
    return articleElement;
}

/**
 * Make a single element editable
 */
function makeElementEditable(element, saveCallback, index) {
    if (!element) return;
    
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
        notification.style.zIndex = '9999';
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
 * Initialize image control functionality for all image containers
 */
function initImageControls() {
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach((container, index) => {
        initSingleImageControl(container, index);
    });
}

/**
 * Initialize a single image control
 */
function initSingleImageControl(container, index) {
    if (!container) return;
    
    const placeholder = container.querySelector('.placeholder-image');
    const urlInput = container.querySelector('.image-url-input');
    const addBtn = container.querySelector('.add-image-btn');
    const deleteBtn = container.querySelector('.delete-image-btn');
    
    if (!placeholder || !urlInput || !addBtn || !deleteBtn) return;
    
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
                
                // Get article ID from parent
                const articleElement = container.closest('.content-box');
                const articleId = articleElement ? parseInt(articleElement.dataset.articleId) : index;
                
                // Save to localStorage
                let content = JSON.parse(localStorage.getItem('cmsContent')) || {
                    articles: [],
                    company: {
                        name: 'Your company\'s name',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
                        copyright: '© 2024, Company\'s name. All rights reserved'
                    }
                };
                
                // Ensure articles array has enough items
                while (content.articles.length <= articleId) {
                    content.articles.push({
                        title: '',
                        content: '',
                        image: ''
                    });
                }
                
                content.articles[articleId].image = imageUrl;
                localStorage.setItem('cmsContent', JSON.stringify(content));
                
                // Save to server
                saveToServer('image', articleId, imageUrl);
                
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
            
            // Get article ID from parent
            const articleElement = container.closest('.content-box');
            const articleId = articleElement ? parseInt(articleElement.dataset.articleId) : index;
            
            // Save to localStorage
            let content = JSON.parse(localStorage.getItem('cmsContent')) || {};
            
            if (content.articles && content.articles.length > articleId) {
                content.articles[articleId].image = '';
                localStorage.setItem('cmsContent', JSON.stringify(content));
                
                // Save to server
                saveToServer('image', articleId, '');
                
                // Show notification
                showNotification('Image removed');
            }
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
    
    // Send AJAX request to server
    fetch('../includes/save-content.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (!result.success) {
            console.error('Error saving to server:', result.message);
        }
    })
    .catch(error => {
        console.error('Error saving to server:', error);
    });
}