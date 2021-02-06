<?php
function connectDB()
{
    try {
        $db = new PDO('mysql:dbname=teaa_shakeyaro;host=localhost;charset=utf8', 'root', 'root');
        return $db;
    } catch (PDOException $e) {
        exit('DBConnectError:' . $e->getMessage());
    }
}

function sql_error($stmt)
{
    $error = $stmt->errorInfo();
    echo '何か問題があったので最初からお願いします';
    exit('<br><button><a href="loginFrom.html">ログイン画面へ戻る</a></button>');
}

function redirect($file_name)
{
    header('Location:' . $file_name);
    exit();
}
