
(async function main() {
  const Peer = window.Peer;
  const VIDEO = document.getElementById('js-local-stream');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  const remoteVideos = document.getElementById('js-remote-streams');
  const roomId = document.getElementById('js-room-id');
  const roomMode = document.getElementById('js-room-mode');
  const sendTrigger = document.getElementById('js-send-trigger');
  const messages = document.getElementById('js-messages');
  const closeTrigger = document.getElementById('messages-nav-close')
  const { tf, bodyPix } = window;

  // sfuモードとmeshモード(サーバーへの負担とかの話)の選択をaタグのハッシュで切り替える関数
  const getRoomModeByHash = () => (location.hash === '#sfu' ? 'sfu' : 'mesh');

  roomMode.textContent = getRoomModeByHash();
  window.addEventListener(
    // ハッシュチェンジで発火
    'hashchange',
    () => (roomMode.textContent = getRoomModeByHash())
  );
  
  // ユーザー自身のカメラの設定
  const localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .catch(console.error);
    
    // Render local stream
    VIDEO.muted = true;
    VIDEO.srcObject = localStream;
    VIDEO.playsInline = true;
    await VIDEO.play().catch(console.error);
  
    // peer(電話番号的なもの)の設定、SkyWayで取得したAPIKeyをここに入力
    // eslint-disable-next-line require-atomic-updates
    const peer = (window.peer = new Peer({
      key: 'b5981b2c-5860-49b4-8d70-131b9ab631e2',
      debug: 3,
    }));
  
    // 入室の設定
  joinTrigger.addEventListener('click', () => {
    console.log(peer.id);
    $(".chat-open").removeClass('hidden');
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }
    // ルーム名を指定してルームに参加（peer.joinRoom）
    const room = peer.joinRoom(roomId.value, {
      mode: getRoomModeByHash(),
      stream: localStream,
    });
    // 接続が成功するとopenイベントが発火する,onceは複数回実行されても1度しか実行しない関数を返す
    room.once('open', () => {
      messages.textContent += `<<< ${roomId.value}へあなたが入室しました >>>\n`;
      chatOpen();
    });
    // 他の人が入ってきたpeerJoinイベントで発火するメッセージ
    room.on('peerJoin', peerId => {
      console.log(peerId);
      messages.textContent += `<<< ${peerId} が入室しました >>>\n`;
      if(!$(".messages-nav").hasClass(open)) {
        chatOpen();
      }
    });
    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      // mark peerId to find it later at peerLeave event
      newVideo.setAttribute('data-peer-id', stream.peerId);
      remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);
    });

    room.on('data', ({ data, src }) => {
      console.log(data);
      console.log(src);
      chatOpen();
      // Show a message sent to the room and who sent
      messages.textContent += `${src}: ${data}\n`;
    });

    // for closing room members
    room.on('peerLeave', peerId => {
      const remoteVideo = remoteVideos.querySelector(
        `[data-peer-id="${peerId}"]`
      );
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();

      messages.textContent += `=== ${peerId} left ===\n`;
    });

    // for closing myself
    room.once('close', () => {
      sendTrigger.removeEventListener('click', onClickSend);
      messages.textContent += '<<< You left >>>\n';
      // 退室押した後にYou leftの表示を見せてからチャット画面をクローズさせる
      $('.messages-nav').delay(1000).queue(function(){
        chatClose();
      });
      Array.from(remoteVideos.children).forEach(remoteVideo => {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        remoteVideo.remove();
      });
    });
    
    // sendボタン、chatcloseボタン、退出ボタンについて

    sendTrigger.addEventListener('click', onClickSend);
    closeTrigger.addEventListener('click', chatClose);
    leaveTrigger.addEventListener('click', () => room.close(), { once: true });
    
  });

  peer.on('error', console.error);

  console.log(tf.version);
  console.log(bodyPix.version);

  // use WASM
  await tf.setBackend("wasm");

  const net = await bodyPix.load();

  // output source
  const $destCanvas = document.querySelector("canvas");

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  VIDEO.srcObject = stream;

    // THESE LINES ARE REQUIRED!
    VIDEO.width = $destCanvas.width = VIDEO.videoWidth;
    VIDEO.height = $destCanvas.height = VIDEO.videoHeight;

    const destCtx = $destCanvas.getContext("2d");
    // $destCanvas.style.backgroundImage = "url(./img/about_03.jpg)";
    // $destCanvas.style.backgroundSize = "cover";

    // to remove background, need another canvas
    const $tempCanvas = document.createElement("canvas");
    $tempCanvas.width = VIDEO.videoWidth;
    $tempCanvas.height = VIDEO.videoHeight;
    const tempCtx = $tempCanvas.getContext("2d");

    (async function loop() {
      requestAnimationFrame(loop);

      // create mask on temp canvas
      const segmentation = await net.segmentPerson(VIDEO);
      const mask = bodyPix.toMask(segmentation);
      tempCtx.putImageData(mask, 0, 0);

      // draw original
      destCtx.drawImage(VIDEO, 0, 0, $destCanvas.width, $destCanvas.height);

      // then overwrap, masked area will be removed
      destCtx.save();
      destCtx.globalCompositeOperation = "destination-out";
      destCtx.drawImage($tempCanvas, 0, 0, $destCanvas.width, $destCanvas.height);
      destCtx.restore();
    })();
})();

