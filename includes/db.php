<?php
// Include configuration
require_once('config.php');

/**
 * Set up database tables
 */
function setupDatabase() {
    $conn = getDbConnection();
    
    // Create articles table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS articles (
        id INT(11) NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(255) DEFAULT NULL,
        status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    if ($conn->query($sql) !== TRUE) {
        die("Error creating articles table: " . $conn->error);
    }
    
    // Create users table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    if ($conn->query($sql) !== TRUE) {
        die("Error creating users table: " . $conn->error);
    }
    
    // Check if admin user exists
    $sql = "SELECT id FROM users WHERE username = 'admin'";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows === 0) {
        // Create default admin user
        $password = password_hash('admin123', PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (username, password, email, created_at)
                VALUES ('admin', '$password', 'admin@example.com', NOW())";
        
        if ($conn->query($sql) !== TRUE) {
            die("Error creating admin user: " . $conn->error);
        }
        
        echo "Admin user created successfully!<br>";
    }
    
    echo "Database setup completed successfully!";
}

// Run setup if this file is accessed directly
if (basename($_SERVER['PHP_SELF']) === 'db.php') {
    setupDatabase();
}