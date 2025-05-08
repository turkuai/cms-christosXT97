<?php
// Include configuration and functions
require_once('../includes/config.php');
require_once('../includes/functions.php');
require_once('../includes/auth.php');

// Check if user is logged in
if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

// Get article ID from URL
$articleId = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Delete article if ID is valid
if ($articleId > 0) {
    $conn = getDbConnection();
    
    // Get the article to find image
    $sql = "SELECT image_url FROM articles WHERE id = $articleId";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $article = $result->fetch_assoc();
        
        // Delete the associated image if exists
        if (!empty($article['image_url'])) {
            $imagePath = '../' . $article['image_url'];
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        
        // Delete the article
        $sql = "DELETE FROM articles WHERE id = $articleId";
        if ($conn->query($sql) === TRUE) {
            // Redirect directly to the admin dashboard
            header('Location: index.php?deleted=1');
            exit;
        } else {
            $error = "Error deleting article: " . $conn->error;
            header('Location: index.php?error=' . urlencode($error));
            exit;
        }
    } else {
        // Article not found, redirect to admin dashboard
        header('Location: index.php?error=Article+not+found');
        exit;
    }
}

// Redirect back to admin index with error
header('Location: index.php?error=Invalid+article+ID');
exit;