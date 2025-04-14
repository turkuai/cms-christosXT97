// Basic Editing Mode Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage if available
    loadFromLocalStorage();
    
    // Initialize logo edit button
    initLogoEdit();
    
    // Initialize navigation controls
    initNavControls();
    
    // Initialize article controls
    initArticleControls();
    
    // Initialize social media controls
    initSocialControls();
    
    // Initialize footer edit button
    initFooterEdit();
    
    // Update last modified timestamp
    updateLastModified();
});

// Function to load saved data from localStorage
function loadFromLocalStorage() {
    // Load logo text
    if (localStorage.getItem('logoText')) {
        document.querySelector('.logo-text').textContent = localStorage.getItem('logoText');
    }
    
    // Load navigation items
    if (localStorage.getItem('navItems')) {
        try {
            const navItems = JSON.parse(localStorage.getItem('navItems'));
            if (Array.isArray(navItems) && navItems.length > 0) {
                const navigation = document.querySelector('.navigation');
                
                // Keep only the blog field
                const blogField = navigation.querySelector('.blog-field');
                navigation.innerHTML = '';
                navigation.appendChild(blogField);
                
                // Add each saved nav item
                navItems.forEach(item => {
                    addNavItem(item.text, item.url, navigation, blogField);
                });
            }
        } catch (e) {
            console.error('Error loading navigation items:', e);
        }
    }
    
    // Load blog URL
    if (localStorage.getItem('blogUrl')) {
        document.querySelector('.blog-url-field').value = localStorage.getItem('blogUrl');
    }
    
    // Load articles
    if (localStorage.getItem('articles')) {
        try {
            const articles = JSON.parse(localStorage.getItem('articles'));
            if (Array.isArray(articles) && articles.length > 0) {
                const contentSection = document.querySelector('.content-section');
                
                // Keep only the add button
                const addButton = contentSection.querySelector('.add-article-btn');
                contentSection.innerHTML = '';
                contentSection.appendChild(addButton);
                
                // Add each saved article
                articles.forEach((article, index) => {
                    addArticle(article.title, article.content, article.imageUrl, contentSection, addButton, index + 1);
                });
            }
        } catch (e) {
            console.error('Error loading articles:', e);
        }
    }
    
    // Load footer text
    if (localStorage.getItem('footerText')) {
        document.querySelector('.footer-company-name').textContent = localStorage.getItem('footerText');
    }
    
    // Load social media links
    if (localStorage.getItem('socialLinks')) {
        try {
            const socialLinks = JSON.parse(localStorage.getItem('socialLinks'));
            if (Array.isArray(socialLinks) && socialLinks.length > 0) {
                const socialLinksContainer = document.querySelector('.social-links');
                
                // Keep only the add button
                const addButton = socialLinksContainer.querySelector('.add-social-btn');
                socialLinksContainer.innerHTML = '';
                socialLinksContainer.appendChild(addButton);
                
                // Add each saved link
                socialLinks.forEach(link => {
                    addSocialLink(link.text, link.url, socialLinksContainer, addButton);
                });
            }
        } catch (e) {
            console.error('Error loading social links:', e);
        }
    }
}

// Function to update last modified timestamp
function updateLastModified() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const formattedDate = now.toLocaleDateString('en-US', options);
    document.querySelector('.last-modified').textContent = `Last modified: ${formattedDate}`;
}

// Initialize logo edit functionality
function initLogoEdit() {
    const logoEditBtn = document.querySelector('.logo-edit-btn');
    logoEditBtn.addEventListener('click', function() {
        const logoElement = document.querySelector('.logo-text');
        const currentText = logoElement.textContent;
        
        const newText = prompt('Edit logo text:', currentText);
        if (newText !== null && newText.trim() !== '') {
            logoElement.textContent = newText;
            localStorage.setItem('logoText', newText);
            updateLastModified();
        }
    });
}

