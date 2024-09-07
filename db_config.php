<?php
$servername = "localhost";
$username = "root"; // Default MySQL username
$password = "";    // Default MySQL password (if you changed it, use your password)
$dbname = "productivity_db"; // The name of your database

// Create a connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check the connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
?>