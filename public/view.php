<?php
// Include configuration and functions
require_once('../includes/config.php');
require_once('../includes/functions.php');
require_once('../includes/auth.php'); // Include auth functions

// Check if the getFooterLinks function exists
if (!function_exists('getFooterLinks')) {
    // Fallback function in case the original isn't available
    function getFooterLinks($position = '') {
        return []; // Return empty array as fallback
    }
}

// Get article ID from URL
$articleId = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Check if no article ID was provided
if ($articleId <= 0) {
    // Redirect to the articles list
    header('Location: index.php');
    exit;
}

// Get article content from database - get from either admin or front-end
$isAdmin = isset($_GET['admin']) && $_GET['admin'] == 1;
$article = null;

if ($isAdmin && isLoggedIn()) {
    // If accessed from admin and logged in, get article regardless of status
    $article = getArticleByIdAdmin($articleId);
} else {
    // If accessed from public, only get published articles
    $article = getArticleById($articleId);
}

// If article doesn't exist, redirect instead of showing error
if (!$article) {
    if ($isAdmin && isLoggedIn()) {
        // If admin is trying to view a deleted article, redirect to admin dashboard
        header('Location: ../admin/index.php?deleted=1');
        exit;
    } else {
        // If public user is trying to view a non-existent article, redirect to home
        header('Location: index.php');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($article['title']); ?> - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../assets/css/view.css">
</head>
<body>
    <header>
        <div class="logo">LOGO</div>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="about.php">About</a></li>
                <li><a href="blog.php">Blog</a></li>
                <?php if (isLoggedIn()): ?>
                <li><a href="../admin/index.php">Admin</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>

    <main>
        <?php if ($isAdmin && $article['status'] === 'draft'): ?>
        <div class="draft-notice">
            <strong>Draft Article:</strong> This article is not visible to the public.
        </div>
        <?php endif; ?>
        
        <div class="content-box">
            <div class="article-content">
                <h2><?php echo htmlspecialchars($article['title']); ?></h2>
                <div class="article-meta">
                    <span>Status: 
                        <span class="status-indicator status-<?php echo $article['status']; ?>">
                            <?php echo ucfirst($article['status']); ?>
                        </span>
                    </span>
                    <span>Created: <?php echo formatDate($article['created_at']); ?></span>
                </div>
                <?php echo $article['content']; ?>
            </div>
            <?php if (!empty($article['image_url'])): ?>
            <div class="article-image">
                <img src="<?php echo htmlspecialchars('../' . $article['image_url']); ?>" alt="<?php echo htmlspecialchars($article['title']); ?>" class="view-image">
            </div>
            <?php endif; ?>
        </div>
    </main>

    <footer>
        <div>Your company's name</div>
        <div>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="about.php">About</a></li>
                <li><a href="blog.php">Blog</a></li>
            </ul>
        </div>
        <div>
            <ul>
                <?php 
                // Try-catch to prevent errors
                try {
                    $footerLinks = getFooterLinks('right');
                    foreach ($footerLinks as $link): 
                    ?>
                    <li><a href="<?php echo htmlspecialchars($link['url']); ?>"><?php echo htmlspecialchars($link['name']); ?></a></li>
                    <?php endforeach;
                } catch (Exception $e) {
                    // Fallback social links if function fails
                    ?>
                    <li><a href="https://facebook.com">Facebook</a></li>
                    <li><a href="https://linkedin.com">LinkedIn</a></li>
                    <li><a href="https://github.com">GitHub</a></li>
                    <?php
                }
                ?>
            </ul>
        </div>
    </footer>
</body>
</html>