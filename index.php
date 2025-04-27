<?php
require_once 'config.php';

// Delete user
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        header("Location: index.php");
        exit();
    }
    $stmt->close();
}

// Fetch all users
$sql = "SELECT * FROM users ORDER BY created_at DESC";
$result = $conn->query($sql);

// Check for database errors
if (!$result) {
    die("Error fetching users: " . $conn->error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP CRUD Application</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Users Management System</h1>
        <a href="create.php" class="btn add-btn">Add New User</a>
        
        <?php if (isset($_GET['success'])): ?>
            <div class="success-message" style="color: green; margin: 1rem 0;">
                Operation completed successfully!
            </div>
        <?php endif; ?>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result && $result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>".htmlspecialchars($row['id'])."</td>";
                        echo "<td>".htmlspecialchars($row['name'])."</td>";
                        echo "<td>".htmlspecialchars($row['email'])."</td>";
                        echo "<td>".htmlspecialchars($row['phone'])."</td>";
                        echo "<td>".htmlspecialchars($row['created_at'])."</td>";
                        echo "<td class='actions'>";
                        echo "<a href='edit.php?id=".htmlspecialchars($row['id'])."' class='btn edit-btn'>Edit</a>";
                        echo "<a href='index.php?delete=".htmlspecialchars($row['id'])."' class='btn delete-btn' onclick='return confirm(\"Are you sure?\")'>Delete</a>";
                        echo "</td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='6' class='no-records'>No users found</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html> 