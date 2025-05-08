<?php
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
 * Get all footer links
 * @param string $position Optional position filter
 * @return array Footer links
 */
function getFooterLinks($position = '') {
    try {
        $conn = getDbConnection();
        
        $sql = "SELECT * FROM footer_links";
        if (!empty($position)) {
            $position = $conn->real_escape_string($position);
            $sql .= " WHERE position = '$position'";
        }
        $sql .= " ORDER BY display_order ASC";
        
        $result = $conn->query($sql);
        
        $links = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $links[] = $row;
            }
        }
        
        return $links;
    } catch (Exception $e) {
        // Return default links if anything goes wrong
        return [
            ['name' => 'Facebook', 'url' => 'https://facebook.com'],
            ['name' => 'LinkedIn', 'url' => 'https://linkedin.com'],
            ['name' => 'GitHub', 'url' => 'https://github.com']
        ];
    }
}

/**
 * Get a footer link by ID
 * @param int $id Link ID
 * @return array|bool Link data or false if not found
 */
function getFooterLinkById($id) {
    try {
        $conn = getDbConnection();
        $id = intval($id);
        
        $sql = "SELECT * FROM footer_links WHERE id = $id";
        $result = $conn->query($sql);
        
        if ($result && $result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return false;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Save a footer link
 * @param array $data Link data
 * @return bool Success or failure
 */
function saveFooterLink($data) {
    try {
        $conn = getDbConnection();
        
        $name = $conn->real_escape_string($data['name']);
        $url = $conn->real_escape_string($data['url']);
        $position = $conn->real_escape_string($data['position']);
        $order = intval($data['display_order']);
        $id = isset($data['id']) ? intval($data['id']) : 0;
        
        if ($id > 0) {
            // Update existing link
            $sql = "UPDATE footer_links SET 
                    name = '$name',
                    url = '$url',
                    position = '$position',
                    display_order = $order
                    WHERE id = $id";
        } else {
            // Insert new link
            $sql = "INSERT INTO footer_links (name, url, position, display_order)
                    VALUES ('$name', '$url', '$position', $order)";
        }
        
        return $conn->query($sql) === TRUE;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Delete a footer link
 * @param int $id Link ID
 * @return bool Success or failure
 */
function deleteFooterLink($id) {
    try {
        $conn = getDbConnection();
        $id = intval($id);
        
        $sql = "DELETE FROM footer_links WHERE id = $id";
        return $conn->query($sql) === TRUE;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Check if a table exists in the database
 * @param string $tableName Table name to check
 * @return bool True if table exists, false otherwise
 */
function tableExists($tableName) {
    try {
        $conn = getDbConnection();
        $tableName = $conn->real_escape_string($tableName);
        
        $result = $conn->query("SHOW TABLES LIKE '$tableName'");
        return $result && $result->num_rows > 0;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Safe database query execution
 * @param string $sql SQL query to execute
 * @return bool|mysqli_result Result of the query or false on failure
 */
function executeQuery($sql) {
    try {
        $conn = getDbConnection();
        return $conn->query($sql);
    } catch (Exception $e) {
        return false;
    }
}