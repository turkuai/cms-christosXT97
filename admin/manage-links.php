<?php
// admin/manage-links.php
// Include configuration and functions
require_once('../includes/config.php');
require_once('../includes/functions.php');
require_once('../includes/auth.php');

// Check if user is logged in
if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

// Handle form submission for adding new link
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    // Load current content
    $content = loadContentData();
    
    if ($_POST['action'] === 'add' && isset($_POST['label']) && isset($_POST['url'])) {
        // Prepare new link data
        $label = cleanInput($_POST['label']);
        $url = cleanInput($_POST['url']);
        
        // Validate URL
        if (!empty($url) && !preg_match('/^https?:\/\//i', $url)) {
            $url = 'https://' . $url;
        }
        
        // Add the new link
        if (!empty($label) && !empty($url)) {
            if (!isset($content['socialLinks'])) {
                $content['socialLinks'] = [];
            }
            
            $content['socialLinks'][] = [
                'label' => $label,
                'url' => $url
            ];
            
            // Save content
            saveContentData($content);
            
            // Redirect to avoid form resubmission
            header('Location: manage-links.php?success=1');
            exit;
        } else {
            $error = "Both label and URL are required.";
        }
    } else if ($_POST['action'] === 'delete' && isset($_POST['index'])) {
        // Delete link
        $index = intval($_POST['index']);
        
        if (isset($content['socialLinks'][$index])) {
            array_splice($content['socialLinks'], $index, 1);
            saveContentData($content);
            
            // Redirect to avoid form resubmission
            header('Location: manage-links.php?deleted=1');
            exit;
        }
    } else if ($_POST['action'] === 'edit' && isset($_POST['index']) && isset($_POST['label']) && isset($_POST['url'])) {
        // Edit link
        $index = intval($_POST['index']);
        $label = cleanInput($_POST['label']);
        $url = cleanInput($_POST['url']);
        
        // Validate URL
        if (!empty($url) && !preg_match('/^https?:\/\//i', $url)) {
            $url = 'https://' . $url;
        }
        
        if (!empty($label) && !empty($url) && isset($content['socialLinks'][$index])) {
            $content['socialLinks'][$index] = [
                'label' => $label,
                'url' => $url
            ];
            
            // Save content
            saveContentData($content);
            
            // Redirect to avoid form resubmission
            header('Location: manage-links.php?updated=1');
            exit;
        } else {
            $error = "Both label and URL are required.";
        }
    }
}

// Get current links
$content = loadContentData();
$links = isset($content['socialLinks']) ? $content['socialLinks'] : [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Footer Links - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>
    <header>
        <div class="logo">LOGO</div>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="edit-content.php">Add Content</a></li>
                <li><a href="manage-links.php">Manage Links</a></li>
                <li><a href="../public/index.php" target="_blank">View Site</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="admin-header">
            <h1>Manage Footer Links</h1>
            <a href="index.php" class="btn btn-secondary">Back to Dashboard</a>
        </div>

        <?php if (isset($_GET['success'])): ?>
        <div class="success-message">
            <p>Link has been added successfully!</p>
        </div>
        <?php endif; ?>

        <?php if (isset($_GET['deleted'])): ?>
        <div class="success-message">
            <p>Link has been deleted successfully!</p>
        </div>
        <?php endif; ?>

        <?php if (isset($_GET['updated'])): ?>
        <div class="success-message">
            <p>Link has been updated successfully!</p>
        </div>
        <?php endif; ?>

        <?php if (isset($error)): ?>
        <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>

        <div class="admin-content">
            <h2>Current Links</h2>
            
            <?php if (empty($links)): ?>
            <div class="empty-state">
                <h3>No links found</h3>
                <p>Start by adding your first link below.</p>
            </div>
            <?php else: ?>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($links as $index => $link): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($link['label']); ?></td>
                        <td><a href="<?php echo htmlspecialchars($link['url']); ?>" target="_blank"><?php echo htmlspecialchars($link['url']); ?></a></td>
                        <td class="action-buttons">
                            <button class="btn btn-primary edit-link-btn" data-index="<?php echo $index; ?>" data-label="<?php echo htmlspecialchars($link['label']); ?>" data-url="<?php echo htmlspecialchars($link['url']); ?>">Edit</button>
                            <form method="post" style="display: inline-block;" onsubmit="return confirm('Are you sure you want to delete this link?');">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="index" value="<?php echo $index; ?>">
                                <button type="submit" class="btn btn-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php endif; ?>
            
            <h2 class="mt-4">Add New Link</h2>
            <form method="post" class="admin-form">
                <input type="hidden" name="action" value="add">
                <div class="form-group">
                    <label for="label">Link Label</label>
                    <input type="text" id="label" name="label" required placeholder="e.g. Facebook">
                </div>
                <div class="form-group">
                    <label for="url">URL</label>
                    <input type="text" id="url" name="url" required placeholder="e.g. https://facebook.com">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Add Link</button>
                </div>
            </form>
        </div>
    </main>

    <footer>
        <div>Your company's name</div>
        <div>© 2024, Company's name. All rights reserved</div>
        <div>
            <a href="logout.php">Logout</a>
        </div>
    </footer>

    <!-- Modal for editing links -->
    <div id="edit-modal" class="modal">
        <div class="modal-content">
            <h2>Edit Link</h2>
            <span class="close-modal">&times;</span>
            <form method="post" id="edit-form">
                <input type="hidden" name="action" value="edit">
                <input type="hidden" name="index" id="edit-index">
                <div class="form-group">
                    <label for="edit-label">Link Label</label>
                    <input type="text" id="edit-label" name="label" required>
                </div>
                <div class="form-group">
                    <label for="edit-url">URL</label>
                    <input type="text" id="edit-url" name="url" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" id="cancel-edit">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Initialize edit modal functionality
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('edit-modal');
            const editForm = document.getElementById('edit-form');
            const editBtns = document.querySelectorAll('.edit-link-btn');
            const closeBtn = document.querySelector('.close-modal');
            const cancelBtn = document.getElementById('cancel-edit');
            
            // Show modal when edit button is clicked
            editBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.dataset.index;
                    const label = this.dataset.label;
                    const url = this.dataset.url;
                    
                    document.getElementById('edit-index').value = index;
                    document.getElementById('edit-label').value = label;
                    document.getElementById('edit-url').value = url;
                    
                    modal.style.display = 'block';
                });
            });
            
            // Close modal when X is clicked
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            }
            
            // Close modal when Cancel is clicked
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            }
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>