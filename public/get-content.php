<?php
// public/get-content.php

// Include shared functions
require_once '../includes/functions.php';

// Set content type to JSON
header('Content-Type: application/json');

// Load current content data
$content = loadContentData();

// Return the data as JSON
echo json_encode($content);