<?php
// includes/functions.php
// Include database connection
require_once('config.php');

/**
 * Get article by ID
 * @param int $id Article ID
 * @return array|bool Article data or false if not found
 */
function getArticleById($id) {
    $conn = getDbConnection();
    $id = $conn->real_escape_string($id);
    
    $sql = "SELECT * FROM articles WHERE id = $id AND status = 'published'";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    
    return false;
}

/**
 * Get article by ID regardless of status (for admin users)
 * @param int $id Article ID
 * @return array|bool Article data or false if not found
 */
function getArticleByIdAdmin($id) {
    $conn = getDbConnection();
    $id = $conn->real_escape_string($id);
    
    $sql = "SELECT * FROM articles WHERE id = $id";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    
    return false;
}

/**
 * Get all published articles
 * @param int $limit Number of articles to return
 * @param int $offset Offset for pagination
 * @return array Articles
 */
function getPublishedArticles($limit = 10, $offset = 0) {
    $conn = getDbConnection();
    
    $sql = "SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);
    
    $articles = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $articles[] = $row;
        }
    }
    
    return $articles;
}

/**
 * Get all articles (for admin)
 * @param int $limit Number of articles to return
 * @param int $offset Offset for pagination
 * @return array Articles
 */
function getAllArticles($limit = 10, $offset = 0) {
    $conn = getDbConnection();
    
    $sql = "SELECT * FROM articles ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);
    
    $articles = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $articles[] = $row;
        }
    }
    
    return $articles;
}

/**
 * Get total count of published articles
 * @return int Total articles
 */
function getArticleCount() {
    $conn = getDbConnection();
    $sql = "SELECT COUNT(*) as total FROM articles WHERE status = 'published'";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['total'];
    }
    
    return 0;
}

/**
 * Clean user input
 * @param string $input Input to clean
 * @return string Cleaned input
 */
function cleanInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    return $input;
}

/**
 * Format date for display
 * @param string $date Date string
 * @return string Formatted date
 */
function formatDate($date) {
    return date('F j, Y', strtotime($date));
}

/**
 * Get footer links from content data
 * @return array Array of links
 */
function getFooterLinks() {
    // Default links if nothing is set
    $defaultLinks = [
        ['label' => 'Facebook', 'url' => 'https://facebook.com'],
        ['label' => 'LinkedIn', 'url' => 'https://linkedin.com'],
        ['label' => 'GitHub', 'url' => 'https://github.com']
    ];
    
    // Get from stored content
    $content = loadContentData();
    
    if (isset($content['socialLinks']) && !empty($content['socialLinks'])) {
        return $content['socialLinks'];
    }
    
    return $defaultLinks;
}

/**
 * Load content data from storage
 * @return array
 */
function loadContentData() {
    $dataFile = __DIR__ . '/../data/content.json';
    
    // Create default content structure
    $defaultContent = [
        'articles' => [],
        'company' => [
            'name' => 'Your company\'s name',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            'copyright' => '© ' . date('Y') . ', Company\'s name. All rights reserved'
        ],
        'socialLinks' => [
            ['label' => 'Facebook', 'url' => 'https://facebook.com'],
            ['label' => 'LinkedIn', 'url' => 'https://linkedin.com'],
            ['label' => 'GitHub', 'url' => 'https://github.com']
        ]
    ];
    
    // Check if the data file exists
    if (file_exists($dataFile)) {
        $content = json_decode(file_get_contents($dataFile), true);
        
        // If JSON is invalid, use default content
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $defaultContent;
        }
        
        return $content;
    }
    
    // If file doesn't exist, create it with default content
    if (!is_dir(__DIR__ . '/../data')) {
        mkdir(__DIR__ . '/../data', 0777, true);
    }
    
    file_put_contents($dataFile, json_encode($defaultContent, JSON_PRETTY_PRINT));
    
    return $defaultContent;
}

/**
 * Save content data to storage
 * @param array $content
 * @return bool
 */
function saveContentData($content) {
    $dataFile = __DIR__ . '/../data/content.json';
    
    // Ensure data directory exists
    if (!is_dir(__DIR__ . '/../data')) {
        mkdir(__DIR__ . '/../data', 0777, true);
    }
    
    // Save content to file
    return file_put_contents($dataFile, json_encode($content, JSON_PRETTY_PRINT)) !== false;
}