// Initialize navigation controls
function initNavControls() {
    // Add button functionality
    const addNavBtn = document.querySelector('.add-nav-btn');
    addNavBtn.addEventListener('click', function() {
        addNewNavItem();
    });
    
    // Edit buttons for existing navigation items
    document.querySelectorAll('.nav-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const navItem = this.closest('.nav-item');
            editNavItem(navItem);
        });
    });
    
    // Delete buttons for existing navigation items
    document.querySelectorAll('.nav-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const navItem = this.closest('.nav-item');
            deleteNavItem(navItem);
        });
    });
    
    // Blog URL field
    const blogUrlField = document.querySelector('.blog-url-field');
    blogUrlField.addEventListener('change', function() {
        localStorage.setItem('blogUrl', this.value);
        updateLastModified();
    });
}

// Add a new navigation item
function addNewNavItem() {
    const text = prompt('Enter navigation item text:');
    if (!text || text.trim() === '') return;
    
    const url = prompt('Enter URL:');
    if (!url || url.trim() === '') return;
    
    const navigation = document.querySelector('.navigation');
    const blogField = navigation.querySelector('.blog-field');
    
    addNavItem(text, url, navigation, blogField);
    saveNavItems();
    updateLastModified();
}

// Add a navigation item to the DOM
function addNavItem(text, url, container, beforeElement) {
    const navItem = document.createElement('div');
    navItem.className = 'nav-item';
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    link.className = 'nav-link';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-icon nav-edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.addEventListener('click', function() {
        editNavItem(navItem);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-icon nav-delete-btn';
    deleteBtn.innerHTML = '❌';
    deleteBtn.addEventListener('click', function() {
        deleteNavItem(navItem);
    });
    
    navItem.appendChild(link);
    navItem.appendChild(editBtn);
    navItem.appendChild(deleteBtn);
    
    container.insertBefore(navItem, beforeElement);
}

// Edit a navigation item
function editNavItem(navItem) {
    const link = navItem.querySelector('.nav-link');
    const currentText = link.textContent;
    const currentUrl = link.href;
    
    const newText = prompt('Edit navigation text:', currentText);
    if (newText === null) return;
    
    const newUrl = prompt('Edit URL:', currentUrl);
    if (newUrl === null) return;
    
    if (newText.trim() !== '') {
        link.textContent = newText;
    }
    
    if (newUrl.trim() !== '') {
        link.href = newUrl;
    }
    
    saveNavItems();
    updateLastModified();
}

// Delete a navigation item
function deleteNavItem(navItem) {
    const confirmDelete = confirm('Are you sure you want to delete this navigation item?');
    if (confirmDelete) {
        navItem.remove();
        saveNavItems();
        updateLastModified();
    }
}

// Save all navigation items to localStorage
function saveNavItems() {
    const navItems = [];
    document.querySelectorAll('.nav-item:not(.blog-field)').forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link) {
            navItems.push({
                text: link.textContent,
                url: link.href
            });
        }
    });
    
    localStorage.setItem('navItems', JSON.stringify(navItems));
}

// Initialize article controls
function initArticleControls() {
    // Add article button
    const addArticleBtn = document.querySelector('.add-article-btn');
    addArticleBtn.addEventListener('click', function() {
        addNewArticle();
    });
    
    // Edit title buttons
    document.querySelectorAll('.article-title-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const article = this.closest('.article');
            editArticleTitle(article);
        });
    });
    
    // Delete article buttons
    document.querySelectorAll('.article-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const article = this.closest('.article');
            deleteArticle(article);
        });
    });
    
    // Edit image buttons
    document.querySelectorAll('.image-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const articleId = this.dataset.articleId;
            editArticleImage(articleId);
        });
    });
}

