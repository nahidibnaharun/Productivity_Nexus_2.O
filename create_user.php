<?php 
// Include the database connection 
include 'db_config.php'; 

$name = $_POST["name"];
$username = $_POST["username"];
$email = $_POST["email"];
$password = $_POST["password"];

// Sanitize input (important for security)
$name = mysqli_real_escape_string($conn, $name);
$username = mysqli_real_escape_string($conn, $username);
$email = mysqli_real_escape_string($conn, $email);
$password = mysqli_real_escape_string($conn, $password);

// Check if the username already exists
$sql = "SELECT * FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    echo "Username already exists.";
} else {
    // Insert the new user into the database
    $sql = "INSERT INTO users (name, username, email, password) VALUES ('$name', '$username', '$email', '$password')";

    if (mysqli_query($conn, $sql)) {
        echo "User created successfully.";
    } else {
        echo "Error creating user: " . mysqli_error($conn);
    }
}
?>