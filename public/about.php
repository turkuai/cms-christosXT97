<?php
// Include configuration
require_once('../includes/config.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - <?php echo SITE_NAME; ?></title>
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
        <div class="content-box">
            <div class="article-content">
                <h2>About Us</h2>
                <p>Welcome to our CMS website. This is a simple content management system built with PHP.</p>
                <p>This CMS allows you to create, manage, and publish articles with ease. The admin panel provides a user-friendly interface for content management.</p>
                <p>Features include:</p>
                <ul>
                    <li>Admin panel for content management</li>
                    <li>Article publishing system</li>
                    <li>Clean and responsive design</li>
                    <li>Image upload functionality</li>
                    <li>User authentication</li>
                </ul>
            </div>
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
                <li><a href="#">Facebook</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">GitHub</a></li>
            </ul>
        </div>
    </footer>
</body>
</html>