<?php
// Turn on error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include configuration and functions
require_once('../includes/config.php');
require_once('../includes/functions.php');
require_once('../includes/auth.php');  // Make sure this path is correct!

// Check if already logged in
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (login($username, $password)) {
        header('Location: index.php');
        exit;
    } else {
        $error = "Invalid username or password";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - CMS</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-header">
            <h1>CMS Login</h1>
        </div>
        
        <?php if (isset($error)): ?>
        <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form method="post" class="login-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-block">Login</button>
            </div>
        </form>
        
        <div class="login-footer">
            <a href="../public/index.php">Back to Site</a>
        </div>
    </div>
</body>
</html>