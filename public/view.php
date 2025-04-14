<?php
// Include shared functions
require_once '../includes/functions.php';

// Load content data
$content = loadContentData();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CMS Website - View</title>
    <link rel="stylesheet" href="css/view.css">
</head>
<body>
    <!-- Header Section -->
    <header>
        <div class="logo">LOGO</div>
        <nav>
            <ul>
                <li><a href="view.php">Home</a></li>
                <li><a href="view-about.php">About</a></li>
                <li><a href="view-blog.php">Blog</a></li>
            </ul>
        </nav>
    </header>

    <!-- Main Content Section -->
    <main>
        <?php if (empty($content['articles'])): ?>
            <div class="no-content">
                <p>No content available. Please add articles in the admin panel.</p>
            </div>
        <?php else: ?>
            <?php foreach ($content['articles'] as $article): ?>
                <article class="content-box">
                    <div class="article-content">
                        <h2><?php echo htmlspecialchars($article['title']); ?></h2>
                        <?php echo $article['content']; ?>
                    </div>
                    <div class="article-image">
                        <?php if (!empty($article['image'])): ?>
                            <div class="view-image" style="background-image: url('<?php echo htmlspecialchars($article['image']); ?>');"></div>
                        <?php else: ?>
                            <div class="view-image"></div>
                        <?php endif; ?>
                    </div>
                </article>
            <?php endforeach; ?>
        <?php endif; ?>
    </main>

    <!-- Footer Section -->
    <footer>
        <div class="footer-left">
            <h3><?php echo htmlspecialchars($content['company']['name']); ?></h3>
            <p><?php echo htmlspecialchars($content['company']['description']); ?></p>
            <p><?php echo htmlspecialchars($content['company']['copyright']); ?></p>
        </div>
        <div class="footer-center">
            <ul>
                <li><a href="view.php">Home</a></li>
                <li><a href="view-about.php">About</a></li>
                <li><a href="view-blog.php">Blog</a></li>
            </ul>
        </div>
        <div class="footer-right">
            <ul>
                <?php if (isset($content['socialLinks']) && !empty($content['socialLinks'])): ?>
                    <?php foreach ($content['socialLinks'] as $link): ?>
                        <li><a href="<?php echo htmlspecialchars($link['url']); ?>" target="_blank"><?php echo htmlspecialchars($link['label']); ?></a></li>
                    <?php endforeach; ?>
                <?php else: ?>
                    <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
                    <li><a href="https://linkedin.com" target="_blank">LinkedIn</a></li>
                    <li><a href="https://github.com" target="_blank">GitHub</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </footer>
</body>
</html>