<?php
include 'db_config.php'; 

$userId = $_POST["userId"];

$sql = "DELETE FROM users WHERE id = $userId";

if (mysqli_query($conn, $sql)) {
    echo "User deleted successfully.";
} else {
    echo "Error deleting user: " . mysqli_error($conn);
}
?>
