/* =========================================================
   memo.js  —  메모 앱 동작 (아이폰 메모 느낌의 가상 메모)
   내용은 data/memo-data.js 에서 바꿔요. 이 파일은 고칠 일이 거의 없어요.
   - 메모 목록, 검색, 메모 열기
   - 폰 안에서 직접 쓰고 고치기 / 새 메모 / 삭제
   - 앱을 나갔다 들어와도 보던 화면이 그대로 유지돼요
   ========================================================= */

(function () {
  "use strict";

  var D = window.MEMO_DATA || { memos: [] };
  var Apps = window.Apps, Phone = window.Phone;
  var R, els = {};
  var query = "", openId = null, seq = 1;

  /* 데이터의 lines(줄 목록)를 글 한 덩어리로 바꿔서 가지고 있어요 */
  var memos = (D.memos || []).map(function (m) {
    return { id: m.id, text: m.lines ? m.lines.join("\n") : String(m.text || "") };
  });

  var P = {
    search:  '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    back:    '<path d="M15 5l-7 7 7 7"/>',
    share:   '<path d="M12 15V3M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>',
    trash:   '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',
    compose: '<path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>'
  };
  function ic(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + P[n] + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function find(id) { for (var i = 0; i < memos.length; i++) if (memos[i].id === id) return memos[i]; return null; }
  function split(text) {                       // 첫 줄 = 제목, 나머지 = 본문
    var i = text.indexOf("\n");
    return i < 0 ? { title: text, body: "" } : { title: text.slice(0, i), body: text.slice(i + 1) };
  }
  function join(title, body) { return body === "" ? title : title + "\n" + body; }
  function previewOf(body) {                   // 본문의 첫 번째 글자 있는 줄
    var lines = body.split("\n");
    for (var i = 0; i < lines.length; i++) if (lines[i].trim()) return lines[i].trim();
    return "추가 텍스트 없음";
  }

  /* ---------- 목록 ---------- */
  function row(m) {
    var p = split(m.text), t = p.title.trim();
    return '<button class="mm-row" data-id="' + esc(m.id) + '" type="button">' +
      "<b" + (t ? "" : ' class="none"') + ">" + esc(t || "새로운 메모") + "</b>" +
      "<span>" + esc(previewOf(p.body)) + "</span></button>";
  }
  function renderList() {
    var q = query.trim().toLowerCase();
    var list = memos.filter(function (m) { return !q || m.text.toLowerCase().indexOf(q) >= 0; });
    els.list.innerHTML = list.length
      ? '<div class="mm-card">' + list.map(row).join("") + "</div>"
      : '<div class="mm-empty">' + (q ? "검색 결과가 없어요." : "메모가 없어요.") + "</div>";
    els.count.textContent = memos.length + "개의 메모";
  }

  /* ---------- 메모 열기 / 닫기 ---------- */
  function autosize() {
    els.body.style.height = "auto";
    els.body.style.height = els.body.scrollHeight + "px";
  }
  function openMemo(id, focusTitle) {
    var m = find(id);
    if (!m) return;
    openId = id;
    var p = split(m.text);
    els.title.value = p.title;
    els.body.value = p.body;
    els.detail.classList.remove("editing");
    els.detail.classList.add("on");
    void els.detail.offsetWidth;
    els.detail.classList.add("show");
    autosize();
    els.dscroll.scrollTop = 0;
    if (focusTitle) setTimeout(function () { els.title.focus(); }, 340);
  }
  function hideDetail() {
    openId = null;
    els.detail.classList.remove("show", "editing");
    setTimeout(function () { if (openId === null) els.detail.classList.remove("on"); }, 320);
    renderList();
  }
  function closeDetail() {
    var a = document.activeElement;
    if (a && a.blur && (a === els.title || a === els.body)) a.blur();
    var m = find(openId);
    if (m && !m.text.trim()) memos.splice(memos.indexOf(m), 1);   // 아무것도 안 쓴 새 메모는 사라져요
    hideDetail();
  }
  function deleteMemo() {
    var m = find(openId);
    if (m) memos.splice(memos.indexOf(m), 1);
    hideDetail();
    Phone.toast("메모를 삭제했어요");
  }
  function newMemo() {
    var m = { id: "new" + (seq++), text: "" };
    memos.unshift(m);
    openMemo(m.id, true);
  }
  function onType() {
    var m = find(openId);
    if (m) m.text = join(els.title.value, els.body.value);
    autosize();
  }

  /* ---------- 화면 만들기 ---------- */
  function build(root) {
    R = root;
    root.classList.add("mm-app");
    root.innerHTML =
      '<div class="mm-panel">' +
        '<div class="mm-top"><h1>메모</h1>' +
          '<label class="mm-search">' + ic("search") + '<input id="mm-q" type="search" placeholder="검색" autocomplete="off"></label></div>' +
        '<div class="mm-scroll" id="mm-list"></div>' +
        '<div class="mm-bar"><span id="mm-count"></span>' +
          '<button class="mm-new" id="mm-new" type="button" aria-label="새 메모">' + ic("compose") + "</button></div>" +
      "</div>" +
      '<div class="mm-detail" id="mm-detail">' +
        '<div class="mm-dtop"><button class="mm-back" id="mm-back" type="button">' + ic("back") + "<span>메모</span></button>" +
          '<div class="mm-dr"><button class="mm-ib mm-share" id="mm-share" type="button">' + ic("share") + "</button>" +
          '<button class="mm-ib" id="mm-del" type="button">' + ic("trash") + "</button>" +
          '<button class="mm-done" id="mm-done" type="button">완료</button></div></div>' +
        '<div class="mm-dscroll" id="mm-dscroll"><div class="mm-doc">' +
          '<input id="mm-title" type="text" placeholder="제목" autocomplete="off">' +
          '<textarea id="mm-body" rows="2" placeholder="내용"></textarea></div></div>' +
      "</div>";

    var q = function (id) { return root.querySelector("#" + id); };
    els = { list: q("mm-list"), count: q("mm-count"), detail: q("mm-detail"), dscroll: q("mm-dscroll"),
            title: q("mm-title"), body: q("mm-body") };

    Apps.dragScroll(els.list);
    Apps.dragScroll(els.dscroll);

    q("mm-q").addEventListener("input", function (e) { query = e.target.value; renderList(); });
    els.list.addEventListener("click", function (e) {
      var b = e.target.closest("[data-id]");
      if (b) openMemo(b.getAttribute("data-id"));
    });
    q("mm-new").addEventListener("click", newMemo);
    q("mm-back").addEventListener("click", closeDetail);
    q("mm-del").addEventListener("click", deleteMemo);
    q("mm-share").addEventListener("click", function () { Phone.toast("가상 시뮬레이션에서는 공유할 수 없어요"); });

    var done = q("mm-done");
    done.addEventListener("mousedown", function (e) { e.preventDefault(); });   // 누르는 순간 입력창이 먼저 풀리지 않게
    done.addEventListener("click", function () {
      var a = document.activeElement;
      if (a && a.blur) a.blur();
    });

    els.title.addEventListener("input", onType);
    els.body.addEventListener("input", onType);
    els.title.addEventListener("keydown", function (e) {      // 제목에서 엔터 → 본문으로
      if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); els.body.focus(); }
    });
    els.detail.addEventListener("focusin", function () { els.detail.classList.add("editing"); });
    els.detail.addEventListener("focusout", function () {
      setTimeout(function () {
        var a = document.activeElement;
        if (a !== els.title && a !== els.body) els.detail.classList.remove("editing");
      }, 0);
    });

    renderList();
  }

  Apps.register("memo", { theme: "light", build: build });
})();
