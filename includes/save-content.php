<?php
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
                // Basic URL validation
                $url = filter_var($postData['value'], FILTER_VALIDATE_URL);
                if ($url !== false || empty($postData['value'])) {
                    $content['articles'][$index]['image'] = $url;
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
?>