// -------------------------------------------------------
//  とりあえず貼り付けたバーチャル背景部分のjs
// -------------------------------------------------------
const { tf, bodyPix } = window;

(async () => {
  console.log(tf.version);
  console.log(bodyPix.version);

  // use WASM
  await tf.setBackend("wasm");

  const net = await bodyPix.load();

  // output source
  const $destCanvas = document.querySelector("canvas");

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  VIDEO.srcObject = stream;

    // THESE LINES ARE REQUIRED!
    VIDEO.width = $destCanvas.width = VIDEO.videoWidth;
    VIDEO.height = $destCanvas.height = VIDEO.videoHeight;

    const destCtx = $destCanvas.getContext("2d");
    // $destCanvas.style.backgroundImage = "url(./img/about_03.jpg)";
    // $destCanvas.style.backgroundSize = "cover";

    // to remove background, need another canvas
    const $tempCanvas = document.createElement("canvas");
    $tempCanvas.width = VIDEO.videoWidth;
    $tempCanvas.height = VIDEO.videoHeight;
    const tempCtx = $tempCanvas.getContext("2d");

    (async function loop() {
      requestAnimationFrame(loop);

      // create mask on temp canvas
      const segmentation = await net.segmentPerson(VIDEO);
      const mask = bodyPix.toMask(segmentation);
      tempCtx.putImageData(mask, 0, 0);

      // draw original
      destCtx.drawImage(VIDEO, 0, 0, $destCanvas.width, $destCanvas.height);

      // then overwrap, masked area will be removed
      destCtx.save();
      destCtx.globalCompositeOperation = "destination-out";
      destCtx.drawImage($tempCanvas, 0, 0, $destCanvas.width, $destCanvas.height);
      destCtx.restore();
    })();


  document.querySelector("#teacher").onclick = async () => {
    DODON.play();
    // THESE LINES ARE REQUIRED!
    VIDEO.width = $destCanvas.width = VIDEO.videoWidth;
    VIDEO.height = $destCanvas.height = VIDEO.videoHeight;

    const destCtx = $destCanvas.getContext("2d");
    $destCanvas.style.backgroundImage = "url(./img/course_02.jpg)";
    $destCanvas.style.backgroundSize = "cover";

    // to remove background, need another canvas
    const $tempCanvas = document.createElement("canvas");
    $tempCanvas.width = VIDEO.videoWidth;
    $tempCanvas.height = VIDEO.videoHeight;
    const tempCtx = $tempCanvas.getContext("2d");

    (async function loop() {
      requestAnimationFrame(loop);

      // create mask on temp canvas
      const segmentation = await net.segmentPerson(VIDEO);
      const mask = bodyPix.toMask(segmentation);
      tempCtx.putImageData(mask, 0, 0);

      // draw original
      destCtx.drawImage(VIDEO, 0, 0, $destCanvas.width, $destCanvas.height);

      // then overwrap, masked area will be removed
      destCtx.save();
      destCtx.globalCompositeOperation = "destination-out";
      destCtx.drawImage($tempCanvas, 0, 0, $destCanvas.width, $destCanvas.height);
      destCtx.restore();
    })();
  };
  });


