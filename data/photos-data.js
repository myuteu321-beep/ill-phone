/* =========================================================
   photos-data.js  —  사진 앱의 모든 내용 (가상 시뮬레이션)
   ---------------------------------------------------------
   ※ 지금은 색깔 상자(임시 사진)로 채워져 있어요.
      나중에 진짜 사진을 넣는 방법:
        1) images 폴더에 사진을 올리세요. (예: images/photo01.jpg)
        2) 아래 사진 한 줄에서 img: "" 를 img: "images/photo01.jpg" 로 바꾸세요.
        3) date 는 찍은 날짜/시간이에요. ("2026-10-24 07:12" 형식)
      사진을 더 넣고 싶으면 { } 한 줄을 복사해서 붙이세요. (id 는 겹치지 않게!)
   - 따옴표 "" 안의 글자만 바꾸세요. 쉼표 , 는 지우지 마세요.
   - fav: true 면 "즐겨찾는 항목" 앨범에 들어가요.
   ========================================================= */

window.PHOTOS_DATA = {

  /* ---------- 사진 목록 ---------- */
  photos: [
    { id: "p01", img: "images/pic01.jpg", label: "", date: "2023-02-04 23:15", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p02", img: "images/pic02.jpg", label: "", date: "2022-11-20 15:08", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p03", img: "images/pic03.jpg", label: "", date: "2023-05-14 11:27", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p04", img: "images/pic04.jpg", label: "", date: "2022-10-08 21:36", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p05", img: "images/pic05.jpg", label: "", date: "2022-09-12 01:01", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p06", img: "images/pic06.jpg", label: "", date: "2022-09-25 22:27", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p07", img: "images/pic07.jpg", label: "", date: "2026-05-02 13:25", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p08", img: "images/pic08.jpg", label: "", date: "2026-06-02 01:48", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p09", img: "images/pic09.jpg", label: "", date: "2026-06-02 01:49", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p10", img: "images/pic10.jpg", label: "", date: "2026-11-05 02:39", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p11", img: "images/pic11.jpg", label: "", date: "2026-03-08 14:20", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p12", img: "images/pic12.jpg", label: "", date: "2026-09-27 10:42", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p13", img: "images/pic13.jpg", label: "", date: "2026-11-13 23:36", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p14", img: "images/pic14.jpg", label: "", date: "2026-10-21 21:15", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p15", img: "images/pic15.jpg", label: "", date: "2026-10-21 21:18", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p16", img: "images/pic16.jpg", label: "", date: "2026-10-03 12:30", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p17", img: "images/pic17.jpg", label: "", date: "2026-05-17 18:44", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p18", img: "images/pic18.jpg", label: "", date: "2026-10-28 19:30", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p19", img: "images/pic19.jpg", label: "", date: "2025-12-05 23:50", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p20", img: "images/pic20.jpg", label: "", date: "2026-06-02 19:03", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p21", img: "images/pic21.jpg", label: "", date: "2026-11-05 22:50", c1: "#cccccc", c2: "#999999", fav: false },
    { id: "p22", img: "images/pic22.jpg", label: "", date: "2026-11-05 22:50", c1: "#cccccc", c2: "#999999", fav: false }
  ],

  /* ---------- 앨범 ---------- */
  albums: [],

  /* ---------- 최근 삭제된 항목 ---------- */
  deleted: [
    { id: "d01", img: "images/bin01.jpg", label: "", date: "2026-10-05 22:11", days: 21, c1: "#cccccc", c2: "#999999" },
    { id: "d02", img: "images/bin02.jpg", label: "", date: "2026-09-19 18:05", days: 9, c1: "#cccccc", c2: "#999999" }
  ]
};
