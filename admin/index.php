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

// Check for success message
$success = isset($_GET['success']) ? intval($_GET['success']) : 0;

// Check for deletion message
$deleted = isset($_GET['deleted']) && $_GET['deleted'] == 1;
$error = isset($_GET['error']) ? $_GET['error'] : '';

// Get all articles for admin view
$articles = getAllArticles();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>
    <header>
        <div class="logo">LOGO</div>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="edit-content.php">Add Content</a></li>
                <li><a href="links.php">Footer Links</a></li>
                <li><a href="../public/index.php" target="_blank">View Site</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="admin-header">
            <h1>Admin Dashboard</h1>
            <a href="edit-content.php" class="btn btn-primary">Add New Article</a>
        </div>

        <?php if ($success): ?>
        <div class="success-message">
            <p>Article has been saved successfully!</p>
        </div>
        <?php endif; ?>

        <?php if ($deleted): ?>
        <div class="success-message">
            <p>Article has been deleted successfully!</p>
        </div>
        <?php endif; ?>

        <?php if (!empty($error)): ?>
        <div class="error-message">
            <p><?php echo htmlspecialchars($error); ?></p>
        </div>
        <?php endif; ?>

        <div class="admin-content">
            <h2>Manage Articles</h2>
            
            <?php if (empty($articles)): ?>
            <div class="empty-state">
                <h3>No articles found</h3>
                <p>Start by creating your first article.</p>
                <a href="edit-content.php" class="btn btn-primary">Create Article</a>
            </div>
            <?php else: ?>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($articles as $article): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($article['title']); ?></td>
                        <td>
                            <span class="status-indicator status-<?php echo $article['status']; ?>">
                                <?php echo ucfirst($article['status']); ?>
                            </span>
                        </td>
                        <td><?php echo formatDate($article['created_at']); ?></td>
                        <td class="action-buttons">
                            <a href="../public/view.php?id=<?php echo $article['id']; ?>&admin=1" class="btn btn-secondary" target="_blank">View</a>
                            <a href="edit-content.php?id=<?php echo $article['id']; ?>" class="btn btn-primary">Edit</a>
                            <a href="delete.php?id=<?php echo $article['id']; ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this article?')">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php endif; ?>
        </div>
    </main>

    <footer>
        <div>Your company's name</div>
        <div>© 2024, Company's name. All rights reserved</div>
        <div>
            <a href="logout.php">Logout</a>
        </div>
    </footer>
</body>
</html>