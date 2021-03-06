<?php
require_once('funcs.php');
session_start();

$userName = $_SESSION['user'];
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="utf-8">
  <!-- <link rel="preconnect" href="https://fonts.gstatic.com"> -->
  <!-- <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;1,300&display=swap" rel="stylesheet"> -->
  <!-- <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css" /> -->
  <!-- <link rel="stylesheet" href="css/reset.css"> -->
  <link rel="stylesheet" href="css/video.css">
  <title>ビデオ画面</title>
</head>

<body>
  <header>
    <div id="info"></div>
  </header>
  <main>
    <!-- ビデオ部分 -->
    <div class="self-video-wrapper">
      <p class="note invisible">
        <a id="mesh" href="#mesh">mesh</a> / <a id="sfu" href="#sfu">sfu</a>
        (now:<span id="js-room-mode"></span>)
      </p>
      <div class="room">
        <div>
          <input type="text" placeholder="Room Name" id="js-room-id">
          <button id="js-join-trigger">入室</button>
          <button id="js-leave-trigger">退室</button>
        </div>
        <div class="remote-streams" id="js-remote-streams"></div>
        <video id="js-local-stream"></video>
        <canvas id="target"></canvas>
      </div>
    </div>
    <!-- <p class="meta" id="js-meta"></p> -->
    </div>
    <!-- 部屋の中のチャット部分 -->
    <!-- <nav class="messages-nav">
      <pre class="messages" id="js-messages"></pre>
      <input type="text" id="js-local-text">
      <button id="js-send-trigger">Send</button>
      <button id="messages-nav-close">Chat Close</button>
    </nav> -->
    </div>

    <!-- ログインしている人の名前表示 -->
    <div class="userName">
      <?= $userName ?>
    </div>

  </main>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://cdn.webrtc.ecl.ntt.com/skyway-latest.js"></script>
  <script src="js/config.js"></script>
  <script src="js/video.js"></script>
</body>

</html>