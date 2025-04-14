<?php
/**
 * Load content data from JSON file
 * 
 * @return array The content data
 */
function loadContentData() {
    $jsonFile = __DIR__ . '/../data/content.json';
    
    if (file_exists($jsonFile)) {
        $jsonContent = file_get_contents($jsonFile);
        $content = json_decode($jsonContent, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            return $content;
        }
    }
    
    // Return default content if file doesn't exist or is invalid
    return [
        'articles' => [
            [
                'title' => 'A title for your first article',
                'content' => '<p>Default content. Please edit in admin page.</p>',
                'image' => ''
            ],
            [
                'title' => 'A title for your first article',
                'content' => '<p>Default content. Please edit in admin page.</p>',
                'image' => ''
            ]
        ],
        'company' => [
            'name' => 'Your company\'s name',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            'copyright' => '© 2024, Company\'s name. All rights reserved'
        ]
    ];
}

/**
 * Save content data to JSON file
 * 
 * @param array $content The content data to save
 * @return bool True if save was successful, false otherwise
 */
function saveContentData($content) {
    $jsonFile = __DIR__ . '/../data/content.json';
    $jsonContent = json_encode($content, JSON_PRETTY_PRINT);
    
    // Create directory if it doesn't exist
    $dir = dirname($jsonFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    $result = file_put_contents($jsonFile, $jsonContent);
    return $result !== false;
}

/**
 * Sanitize content for storage
 * 
 * @param string $content The content to sanitize
 * @return string The sanitized content
 */
function sanitizeContent($content) {
    // Allow basic HTML tags but remove potentially harmful ones
    $allowedTags = '<p><br><strong><em><ul><ol><li><h2><h3><h4><a>';
    return strip_tags($content, $allowedTags);
}
?>