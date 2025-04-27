<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "crud_db";

// Create connection without database selection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS crud_db";
if ($conn->query($sql) === TRUE) {
    // Close the initial connection
    $conn->close();
    
    // Create new connection with database selected
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Create users table if it doesn't exist
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        phone VARCHAR(15),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB";

    if (!$conn->query($sql)) {
        echo "Error creating table: " . $conn->error;
    }
}
?> 