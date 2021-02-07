<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <header>
        <h1>ログイン</h1>
    </header>
    <div class="loginForm">
        <form action="login.php" method="post" name="login">
            <table>
                <tbody>
                    <tr>
                        <th>お名前</th>
                        <td><input type="text" name="name"></td>
                    </tr>
                    <tr>
                        <th>おパスワード</th>
                        <td><input type="password" name="pass"></td>
                    </tr>

                </tbody>
            </table>
            <input type="submit" value="login" onclick="return checkForm();">
        </form>
    </div><br><br>
    <button><a href="userSave.php">新規登録</a></button>
    <script>
        function checkForm() {
            if (document.login.name.value == "") {
                alert("名前を入力して下さい。");
                return false;
            } else if (document.login.pass.value == "") {
                alert("パスワードを入力して下さい。");
                return false;
            } else {
                return true;
            }
        }
    </script>
</body>

</html>