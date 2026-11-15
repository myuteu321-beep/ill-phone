/* =========================================================
   kakao.js  —  카카오톡 앱 동작
   내용(친구, 대화)은 data/kakao-data.js 에서 바꿔요. 이 파일은 고칠 일이 거의 없어요.
   ========================================================= */

(function () {
  "use strict";

  var D = window.KAKAO_DATA, Apps = window.Apps, Phone = window.Phone;
  var R, els = {}, tab = "friends", stack = [];

  var P = {
    friends: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/>',
    chat:    '<path d="M12 3C6.5 3 2 6.6 2 11c0 2.5 1.4 4.7 3.6 6.1L4.5 21l4.3-2.3c1 .2 2 .3 3.2.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/>',
    more:    '<circle cx="5" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="19" cy="12" r="1.7" fill="currentColor"/>',
    search:  '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
    back:    '<path d="M15 4l-8 8 8 8"/>',
    plus:    '<path d="M12 5v14M5 12h14"/>',
    menu:    '<path d="M4 7h16M4 12h16M4 17h16"/>',
    star:    '<path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"/>',
    send:    '<path d="M3 11l18-8-8 18-2-8z"/>',
    video:   '<rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="M15.5 10.5l6-3.5v10l-6-3.5z"/>',
    call:    '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
    gift:    '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 13h18M12 8c-3 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-2 3-5 3z"/>'
  };
  function ic(n, o) {
    o = o || {};
    return '<svg class="kk-ic" viewBox="0 0 24 24" fill="' + (o.fill || "none") + '" stroke="currentColor" stroke-width="' + (o.sw || 1.9) +
      '" stroke-linecap="round" stroke-linejoin="round">' + P[n] + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function person(id) { return id === "me" ? D.me : (D.friends[id] || { name: id, color: "#888" }); }
  /* 프로필 사진: 사진이 있으면 사진, 없으면 카카오톡 기본 프로필(회색 사람 모양) */
  var SILHOUETTE = '<svg viewBox="0 0 24 24" width="72%" height="72%" fill="#fff"><circle cx="12" cy="9" r="4"/><path d="M4.5 21c0-4.2 3.3-6.6 7.5-6.6s7.5 2.4 7.5 6.6z"/></svg>';
  function av(id, s, sq) {
    var u = person(id);
    var rad = sq ? "border-radius:" + Math.round(s * 0.38) + "px;" : "border-radius:50%;";
    var st = "width:" + s + "px;height:" + s + "px;" + rad;
    if (u.img) return '<span class="kk-av" style="' + st + "background-image:url('" + esc(u.img) + "')\"></span>";
    return '<span class="kk-av def" style="' + st + '">' + SILHOUETTE + "</span>";
  }
  /* 말풍선 하나만 다른 프로필 사진을 쓰고 싶을 때: av: { color: "#7b6cf0", emoji: "🦁" } (또는 img: "images/파일.jpg") */
  function altAv(a, s) {
    var st = "width:" + s + "px;height:" + s + "px;border-radius:" + Math.round(s * 0.38) + "px;";
    if (a.img) return '<span class="kk-av" style="' + st + "background-image:url('" + esc(a.img) + "')\"></span>";
    return '<span class="kk-av alt" style="' + st + "background:" + (a.color || "#888") + '">' + esc(a.emoji || "") + "</span>";
  }
  /* 답장 말풍선 위에 붙는 인용: rp: { to: "효기", text: "안 바빠요?" } → "효기에게 답장" */
  function rpHTML(m) {
    if (!m.rp) return "";
    return '<span class="kk-rp"><b>' + esc(m.rp.to) + "에게 답장</b><span>" + esc(m.rp.text) + "</span></span>";
  }
  /* 상대가 보낸 메시지인지 (사진은 from: "me" 가 아니면 상대가 보낸 것) */
  function isThem(m) { return !!m && (m.k === "them" || ((m.k === "photo" || m.k === "voice" || m.k === "call") && m.from !== "me")); }
  function isMine(m) { return !!m && (m.k === "me" || ((m.k === "photo" || m.k === "voice" || m.k === "call") && m.from === "me")); }
  /* 시계 (스토리 속 가짜 시간): "오후 11:08" <-> 분 단위 숫자 */
  function parseT(t) {
    var m = /(오전|오후)\s*(\d+):(\d+)/.exec(t || "");
    if (!m) return null;
    var h = parseInt(m[2], 10) % 12;
    if (m[1] === "오후") h += 12;
    return h * 60 + parseInt(m[3], 10);
  }
  function fmtT(n) {
    n = ((n % 1440) + 1440) % 1440;
    var h = Math.floor(n / 60), mi = n % 60;
    return (h < 12 ? "오전 " : "오후 ") + (h % 12 === 0 ? 12 : h % 12) + ":" + (mi < 10 ? "0" + mi : mi);
  }
  function nowTime() {
    var n = new Date(), h = n.getHours(), mi = n.getMinutes();
    return (h < 12 ? "오전 " : "오후 ") + (h % 12 === 0 ? 12 : h % 12) + ":" + (mi < 10 ? "0" + mi : mi);
  }
  function chatOf(f) { for (var i = 0; i < D.chats.length; i++) if (D.chats[i].f === f) return D.chats[i]; return null; }
  function lastMsg(c) {
    for (var i = c.msgs.length - 1; i >= 0; i--) if (c.msgs[i].k !== "day" && c.msgs[i].k !== "notice") return c.msgs[i];
    return null;
  }
  function total() { return D.chats.reduce(function (a, c) { return a + (c.unread || 0); }, 0); }

  /* 홈 화면 아이콘 / 탭의 빨간 숫자 */
  function badges() {
    var n = total();
    var txt = n > 999 ? "999+" : n;
    if (els.tabBadge) { els.tabBadge.textContent = txt; els.tabBadge.style.display = n ? "flex" : "none"; }
    var icon = document.querySelector('.app-ico[data-app="kakao"]');
    if (icon) {
      var b = icon.querySelector(".app-badge");
      if (!b) { b = document.createElement("i"); b.className = "app-badge"; icon.appendChild(b); }
      b.textContent = txt; b.style.display = n ? "flex" : "none";
    }
  }

  /* ---------- 뼈대 ---------- */
  function build(root) {
    R = root;
    R.classList.add("kk-app");
    R.innerHTML =
      '<div class="kk-panels">' +
        '<div class="kk-panel on" data-p="friends"></div>' +
        '<div class="kk-panel" data-p="chats"></div>' +
      "</div>" +
      '<div class="kk-nav">' +
        '<button data-t="friends" class="on">' + ic("friends", { fill: "currentColor", sw: 0 }) + "<span>친구</span></button>" +
        '<button data-t="chats">' + ic("chat", { fill: "currentColor", sw: 0 }) + '<span>채팅</span><i class="kk-badge" id="kk-tab-badge"></i></button>' +
      "</div>" +
      '<div class="kk-ovs"></div>';
    els.panels = { friends: R.querySelector('[data-p="friends"]'), chats: R.querySelector('[data-p="chats"]') };
    els.ovs = R.querySelector(".kk-ovs");
    els.tabBadge = R.querySelector("#kk-tab-badge");

    R.querySelector(".kk-nav").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-t]");
      if (!b) return;
      closeAll();
      showTab(b.getAttribute("data-t"));
    });
    R.addEventListener("click", onClick);
    new MutationObserver(function () { if (!R.classList.contains("open")) flushPending(); if (ft && !R.classList.contains("open")) endFacetalk(true); })
      .observe(R, { attributes: true, attributeFilter: ["class"] });
    renderFriends();
    renderChats();
    badges();
  }

  function showTab(t) {
    tab = t;
    els.panels.friends.classList.toggle("on", t === "friends");
    els.panels.chats.classList.toggle("on", t === "chats");
    var bs = R.querySelectorAll(".kk-nav button");
    for (var i = 0; i < bs.length; i++) bs[i].classList.toggle("on", bs[i].getAttribute("data-t") === t);
    if (t === "chats") renderChats();
    badges();
  }

  /* ---------- 위에 쌓이는 화면 ---------- */
  function push(html, cls) {
    var o = document.createElement("div");
    o.className = "kk-ov " + (cls || "");
    o.innerHTML = html;
    els.ovs.appendChild(o);
    void o.offsetWidth;
    o.classList.add("in");
    stack.push(o);
    var sc = o.querySelectorAll(".kk-scroll");
    for (var i = 0; i < sc.length; i++) Apps.dragScroll(sc[i]);
    return o;
  }
  function pop() {
    var o = stack.pop();
    if (!o) return;
    if (o.classList.contains("kk-room")) {         // 채팅방을 나가면 보류 중이던 알람이 떠요
      var rb = o.querySelector(".kk-chatbody"), rid = rb && rb.getAttribute("data-room");
      var rc = rid && D.chats.filter(function (x) { return x.id === rid; })[0];
      if (rc) leaveRoom(rc);
    }
    o.classList.remove("in");
    setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 300);
    if (!stack.length) { renderChats(); badges(); }
    updateTheme();
  }
  function closeAll() { while (stack.length) pop(); }

  /* 프로필 화면은 어두운 배경이라 상태바를 흰색으로 */
  function updateTheme() {
    if (Apps.current() !== "kakao") return;
    var top = stack[stack.length - 1];
    var dark = !!(top && top.classList.contains("kk-profile"));
    document.getElementById("phone").setAttribute("data-theme", dark ? "dark" : "light");
  }

  /* =======================================================
     친구 탭
  ======================================================= */
  function friendRow(id) {
    var f = person(id);
    return '<button class="kk-fr" data-a="profile" data-id="' + id + '">' + av(id, 44, true) +
      '<span class="kk-fr-t"><b>' + esc(f.name) + "</b></span>" +
      (f.status ? '<span class="kk-fr-s">' + esc(f.status) + "</span>" : "") + "</button>";
  }
  function renderFriends() {
    var favs = Object.keys(D.friends).filter(function (k) { return D.friends[k].fav; });
    var rest = D.order.filter(function (k) { return !D.friends[k].fav; });
    els.panels.friends.innerHTML =
      '<div class="kk-top"><div class="kk-top-in"><b>친구</b><div class="kk-top-r">' +
        '<button data-a="toast" data-m="친구 검색은 준비 중이에요">' + ic("search") + "</button>" +
        '<button data-a="toast" data-m="친구 추가는 준비 중이에요">' + ic("plus") + "</button>" +
        '<button data-a="toast" data-m="설정은 준비 중이에요">' + ic("menu") + "</button></div></div></div>" +
      '<div class="kk-scroll">' +
        '<button class="kk-me" data-a="profile" data-id="me">' + av("me", 56, true) +
          '<span class="kk-fr-t"><b>' + esc(D.me.name) + "</b><small>" + esc(D.me.status) + "</small></span></button>" +
        '<div class="kk-sec">즐겨찾기 <em>' + favs.length + "</em></div>" + favs.map(friendRow).join("") +
        '<div class="kk-sec">친구 <em>' + rest.length + "</em></div>" + rest.map(friendRow).join("") +
        '<div class="kk-endpad"></div></div>';
    Apps.dragScroll(els.panels.friends.querySelector(".kk-scroll"));
  }

  /* 친구 프로필 */
  function openProfile(id) {
    var f = person(id);
    var me = id === "me";
    var o = push(
      '<div class="kk-pf-bg"></div>' +
      '<button class="kk-pf-x" data-a="back">' + ic("plus", { sw: 2.2 }).replace('class="kk-ic"', 'class="kk-ic" style="transform:rotate(45deg)"') + "</button>" +
      '<div class="kk-pf-c">' + av(id, 104, true) + "<b>" + esc(f.name) + "</b><p>" + esc(f.status || "") + "</p></div>" +
      '<div class="kk-pf-b"><button data-a="chat" data-id="' + id + '">' + ic("chat", { fill: "#fff", sw: 0 }) + "<span>" + (me ? "나와의 채팅" : "1:1 채팅") + "</span></button>" +
      (me ? '<button data-a="toast" data-m="프로필 편집은 준비 중이에요">' + ic("menu") + "<span>프로필 편집</span></button>"
          : '<button data-a="toast" data-m="통화 기능은 준비 중이에요">' + ic("gift") + "<span>선물하기</span></button>") + "</div>",
      "kk-profile");
    updateTheme();
    return o;
  }

  /* =======================================================
     채팅 탭
  ======================================================= */
  function renderChats() {
    var list = D.chats.map(function (c) {
      var f = person(c.f), m = lastMsg(c);
      var prev = c.preview ? c.preview : !m ? "" : m.k === "photo" ? "사진" : m.k === "call" ? callTitle(m) : m.k === "voice" ? "음성메시지" : (m.k === "me" && m.sending ? "" : m.text);
      return '<button class="kk-ch" data-a="chat" data-id="' + c.f + '">' + av(c.f, 52, true) +
        '<span class="kk-ch-b"><b>' + esc(f.name) + '</b><span class="kk-ch-p">' + esc(prev) + "</span></span>" +
        '<span class="kk-ch-r"><small>' + esc(m ? m.time : "") + "</small>" +
        (c.unread ? '<i class="kk-cnt">' + (c.unread > 999 ? "999+" : c.unread) + "</i>" : "") + "</span></button>";
    }).join("");
    els.panels.chats.innerHTML =
      '<div class="kk-top"><div class="kk-top-in"><b>채팅</b><div class="kk-top-r">' +
        '<button data-a="toast" data-m="채팅 검색은 준비 중이에요">' + ic("search") + "</button>" +
        '<button data-a="toast" data-m="새 채팅은 준비 중이에요">' + ic("chat") + "</button>" +
        '<button data-a="toast" data-m="설정은 준비 중이에요">' + ic("menu") + "</button></div></div></div>" +
      '<div class="kk-scroll">' + (list || '<div class="kk-empty">채팅이 없어요</div>') + '<div class="kk-endpad"></div></div>';
    Apps.dragScroll(els.panels.chats.querySelector(".kk-scroll"));
  }

  /* =======================================================
     채팅방
  ======================================================= */
  function bubbleHTML(m, f, prev) {
    if (m.k === "day") return '<div class="kk-day"><span>' + esc(m.text) + "</span></div>";
    if (m.k === "notice") return '<div class="kk-notice">' + esc(m.text) + "</div>";
    var body = m.k === "photo"
      ? (m.img
          ? '<div class="kk-ph" style="background-image:url(\'' + esc(m.img) + '\');background-size:cover;background-position:center"></div>'
          : '<div class="kk-ph" style="background:linear-gradient(150deg,' + (m.c1 || "#8aa") + "," + (m.c2 || "#345") + ')">' + esc(m.text || "사진") + "</div>")
      : m.k === "voice" ? voiceHTML(m)
      : m.k === "call" ? callHTML(m)
      : '<div class="kk-bb' + (m.del ? " kk-del" : "") + '">' + rpHTML(m) + esc(m.text) + "</div>";
    if (isMine(m)) {
      return '<div class="kk-row me">' + '<span class="kk-meta">' + (m.read === false ? "<i>1</i>" : "") + esc(m.time || "") + "</span>" + body + "</div>";
    }
    // 같은 사람이 연속으로 보낸 메시지는 프로필/이름을 한 번만
    var first = !!m.np || !isThem(prev);                 // np: true → 이어진 대화가 아니라 새로 보낸 것처럼 프로필을 붙여요
    return '<div class="kk-row them' + (first ? " first" : "") + '">' +
      (first ? '<span class="kk-row-av">' + (m.av ? altAv(m.av, 40) : av(f, 40, true)) + "</span>" : '<span class="kk-row-av sp"></span>') +
      '<div class="kk-row-b">' + (first ? '<span class="kk-nm">' + esc(person(f).name) + "</span>" : "") +
      '<div class="kk-bw">' + body + '<span class="kk-meta">' + esc(m.time || "") + "</span></div></div></div>";
  }

  /* ---------- 보이스톡 / 페이스톡 기록 ----------
     { k:"call", from:"me"|"them", kind:"voice"|"video", state:"request", time }              → "보이스톡" (초록 아이콘)
     { k:"call", from:"me"|"them", kind:"voice"|"video", state:"end", dur:"03:02", time }     → "보이스톡 종료 03:02" (검은 아이콘) */
  function callTitle(m) {
    if (m.state) { var nm = m.kind === "video" ? "페이스톡" : "보이스톡"; return m.state === "end" ? nm + " 종료" : nm; }
    return m.text || "";
  }
  function callHTML(m) {
    var end = m.state ? m.state === "end" : !!m.sub;
    var sub = m.state ? (end && m.dur ? m.dur : "") : (m.sub || "");
    return '<div class="kk-bb kk-callb ' + (end ? "end" : "req") + '"><i>' + ic(m.kind === "video" ? "video" : "call", { fill: "currentColor", sw: 0 }) + "</i><span><b>" + esc(callTitle(m)) + "</b>" + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span></div>";
  }

  /* ---------- 음성 메시지 ---------- */
  var ICON_PLAY = '<svg class="kk-vi" viewBox="0 0 24 24"><path d="M6.5 3.5l14 8.5-14 8.5z"/></svg>';
  var ICON_PAUSE = '<svg class="kk-vi" viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" rx="1.2"/><rect x="14" y="4" width="5" height="16" rx="1.2"/></svg>';
  var vAudio = null, vEl = null;
  function fmtD(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ":" + (sec % 60 < 10 ? "0" : "") + (sec % 60); }
  function voiceHTML(m) {
    return '<div class="kk-bb kk-vc" data-a="voice" data-src="' + esc(m.src) + '" data-total="' + esc(m.dur || "0:00") + '">' +
      ICON_PLAY + '<span class="kk-vt">' + esc(m.dur || "0:00") + "</span></div>";
  }
  function vReset(el) {
    if (!el) return;
    el.classList.remove("on");
    var i = el.querySelector(".kk-vi"); if (i) i.outerHTML = ICON_PLAY;
    var t = el.querySelector(".kk-vt"); if (t) t.textContent = el.getAttribute("data-total") || "0:00";
  }
  function toggleVoice(el) {
    var src = el.getAttribute("data-src");
    if (vEl === el && vAudio && !vAudio.paused) { vAudio.pause(); vReset(el); return; }
    if (vAudio) { vAudio.pause(); vReset(vEl); }
    var a = new Audio(src);
    vAudio = a; vEl = el;
    el.classList.add("on");
    var i = el.querySelector(".kk-vi"); if (i) i.outerHTML = ICON_PAUSE;
    a.addEventListener("timeupdate", function () { if (vEl === el) el.querySelector(".kk-vt").textContent = fmtD(a.currentTime); });
    a.addEventListener("ended", function () { vReset(el); });
    a.addEventListener("error", function () { vReset(el); Phone.toast("음성 파일을 찾을 수 없어요"); });
    var p = a.play();
    if (p && p.catch) p.catch(function () { vReset(el); });
  }
  /* 파일의 진짜 길이를 읽어서 말풍선 시간에 맞춰요 */
  function hydrateVoices(root) {
    if (!root) return;
    var list = root.querySelectorAll(".kk-vc:not([data-h])");
    Array.prototype.forEach.call(list, function (el) {
      el.setAttribute("data-h", "1");
      var a = new Audio();
      a.preload = "metadata";
      a.addEventListener("loadedmetadata", function () {
        if (!isFinite(a.duration) || a.duration <= 0) return;
        var d = fmtD(a.duration);
        el.setAttribute("data-total", d);
        if (!el.classList.contains("on")) el.querySelector(".kk-vt").textContent = d;
      });
      a.src = el.getAttribute("data-src");
    });
  }

  function bodyHTML(c, f, unread) {
    var html = "", prev = null, divAt = -1;
    var themIdx = [];                              // 안 읽은 메시지 시작 위치 계산
    c.msgs.forEach(function (m, i) { if (m.k === "them") themIdx.push(i); });
    if (c.unreadFrom != null) divAt = c.unreadFrom;
    else if (unread > 0 && themIdx.length >= unread) divAt = themIdx[themIdx.length - unread];
    c.msgs.forEach(function (m, i) {
      if (i === divAt) html += '<div class="kk-unread"><span>여기까지 읽으셨습니다</span></div>';
      html += bubbleHTML(m, f, prev);
      prev = (m.k !== "day" && m.k !== "notice") ? m : null;
    });
    return html;
  }

  function openChat(f) {
    var c = chatOf(f);
    if (!c) {                                    // 대화가 없는 친구는 빈 채팅방을 새로 만들어요
      c = { id: "c_" + f, f: f, unread: 0, msgs: [], _empty: true };
      D.chats.unshift(c);
    }
    c.preview = null;                            // 목록의 안내 문구는 방에 들어가면 사라지고 실제 마지막 채팅이 보여요
    flushQueued(c);                              // 알람 뒤 나머지 대화가 한꺼번에 올라와요
    var unread = c.unread || 0;
    var html = bodyHTML(c, f, unread);
    var jump = c.unreadFrom != null;
    var name = f === "me" ? D.me.name : person(f).name;
    var o = push(
      '<div class="kk-ch-h"><button class="kk-back" data-a="back">' + ic("back", { sw: 2.2 }) + "</button>" +
        '<b>' + esc(name) + (f === "me" ? "" : "") + "</b>" +
        '<div class="kk-top-r">' + (c.facetalk ? '<button data-a="facetalk" data-id="' + c.id + '" class="kk-ft-btn">' + ic("video", { fill: "currentColor", sw: 0 }) + "</button>" : "") + '<button data-a="toast" data-m="검색은 준비 중이에요">' + ic("search") + '</button><button data-a="toast" data-m="메뉴는 준비 중이에요">' + ic("menu") + "</button></div></div>" +
      '<div class="kk-scroll kk-chatbody" data-room="' + c.id + '">' + (html || '<div class="kk-empty light">대화를 시작해 보세요</div>') + "</div>" +
      '<div class="kk-in"><button data-a="toast" data-m="첨부는 준비 중이에요">' + ic("plus", { sw: 2.2 }) + "</button>" +
      '<input type="text" placeholder="메시지 입력" data-in="' + c.id + '">' +
      '<button class="kk-send" data-a="send" data-id="' + c.id + '">' + ic("send", { fill: "currentColor", sw: 0 }) + "</button></div>",
      "kk-room");
    var body = o.querySelector(".kk-chatbody");
    hydrateVoices(body);
    setTimeout(function () {
      var dv = jump && body.querySelector(".kk-unread");
      if (dv) {                                  // 알람으로 온 대화는 안 읽은 줄부터 읽어요
        var sc = body.getBoundingClientRect().height / body.offsetHeight || 1;
        body.scrollTop += (dv.getBoundingClientRect().top - body.getBoundingClientRect().top) / sc - 70;
      } else body.scrollTop = body.scrollHeight;
    }, 320);
    var inp = o.querySelector("input");
    inp.addEventListener("input", function () { o.querySelector(".kk-send").classList.toggle("on", !!inp.value.trim()); });
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); send(o.querySelector(".kk-send")); }
    });
    setupFlow(o, c);
    watchEnd(o, c);
    startStream(c);
    // 읽음 처리 (목록의 숫자는 방에서 나올 때 사라져요)
    c.unread = 0;
    c.unreadFrom = null;
    badges();
    return o;
  }


  /* =======================================================
     페이스톡 (재환 채팅방)
     채팅방 위 카메라 아이콘 → 3초 뒤 영상 재생 → 끝나거나 끊으면 뒤의 대화(later)가 나타나요
  ======================================================= */
  var ft = null;
  function startFacetalk(room, c) {
    if (ft || !c.facetalk) return;
    var cfg = c.facetalk, nm = person(c.f).name;
    var el = document.createElement("div");
    el.className = "kk-ft ring";
    el.innerHTML =
      '<video class="kk-ft-v" playsinline webkit-playsinline preload="auto"></video><div class="kk-ft-shade"></div>' +
      '<div class="kk-ft-ring"><span class="kk-ft-av">' + av(c.f, 112, true) + "</span><b>" + esc(nm) + '</b><span class="kk-ft-st">페이스톡 연결 중<i>.</i><i>.</i><i>.</i></span></div>' +
      '<div class="kk-ft-top"><b>' + esc(nm) + "</b><span>00:00</span></div>" +
      '<div class="kk-ft-bar"><button class="kk-ft-end" data-a="ftend">' + ic("call", { fill: "#fff", sw: 0 }) + "<span>종료</span></button></div>" +
      '<div class="kk-ft-fin">통화 종료</div>' +
      '<button class="kk-ft-tap" data-a="fttap">화면을 눌러 통화 연결</button>';
    room.appendChild(el);
    var v = el.querySelector("video");
    ft = { c: c, room: room, el: el, v: v, live: false, timer: null };
    document.getElementById("phone").setAttribute("data-theme", "dark");
    v.src = cfg.video;
    v.volume = 0;                                   // 누른 순간 재생을 한 번 풀어 둬야 소리와 함께 자동 재생돼요
    var p = v.play();
    var me = ft;
    if (p && p.then) p.then(function () { if (ft === me && !me.live) { v.pause(); v.currentTime = 0; } v.volume = 1; }).catch(function () { v.volume = 1; });
    v.addEventListener("timeupdate", function () {
      if (ft !== me || !me.live) return;
      var t = Math.floor(v.currentTime), m = Math.floor(t / 60), sc = t % 60;
      el.querySelector(".kk-ft-top span").textContent = (m < 10 ? "0" : "") + m + ":" + (sc < 10 ? "0" : "") + sc;
    });
    v.addEventListener("ended", function () { if (ft === me) endFacetalk(); });
    v.addEventListener("error", function () { if (ft === me) { endFacetalk(true); Phone.toast("영상 파일을 찾을 수 없어요 (" + cfg.video + ")"); } });
    me.timer = setTimeout(function () {
      if (ft !== me) return;
      me.live = true;
      el.classList.remove("ring"); el.classList.add("live");
      v.currentTime = 0; v.volume = 1; v.muted = false;
      var q = v.play();
      if (q && q.catch) q.catch(function () { el.classList.add("needtap"); });
    }, cfg.ringMs || 3000);
  }
  function endFacetalk(instant) {                    // 영상이 끝나도, 중간에 끊어도 뒤의 대화가 나타나요
    if (!ft) return;
    var me = ft; ft = null;
    clearTimeout(me.timer);
    try { me.v.pause(); } catch (e) {}
    function done() {
      if (me.el.parentNode) me.el.parentNode.removeChild(me.el);
      me.v.removeAttribute("src"); try { me.v.load(); } catch (e) {}
      updateTheme();
      revealLater(me.c);
    }
    if (instant) { done(); return; }
    me.el.classList.add("ending");
    setTimeout(done, 900);
  }
  function revealLater(c) {
    if (!c.later || !c.later.length) return;
    var rest = c.later; c.later = null;
    var body = roomBody(c);
    var html = "", oldCount = body ? body.children.length : 0;
    rest.forEach(function (m) {
      var last = c.msgs[c.msgs.length - 1];
      var prev = (last && last.k !== "day" && last.k !== "notice") ? last : null;
      c.msgs.push(m);
      html += bubbleHTML(m, c.f, prev);
    });
    if (!body) return;
    body.insertAdjacentHTML("beforeend", html);
    activateFlow(c);                                           // 이제부터 선택지가 떠요
    var anchor = body.children[Math.max(0, oldCount - 1)];     // 페이스톡 안내 문구가 위쪽에 보이고, 그 바로 아래부터 이어져요
    if (anchor) {
      var sc = body.getBoundingClientRect().height / body.offsetHeight || 1;
      body.scrollTop += (anchor.getBoundingClientRect().top - body.getBoundingClientRect().top) / sc - 90;
    }
  }

  /* 말풍선 / 페이스톡 스타일 */
  (function () {
    var st = document.createElement("style");
    st.textContent =
      ".kk-bb.kk-del { background: #eceef2 !important; color: #8a8f98 !important; }" +
      ".kk-bb.kk-callb { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 128px; padding: 8px 12px; box-sizing: border-box; }" +
      ".kk-row .kk-bb.kk-callb { background: #fff !important; color: #191919 !important; border-radius: 12px !important; max-width: none !important; }" +
      ".kk-callb i { display: flex; align-items: center; justify-content: center; flex: none; }" +
      ".kk-callb i .kk-ic { width: 17px; height: 17px; }" +
      ".kk-callb.req i { color: #2fb800; } .kk-callb.end i { color: #1a1a1a; }" +
      ".kk-callb span { display: flex; flex-direction: column; gap: 1px; text-align: right; line-height: 1.25; }" +
      ".kk-callb b { font-size: 13px; font-weight: 500; } .kk-callb small { font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; }" +
      ".kk-ft { position: absolute; inset: 0; z-index: 12; background: #000; color: #fff; overflow: hidden; }" +
      ".kk-ft-v { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: #000; opacity: 0; transition: opacity .5s; }" +
      ".kk-ft.live .kk-ft-v { opacity: 1; }" +
      ".kk-ft-shade { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .4s; background: linear-gradient(180deg, rgba(0,0,0,.5), transparent 22%, transparent 70%, rgba(0,0,0,.55)); }" +
      ".kk-ft.live .kk-ft-shade { opacity: 1; }" +
      ".kk-ft-ring { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; gap: 14px; padding-top: 190px; box-sizing: border-box; background: linear-gradient(170deg, #4a5062, #14161c); transition: opacity .5s; }" +
      ".kk-ft.live .kk-ft-ring { opacity: 0; pointer-events: none; }" +
      ".kk-ft-ring b { font-size: 30px; font-weight: 700; margin-top: 8px; }" +
      ".kk-ft-st { font-size: 16px; color: rgba(255,255,255,.75); }" +
      ".kk-ft-st i { font-style: normal; animation: kkFtDot 1.2s infinite; opacity: .2; } .kk-ft-st i:nth-child(2) { animation-delay: .2s; } .kk-ft-st i:nth-child(3) { animation-delay: .4s; }" +
      "@keyframes kkFtDot { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }" +
      ".kk-ft-top { position: absolute; left: 18px; top: 64px; display: none; flex-direction: column; gap: 2px; text-shadow: 0 1px 6px rgba(0,0,0,.5); }" +
      ".kk-ft.live .kk-ft-top { display: flex; } .kk-ft-top b { font-size: 20px; font-weight: 700; } .kk-ft-top span { font-size: 14px; color: rgba(255,255,255,.85); font-variant-numeric: tabular-nums; }" +
      ".kk-ft-bar { position: absolute; left: 0; right: 0; bottom: 46px; display: flex; justify-content: center; }" +
      ".kk-ft-end { display: flex; flex-direction: column; align-items: center; gap: 7px; color: #fff; font-size: 11.5px; }" +
      ".kk-ft-end .kk-ic { width: 60px; height: 60px; padding: 16px; box-sizing: border-box; border-radius: 50%; background: #ff3b30; transform: rotate(135deg); }" +
      ".kk-ft-fin { position: absolute; inset: 0; display: none; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; background: rgba(0,0,0,.55); }" +
      ".kk-ft.ending .kk-ft-fin { display: flex; animation: kkFade .4s ease; } .kk-ft.ending .kk-ft-bar, .kk-ft.ending .kk-ft-top { opacity: 0; }" +
      ".kk-ft-tap { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: none; padding: 14px 22px; border-radius: 26px; background: rgba(255,255,255,.92); color: #111; font-weight: 700; font-size: 15px; z-index: 5; }" +
      ".kk-ft.needtap .kk-ft-tap { display: block; }";
    document.head.appendChild(st);
  })();

  /* =======================================================
     선택지 대화 (지효 채팅방)
     내용은 data/kakao-data.js 의 choiceFlow 에서 바꿔요.
  ======================================================= */
  var flow = {};   // 친구id → { node: 지금 보여줄 선택지, busy: 답장 오는 중 }
  function flowOf(f) {
    if (!D.choiceFlow || !D.choiceFlow[f]) return null;
    var cc = chatOf(f);
    if (cc && cc.later && cc.later.length) return null;   // 페이스톡 뒤 대화가 채워지기 전에는 평소처럼 타이핑
    if (!flow[f]) flow[f] = { node: typeof D.choiceFlow[f] === "string" ? N(D.choiceFlow[f]) : D.choiceFlow[f], busy: false };
    return flow[f];
  }
  function roomBody(c) { return R ? R.querySelector('[data-room="' + c.id + '"]') : null; }

  function setupFlow(o, c) {
    var st = flowOf(c.f);
    if (!st || !st.node) return;                  // 선택지가 없거나 모두 끝났으면 평소처럼 타이핑
    if (!st.marks && c.f !== (D.story && D.story.chat)) {   // 재환 방: 되돌아올 지점과 시간 기록
      var lm = lastMsg(c);
      st.perMsg = true; st.lastSp = "them";
      st.clock = lm ? parseT(lm.time) : null;
      st.marks = {};
      st.marks[st.node.name] = { len: c.msgs.length, clock: st.clock };
    }
    var inp = o.querySelector("input");
    inp.readOnly = true;                           // 키보드 대신 선택지가 뜨게
    inp.setAttribute("inputmode", "none");
    var ov = document.createElement("div");
    ov.className = "kk-choice";
    ov.setAttribute("data-a", "closechoice");
    o.appendChild(ov);
    inp.addEventListener("click", function () { openChoices(o, c); });
    if (st.node.auto) setTimeout(function () { openChoices(o, c, true); }, 600);   // 저절로 뜨는 선택지
  }

  /* 스토리 노드 이름 -> 노드 (D.story.nodes) */
  function N(n) {
    if (!n) return null;
    if (typeof n === "object") return n;
    var S = D.story;
    return (S && S.nodes && S.nodes[n]) || null;
  }
  (function () {
    var S = D.story;
    if (S && S.nodes) Object.keys(S.nodes).forEach(function (k) { S.nodes[k].name = k; });
  })();
  function unlock(room) {
    var inp = room && room.querySelector("input");
    if (inp) { inp.readOnly = false; inp.removeAttribute("inputmode"); }
  }

  function openChoices(o, c, fromAuto) {
    var st = flowOf(c.f);
    if (!st || !st.node || st.busy) return;
    var ov = o.querySelector(".kk-choice");
    if (!ov) return;
    function pillHTML(ch, i) {
      return '<button class="kk-pill' + (ch.final ? " end" : "") + '" data-a="pick" data-i="' + i + '" data-id="' + c.id + '">' + esc(ch.label) + "</button>";
    }
    // HAPPY / TRUE 엔딩을 둘 다 본 뒤 입력창을 누르면:
    // 지지직 효과와 함께 "그래서 우리 어떻게 하길 원해요?" 로 되돌아가고,
    // 새 선택지 두 개(위) + 처음 선택지 두 개(아래) = 선택지 4개가 떠요
    var extra = N("newChoose"), first = N("choose");
    if (!fromAuto && extra && first && st.node.name === "again" && !st.node.combined && st.seen && st.seen["true"] && st.seen.happy) {
      var n = extra.choices.length;
      st.busy = true;
      closeChoices(o);
      bump(o, 1800); noise();
      setTimeout(function () {                       // 지지직하는 동안 대화가 되돌아가요
        c.msgs.length = st.rewindLen;
        st.clock = st.rewindClock; st.lastSp = "them";
        if (window.KakaoStory) window.KakaoStory.dialReady = false;
        var body = roomBody(c);
        if (body) { body.innerHTML = bodyHTML(c, c.f, 0); hydrateVoices(body); body.scrollTop = body.scrollHeight; }
        st.node = { name: "choose", combined: true, choices: extra.choices.concat(first.choices) };
        ov.innerHTML = first.choices.map(function (ch, i) { return pillHTML(ch, i + n); }).join("");
        ov.classList.add("on");
        setTimeout(function () {                     // 새 선택지가 위에 지지직 하며 나타나요
          var CH = "▓▒░#@%&*?!/ㅁㅂㅅㅇㅈㅊ지직";
          var added = [];
          for (var k = n - 1; k >= 0; k--) {
            ov.insertAdjacentHTML("afterbegin", pillHTML(extra.choices[k], k));
            added.unshift(ov.firstChild);
          }
          added.forEach(function (b) { b.classList.add("gl"); });
          var t0 = Date.now(), dur = 1500;
          var iv = setInterval(function () {
            var p = Math.min(1, (Date.now() - t0) / dur);
            added.forEach(function (b, i) {
              var tgt = extra.choices[i].label, m = Math.floor(tgt.length * p), txt = tgt.slice(0, m);
              for (var j = m; j < tgt.length; j++) txt += tgt.charAt(j) === " " ? " " : CH.charAt(Math.floor(Math.random() * CH.length));
              b.textContent = txt;
            });
            if (p >= 1) {
              clearInterval(iv);
              added.forEach(function (b) { b.classList.remove("gl"); });
              st.busy = false;
            }
          }, 60);
        }, 400);
      }, 700);
      return;
    }
    ov.innerHTML = st.node.choices.map(pillHTML).join("");
    ov.classList.add("on");
  }
  function closeChoices(o) {
    var ov = o && o.querySelector(".kk-choice");
    if (ov) ov.classList.remove("on");
  }

  function addMsg(c, m) {
    var last = c.msgs[c.msgs.length - 1];
    var prev = (last && last.k !== "day" && last.k !== "notice") ? last : null;
    c.msgs.push(m);
    D.chats.splice(D.chats.indexOf(c), 1);
    D.chats.unshift(c);
    var body = roomBody(c);
    if (!body) return;                             // 방을 나갔으면 데이터에만 저장돼요
    var empty = body.querySelector(".kk-empty"); if (empty) empty.remove();
    var ty = body.querySelector(".kk-typing"); if (ty) ty.remove();
    body.insertAdjacentHTML("beforeend", bubbleHTML(m, c.f, prev));
    hydrateVoices(body);
    body.scrollTop = body.scrollHeight;
  }
  function showTyping(c) {
    var body = roomBody(c);
    if (!body || body.querySelector(".kk-typing")) return;
    var last = c.msgs[c.msgs.length - 1];
    var first = !(last && last.k !== "day" && last.k !== "notice" && isThem(last));
    body.insertAdjacentHTML("beforeend",
      '<div class="kk-row them kk-typing' + (first ? " first" : "") + '">' +
      (first ? '<span class="kk-row-av">' + av(c.f, 40, true) + "</span>" : '<span class="kk-row-av sp"></span>') +
      '<div class="kk-row-b"><div class="kk-bb kk-dots"><i></i><i></i><i></i></div></div></div>');
    body.scrollTop = body.scrollHeight;
  }
  function hideTyping(c) {
    var body = roomBody(c);
    var ty = body && body.querySelector(".kk-typing");
    if (ty) ty.remove();
  }

  /* 말풍선에 찍을 시간: item.time 이 있으면 그 시간, 없으면 말하는 사람이 바뀔 때마다 1분씩 */
  function stamp(st, item, sp) {
    if (item.time) st.clock = parseT(item.time);
    else if (st.perMsg && st.clock != null) { st.n = (st.n || 0) + 1; st.clock += [1, 2, 1, 1, 2][st.n % 5]; }   // 재환 방: 말풍선마다 1~2분씩
    else if (st.clock != null && st.lastSp && st.lastSp !== sp) st.clock += 1;
    st.lastSp = sp;
    return st.clock != null ? fmtT(st.clock) : nowTime();
  }

  /* ---------- 엔딩 문구 / 지지직 효과 ---------- */
  function showEnding(room, e, done) {
    var d = document.createElement("div");
    d.className = "kk-ending" + (e.fx ? " fx-" + e.fx : "");
    d.style.setProperty("--ec", e.color || "#fff");
    d.innerHTML = "<b>" + esc(e.title) + "</b>" + (e.sub ? "<span>" + esc(e.sub) + "</span>" : "");
    room.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); done(); }, 5700);
  }
  function noise() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      var ctx = new AC(), len = Math.floor(ctx.sampleRate * 0.7), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < 0.5 ? 1 : 0.25) * (1 - i / len);
      var src = ctx.createBufferSource(); src.buffer = buf;
      var g = ctx.createGain(); g.gain.value = 0.22;
      src.connect(g); g.connect(ctx.destination); src.start();
      setTimeout(function () { try { ctx.close(); } catch (e) {} }, 1000);
    } catch (e) {}
  }
  function bump(o, ms) {
    o.classList.add("kk-glitching");
    setTimeout(function () { o.classList.remove("kk-glitching"); }, ms);
  }
  /* 선택지 글자가 지지직거리다가 새 글자로 바뀌어요 */
  function glitchSwap(o, c, st, node) {
    var ov = o.querySelector(".kk-choice");
    if (!ov || !ov.classList.contains("on")) { st.node = node; return; }
    st.busy = true;
    bump(o, 800); noise();
    var pills = ov.querySelectorAll(".kk-pill");
    var CH = "▓▒░#@%&*?!/ㅁㅂㅅㅇㅈㅊ지직";
    var t0 = Date.now(), dur = 1500;
    for (var k = 0; k < pills.length; k++) pills[k].classList.add("gl");
    var iv = setInterval(function () {
      var p = Math.min(1, (Date.now() - t0) / dur);
      for (var i = 0; i < pills.length; i++) {
        var tgt = node.choices[i] ? node.choices[i].label : "";
        var n = Math.floor(tgt.length * p), txt = tgt.slice(0, n);
        for (var j = n; j < tgt.length; j++) txt += tgt.charAt(j) === " " ? " " : CH.charAt(Math.floor(Math.random() * CH.length));
        pills[i].textContent = txt;
      }
      if (p >= 1) {
        clearInterval(iv);
        for (var m = 0; m < pills.length; m++) pills[m].classList.remove("gl");
        st.node = node; st.busy = false;
      }
    }, 60);
  }
  /* 선택지 앞의 순간으로 되돌아가요 */
  function rewind(o, c, st, ch) {
    var glitch = ch.rewind === "glitch";
    st.busy = true;
    closeChoices(o);
    if (glitch) { bump(o, 1000); noise(); }
    setTimeout(function () {
      var mk = ch.to && st.marks && st.marks[ch.to];
      c.msgs.length = mk ? mk.len : st.rewindLen;
      st.clock = mk ? mk.clock : st.rewindClock; st.lastSp = "them";
      c.unreadFrom = null; c.queued = null;
      if (!ch.to && window.KakaoStory) window.KakaoStory.dialReady = false;
      var body = roomBody(c);
      if (body) { body.innerHTML = bodyHTML(c, c.f, 0); hydrateVoices(body); body.scrollTop = body.scrollHeight; }
      st.node = N(ch.to || "choose");
      st.busy = false;
      setTimeout(function () {
        openChoices(o, c, true);
        if (glitch) setTimeout(function () { glitchSwap(o, c, st, N("newChoose")); }, 1300);
      }, glitch ? 500 : 700);
    }, glitch ? 900 : 350);
  }

  /* =======================================================
     재환 채팅방: 변명한다 → 방을 나가면 카톡 알람 3개 → 들어오면 대화가 다 올라와 있고,
     맨 아래까지 읽으면 엔딩 문구가 떠요
  ======================================================= */
  function appendMsgs(c, arr, keep) {
    var body = roomBody(c), html = "";
    var nearEnd = !body || body.scrollTop + body.clientHeight >= body.scrollHeight - 90;
    arr.forEach(function (m) {
      var last = c.msgs[c.msgs.length - 1];
      var prev = (last && last.k !== "day" && last.k !== "notice") ? last : null;
      c.msgs.push(m);
      html += bubbleHTML(m, c.f, prev);
    });
    if (!body) return;
    var empty = body.querySelector(".kk-empty"); if (empty) empty.remove();
    body.insertAdjacentHTML("beforeend", html);
    if (!keep || nearEnd) body.scrollTop = body.scrollHeight;
  }
  /* 방에 들어오면: 알람으로 본 3개 아래에 "여기까지 읽으셨습니다" 줄이 뜨고,
     바로 아래 2개(preload)가 올라와 있어요. 나머지는 몇 초씩 간격을 두고 한 줄씩 올라와요 */
  function flushQueued(c) {
    if (!c.queued || !c.queued.length) { c.queued = null; return; }
    var q = c.queued; c.queued = null;
    var n = c.preload != null ? c.preload : 2;
    var pre = q.slice(0, n), rest = q.slice(n);
    if (!roomBody(c) && pre.length) c.unreadFrom = c.msgs.length;   // 알람으로 본 대화 아래부터가 안 읽은 대화
    appendMsgs(c, pre);
    c.stream = rest.length ? rest : null;
    if (!c.stream && flow[c.f]) flow[c.f].armReady = true;
  }
  function startStream(c) {
    if (!c.stream || c.streaming) return;
    var st = flow[c.f];
    c.streaming = true;
    function wait(m) { return Math.min(4300, 1400 + String(m.text || "").length * 95); }   // 글자 수에 맞춰 1.5~4초
    function end() { c.stream = null; c.streaming = false; if (st) st.armReady = true; }
    function next() {
      if (!c.stream || !c.stream.length) { end(); return; }
      if (!roomBody(c)) { setTimeout(next, 700); return; }         // 방을 나가 있으면 들어올 때까지 기다려요
      var m = c.stream.shift();
      appendMsgs(c, [m], true);
      if (c.stream.length) setTimeout(next, wait(c.stream[0])); else end();
    }
    setTimeout(next, 2000);
  }
  function gotoRoom(f) {                           // 알람을 누르면 그 채팅방으로 들어가요
    var c = chatOf(f);
    if (!c) return;
    function enter() {
      var top = stack[stack.length - 1], b = top && top.querySelector(".kk-chatbody");
      if (b && b.getAttribute("data-room") === c.id) return;       // 이미 그 방이에요
      openChat(f);
    }
    if (Apps.current() === "kakao") { enter(); return; }
    if (window.Phone && Phone.state === "home") { Apps.open("kakao"); setTimeout(enter, 520); }
  }
  function notify(f, text) {                       // 화면 위에서 내려오는 카톡 알람
    var ph = document.getElementById("phone");
    if (!ph) return;
    var old = ph.querySelector(".kk-noti");
    if (old) { clearTimeout(old._t); old.remove(); }
    var d = document.createElement("div");
    d.className = "kk-noti";
    d.innerHTML = av(f, 38, true) + '<span class="kk-noti-t"><small>카카오톡 · 지금</small><b>' + esc(person(f).name) + "</b><em>" + esc(text) + "</em></span>";
    d.addEventListener("click", function () { clearTimeout(d._t); d.remove(); gotoRoom(f); });
    ph.appendChild(d);
    void d.offsetWidth;
    d.classList.add("in");
    d._t = setTimeout(function () {
      d.classList.remove("in");
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 400);
    }, 3600);
  }
  function triggerOffline(c) {
    var st = flow[c.f], P = st && st.pending;
    if (!P) return;
    st.pending = null;
    var off = P.ch.offline, block = [];
    off.msgs.forEach(function (it) {
      var sp = it.me != null ? "me" : "them";
      block.push({ k: sp, text: it.me != null ? it.me : it.them, time: stamp(st, it, sp) });
    });
    st.armEnding = { run: P.run };
    st.armReady = false;
    var n = Math.min(off.notify || 3, block.length), i = 0;
    function alarm() {
      var m = block[i], open = !!roomBody(c);
      appendMsgs(c, [m]);
      if (!open) c.unread = (c.unread || 0) + 1;
      D.chats.splice(D.chats.indexOf(c), 1); D.chats.unshift(c);
      if (els.panels) renderChats();
      badges();
      notify(c.f, m.text);
      i++;
      if (i < n) setTimeout(alarm, off.gap || 5000);
      else {
        c.queued = block.slice(n);                 // 나머지는 채팅방에 들어가면 올라와요
        c.preload = off.preload != null ? off.preload : 2;
        if (!c.queued.length) { c.queued = null; st.armReady = true; }
        else if (roomBody(c)) {
          flushQueued(c); startStream(c);
          var rm = roomBody(c).closest(".kk-room"); if (rm) watchEnd(rm, c);
        }
      }
    }
    setTimeout(alarm, off.first || 3000);
  }
  function leaveRoom(c) { var st = flow[c.f]; if (st && st.pending) triggerOffline(c); }
  /* 카톡 앱을 홈으로 나가면 열려 있던 채팅방 화면은 닫아 둬요.
     (그대로 두면 안 보이는 방에서 대화가 혼자 올라와 버리고, 돌아와도 엔딩 준비가 안 돼서 나갔다 들어와야 했어요) */
  function dropRoom(c) {
    for (var i = stack.length - 1; i >= 0; i--) {
      var o = stack[i], b = o.querySelector && o.querySelector(".kk-chatbody");
      if (b && b.getAttribute("data-room") === c.id) { stack.splice(i, 1); if (o.parentNode) o.parentNode.removeChild(o); }
    }
    if (!stack.length) { renderChats(); badges(); }
  }
  function flushPending() {
    Object.keys(flow).forEach(function (f) {
      var c = chatOf(f);
      if (c && flow[f].pending) { dropRoom(c); triggerOffline(c); }
    });
  }
  function watchEnd(o, c) {                        // 맨 아래까지 읽으면 엔딩 문구
    var st = flow[c.f];
    if (!st || !st.armEnding) return;
    var body = o.querySelector(".kk-chatbody");
    var iv = setInterval(function () {
      if (!o.parentNode || !st.armEnding) { clearInterval(iv); return; }
      if (!st.armReady || stack[stack.length - 1] !== o) return;
      body.scrollTop = body.scrollHeight;             // 마지막 줄까지 올라오면 스크롤을 직접 안 내려도 바로 엔딩
      clearInterval(iv);
      var a = st.armEnding; st.armEnding = null;
      a.run(700);
    }, 200);
  }
  function activateFlow(c) {                       // 페이스톡 뒤 대화가 채워지면 열려 있는 방에서도 선택지를 켜요
    var body = roomBody(c), room = body && body.closest(".kk-room");
    if (room && !room.querySelector(".kk-choice")) setupFlow(room, c);
  }
  (function () {
    var s = document.createElement("style");
    s.textContent =
      ".kk-noti { position: absolute; left: 10px; right: 10px; top: 48px; z-index: 500; display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 20px; background: rgba(246,246,248,.96); color: #111; box-shadow: 0 8px 28px rgba(0,0,0,.28); transform: translateY(-170%); opacity: 0; transition: transform .38s cubic-bezier(.2,.9,.3,1), opacity .3s; cursor: pointer; }" +
      ".kk-noti.in { transform: none; opacity: 1; }" +
      ".kk-noti .kk-av { display: block; flex: none; background-size: cover; background-position: center; }" +
      ".kk-noti .kk-av.def { display: flex; align-items: center; justify-content: center; background: #b9bec8; }" +
      ".kk-noti-t { display: flex; flex-direction: column; min-width: 0; gap: 1px; text-align: left; }" +
      ".kk-noti-t small { font-size: 11px; color: #8a8f98; } .kk-noti-t b { font-size: 14px; font-weight: 700; }" +
      ".kk-noti-t em { font-style: normal; font-size: 14px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }";
    document.head.appendChild(s);
  })();

  function pick(o, c, i) {
    var st = flowOf(c.f);
    if (!st || !st.node || st.busy) return;
    var ch = st.node.choices[i];
    if (!ch) return;
    if (ch.final) {                                // 안내 문구: 누르면 닫혀요
      closeChoices(o);
      if (!ch.hold) { st.node = null; unlock(o); } // hold 는 입력창을 다시 누르면 같은 안내가 또 떠요
      return;
    }
    if (ch.quiet) { closeChoices(o); return; }     // 아무 일도 안 일어나요
    if (ch.rewind) { rewind(o, c, st, ch); return; }
    st.busy = true;
    closeChoices(o);

    // 보낼 말풍선 순서 만들기: script 가 있으면 그대로, 없으면 me → replies
    var seq = [];
    if (ch.script) {
      seq = ch.script.slice();
    } else {
      if (ch.me) seq.push({ me: ch.me });
      (ch.replies || []).forEach(function (r) { seq.push({ them: r }); });
    }
    var next = N(ch.next);

    function finish() {                            // 모두 끝났어요
      function done() {
        st.node = next;
        st.busy = false;
        if (next && next.mark) {                   // mark: 다시 하시겠습니까? 로 돌아올 지점
          st.marks = st.marks || {};
          st.marks[next.name] = { len: c.msgs.length, clock: st.clock };
        }
        var body = roomBody(c);
        var room = body && body.closest(".kk-room");
        if (!room) return;
        if (!st.node) { unlock(room); return; }    // 선택지가 끝나면 평소처럼 타이핑
        if (stack[stack.length - 1] === room && (ch.ending || !st.node.manual)) {
          setTimeout(function () { openChoices(room, c, true); }, ch.ending ? 500 : (st.node.auto ? 1800 : 700));
        }
      }
      function conclude(delay) {
        if (ch.ending) {
          st.seen = st.seen || {};
          st.seen[ch.ending.key] = true;
          var b0 = roomBody(c), room0 = b0 && b0.closest(".kk-room");
          if (room0 && stack[stack.length - 1] === room0) setTimeout(function () { showEnding(room0, ch.ending, done); }, delay == null ? 700 : delay);
          else done();
        } else done();
      }
      if (ch.offline) {                            // 채팅방을 나가면 알람이 뜨고, 다시 들어오면 대화가 올라와 있어요
        st.pending = { ch: ch, run: conclude };
        var b1 = roomBody(c), room1 = b1 && b1.closest(".kk-room");
        if (!(room1 && stack[stack.length - 1] === room1)) triggerOffline(c);
        return;
      }
      conclude();
    }
    function step() {
      if (!seq.length) { finish(); return; }
      var item = seq.shift();
      if (item.skip) {                             // 시간이 흘러요 (24분 뒤...)
        if (st.clock != null) st.clock += item.skip;
        st.lastSp = null;
        setTimeout(step, item.wait || 1200); return;   // wait: 기다리는 시간(1000 = 1초)
      }
      if (item.day) {                              // 날짜 줄
        addMsg(c, { k: "day", text: item.day });
        if (item.time) st.clock = parseT(item.time);
        st.lastSp = null;
        setTimeout(step, 1400); return;
      }
      if (item.notice) {                           // 대화 밑 안내 문구
        addMsg(c, { k: "notice", text: item.notice });
        if (window.KakaoStory) window.KakaoStory.dialReady = true;   // 이제 전화앱에서 번호를 걸 수 있어요
        setTimeout(step, 900); return;
      }
      if (item.me != null) {                       // 내가 보내는 말풍선
        addMsg(c, { k: "me", text: item.me, time: stamp(st, item, "me") });
        setTimeout(step, seq.length ? 1600 : 350);          // 마지막 말풍선이면 바로 엔딩으로
      } else {                                     // 상대가 보내는 말풍선 (입력 중... 후에)
        showTyping(c);
        var wait = Math.min(4200, 1800 + String(item.them).length * 55);
        setTimeout(function () {
          hideTyping(c);
          addMsg(c, { k: "them", text: item.them, time: stamp(st, item, "them") });
          setTimeout(step, seq.length ? 900 : 250);
        }, wait);
      }
    }
    setTimeout(step, 900);
  }

  /* =======================================================
     영상통화가 끝난 뒤: 효기가 보낸 메시지가 도착하고 선택지가 시작돼요
     전화앱(영상통화)에서 window.KakaoStory.afterVideoCall() 을 실행하세요.
  ======================================================= */
  function afterVideoCall() {
    var S = D.story;
    if (!S || !S.arrive) return false;
    var c = chatOf(S.chat);
    if (!c) return false;
    var st = flowOf(S.chat);
    if (!st || st.arrived) return false;           // 한 번만
    st.arrived = true; st.seen = {}; st.busy = false;
    var open = !!roomBody(c);
    S.arrive.forEach(function (it) {
      var m = { k: "them", text: it.them, time: it.time || nowTime() };
      if (open) addMsg(c, m);
      else c.msgs.push(m);
    });
    if (!open) {
      c.unread = (c.unread || 0) + S.arrive.length;
      D.chats.splice(D.chats.indexOf(c), 1);
      D.chats.unshift(c);
    }
    st.node = N(S.start);
    st.rewindLen = c.msgs.length;
    st.clock = parseT(S.arrive[S.arrive.length - 1].time);
    st.rewindClock = st.clock; st.lastSp = "them";
    if (els.panels) renderChats();
    badges();
    return true;
  }
  /* 전화앱에서 혁에게 건 통화가 끝난 뒤: 대화가 "그래서 우리 어떻게 하길 원해요?" 로 돌아가고,
     입력창을 누르면 선택지 4개(새 2개 + 처음 2개)가 그대로 떠요 */
  function afterDialCall() {
    var S = D.story;
    if (!S) return false;
    var c = chatOf(S.chat), st = flowOf(S.chat), ex = N("newChoose"), fi = N("choose");
    if (!c || !st || st.rewindLen == null || !ex || !fi) return false;
    c.msgs.length = st.rewindLen;
    st.clock = st.rewindClock; st.lastSp = "them"; st.busy = false;
    st.node = { name: "choose", combined: true, manual: true, choices: ex.choices.concat(fi.choices) };
    window.KakaoStory.dialReady = false;
    var body = roomBody(c);
    if (body) {                                    // 채팅방이 열려 있는 채로 남아 있으면 화면도 되돌려요
      body.innerHTML = bodyHTML(c, c.f, 0); hydrateVoices(body); body.scrollTop = body.scrollHeight;
      var room = body.closest(".kk-room");
      if (room) {
        closeChoices(room);
        var inp = room.querySelector("input");
        if (inp) { inp.readOnly = true; inp.setAttribute("inputmode", "none"); }
      }
    }
    D.chats.splice(D.chats.indexOf(c), 1);
    D.chats.unshift(c);
    if (els.panels) renderChats();
    badges();
    return true;
  }
  window.KakaoStory = { afterVideoCall: afterVideoCall, afterDialCall: afterDialCall, dialReady: false };

  function send(btn) {
    var id = btn.getAttribute("data-id");
    var c = D.chats.filter(function (x) { return x.id === id; })[0];
    var inp = btn.parentNode.querySelector("input");
    var text = inp.value.trim();
    if (!text) return;
    var t = nowTime();
    var m = { k: "me", text: text, time: t, read: c.f === "me" ? true : undefined };
    c.msgs.push(m);
    inp.value = "";
    btn.classList.remove("on");
    var body = R.querySelector('[data-room="' + id + '"]');
    var empty = body.querySelector(".kk-empty"); if (empty) empty.remove();
    body.insertAdjacentHTML("beforeend", bubbleHTML(m, c.f, null));
    body.scrollTop = body.scrollHeight;
    // 가장 위로 올리기
    D.chats.splice(D.chats.indexOf(c), 1);
    D.chats.unshift(c);
  }

  /* ---------- 클릭 처리 ---------- */
  function onClick(e) {
    var t = e.target.closest("[data-a]");
    if (!t) return;
    var a = t.getAttribute("data-a"), id = t.getAttribute("data-id");
    if (a === "back") pop();
    else if (a === "toast") Phone.toast(t.getAttribute("data-m") || "준비 중이에요");
    else if (a === "profile") openProfile(id);
    else if (a === "chat") {
      // 프로필에서 들어온 경우, 프로필을 닫고 채팅방을 열어요
      var top = stack[stack.length - 1];
      if (top && top.classList.contains("kk-profile")) { stack.pop(); top.remove(); }
      openChat(id);
      updateTheme();
    }
    else if (a === "voice") toggleVoice(t);
    else if (a === "facetalk") { var rf = t.closest(".kk-room"), cf = D.chats.filter(function (x) { return x.id === id; })[0]; if (rf && cf) startFacetalk(rf, cf); }
    else if (a === "ftend") endFacetalk();
    else if (a === "fttap") { if (ft) { ft.el.classList.remove("needtap"); var pp = ft.v.play(); if (pp && pp.catch) pp.catch(function () {}); } }
    else if (a === "pick") {
      var room = t.closest(".kk-room");
      var cc = D.chats.filter(function (x) { return x.id === id; })[0];
      if (room && cc) pick(room, cc, parseInt(t.getAttribute("data-i"), 10));
    }
    else if (a === "closechoice") { if (e.target === t) closeChoices(t.closest(".kk-room")); }
    else if (a === "send") {
      var rm = t.closest(".kk-room");
      var c2 = D.chats.filter(function (x) { return x.id === id; })[0];
      var st2 = c2 && flowOf(c2.f);
      if (st2 && st2.node) openChoices(rm, c2);    // 선택지가 남아 있으면 선택지를 띄워요
      else send(t);
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && R && Apps.current() === "kakao") pop();
  });

  Apps.register("kakao", {
    theme: "light",
    build: build,
    onShow: function () { updateTheme(); badges(); }
  });

  // 앱을 열기 전에도 홈 화면 아이콘에 안 읽은 숫자가 보이도록
  (function () {
    var n = total();
    var icon = document.querySelector('.app-ico[data-app="kakao"]');
    if (!icon) return;
    var b = document.createElement("i");
    b.className = "app-badge";
    b.textContent = n > 999 ? "999+" : n;
    b.style.display = n ? "flex" : "none";
    icon.appendChild(b);
  })();

})();


