<?php
// db.php
function getDbConnection() {
    $config = include('/home/xqnvkhf1n41d/crds/config.php');
    $conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);
    if ($conn->connect_error) {
        echo "Database connection failed....";
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}
?>