// Add a new article
function addNewArticle() {
    const title = prompt('Enter article title:');
    if (!title || title.trim() === '') return;
    
    const content = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`;
    
    const contentSection = document.querySelector('.content-section');
    const addButton = contentSection.querySelector('.add-article-btn');
    
    // Generate a new article ID
    const articleId = document.querySelectorAll('.article').length + 1;
    
    addArticle(title, content, null, contentSection, addButton, articleId);
    saveArticles();
    updateLastModified();
}

// Add an article to the DOM
function addArticle(title, content, imageUrl, container, beforeElement, articleId) {
    const article = document.createElement('div');
    article.className = 'article';
    article.dataset.articleId = articleId;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-icon article-delete-btn';
    deleteBtn.innerHTML = '❌';
    deleteBtn.addEventListener('click', function() {
        deleteArticle(article);
    });
    
    const articleContent = document.createElement('div');
    articleContent.className = 'article-content';
    
    const titleContainer = document.createElement('div');
    titleContainer.className = 'article-title-container';
    
    const heading = document.createElement('h2');
    heading.textContent = title;
    
    const editTitleBtn = document.createElement('button');
    editTitleBtn.className = 'edit-icon article-title-edit-btn';
    editTitleBtn.innerHTML = '✏️';
    editTitleBtn.addEventListener('click', function() {
        editArticleTitle(article);
    });
    
    titleContainer.appendChild(heading);
    titleContainer.appendChild(editTitleBtn);
    articleContent.appendChild(titleContainer);
    articleContent.insertAdjacentHTML('beforeend', content);
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'article-image-container';
    imageContainer.id = `image-container-${articleId}`;
    
    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        imageContainer.appendChild(img);
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'article-image-placeholder';
        placeholder.innerHTML = `
            <svg width="100" height="100" viewBox="0 0 100 100">
                <line x1="0" y1="0" x2="100" y2="100" stroke="#ccc" />
                <line x1="0" y1="100" x2="100" y2="0" stroke="#ccc" />
            </svg>
        `;
        imageContainer.appendChild(placeholder);
    }
    
    const editImageBtn = document.createElement('button');
    editImageBtn.className = 'edit-icon image-edit-btn';
    editImageBtn.dataset.articleId = articleId;
    editImageBtn.innerHTML = '✏️';
    editImageBtn.addEventListener('click', function() {
        editArticleImage(articleId);
    });
    
    imageContainer.appendChild(editImageBtn);
    
    article.appendChild(deleteBtn);
    article.appendChild(articleContent);
    article.appendChild(imageContainer);
    
    container.insertBefore(article, beforeElement);
}

// Edit article title
function editArticleTitle(article) {
    const heading = article.querySelector('h2');
    const currentTitle = heading.textContent;
    
    const newTitle = prompt('Edit article title:', currentTitle);
    if (newTitle !== null && newTitle.trim() !== '') {
        heading.textContent = newTitle;
        saveArticles();
        updateLastModified();
    }
}

// Delete an article
function deleteArticle(article) {
    const confirmDelete = confirm('Are you sure you want to delete this article?');
    if (confirmDelete) {
        article.remove();
        saveArticles();
        updateLastModified();
    }
}

// Edit article image
function editArticleImage(articleId) {
    const imageUrl = prompt('Enter image URL (leave empty to use placeholder):');
    if (imageUrl === null) return;
    
    const imageContainer = document.querySelector(`#image-container-${articleId}`);
    
    if (imageUrl.trim() === '') {
        // Use placeholder
        imageContainer.innerHTML = `
            <div class="article-image-placeholder">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="#ccc" />
                    <line x1="0" y1="100" x2="100" y2="0" stroke="#ccc" />
                </svg>
            </div>
            <button class="edit-icon image-edit-btn" data-article-id="${articleId}">✏️</button>
        `;
        
        // Reattach event listener
        imageContainer.querySelector('.image-edit-btn').addEventListener('click', function() {
            editArticleImage(articleId);
        });
    } else {
        // Use provided image URL
        imageContainer.innerHTML = `
            <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">
            <button class="edit-icon image-edit-btn" data-article-id="${articleId}">✏️</button>
        `;
        
        // Reattach event listener
        imageContainer.querySelector('.image-edit-btn').addEventListener('click', function() {
            editArticleImage(articleId);
        });
    }
    
    saveArticles();
    updateLastModified();
}

