/* 가상폰 서비스 워커
   - 크롬의 "앱 설치" 조건을 맞추기 위한 파일이에요.
   - 파일을 고쳐서 다시 올렸을 때 옛날 화면이 남지 않도록, 항상 인터넷에서 먼저 받아오고
     인터넷이 안 될 때만 저장해 둔 것을 보여줘요.
   - 영상(mp4)은 저장하지 않아요. */
var CACHE = "virtual-phone-v1";

self.addEventListener("install", function () { self.skipWaiting(); });

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (/\.(mp4|webm|mov)$/i.test(url.pathname) || req.headers.has("range")) return;   // 영상은 그대로 통과
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.status === 200) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match("./index.html"); });
    })
  );
});
