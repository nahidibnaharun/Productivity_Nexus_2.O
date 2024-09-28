<?php 
include 'db_config.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $adminUsername = $_POST["adminUsername"];
    $adminPassword = $_POST["adminPassword"];

    $adminUsername = mysqli_real_escape_string($conn, $adminUsername);
    $adminPassword = mysqli_real_escape_string($conn, $adminPassword);

    $sql = "SELECT * FROM users WHERE username = '$adminUsername' AND password = '$adminPassword' AND role = 'admin'"; 
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) == 1) {
        echo "Admin login successful!"; 
    } else {
        echo "Invalid admin username or password.";
    }
} 
?>
