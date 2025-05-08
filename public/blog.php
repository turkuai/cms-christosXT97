<?php
//public/blog.php
// Include configuration and functions
require_once('../includes/config.php');
require_once('../includes/functions.php');

// Get page number for pagination
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$perPage = 5;
$offset = ($page - 1) * $perPage;

// Get articles for current page
$articles = getPublishedArticles($perPage, $offset);

// Get total number of articles for pagination
$totalArticles = getArticleCount();
$totalPages = ceil($totalArticles / $perPage);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - <?php echo SITE_NAME; ?></title>
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
        <h1>Blog</h1>
        
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
                    <div class="view-image" style="background-image: url('<?php echo htmlspecialchars('../' . $article['image_url']); ?>')"></div>
                </div>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
        
        <?php if ($totalPages > 1): ?>
        <div class="pagination">
            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
            <a href="blog.php?page=<?php echo $i; ?>" class="btn <?php echo $i === $page ? 'btn-primary' : 'btn-secondary'; ?>">
                <?php echo $i; ?>
            </a>
            <?php endfor; ?>
        </div>
        <?php endif; ?>
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
        <div># CMS Project Complete File Structure and Code

This document contains all the code files for your CMS project, organized according to the proper folder structure.

## 1. `.github/workflows/ftp-deploy.yml`

```yaml
name: Deploy to School FTP Server

on:
  push:
    branches: [ main ]

jobs:
  web-deploy:
    name: Deploy website
    runs-on: ubuntu-latest
    
    steps:
    - name: Get latest code
      uses: actions/checkout@v3
    
    - name: Sync files
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: 194.197.245.5
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        server-dir: /cms/
        protocol: ftp
        exclude: |
          **/.git*
          **/.git*/**
          **/node_modules/**
          **/.github/**