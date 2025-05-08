<?php
//includes/config.php
// Database connection settings
define('DB_HOST', 'localhost');
define('DB_USER', 'root');         // Try using the root user
define('DB_PASS', '');             // Root often has no password in local setups
define('DB_NAME', 'cms_christosxt97');

// Create database connection
function getDbConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

// Site configuration
define('SITE_NAME', 'My CMS');
define('SITE_URL', 'http://localhost/CMS_WEBSITE/');  // Updated to match your URL
define('ADMIN_EMAIL', 'admin@example.com');

// Upload directory
define('UPLOAD_DIR', '../uploads/');
?>