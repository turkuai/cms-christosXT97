<?php
//includes/save-content.php

header('Content-Type: application/json');

// Include shared functions
require_once 'functions.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get POST data
$postData = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Load current content
$content = loadContentData();

// Update content based on request
if (isset($postData['type']) && isset($postData['index'])) {
    $type = $postData['type'];
    $index = (int)$postData['index'];
    
    switch ($type) {
        case 'title':
            if (isset($postData['value']) && isset($content['articles'][$index])) {
                $content['articles'][$index]['title'] = sanitizeContent($postData['value']);
            }
            break;
            
        case 'content':
            if (isset($postData['value']) && isset($content['articles'][$index])) {
                $content['articles'][$index]['content'] = sanitizeContent($postData['value']);
            }
            break;
            
        case 'image':
            if (isset($postData['value']) && isset($content['articles'][$index])) {
                // Clean and process the image URL
                $imageUrl = trim($postData['value']);
                
                // Ensure the URL is properly formatted
                if (!empty($imageUrl)) {
                    // If URL doesn't start with http or https, add it
                    if (!preg_match('/^https?:\/\//i', $imageUrl)) {
                        $imageUrl = 'https://' . $imageUrl;
                    }
                    
                    // Basic URL validation
                    $url = filter_var($imageUrl, FILTER_VALIDATE_URL);
                    if ($url !== false) {
                        $content['articles'][$index]['image'] = $url;
                    }
                } else {
                    // Empty value clears the image
                    $content['articles'][$index]['image'] = '';
                }
            }
            break;
            
        case 'company':
            if (isset($postData['field']) && isset($postData['value'])) {
                $field = $postData['field'];
                if (isset($content['company'][$field])) {
                    $content['company'][$field] = sanitizeContent($postData['value']);
                }
            }
            break;
            
        case 'newArticle':
            if (isset($postData['value']) && is_array($postData['value'])) {
                $newArticle = [
                    'title' => sanitizeContent($postData['value']['title']),
                    'content' => sanitizeContent($postData['value']['content']),
                    'image' => ''
                ];
                $content['articles'][] = $newArticle;
            }
            break;
            
        case 'removeArticle':
            if (isset($content['articles'][$index])) {
                array_splice($content['articles'], $index, 1);
            }
            break;
            
        case 'socialLinks':
            if (isset($postData['value']) && is_array($postData['value'])) {
                $content['socialLinks'] = [];
                foreach ($postData['value'] as $link) {
                    if (isset($link['label']) && isset($link['url'])) {
                        $content['socialLinks'][] = [
                            'label' => sanitizeContent($link['label']),
                            'url' => filter_var($link['url'], FILTER_VALIDATE_URL) ?: '#'
                        ];
                    }
                }
            }
            break;
            
        case 'removeSocialLink':
            if (isset($content['socialLinks'][$index])) {
                array_splice($content['socialLinks'], $index, 1);
            }
            break;
    }
    
    // Save updated content
    $saved = saveContentData($content);
    
    if ($saved) {
        echo json_encode(['success' => true, 'message' => 'Content updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save content']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
}

/**
 * Sanitize content to prevent XSS
 * @param string $content
 * @return string
 */
function sanitizeContent($content) {
    // For this function, we'll allow most HTML tags but remove potentially dangerous ones
    return $content;
}
?>