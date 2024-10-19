<?php
// WURFL API URL
$url = "https://wurfl.io/api/v1/json/device";

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute request
$response = curl_exec($ch);
curl_close($ch);

// Set content type to JSON and output the response
header('Content-Type: application/json', Access-Control-Allow-Origin);
echo $response;
?>
