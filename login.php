<?php
require_once('funcs.php');
session_start();

$name = $_POST["name"];
$pass = $_POST["pass"];

$_SESSION['user'] = $name;

$db = connectDB();

$stmt = $db->prepare('SELECT * FROM user_table WHERE name=:name');
$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$status = $stmt->execute();

if ($status == false) {
    sql_error($stmt);
} else {
    $row = $stmt->fetch();
    if ($name == "") {
        echo '名前を入力してください';
        echo '<a href="loginForm.php">ログイン画面へ</a>';
    } else if ($pass == "") {
        echo 'パスワードを入力してください';
        echo '<a href="loginForm.php">ログイン画面へ</a>';
    } else if ($row['pass'] != $pass) {
        echo 'パスワードが違います';
        echo '<a href="loginForm.php">ログイン画面へ</a>';
    } else if ($row['name'] != $name) {
        echo 'とうろくなし';
        echo '<a href="loginForm.php">ログイン画面へ</a>';
    } else {
        redirect('kakunin.php');
    }
}
