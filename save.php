<?php
require_once('funcs.php');

$name = $_POST["name"];
$pass = $_POST["pass"];
$position = $_POST["position"];

$db = connectDB();

$stmt = $db->prepare('INSERT INTO user_table(id, name, pass, position, login)VALUES(NULL,:name,:pass,:position,login=0)');
$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$stmt->bindValue(':pass', $pass, PDO::PARAM_STR);
$stmt->bindValue(':position', $position, PDO::PARAM_STR);

$status = $stmt->execute();

echo 'aaa';

if ($status == false) {
    echo 'error';
    echo '<a href="userSave.php">戻る</a>';
} else {
    header('Location: userSave.php');
}
