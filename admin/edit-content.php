<?php
//edi-content.php
// Include configuration and functions
require_once('../includes/config.php');
require_once('../includes/functions.php');
require_once('../includes/auth.php');

// Check if user is logged in
if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

// Get article ID if editing existing article
$articleId = isset($_GET['id']) ? intval($_GET['id']) : 0;
$article = [];

// If editing, get article data
if ($articleId > 0) {
    $conn = getDbConnection();
    $sql = "SELECT * FROM articles WHERE id = $articleId";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $article = $result->fetch_assoc();
    } else {
        // Article not found
        header('Location: index.php');
        exit;
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = cleanInput($_POST['title']);
    $content = $_POST['content']; // Don't clean HTML content
    $status = cleanInput($_POST['status']);
    
    // Upload image if provided
    $imageUrl = $article['image_url'] ?? '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $fileName;
        
        // Make sure uploads directory exists
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $imageUrl = 'uploads/' . $fileName;
        }
    }
    
    $conn = getDbConnection();
    
    // Update or insert article
    if ($articleId > 0) {
        // Update existing article
        $sql = "UPDATE articles SET 
                title = '" . $conn->real_escape_string($title) . "',
                content = '" . $conn->real_escape_string($content) . "',
                image_url = '" . $conn->real_escape_string($imageUrl) . "',
                status = '" . $conn->real_escape_string($status) . "',
                updated_at = NOW()
                WHERE id = $articleId";
    } else {
        // Insert new article
        $sql = "INSERT INTO articles (title, content, image_url, status, created_at, updated_at)
                VALUES (
                    '" . $conn->real_escape_string($title) . "',
                    '" . $conn->real_escape_string($content) . "',
                    '" . $conn->real_escape_string($imageUrl) . "',
                    '" . $conn->real_escape_string($status) . "',
                    NOW(),
                    NOW()
                )";
    }
    
    if ($conn->query($sql) === TRUE) {
        // Redirect to admin dashboard
        header('Location: index.php?success=1');
        exit;
    } else {
        $error = "Error: " . $conn->error;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $articleId > 0 ? 'Edit' : 'Add'; ?> Article - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>
    <header>
        <div class="logo">LOGO</div>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="edit-content.php">Add Content</a></li>
                <li><a href="../public/index.php" target="_blank">View Site</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="admin-header">
            <h1><?php echo $articleId > 0 ? 'Edit' : 'Add'; ?> Article</h1>
            <a href="index.php" class="btn btn-secondary">Back to Dashboard</a>
        </div>

        <?php if (isset($error)): ?>
        <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="post" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Article Title</label>
                <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($article['title'] ?? ''); ?>" required>
            </div>
            
            <div class="form-group editor-container">
                <label for="content">Article Content</label>
                <div class="editor-toolbar">
                    <button type="button" data-command="bold"><strong>B</strong></button>
                    <button type="button" data-command="italic"><em>I</em></button>
                    <button type="button" data-command="underline"><u>U</u></button>
                    <button type="button" data-command="insertOrderedList">OL</button>
                    <button type="button" data-command="insertUnorderedList">UL</button>
                    <button type="button" data-command="createLink">Link</button>
                </div>
                <div id="editor-content" class="editor-content" contenteditable="true" data-placeholder="Click to edit this new article content. Double-click any text to edit it directly."><?php echo $article['content'] ?? ''; ?></div>
                <textarea name="content" id="hidden-content" style="display: none;"><?php echo htmlspecialchars($article['content'] ?? ''); ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="image">Article Image</label>
                <?php if (!empty($article['image_url'])): ?>
                <div class="current-image">
                    <img src="<?php echo htmlspecialchars('../' . $article['image_url']); ?>" alt="Current Image">
                </div>
                <?php endif; ?>
                <input type="file" id="image" name="image" accept="image/*">
            </div>
            
            <div class="form-group">
                <label for="status">Article Status</label>
                <select id="status" name="status">
                    <option value="draft" <?php echo (isset($article['status']) && $article['status'] === 'draft') ? 'selected' : ''; ?>>Draft</option>
                    <option value="published" <?php echo (isset($article['status']) && $article['status'] === 'published') ? 'selected' : ''; ?>>Published</option>
                </select>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Article</button>
                <a href="index.php" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
    </main>

    <footer>
        <div>Your company's name</div>
        <div>© 2024, Company's name. All rights reserved</div>
        <div>
            <a href="logout.php">Logout</a>
        </div>
    </footer>

    <script src="../assets/js/editor.js"></script>
</body>
</html>