/* =========================================================
   ▼ 전화 앱 (연락처 · 최근 기록 · 키패드 · 영상통화)
   효기 전화번호는 아래 CONFIG 의 numbers 에서 바꾸세요.
   ========================================================= */

/* =========================================================
   phoneapp.js  —  전화 앱 (연락처 · 최근 기록 · 키패드 · 영상통화)
   - 연락처에서 효기를 누르고 [영상통화] 아이콘을 누르면 영상통화 영상이 재생돼요.
   - 영상이 끝나면 통화가 자동으로 끊기고, 카카오톡 효기 채팅방에 새 메시지가 도착해요.
   - 연락처 이름은 kakao-data.js 의 friends 에서 가져와요.
   ※ 파일 이름이 phone.js 와 비슷하지만 다른 파일이에요 (phone.js 는 폰 공통 기능).
   ========================================================= */

(function () {
  "use strict";

  var Apps = window.Apps, Phone = window.Phone;
  var K = window.KAKAO_DATA || { me: {}, friends: {}, order: [] };
  var phoneEl = document.getElementById("phone");

  /* ---------- 바꿀 수 있는 설정 ---------- */
  var CONFIG = {
    video: "video/call.mp4",          // 영상통화 영상 파일
    callContact: "jihyo",             // 영상통화가 연결되는 친구 id (효기)
    ringMs: 3200,                     // 전화를 거는 동안 울리는 시간 (밀리초)
    numbers: { jihyo: "010-0755-5240" }, // 연락처에 보이는 전화번호
    dialNumber: "01007555240"            // 키패드에 입력하면 걸리는 번호 (숫자만)
  };
  var U = window.PHONE_CONFIG || {};
  for (var key in U) CONFIG[key] = U[key];

  /* 키패드로 건 통화 내용 [시작초, 끝초, 누구, 대사] — 자막으로 나와요 */
  var DIAL_END = 196;                 // 3:16 이후 HIDDEN ENDING
  var DIAL_SCRIPT = [
    [2, 5, "택운", "여보세요?"],
    [8, 10, "혁", "..여보세요"],
    [14, 19, "택운", "..혁아 너 술 마셨어?"],
    [20, 21, "혁", "네"],
    [22, 28, "혁", "안 먹으면 제정신으로 못 있을 것 같아서요"],
    [28, 30, "택운", "..."],
    [31, 32, "혁", "형"],
    [33, 34, "택운", "응"],
    [35, 39, "혁", "앞으로 연락 잘해요"],
    [41, 46, "혁", "형 연락 안 되면 무슨 또 나 몰래 다른 사람 만나나 싶어요"],
    [48, 52, "택운", "그런 일 없을거야"],
    [53, 58, "혁", "내가 그런 생각 안 하게 해줘요"],
    [59, 65, "혁", "형은 나랑 있을 때가 제일 좋아요?"],
    [67, 69, "택운", "당연하지"],
    [71, 74, "택운", "너를 가장 사랑하니까.."],
    [75, 78, "혁", "나만 사랑한다고 해야죠"],
    [79, 81, "택운", "아.. 미안해"],
    [82, 86, "혁", "형한테는 별일 아닌 하루였겠지만"],
    [87, 93, "혁", "나한테는 형 연락 한 번이 하루 중 제일 큰일이었어요"],
    [94, 98, "택운", ".."],
    [99, 100, "택운", "혁아"],
    [101, 102, "혁", "네"],
    [103, 105, "택운", "사랑해"],
    [106, 108, "혁", "..."],
    [109, 110, "혁", "(훌쩍).."],
    [113, 117, "택운", "..너 울어 혁아?"],
    [118, 121, "혁", "형 미워요.."],
    [125, 129, "혁", "..형 언제 잘거에요?"],
    [130, 133, "택운", "나중에.. 왜?"],
    [134, 137, "혁", "그냥 목소리 듣고 싶어서요"],
    [138, 140, "혁", "끊지 말고 있어요"],
    [141, 144, "택운", "너 잘 때까지?"],
    [145, 147, "혁", "아니요 형이 잠들 때까지."],
    [148, 150, "택운", "너도 자야지"],
    [151, 155, "혁", "형이 먼저 잠들면 끊을게요"],
    [156, 160, "혁", "전화 끊고 혼자 있으면 자꾸 나쁜 생각이 들어서요"],
    [162, 163, "택운", "알겠어..."],
    [164, 168, "택운", "네가 잠들 때까지 계속 옆에 있어 줄게"],
    [169, 172, "택운", "그러니까 혼자 무서워하지 마.."],
    [173, 177, "택운", "내가 너 좋아하는 마음은 변한 적 없어"],
    [178, 180, "혁", "..."],
    [181, 184, "혁", "형도 저랑 같이 자요"],
    [186, 188, "택운", "응, 그래야겠다."],
    [189, 192, "택운", "잘자, 미안해.. 사랑해."],
    [193, 195, "혁", "저도 사랑해요."]
  ];

  var R, els = {}, tab = "contacts";
  var recents = [];
  var callDone = false;               // 효기와 영상통화를 끝까지 봤는지
  var calling = false, call = null;
  var dialed = "";
  var ovStack = [];

  /* ---------- 도우미 ---------- */
  var P = {
    contacts: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/>',
    recents: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    keypad: '<circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="18" cy="5" r="1.7"/><circle cx="6" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="18" cy="11" r="1.7"/><circle cx="6" cy="17" r="1.7"/><circle cx="12" cy="17" r="1.7"/><circle cx="18" cy="17" r="1.7"/><circle cx="12" cy="22" r="1.7"/>',
    back: '<path d="M15 4l-8 8 8 8"/>',
    msg: '<path d="M12 3C6.5 3 2 6.6 2 11c0 2.5 1.4 4.7 3.6 6.1L4.5 21l4.3-2.3c1 .2 2 .3 3.2.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/>',
    phone: '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="M15.5 10.5l6-3.5v10l-6-3.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
    camera: '<rect x="3" y="7" width="18" height="12" rx="3"/><path d="M8.5 7l1.4-2.2h4.2L15.5 7"/><circle cx="12" cy="13" r="3.3"/>',
    end: '<path d="M3 14.5c5.5-5 12.5-5 18 0l-2.4 2.9c-.4.5-1.1.6-1.6.2l-2.1-1.5c-.4-.3-.6-.8-.5-1.3l.3-1.4c-1.8-.7-3.6-.7-5.4 0l.3 1.4c.1.5-.1 1-.5 1.3l-2.1 1.5c-.5.4-1.2.3-1.6-.2z"/>',
    del: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/><path d="M13 9.5l5 5M18 9.5l-5 5"/>'
  };
  function ic(n, o) {
    o = o || {};
    return '<svg class="ph-ic" viewBox="0 0 24 24" fill="' + (o.fill || "none") + '" stroke="' + (o.stroke || "currentColor") + '" stroke-width="' + (o.sw || 1.9) +
      '" stroke-linecap="round" stroke-linejoin="round">' + P[n] + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function person(id) { return K.friends[id] || { name: id }; }
  var SIL = '<svg viewBox="0 0 24 24" width="72%" height="72%" fill="#fff"><circle cx="12" cy="9" r="4"/><path d="M4.5 21c0-4.2 3.3-6.6 7.5-6.6s7.5 2.4 7.5 6.6z"/></svg>';
  function avatar(id, size) {
    var u = person(id), st = "width:" + size + "px;height:" + size + "px;";
    if (u.img) return '<span class="ph-av" style="' + st + "background-image:url('" + esc(u.img) + "')\"></span>";
    return '<span class="ph-av def" style="' + st + '">' + SIL + "</span>";
  }
  function contactIds() {
    var ids = [CONFIG.callContact].concat(K.order || []);
    return ids.filter(function (id, i) { return K.friends[id] && ids.indexOf(id) === i; });
  }
  function numberOf(id) { return (CONFIG.numbers && CONFIG.numbers[id]) || ""; }
  function setTheme(t) { phoneEl.setAttribute("data-theme", t); }
  function storyTime() {
    var s = K.story && K.story.arrive && K.story.arrive[0];
    if (s && s.time) return s.time;
    var n = new Date(), h = n.getHours(), m = n.getMinutes();
    return (h < 12 ? "오전 " : "오후 ") + (h % 12 === 0 ? 12 : h % 12) + ":" + (m < 10 ? "0" + m : m);
  }

  /* ---------- 뼈대 ---------- */
  function build(root) {
    R = root;
    R.classList.add("ph-app");
    R.innerHTML =
      '<div class="ph-panels">' +
        '<div class="ph-panel on" data-p="contacts"></div>' +
        '<div class="ph-panel" data-p="recents"></div>' +
        '<div class="ph-panel" data-p="keypad"></div>' +
      "</div>" +
      '<div class="ph-nav">' +
        '<button data-t="contacts" class="on">' + ic("contacts", { fill: "currentColor", sw: 0 }) + "<span>연락처</span></button>" +
        '<button data-t="recents">' + ic("recents") + "<span>최근 기록</span></button>" +
        '<button data-t="keypad">' + ic("keypad", { fill: "currentColor", sw: 0 }) + "<span>키패드</span></button>" +
      "</div>" +
      '<div class="ph-ovs"></div>' +
      '<div class="ph-call" id="ph-call">' +
        '<video class="ph-cv" playsinline webkit-playsinline preload="auto"></video>' +
        '<div class="ph-cshade"></div>' +
        '<div class="ph-cring"><span class="ph-cav"></span><b class="ph-cname"></b><span class="ph-cdots">영상통화 연결 중<i>.</i><i>.</i><i>.</i></span></div>' +
        '<div class="ph-ctop"><b></b><span>00:00</span></div>' +
        '<div class="ph-cbar">' +
          '<button class="ph-cb" data-c="speaker"><i>' + ic("speaker") + "</i><span>스피커</span></button>" +
          '<button class="ph-cb" data-c="mic"><i>' + ic("mic") + "</i><span>음소거</span></button>" +
          '<button class="ph-cb end" data-c="end"><i>' + ic("end", { fill: "#fff", sw: 0 }) + "</i><span>종료</span></button>" +
        "</div>" +
        '<div class="ph-cap"></div>' +
        '<div class="ph-hid"><b>HIDDEN ENDING</b><span>우리만 아는 밤</span></div>' +
        '<div class="ph-cend">통화 종료</div>' +
        '<button class="ph-tapplay" data-c="tapplay">화면을 눌러 통화 연결</button>' +
      "</div>";

    els.panels = {};
    ["contacts", "recents", "keypad"].forEach(function (p) { els.panels[p] = R.querySelector('[data-p="' + p + '"]'); });
    els.ovs = R.querySelector(".ph-ovs");
    els.call = R.querySelector("#ph-call");
    els.video = els.call.querySelector("video");

    R.querySelector(".ph-nav").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-t]");
      if (!b) return;
      closeOvs();
      showTab(b.getAttribute("data-t"));
    });
    R.addEventListener("click", onClick);

    // 영상이 끝나면 통화가 자동으로 끊겨요
    els.video.addEventListener("timeupdate", function () {
      if (!calling || !call || call.state !== "live") return;
      els.call.querySelector(".ph-ctop span").textContent = fmtT(els.video.currentTime);
    });
    els.video.addEventListener("ended", function () { endCall("done"); });
    els.video.addEventListener("error", function () {
      if (calling) { endCall("hangup"); Phone.toast("영상 파일을 찾을 수 없어요 (" + CONFIG.video + ")"); }
    });
    // 통화 화면을 한 번 누르면 버튼이 숨었다가 다시 나타나요
    els.call.addEventListener("click", function (e) {
      if (e.target.closest("[data-c]")) return;
      if (call && call.state === "live" && !call.timed) els.call.classList.toggle("hide");
    });

    // 통화 중에 홈바를 누르거나 폰이 잠기면 통화도 끊겨요
    new MutationObserver(function () {
      if (calling && !R.classList.contains("open")) endCall("closed");
    }).observe(R, { attributes: true, attributeFilter: ["class"] });

    renderContacts(); renderRecents(); renderKeypad();
  }

  function showTab(t) {
    if (t === "recents") { Phone.toast("최근 기록은 열 수 없어요"); return; }   // 최근 기록 탭은 눌러도 열리지 않아요
    tab = t;
    ["contacts", "recents", "keypad"].forEach(function (p) { els.panels[p].classList.toggle("on", p === t); });
    var bs = R.querySelectorAll(".ph-nav button");
    for (var i = 0; i < bs.length; i++) bs[i].classList.toggle("on", bs[i].getAttribute("data-t") === t);
    if (t === "recents") renderRecents();
  }

  /* ---------- 연락처 ---------- */
  function renderContacts() {
    var rows = contactIds().map(function (id) {
      return '<button class="ph-row" data-a="card" data-id="' + id + '">' + avatar(id, 40) + "<b>" + esc(person(id).name) + "</b></button>";
    }).join("");
    els.panels.contacts.innerHTML =
      '<div class="ph-top"><h1>연락처</h1></div>' +
      '<div class="ph-scroll"><div class="ph-me">' + avatar("me", 52) + '<span><b>' + esc((K.me && K.me.name) || "나") + "</b><small>내 카드</small></span></div>" +
      rows + '<div class="ph-endpad"></div></div>';
    Apps.dragScroll(els.panels.contacts.querySelector(".ph-scroll"));
  }

  function pushOv(html) {
    var o = document.createElement("div");
    o.className = "ph-ov";
    o.innerHTML = html;
    els.ovs.appendChild(o);
    void o.offsetWidth;
    o.classList.add("in");
    ovStack.push(o);
    return o;
  }
  function popOv() {
    var o = ovStack.pop();
    if (!o) return;
    o.classList.remove("in");
    setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 300);
  }
  function closeOvs() { while (ovStack.length) popOv(); }

  function openCard(id) {
    var u = person(id), num = numberOf(id);
    var hl = id === CONFIG.callContact && !callDone ? " hl" : "";
    pushOv(
      '<div class="ph-ch"><button class="ph-back" data-a="back">' + ic("back", { sw: 2.4 }) + "<span>연락처</span></button></div>" +
      '<div class="ph-card">' + avatar(id, 104) + "<h2>" + esc(u.name) + "</h2></div>" +
      '<div class="ph-acts">' +
        '<button data-a="act-msg">' + "<i>" + ic("msg", { fill: "currentColor", sw: 0 }) + "</i><span>메시지</span></button>" +
        '<button data-a="act-call">' + "<i>" + ic("phone", { fill: "currentColor", sw: 0 }) + "</i><span>통화</span></button>" +
        '<button class="vid' + hl + '" data-a="act-video" data-id="' + id + '">' + "<i>" + ic("video", { fill: "currentColor", sw: 0 }) + "</i><span>영상통화</span></button>" +
        '<button data-a="act-mail">' + "<i>" + ic("mail") + "</i><span>메일</span></button>" +
      "</div>" +
      (num ? '<div class="ph-info"><small>휴대전화</small><b>' + esc(num) + "</b></div>" : ""));
  }

  /* ---------- 최근 기록 ---------- */
  function renderRecents() {
    var rows = recents.map(function (r) {
      return '<button class="ph-row rc" data-a="card" data-id="' + r.id + '">' + avatar(r.id, 40) +
        '<span class="ph-rt"><b>' + esc(person(r.id).name) + "</b><small>" + ic("video", { fill: "currentColor", sw: 0 }) + esc(r.type) + "</small></span>" +
        "<em>" + esc(r.time) + "</em></button>";
    }).join("");
    els.panels.recents.innerHTML =
      '<div class="ph-top"><h1>최근 기록</h1></div>' +
      '<div class="ph-scroll">' + (rows || '<div class="ph-empty">최근 통화 기록이 없어요</div>') + '<div class="ph-endpad"></div></div>';
    Apps.dragScroll(els.panels.recents.querySelector(".ph-scroll"));
  }

  /* ---------- 키패드 ---------- */
  var LET = { "1": "", "2": "ABC", "3": "DEF", "4": "GHI", "5": "JKL", "6": "MNO", "7": "PQRS", "8": "TUV", "9": "WXYZ", "0": "", "*": "", "#": "" };
  function fmtNum(d) {
    if (/^01\d/.test(d)) {
      if (d.length <= 3) return d;
      if (d.length <= 7) return d.slice(0, 3) + "-" + d.slice(3);
      if (d.length <= 10) return d.slice(0, 3) + "-" + d.slice(3, d.length - 4) + "-" + d.slice(-4);
      return d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7, 11);
    }
    return d;
  }
  function renderKeypad() {
    var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(function (k) {
      return '<button class="ph-key" data-a="key" data-k="' + k + '"><b>' + k + "</b><small>" + LET[k] + "</small></button>";
    }).join("");
    els.panels.keypad.innerHTML =
      '<div class="ph-kdisp"><span class="ph-knum"></span></div>' +
      '<div class="ph-kgrid">' + keys + "</div>" +
      '<div class="ph-kact"><span></span><button class="ph-kcall" data-a="dial">' + ic("phone", { fill: "#fff", sw: 0 }) + '</button>' +
      '<button class="ph-kdel" data-a="del">' + ic("del") + "</button></div>";
    updateDial();
  }
  function updateDial() {
    var n = els.panels.keypad.querySelector(".ph-knum");
    n.textContent = fmtNum(dialed);
    els.panels.keypad.querySelector(".ph-kdel").style.visibility = dialed ? "visible" : "hidden";
  }

  /* ---------- 영상통화 ---------- */
  function fmtT(sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function startCall(id) {
    if (calling) return;
    var u = person(id), v = els.video, c = els.call;
    calling = true;
    call = { id: id, state: "ring", playable: id === CONFIG.callContact, timer: null };
    c.querySelector(".ph-cav").innerHTML = avatar(id, 112);
    c.querySelector(".ph-cname").textContent = u.name;
    c.querySelector(".ph-ctop b").textContent = u.name;
    c.querySelector(".ph-ctop span").textContent = "00:00";
    c.className = "ph-call on ringing";
    c.querySelector(".ph-cdots").innerHTML = "영상통화 연결 중<i>.</i><i>.</i><i>.</i>";
    Array.prototype.forEach.call(c.querySelectorAll(".ph-cb.off"), function (b) { b.classList.remove("off"); });
    v.muted = false;
    setTheme("dark");
    // 누른 순간 재생을 한 번 풀어 둬야, 연결 뒤에 소리와 함께 자동 재생돼요
    if (call.playable) {
      v.src = CONFIG.video;
      v.currentTime = 0;
      v.volume = 0;
      var p = v.play();
      if (p && p.then) p.then(function () { if (call && call.state === "ring") { v.pause(); v.currentTime = 0; } v.volume = 1; }).catch(function () { v.volume = 1; });
    }
    var my = call;
    call.timer = setTimeout(function () { if (calling && call === my) connect(); }, CONFIG.ringMs);
  }

  function connect() {
    var v = els.video, c = els.call;
    if (!call.playable) { endCall("noanswer"); return; }
    call.state = "live";
    c.classList.remove("ringing");
    c.classList.add("live");
    v.currentTime = 0; v.volume = 1; v.muted = false;
    var p = v.play();
    if (p && p.catch) p.catch(function () { c.classList.add("needtap"); });
  }

  /* ---------- 키패드로 거는 통화 (자막 통화) ---------- */
  function startTimedCall(id) {
    if (calling) return;
    var u = person(id), c = els.call;
    calling = true;
    call = { id: id, state: "ring", playable: false, timed: true, timer: null, iv: null, t2: null };
    c.querySelector(".ph-cav").innerHTML = avatar(id, 112);
    c.querySelector(".ph-cname").textContent = u.name;
    c.querySelector(".ph-cdots").innerHTML = "통화 연결 중<i>.</i><i>.</i><i>.</i>";
    c.querySelector(".ph-cap").innerHTML = "";
    c.className = "ph-call on ringing voice";
    Array.prototype.forEach.call(c.querySelectorAll(".ph-cb.off"), function (b) { b.classList.remove("off"); });
    setTheme("dark");
    var my = call;
    call.timer = setTimeout(function () { if (calling && call === my) connectTimed(); }, CONFIG.ringMs);
  }

  function connectTimed() {
    var c = els.call, my = call, t0 = Date.now(), hid = false;
    my.state = "live";
    c.classList.remove("ringing");
    c.classList.add("live");
    var cdots = c.querySelector(".ph-cdots"), cap = c.querySelector(".ph-cap");
    cdots.textContent = "00:00";
    my.iv = setInterval(function () {
      if (call !== my) return;
      var t = (Date.now() - t0) / 1000;
      cdots.textContent = fmtT(Math.min(t, DIAL_END));
      var line = null;
      for (var i = 0; i < DIAL_SCRIPT.length; i++) {
        if (t >= DIAL_SCRIPT[i][0] && t < DIAL_SCRIPT[i][1] + 0.6) line = DIAL_SCRIPT[i];
      }
      var html = line ? '<small>' + esc(line[2]) + '</small><span>' + esc(line[3]) + "</span>" : "";
      if (cap.getAttribute("data-h") !== html) { cap.setAttribute("data-h", html); cap.innerHTML = html; }
      if (t >= DIAL_END && !hid) {                // 3:16 — HIDDEN ENDING 문구 후 통화 종료
        hid = true;
        clearInterval(my.iv);
        cap.innerHTML = "";
        c.classList.add("hid-on");
        my.t2 = setTimeout(function () { if (call === my) endTimed("done"); }, 5200);
      }
    }, 200);
  }

  function endTimed(reason) {             // "done" 끝까지 / "hangup" 종료 버튼 / "closed" 앱 닫힘
    var c = els.call, my = call;
    clearTimeout(my.timer); clearInterval(my.iv); clearTimeout(my.t2);
    calling = false; call = null;
    function hide() {
      c.className = "ph-call";
      c.querySelector(".ph-cap").innerHTML = "";
      if (R.classList.contains("open")) setTheme("light");
    }
    if (reason === "closed") { hide(); return; }
    c.querySelector(".ph-cend").textContent = "통화 종료";
    c.classList.add("ending");
    setTimeout(function () {
      hide();
      if (reason === "done" && window.KakaoStory && window.KakaoStory.afterDialCall) window.KakaoStory.afterDialCall();
    }, 1500);
  }

  function endCall(reason) {              // "done" 영상 끝 / "hangup" 종료 버튼 / "noanswer" / "closed" 앱 닫힘
    if (calling && call && call.timed) { endTimed(reason); return; }
    if (!calling) return;
    var c = els.call, v = els.video, my = call;
    clearTimeout(call.timer);
    v.pause();
    var wasLive = call.state === "live";
    calling = false;
    var label = reason === "noanswer" ? "응답 없음" : "통화 종료";
    function hide() {
      c.className = "ph-call";
      v.removeAttribute("src"); try { v.load(); } catch (e) {}
      if (R.classList.contains("open")) setTheme("light");
    }
    if (reason === "closed") { hide(); return; }
    c.querySelector(".ph-cend").textContent = label;
    c.classList.add("ending");
    if (wasLive || reason === "done") recents.unshift({ id: my.id, type: "영상통화", time: storyTime() });
    setTimeout(function () {
      hide();
      renderRecents();
      if (reason === "noanswer") Phone.toast("상대방이 받지 않아요");
      if (reason === "done") {
        callDone = true;
        closeOvs(); openCard(my.id);
        // 카카오톡 효기 채팅방에 새 메시지가 도착해요
        if (window.KakaoStory && window.KakaoStory.afterVideoCall) window.KakaoStory.afterVideoCall();
      }
    }, 1500);
    call = null;
  }

  function onCallBtn(c) {
    var cb = els.call.querySelector('[data-c="' + c + '"]');
    if (c === "end") { endCall("hangup"); return; }
    if (c === "tapplay") {
      els.call.classList.remove("needtap");
      var p = els.video.play(); if (p && p.catch) p.catch(function () {});
      return;
    }
    if (!call || call.state !== "live") return;
    var off = cb.classList.toggle("off");
    if (c === "speaker") els.video.muted = off;
  }

  /* ---------- 클릭 처리 ---------- */
  function onClick(e) {
    var t = e.target.closest("[data-a],[data-c]");
    if (!t) return;
    if (t.hasAttribute("data-c")) { onCallBtn(t.getAttribute("data-c")); return; }
    var a = t.getAttribute("data-a"), id = t.getAttribute("data-id");
    if (a === "card") openCard(id);
    else if (a === "back") popOv();
    else if (a === "act-video") startCall(id);
    else if (a === "act-call") Phone.toast("음성 통화는 준비 중이에요");
    else if (a === "act-msg") Phone.toast("메시지는 카카오톡을 이용해 주세요");
    else if (a === "act-mail") Phone.toast("메일은 준비 중이에요");
    else if (a === "key") { if (dialed.length < 15) { dialed += t.getAttribute("data-k"); updateDial(); } }
    else if (a === "del") { dialed = dialed.slice(0, -1); updateDial(); }
    else if (a === "dial") {
      if (!dialed) return;
      if (dialed === String(CONFIG.dialNumber).replace(/\D/g, "")) {
        if (window.KakaoStory && window.KakaoStory.dialReady) {
          dialed = ""; updateDial();
          startTimedCall(CONFIG.callContact);
        } else {
          Phone.toast("지금은 이 번호로 전화할 수 없어요");
        }
        return;
      }
      var h = window.PhoneApp && window.PhoneApp.onDial;
      if (h && h(dialed, fmtNum(dialed)) === true) return;
      Phone.toast("통화 기능은 준비 중이에요");
    }
  }

  /* 다른 코드에서 쓰는 도구 (키패드 입력 확인 등) */
  window.PhoneApp = {
    onDial: null,                        // function (digits, formatted) { return true; } 로 바꾸면 통화 버튼을 눌렀을 때 실행돼요
    getDialed: function () { return dialed; },
    clearDialed: function () { dialed = ""; if (R) updateDial(); },
    startVideoCall: function (id) { if (R) startCall(id || CONFIG.callContact); }
  };

  /* 자막 통화 / HIDDEN ENDING 스타일 */
  (function () {
    var st = document.createElement("style");
    st.textContent =
      ".ph-call.voice.live .ph-cring { opacity: 1; pointer-events: auto; }" +
      ".ph-call.voice .ph-ctop { display: none !important; }" +
      ".ph-call.voice.live .ph-cdots { font-size: 18px; font-variant-numeric: tabular-nums; }" +
      ".ph-cap { position: absolute; left: 0; right: 0; bottom: 170px; z-index: 3; display: none; flex-direction: column; align-items: center; gap: 6px; padding: 0 28px; box-sizing: border-box; text-align: center; pointer-events: none; }" +
      ".ph-call.voice.live .ph-cap { display: flex; }" +
      ".ph-cap small { font-size: 13px; color: rgba(255,255,255,.6); letter-spacing: 1px; }" +
      ".ph-cap span { font-size: 19px; font-weight: 600; line-height: 1.45; word-break: keep-all; text-shadow: 0 1px 8px rgba(0,0,0,.6); animation: phCapIn .25s ease; }" +
      "@keyframes phCapIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }" +
      ".ph-hid { position: absolute; inset: 0; z-index: 6; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; background: rgba(10,8,3,.9); color: #f3dfb0; opacity: 0; pointer-events: none; }" +
      ".ph-call.hid-on .ph-hid { display: flex; animation: phHid 5.2s ease forwards; }" +
      ".ph-hid b { font-size: 30px; font-weight: 800; letter-spacing: 2px; color: #f3dfb0; text-shadow: 0 0 16px #e8c987, 0 0 42px #d9b56a; }" +
      ".ph-hid span { font-size: 17px; font-weight: 600; letter-spacing: 1px; color: #f3dfb0; opacity: .9; }" +
      "@keyframes phHid { 0% { opacity: 0; } 18% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 1; } }";
    document.head.appendChild(st);
  })();

  Apps.register("phone", { theme: "light", build: build });

})();
