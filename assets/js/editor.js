// assets/js/editor.js
document.addEventListener('DOMContentLoaded', function() {
    const editorContent = document.getElementById('editor-content');
    const hiddenContent = document.getElementById('hidden-content');
    const form = document.querySelector('form');
    
    // Initialize editor with content
    if (editorContent && hiddenContent) {
        // Show placeholder if content is empty
        if (editorContent.innerHTML.trim() === '') {
            editorContent.innerHTML = editorContent.getAttribute('data-placeholder') || '';
            editorContent.classList.add('showing-placeholder');
        }
        
        // Remove placeholder on focus
        editorContent.addEventListener('focus', function() {
            if (editorContent.classList.contains('showing-placeholder')) {
                editorContent.innerHTML = '';
                editorContent.classList.remove('showing-placeholder');
            }
        });
        
        // Restore placeholder if still empty on blur
        editorContent.addEventListener('blur', function() {
            if (editorContent.innerHTML.trim() === '') {
                editorContent.innerHTML = editorContent.getAttribute('data-placeholder') || '';
                editorContent.classList.add('showing-placeholder');
            }
        });
        
        // Transfer content to hidden textarea on form submission
        if (form) {
            form.addEventListener('submit', function() {
                // Remove any editor-specific placeholder text or instructions
                let finalContent = editorContent.innerHTML;
                
                // Clean up any editor instructions that might be in the HTML
                finalContent = finalContent.replace(/<p[^>]*>Click to edit.*?<\/p>/g, '');
                finalContent = finalContent.replace(/Double-click any text to edit it directly\./g, '');
                
                hiddenContent.value = finalContent;
            });
        }
        
        // Handle editor toolbar buttons
        const toolbarButtons = document.querySelectorAll('.editor-toolbar button');
        
        toolbarButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const command = this.getAttribute('data-command');
                
                if (command === 'createLink') {
                    const url = prompt('Enter the link URL:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else {
                    document.execCommand(command, false, null);
                }
                
                editorContent.focus();
            });
        });
    }
});