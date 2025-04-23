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
        if (result.success) {
            console.log('Successfully saved to server');
            
            // Clear any old default articles from storage when adding new ones
            if (type === 'newArticle' || type === 'removeArticle') {
                let content = JSON.parse(localStorage.getItem('cmsContent')) || {};
                
                // Clean up default or empty articles
                if (content.articles) {
                    content.articles = content.articles.filter(article => {
                        // Keep articles that have substantial content
                        return article.title && 
                               article.title !== 'A title for your article' && 
                               article.title !== 'A title for your new article' && 
                               article.content && 
                               !article.content.includes('Click to edit this new article content');
                    });
                    
                    localStorage.setItem('cmsContent', JSON.stringify(content));
                }
            }
        } else {
            console.error('Error saving to server:', result.message);
        }
    })
    .catch(error => {
        console.error('Error saving to server:', error);
    });
}