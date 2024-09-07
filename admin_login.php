<?php 
// Include the database connection 
include 'db_config.php'; 

// Check if the admin login form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $adminUsername = $_POST["adminUsername"];
    $adminPassword = $_POST["adminPassword"];

    // Sanitize input (important for security)
    $adminUsername = mysqli_real_escape_string($conn, $adminUsername);
    $adminPassword = mysqli_real_escape_string($conn, $adminPassword);

    // Query the database 
    $sql = "SELECT * FROM users WHERE username = '$adminUsername' AND password = '$adminPassword' AND role = 'admin'"; 
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) == 1) {
        // Admin found, redirect to the admin dashboard
        echo "Admin login successful!"; 
    } else {
        // Incorrect username or password, or not an admin
        echo "Invalid admin username or password.";
    }
} 
?>