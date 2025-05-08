<?php
//public/index.php
// Include configuration and functions
require_once('../includes/config.php');
require_once('../includes/functions.php');

// Get published articles for homepage
$articles = getPublishedArticles(5, 0);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?></title>
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
            </ul>
        </nav>
    </header>

    <main>
        <h1>Welcome to Our CMS</h1>
        
        <?php if (empty($articles)): ?>
        <div class="empty-state">
            <h3>No articles yet</h3>
            <p>Check back soon for new content!</p>
        </div>
        <?php else: ?>
        <div class="articles-list">
            <?php foreach ($articles as $article): ?>
            <div class="content-box">
                <div class="article-content">
                    <h2><?php echo htmlspecialchars($article['title']); ?></h2>
                    <div class="article-meta">
                        <span>Published: <?php echo formatDate($article['created_at']); ?></span>
                    </div>
                    <p><?php echo substr(strip_tags($article['content']), 0, 200); ?>...</p>
                    <div class="action-buttons">
                        <a href="view.php?id=<?php echo $article['id']; ?>" class="btn btn-primary">Read More</a>
                    </div>
                </div>
                <?php if (!empty($article['image_url'])): ?>
                <div class="article-image">
                    <img src="<?php echo htmlspecialchars('../' . $article['image_url']); ?>" alt="<?php echo htmlspecialchars($article['title']); ?>" class="view-image">
                </div>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
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
                <li><a href="#">Facebook</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">GitHub</a></li>
            </ul>
        </div>
    </footer>
</body>
</html>