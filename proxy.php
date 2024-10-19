<?php
// Allow cross-origin requests from any domain
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Preflight request successful
    exit();
}

// WURFL API URL
$url = "https://wurfl.io/api/v1/json/device";

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Execute request
$response = curl_exec($ch);

// Check if the cURL request was successful
if ($response === false) {
    // cURL error handling
    echo "cURL Error: " . curl_error($ch);
} else {
    // Set content type to JSON and output the response
    header('Content-Type: application/json');
    echo $response;
}

// Close cURL session
curl_close($ch);
?>