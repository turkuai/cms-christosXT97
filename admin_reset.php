<?php
// Turn on error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include configuration file
require_once('includes/config.php');

// Connect directly to the database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . "<br>");
}

echo "Connected to database successfully.<br>";

// Delete existing admin user
$result = $conn->query("DELETE FROM users WHERE username = 'admin'");
echo "Deleted existing admin user: " . ($result ? "Success" : "Failed: " . $conn->error) . "<br>";

// Create new admin user with hardcoded password hash
$password_hash = password_hash('admin123', PASSWORD_DEFAULT);
$sql = "INSERT INTO users (username, password, email, created_at) 
        VALUES ('admin', '$password_hash', 'admin@example.com', NOW())";

if ($conn->query($sql) === TRUE) {
    echo "Admin user created successfully!<br>";
    echo "Username: admin<br>";
    echo "Password: admin123<br>";
} else {
    echo "Error creating admin user: " . $conn->error . "<br>";
}

// Verify the user was created
$result = $conn->query("SELECT id, username, password FROM users WHERE username = 'admin'");
if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo "Admin user found in database. ID: " . $user['id'] . "<br>";
    echo "Password hash: " . substr($user['password'], 0, 20) . "...<br>";
} else {
    echo "Failed to find admin user in database.<br>";
}

$conn->close();