// Save all articles to localStorage
function saveArticles() {
    const articles = [];
    document.querySelectorAll('.article').forEach(article => {
        const title = article.querySelector('h2').textContent;
        const content = Array.from(article.querySelectorAll('.article-content p')).map(p => p.outerHTML).join('');
        const imageContainer = article.querySelector('.article-image-container');
        const img = imageContainer.querySelector('img');
        const imageUrl = img ? img.src : null;
        
        articles.push({
            title: title,
            content: content,
            imageUrl: imageUrl
        });
    });
    
    localStorage.setItem('articles', JSON.stringify(articles));
}

// Initialize footer edit functionality
function initFooterEdit() {
    const footerEditBtn = document.querySelector('.footer-edit-btn');
    footerEditBtn.addEventListener('click', function() {
        const footerElement = document.querySelector('.footer-company-name');
        const currentText = footerElement.textContent;
        
        const newText = prompt('Edit company name:', currentText);
        if (newText !== null && newText.trim() !== '') {
            footerElement.textContent = newText;
            localStorage.setItem('footerText', newText);
            updateLastModified();
        }
    });
}

// Initialize social media controls
function initSocialControls() {
    // Add button functionality
    const addSocialBtn = document.querySelector('.add-social-btn');
    addSocialBtn.addEventListener('click', function() {
        addNewSocialLink();
    });
    
    // Edit buttons for existing social links
    document.querySelectorAll('.social-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const socialItem = this.closest('.social-link-item');
            editSocialLink(socialItem);
        });
    });
    
    // Delete buttons for existing social links
    document.querySelectorAll('.social-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const socialItem = this.closest('.social-link-item');
            deleteSocialLink(socialItem);
        });
    });
}

// Add a new social media link
function addNewSocialLink() {
    const text = prompt('Enter social media name:');
    if (!text || text.trim() === '') return;
    
    const url = prompt('Enter URL:');
    if (!url || url.trim() === '') return;
    
    const socialLinksContainer = document.querySelector('.social-links');
    const addButton = socialLinksContainer.querySelector('.add-social-btn');
    
    addSocialLink(text, url, socialLinksContainer, addButton);
    saveSocialLinks();
    updateLastModified();
}

// Add a social media link to the DOM
function addSocialLink(text, url, container, beforeElement) {
    const linkItem = document.createElement('div');
    linkItem.className = 'social-link-item';
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    link.className = 'social-link';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-icon social-edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.addEventListener('click', function() {
        editSocialLink(linkItem);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-icon social-delete-btn';
    deleteBtn.innerHTML = '❌';
    deleteBtn.addEventListener('click', function() {
        deleteSocialLink(linkItem);
    });
    
    linkItem.appendChild(link);
    linkItem.appendChild(editBtn);
    linkItem.appendChild(deleteBtn);
    
    container.insertBefore(linkItem, beforeElement);
}

// Edit a social media link
function editSocialLink(linkItem) {
    const link = linkItem.querySelector('.social-link');
    const currentText = link.textContent;
    const currentUrl = link.href;
    
    const newText = prompt('Edit social media name:', currentText);
    if (newText === null) return;
    
    const newUrl = prompt('Edit URL:', currentUrl);
    if (newUrl === null) return;
    
    if (newText.trim() !== '') {
        link.textContent = newText;
    }
    
    if (newUrl.trim() !== '') {
        link.href = newUrl;
    }
    
    saveSocialLinks();
    updateLastModified();
}

// Delete a social media link
function deleteSocialLink(linkItem) {
    const confirmDelete = confirm('Are you sure you want to delete this social media link?');
    if (confirmDelete) {
        linkItem.remove();
        saveSocialLinks();
        updateLastModified();
    }
}

// Save all social media links to localStorage
function saveSocialLinks() {
    const socialLinks = [];
    document.querySelectorAll('.social-link-item').forEach(item => {
        const link = item.querySelector('.social-link');
        socialLinks.push({
            text: link.textContent,
            url: link.href
        });
    });
    
    localStorage.setItem('socialLinks', JSON.stringify(socialLinks));
}