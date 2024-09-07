<?php 
// Include the database connection 
include 'db_config.php'; 

// Check if the login form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Sanitize input (important for security)
    $username = mysqli_real_escape_string($conn, $username);
    $password = mysqli_real_escape_string($conn, $password);

    // Query the database
    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) == 1) {
        // User found, redirect to the dashboard
        echo "Login successful!"; 
    } else {
        // Incorrect username or password
        echo "Invalid username or password.";
    }
} 
?>