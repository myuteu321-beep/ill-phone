/* =========================================================
   weverse.js  —  위버스 앱 화면
   ---------------------------------------------------------
   - 위버스 아이콘을 누르면 영상이 바로 재생돼요.
   - 앱을 닫거나 폰이 잠기면 영상이 멈추고, 다시 열면 이어서 재생돼요.
   - 아래 WEVERSE 에서 이름 / 글씨 / 영상 / 사진을 바꿀 수 있어요.
   (따옴표 "" 안의 글자만 바꾸세요. 쉼표 , 는 지우지 마세요.)
   ========================================================= */

(function () {
  "use strict";

  var WEVERSE = {
    name:    "ANDUS",                    // 이름
    title:   "엔젤 놀자",                 // 영상 아래 글씨
    video:   "video/weverse-live.mp4",   // 재생할 영상
    profile: "images/andus-profile.png", // 프로필 사진
    badge:   "images/verified.png"       // 이름 옆 공식 표시
  };

  var CSS =
    ".wv{position:absolute;inset:0;background:#0b0b0e;color:#fff;overflow:hidden;" +
      "font-family:-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;}" +
    ".wv *{box-sizing:border-box;}" +
    ".wv button{border:0;background:none;color:inherit;cursor:pointer;font-family:inherit;padding:0;}" +
    ".wv-top{padding-top:54px;}" +
    ".wv-player{position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden;}" +
    ".wv-player video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;}" +
    ".wv-tap{position:absolute;inset:0;z-index:2;}" +
    ".wv-big{position:absolute;left:50%;top:50%;z-index:3;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:50%;" +
      "background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;pointer-events:none;}" +
    ".wv-player.paused .wv-big{display:flex;}" +
    ".wv-big svg{width:28px;height:28px;fill:#fff;}" +
    ".wv-bar{position:absolute;left:0;right:0;bottom:0;z-index:4;display:flex;align-items:center;gap:10px;" +
      "padding:18px 12px 8px;background:linear-gradient(transparent,rgba(0,0,0,.7));}" +
    ".wv-time{font-size:11.5px;color:#e8e8ee;min-width:80px;font-variant-numeric:tabular-nums;}" +
    ".wv-seek{position:relative;flex:1;height:22px;display:flex;align-items:center;cursor:pointer;}" +
    ".wv-seek i{display:block;position:absolute;left:0;right:0;height:3px;border-radius:2px;background:rgba(255,255,255,.3);}" +
    ".wv-seek b{display:block;position:absolute;left:0;height:3px;border-radius:2px;background:#00e3c1;width:0;}" +
    ".wv-mute{width:30px;height:30px;display:flex;align-items:center;justify-content:center;}" +
    ".wv-mute svg{width:20px;height:20px;fill:#fff;}" +
    ".wv-info{padding:16px 16px 0;}" +
    ".wv-who{display:flex;align-items:center;gap:10px;}" +
    ".wv-av{width:44px;height:44px;border-radius:50%;object-fit:cover;background:#000;flex:none;border:1px solid #2a2a30;}" +
    ".wv-name{display:flex;align-items:center;gap:5px;font-size:16px;font-weight:700;letter-spacing:.2px;}" +
    ".wv-name img{width:17px;height:17px;display:block;}" +
    ".wv-title{margin:14px 0 0;font-size:19px;font-weight:700;line-height:1.4;word-break:keep-all;}";

  var ICON_PLAY  = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_VOL   = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-.9 7-4.5 7-8.8s-3-7.9-7-8.8z"/></svg>';
  var ICON_MUTE  = '<svg viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.5 2.5V12zM19 12c0 .9-.2 1.8-.5 2.6l1.5 1.5A9 9 0 0 0 21 12c0-4.3-3-7.9-7-8.8v2.1c2.9.9 5 3.5 5 6.7zM4.3 3L3 4.3 7.7 9H3v6h4l5 5v-6.7l4.3 4.3c-.7.5-1.4.9-2.3 1.1v2.1c1.4-.3 2.7-1 3.8-1.9L19.7 21 21 19.7 12 10.7 4.3 3zM12 4L9.9 6.1 12 8.2V4z"/></svg>';

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" + r : r);
  }

  function addStyle() {
    if (document.getElementById("wv-style")) return;
    var st = document.createElement("style");
    st.id = "wv-style";
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function build(win) {
    addStyle();

    var root = document.createElement("div");
    root.className = "wv";
    root.innerHTML =
      '<div class="wv-top">' +
        '<div class="wv-player paused">' +
          '<video playsinline preload="auto"></video>' +
          '<div class="wv-tap"></div>' +
          '<div class="wv-big">' + ICON_PLAY + '</div>' +
          '<div class="wv-bar">' +
            '<span class="wv-time">0:00 / 0:00</span>' +
            '<div class="wv-seek"><i></i><b></b></div>' +
            '<button type="button" class="wv-mute" aria-label="소리">' + ICON_VOL + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="wv-info">' +
        '<div class="wv-who">' +
          '<img class="wv-av" alt="">' +
          '<div class="wv-name"><span class="wv-nm"></span><img class="wv-badge" alt=""></div>' +
        '</div>' +
        '<p class="wv-title"></p>' +
      '</div>';
    win.appendChild(root);

    var player = root.querySelector(".wv-player");
    var video  = root.querySelector("video");
    var tap    = root.querySelector(".wv-tap");
    var timeEl = root.querySelector(".wv-time");
    var seek   = root.querySelector(".wv-seek");
    var fill   = root.querySelector(".wv-seek b");
    var muteBt = root.querySelector(".wv-mute");

    // 글씨는 textContent 로 넣어요 (특수문자가 있어도 안전)
    root.querySelector(".wv-nm").textContent = WEVERSE.name;
    root.querySelector(".wv-title").textContent = WEVERSE.title;
    root.querySelector(".wv-av").src = WEVERSE.profile;
    root.querySelector(".wv-badge").src = WEVERSE.badge;
    video.src = WEVERSE.video;

    function refresh() {
      var d = video.duration || 0, t = video.currentTime || 0;
      timeEl.textContent = fmt(t) + " / " + fmt(d);
      fill.style.width = (d ? (t / d) * 100 : 0) + "%";
    }

    function updateMuteIcon() {
      muteBt.innerHTML = video.muted ? ICON_MUTE : ICON_VOL;
    }

    video.addEventListener("timeupdate", refresh);
    video.addEventListener("loadedmetadata", refresh);
    video.addEventListener("play",  function () { player.classList.remove("paused"); });
    video.addEventListener("pause", function () { player.classList.add("paused"); });
    video.addEventListener("ended", function () { player.classList.add("paused"); });

    // 화면을 누르면 재생 / 일시정지
    tap.addEventListener("click", function () {
      if (video.paused) {
        if (video.ended) video.currentTime = 0;
        video.play();
      } else {
        video.pause();
      }
    });

    // 막대를 누르면 그 위치로 이동
    seek.addEventListener("click", function (e) {
      var r = seek.getBoundingClientRect();
      var ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      if (video.duration) video.currentTime = ratio * video.duration;
    });

    // 소리 켜기 / 끄기
    muteBt.addEventListener("click", function () {
      video.muted = !video.muted;
      updateMuteIcon();
    });

    // 앱이 닫히거나 폰이 잠기면 영상 멈춤
    new MutationObserver(function () {
      if (!win.classList.contains("open")) video.pause();
    }).observe(win, { attributes: true, attributeFilter: ["class"] });

    win._wvPlay = function () {
      if (video.ended) video.currentTime = 0;
      video.muted = false;
      updateMuteIcon();
      var p = video.play();
      if (p && p.catch) {
        // 소리 재생이 막히면 음소거로 먼저 재생 (소리 버튼으로 켜기)
        p.catch(function () {
          video.muted = true;
          updateMuteIcon();
          video.play().catch(function () {});
        });
      }
    };
  }

  Apps.register("weverse", {
    theme: "dark",
    build: build,
    onShow: function (win) { if (win._wvPlay) win._wvPlay(); }
  });

})();
