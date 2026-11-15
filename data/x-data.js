/* =========================================================
   x-data.js  —  X(트위터) 앱의 모든 내용 (가상 시뮬레이션)
   ---------------------------------------------------------
   ※ 이 안의 인물, 그룹, 언론사, 게시물, 쪽지는 모두 지어낸 내용이에요.
      실제 인물이나 사건과 관계없어요.

   고치는 방법
   - 따옴표 "" 안의 글자만 바꾸세요. 쉼표 , 는 지우지 마세요.
   - 게시물 한 개 = { } 한 덩어리. 복사해서 붙이면 늘어나고, 지우면 줄어요.
   - 사진을 쓰려면 images 폴더에 올리고 img: "images/파일이름.jpg" 처럼 적으세요.
   ========================================================= */

window.X_DATA = {

  /* ---------- 내 계정 ---------- */
  me: {
    name: "VIXX LEO 정택운",
    handle: "@JUNGTW LEO",
    bio: "정택운. leo of muse 늘 오래가자",
    joined: "2015년 9월",
    following: "9",
    followers: "49.5만",
    postCount: "2,184",
    img: "images/x-profile.jpg",          // 프로필 사진 (예: "images/profile.jpg"). 비우면 기본 아바타
    headerImg: "images/x-header.jpg",    // 헤더 사진 (예: "images/header.jpg"). 비우면 기본 배경
    color: "#5b6bd6",
    verified: true
  },

  /* ---------- 다른 계정들 (id: 정보) ---------- */
  users: {
    starlit:  { name: "별",      handle: "@starlit_0412",  color: "#e0709b", img: "images/x-av-1.jpg" },
    moon:     { name: "달달이..",         handle: "@dalmuri_o",     color: "#6b7fd7", img: "images/x-av-2.jpg" },
    pol:      { name: "폴",           handle: "@poleee_n",      color: "#e08a4c", img: "images/x-av-3.jpg" },
    file:     { name: "파일",           handle: "@file_1170",     color: "#4aa88f", img: "images/x-av-6.jpg" },
    mina:     { name: "얀니",           handle: "@mina_nova",     color: "#c065c9", img: "images/x-av-5.jpg" },
    sora:     { name: "후한",           handle: "@sora_nv",       color: "#3d9bd1", img: "images/x-default.jpg" },
    haru:     { name: "하루",           handle: "@haru_0919",     color: "#d1a13d", img: "images/x-default.jpg" },
    jun:      { name: "준냥",         handle: "@junimom_",      color: "#8a6bd1", img: "images/x-av-4.jpg" },
    yeon:     { name: "둡",           handle: "@yeondu_ss",     color: "#5aa65a", img: "images/x-default.jpg" },
    bomi:     { name: "쭈",           handle: "@bomi_bomi7",    color: "#d16b6b", img: "images/x-default.jpg" },
    ara:      { name: "아라",           handle: "@ara_0222",      color: "#4f7fb5", img: "images/x-default.jpg" },
    nuri:     { name: "꿍",           handle: "@nuri_lov",      color: "#b5704f", img: "images/x-default.jpg" },
    news:     { name: "가상연예뉴스",   handle: "@gasang_ent",    color: "#2b2f36", verified: true },
    official: { name: "LEO 정택운",  handle: "@OFFICIALJTW_LEO", color: "#111827", verified: true },
    haon:     { name: "VIXX_KEN",      handle: "@jaehwany0406",     color: "#3b82a0", verified: true, img: "images/a4.jpg" },
    ian:      { name: "차학연 VIXX_N",      handle: "@CHA_NNNNN",      color: "#a05a3b", verified: true, img: "images/a3.jpg" },
    sion:     { name: "냥운 NYANGWOON",      handle: "@nyangwoon",     color: "#5a8f3b", verified: true, img: "images/a1.jpg" },
    f01: { name: "밤톨", handle: "@bamhaneul_88", color: "#8899a6", img: "images/x-default.jpg" },
    f02: { name: "쪼꼬", handle: "@choco_uyu", color: "#8899a6", img: "images/x-default.jpg" },
    f03: { name: "새벽냥", handle: "@dawn_mood_", color: "#8899a6", img: "images/x-default.jpg" },
    f04: { name: "라일..락", handle: "@lilac_0307", color: "#8899a6", img: "images/x-default.jpg" },
    f05: { name: "몽실몽실", handle: "@mongsil_ii", color: "#8899a6", img: "images/x-default.jpg" },
    f06: { name: "하늘멍", handle: "@skyhue_1", color: "#8899a6", img: "images/x-default.jpg" },
    f07: { name: "말랑♡", handle: "@marshmal_lo", color: "#8899a6", img: "images/x-default.jpg" },
    f08: { name: "쟌쟌", handle: "@yunseul_nv", color: "#8899a6", img: "images/x-default.jpg" },
    f09: { name: "소금뭉", handle: "@saltbread_9", color: "#8899a6", img: "images/x-default.jpg" },
    f10: { name: "재란", handle: "@cloud_gureum", color: "#8899a6", img: "images/x-default.jpg" },
    f11: { name: "귤귤", handle: "@oj_juice00", color: "#8899a6", img: "images/x-default.jpg" },
    f12: { name: "켄뭉이", handle: "@film_cam_", color: "#8899a6", img: "images/x-default.jpg" },
    f13: { name: "별냥", handle: "@stardrop_7", color: "#8899a6", img: "images/x-default.jpg" },
    f14: { name: "한", handle: "@midnight_ok", color: "#8899a6", img: "images/x-default.jpg" },
    f15: { name: "두부", handle: "@dubu_dubu_", color: "#8899a6", img: "images/x-default.jpg" },
    q1: { name: "놈", handle: "@mango_bingsu_", color: "#8899a6", img: "images/x-default.jpg" },
    q2: { name: "72", handle: "@dubu_dduk", color: "#8899a6", img: "images/x-default.jpg" },
    q3: { name: "하늘", handle: "@bamhaneul_9", color: "#8899a6", img: "images/x-default.jpg" },
    q4: { name: "Ree", handle: "@somsatang_n", color: "#8899a6", img: "images/x-default.jpg" },
    q5: { name: "오월이..", handle: "@omwol_0501", color: "#8899a6", img: "images/x-default.jpg" },
    q6: { name: "차도", handle: "@cherry_cc0", color: "#8899a6", img: "images/x-default.jpg" },
    q7: { name: "나루", handle: "@naru_nv", color: "#8899a6", img: "images/x-default.jpg" },
    q8: { name: "Nnn", handle: "@byeolddong_", color: "#8899a6", img: "images/x-default.jpg" },
    q9: { name: "라떼", handle: "@latte_0807", color: "#8899a6", img: "images/x-default.jpg" },
    q10: { name: "냐나냥", handle: "@yuna_nova1", color: "#8899a6", img: "images/x-default.jpg" },
    q11: { name: "사바기..", handle: "@haeil_00", color: "#8899a6", img: "images/x-default.jpg" },
    q12: { name: "기억상자", handle: "@kongi_nv", color: "#8899a6", img: "images/x-default.jpg" },
    q13: { name: "댄", handle: "@miso_0214", color: "#8899a6", img: "images/x-default.jpg" },
    q14: { name: "별뭉", handle: "@horang_nv", color: "#8899a6", img: "images/x-default.jpg" },
    q15: { name: "다온", handle: "@daon_nova", color: "#8899a6", img: "images/x-default.jpg" },
    q16: { name: "김운진", handle: "@luna_0630", color: "#8899a6", img: "images/x-default.jpg" },
    q17: { name: "녁", handle: "@saebyeok_s", color: "#8899a6", img: "images/x-default.jpg" },
    q18: { name: "00", handle: "@gaeul_1019", color: "#8899a6", img: "images/x-default.jpg" },
    q19: { name: "리온", handle: "@rion_nv", color: "#8899a6", img: "images/x-default.jpg" },
    q20: { name: "수", handle: "@suryeon_n", color: "#8899a6", img: "images/x-default.jpg" },
    q21: { name: "minaa♡", handle: "@minak_nova", color: "#8899a6", img: "images/x-default.jpg" },
    q22: { name: "토마토", handle: "@haneul_0723", color: "#8899a6", img: "images/x-default.jpg" },
    q23: { name: "뭉", handle: "@bori_nv", color: "#8899a6", img: "images/x-default.jpg" },
    q24: { name: "토리..", handle: "@dami_dm", color: "#8899a6", img: "images/x-default.jpg" },
    q25: { name: "별랑", handle: "@onyu_nova", color: "#8899a6", img: "images/x-default.jpg" },
    d1: { name: "누룽", handle: "@_nurun9", color: "#8899a6", img: "images/x-dm-n1.jpg" },
    d2: { name: "듀", handle: "@dyu1110", color: "#8899a6", img: "images/x-dm-n2.jpg" },
    d3: { name: "묘", handle: "@myomyom_", color: "#8899a6", img: "images/x-dm-n3.jpg" },
    d4: { name: "우연", handle: "@thethingabtlove", color: "#8899a6", img: "images/x-dm-n4.png" },
    d5: { name: "도리", handle: "@20160421_", color: "#8899a6", img: "images/x-dm-n5.jpg" },
    andus:  { name: "ANDUS 앤더스", handle: "@ANDUS_OFFICIAL", color: "#1f2937", verified: true, img: "images/andus.png" },   // 가상 아이돌 앤더스 공식 계정
    dohyun: { name: "서도현", handle: "@seo_dohyun_", color: "#6b7fd7", verified: true, img: "images/x-default.jpg" },
    ask: { name: "질문함", handle: "@ask_box_", color: "#8899a6", img: "images/x-default.jpg" },
    qa: { name: "익명", handle: "@anon_say", color: "#8899a6", img: "images/x-default.jpg" },
    chill: { name: "Chilling", handle: "@chilling_off", color: "#8899a6", img: "images/x-black.jpg" },
    nyang: { name: "낭운이", handle: "@nyangyun_doll", color: "#8899a6", img: "images/x-a1.jpg" }
  },

  /* ---------- 게시물 ----------
     u      : 쓴 사람 (위 users 의 id, 내가 쓴 건 "me")
     time   : 올린 시간 글자
     feed   : 어느 탭에 보일지 ["rec"]=추천, ["fol"]=팔로잉
     media  : 사진 자리 { label:"설명", c1:"#색", c2:"#색" } (img:"images/..." 도 가능)
     quote  : 인용 게시물 { name, handle, text }
     replies: 답글 목록 (없으면 기본 답글이 나와요)
     quotes : 인용 목록
     pinned : true 면 프로필 맨 위에 고정
  */
  tweets: [
    {"id": "x01", "u": "f01", "time": "20분", "feed": ["rec"], "text": "타팬인데 ㅇㄷㅅ ㅎ이랑 ㅂㅅ ㄹㅇ 진짜 사귀는거 아님?\n커플템 한두개도 아니고 너무 겹침 나 약간 진심될 것 같아..ㅠ", "likes": 8, "rts": 2, "rep": 18, "qn": 35, "views": 300, "replies": [{"u": "q2", "time": "3분", "text": "타팬이면 걍 갈길가셈...", "likes": 60}, {"u": "q3", "time": "10분", "text": "님 옵이랑 ㅇㄷㅅ ㅎ이랑 친분 있는데 그럼 둘도 사귀는거임? 개나대😅😅", "likes": 88}], "quotes": [{"u": "q4", "time": "10분", "text": "커플템 겹치거나 같이 입는거 ㅈㄴ흔한일인데ㅜㅜ;;", "likes": 15}]},
    {"id": "x02", "u": "f02", "time": "3분", "feed": ["rec"], "text": "탟이랑 본인만 (💕) 티내놓고 칭긔는 그냥 똥때지(💢) 취급하는거ㄱㅇㄱ 내 주변에 이런 커플 있으면 다신 안만나;;", "media": {"img": "images/tweet1.png"}, "likes": 1100, "rts": 204, "rep": 0, "qn": 8, "views": 12100, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x03", "u": "andus", "time": "5분", "feed": ["rec", "fol"], "text": "[📸]\n🐻🦁🐷", "media": {"c1": "#c9d3e6", "c2": "#8fa3c7", "label": "", "img": "images/tweet9.jpg"}, "likes": 23000, "rts": 11000, "rep": 608, "qn": 621, "views": 330000, "replies": [{"u": "q5", "time": "3분", "text": "돼지 누구얔ㅋㅋㅋㅋㅋㅋ", "likes": 60}, {"u": "q6", "time": "10분", "text": "도현이가 버블로 혁이 혼낸다.. 왜 자기 돼지냐곸ㅋㅋㅋㅋㅋㅋㅋㅋ", "likes": 88}, {"u": "q7", "time": "17분", "text": "HAHHAHAHAHAHA YESS", "likes": 120}, {"u": "q8", "time": "24분", "text": "울 곰아지.ᐟ.ᐟ.ᐟ >_< ", "likes": 12}, {"u": "q9", "time": "31분", "text": "🦁..? 🦁?!!!!!!!", "likes": 8}, {"u": "dohyun", "time": "38분", "text": "저 돼지에요?", "likes": 4800}, {"u": "q10", "time": "45분", "text": "헐 설마 택운님도 같이 갔어???", "likes": 88}, {"u": "q11", "time": "52분", "text": "IM SOFT", "likes": 60}, {"u": "q12", "time": "59분", "text": "엉ㅠ내 곰도리야", "likes": 120}, {"u": "q13", "time": "66분", "text": "화사하게 잘생겼어 너무 이뻐", "likes": 8}, {"u": "q14", "time": "73분", "text": "OMGG T___T", "likes": 5}, {"u": "q15", "time": "80분", "text": "우리 고양이가 여기 있대서...👀", "likes": 60}], "quotes": []},
    {"id": "x04", "u": "f03", "time": "41분", "feed": ["rec"], "text": "혁이 ㅇㅎㅅ 갔다고???\n아 나 두시간 전에 갔다왔는데ㅠㅠㅠㅠㅠ", "likes": 38, "rts": 1, "rep": 3, "qn": 3, "views": 418, "replies": [{"u": "q16", "time": "3분", "text": "아 우리 다시 가자", "likes": 21}, {"u": "q17", "time": "10분", "text": "도현이랑 같이 간 듯 ᐟ.ᐟ.ᐟ ㅜㅜ", "likes": 8}, {"u": "q18", "time": "17분", "text": "헐 개아까워..", "likes": 5}], "quotes": []},
    {"id": "x05", "u": "f04", "time": "11분", "feed": ["rec"], "text": "나 ㅇㄷㅅ랑 ㅂㅅ 다 잘 몰루는데\n씨피 입덕부터 해버림", "likes": 62, "rts": 0, "rep": 0, "qn": 0, "views": 682, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x06", "u": "f05", "time": "14분", "feed": ["rec"], "text": "271022 앤더스 혁 인스타 라이브 빅스 레오님 언급!!😳\n보자마자 입술 들이미시고(ㅇㄱ ㅈㅉㅇㅇ?)\n생각보다 애교 엄청 많고 본인이랑 자주 만나신다구..", "likes": 13000, "rts": 6800, "rep": 0, "qn": 388, "views": 204000, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x07", "u": "f06", "time": "18분", "feed": ["rec"], "text": "🔓 혁이 왜 입술 들이민다고 뭐라하다가 \n갑자기 웃음못참고 환하게 웃음?\n웃긴게 생각나서 이럼ㅇㅈㄹ 아무도안믿어;;", "likes": 212, "rts": 0, "rep": 4, "qn": 3, "views": 2332, "replies": [{"u": "q19", "time": "3분", "text": "그니까 개웃김 애인생각에 정신못차리시네 ", "likes": 88}, {"u": "q20", "time": "10분", "text": "뭐라할때도 행복해보임 둘이먼사이냐", "likes": 3}, {"u": "q21", "time": "17분", "text": "마히따... 능글연상수ㅆㄱㄴ", "likes": 120}], "quotes": []},
    {"id": "x08", "u": "f07", "time": "22분", "feed": ["rec"], "text": "나 오늘 혃탟 때문에 처음으로 빅스 노래 찾아봄\n아니 사슬 듣고 있는데 이거 맞아?\n혁이가 이 노래 왜 추천했는지 알겠다", "likes": 202, "rts": 0, "rep": 0, "qn": 1, "views": 2222, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x09", "u": "andus", "time": "27분", "feed": ["rec", "fol"], "text": "[✌] 다이죠부이데쇼~\n\n▶ vt.tiktok.com/hsovvvtt/\n\n#ANDUS #앤더스\n#Sanghyuk #한상혁 #혁", "media": {"c1": "#c9d3e6", "c2": "#8fa3c7", "label": "", "img": "images/tweet6.png"}, "likes": 11000, "rts": 4800, "rep": 0, "qn": 187, "views": 144000, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x10", "u": "f08", "time": "33분", "feed": ["rec"], "text": "저도 어리둥절하네요 원래 서로 언급 별로 없었는데 맨 처음에는 연하가 요즘 친한 선배님도 계셔서 음방 다니는 것도 더 재밌어졌다~ 이정도로 말했는데\n이틀뒤부터 갑자기 폭주함.. 휀걸들 서로 황당 \n근데 예상외로(사실 예상대로) 맛잇어...... \nㅍㅡㅍ X ^ㅡ^ 이조합 어케 안먹음이", "card": {"site": "Spin spin", "title": "요즘 혁택 왜 이렇게 뜨는 거예요? 입덕한 지 얼마 안 돼서 아무것도 모름", "src": "spin-spin.com"}, "likes": 2500, "rts": 238, "rep": 0, "qn": 8, "views": 27500, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x11", "u": "f09", "time": "39분", "feed": ["rec"], "text": "혁이 버블 말투 너무 귀여움\n🔓자꾸 어떤분(🦁) 닮아가는 것 같음.......", "likes": 391, "rts": 173, "rep": 0, "qn": 2, "views": 5190, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x12", "u": "f10", "time": "46분", "feed": ["rec"], "text": "[📸] 261111 혁 버블\n나는 아는형이랑 만나서 밥 먹으러와따!\n당연히 내가 사줬지😎😎\n🦁\n형 너무 애기야\n나 보면 찡찡대기만 해\n\n>>찡찡대기만 해<< 하 개뿜 택운님 5살 연하에게 대체 어떤 애교를 부리시는거임", "media": {"c1": "#c9d3e6", "c2": "#8fa3c7", "label": "", "img": "images/tweet5.png"}, "likes": 8700, "rts": 4900, "rep": 0, "qn": 639, "views": 147000, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x13", "u": "andus", "time": "54분", "feed": ["rec", "fol"], "text": "[상혁] 몰래 다녀온 빅스 콘서트!\n멋있는 형들 본받아갑니닷", "media": {"c1": "#c9d3e6", "c2": "#8fa3c7", "label": "", "img": "images/tweet2.jpg"}, "likes": 48000, "rts": 21000, "rep": 809, "qn": 431, "views": 630000, "replies": [{"u": "q22", "time": "3분", "text": "하졸귀ㅠㅠㅠㅠ왜몰래갔어ㅠㅠㅠㅠ", "likes": 47}, {"u": "q9", "time": "10분", "text": "누가 제일 멋있었어?!!", "likes": 60}, {"u": "andus", "time": "17분", "text": "[상혁] 어렵다.. 다들 너무 멋있으셨지만\n그중에서 레오?님이 가장 멋있더라고요🤥", "likes": 11000, "to": "@latte_0807"}, {"u": "q23", "time": "24분", "text": "아긔여워ㅠㅠㅠㅠㅠㅠㅠㅠㅠ", "likes": 120}, {"u": "q24", "time": "31분", "text": "혁이도 사슬 한번 쳐줘야지", "likes": 8}, {"u": "q25", "time": "38분", "text": "같이 사진 안찍었어?!", "likes": 120}], "quotes": []},
    {"id": "x14", "u": "f11", "time": "1시간", "feed": ["rec"], "text": "크오씨피라고 욕쳐먹었는데\n떡밥 줄때마다 팔로워 무섭게 늘어남 다들 같은 마음이였구나", "likes": 102, "rts": 313, "rep": 0, "qn": 41, "views": 9390, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x15", "u": "f12", "time": "1시간", "feed": ["rec"], "text": "ㄹㅇ 붐업온듯 틱톡까지 넘어갈 수준\n보통 혃탟이라고 많이 부르지않나", "card": {"site": "Spin spin", "title": "ㅇㄷㅅ ㅎ이랑 ㅂㅅ ㄹㅇ씨피명 알려주라 요새 이 조합에 마음감ㅠ", "src": "spin-spin.com"}, "likes": 371, "rts": 3, "rep": 0, "qn": 0, "views": 4081, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x16", "u": "f13", "time": "2시간", "feed": ["rec"], "text": "앤더스 메이크스타 영통 볼콕ver 미공포 교환 구합니다\n\n저:혁\n님:도현\n\n홍대직거래가능합니다 \n그 외 반택도 가능하니 편하게 연락주세요 🙇‍♀️\n앤더스 ANDUS 포토카드 도현 정현 건빈 지혁 니코 렌 buy sell", "likes": 3, "rts": 0, "rep": 0, "qn": 1, "views": 300, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x17", "u": "f14", "time": "2시간", "feed": ["rec"], "text": "오늘 메보즈 약속있다는데‼️‼️‼️😤😤😤\n@kain_0406 사진 남겨주는거지 그치", "likes": 82, "rts": 0, "rep": 0, "qn": 0, "views": 902, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x18", "u": "f15", "time": "3시간", "feed": ["rec"], "text": "혁이 얼굴ㄹㅈㄷ죽고싶다\n니코는 같그룹이라 좋겠다 이 얼굴 맨날봄", "likes": 1400, "rts": 96, "rep": 14, "qn": 6, "views": 15400, "replies": [], "quotes": []},
    {"id": "x19", "u": "q1", "time": "3시간", "feed": ["rec"], "text": "어떤 노래를 가져와도 앤더스 1집 절대못이김 \n퇴근길에 들으면 뤼얼존좋/////♡♡", "likes": 880, "rts": 64, "rep": 9, "qn": 3, "views": 9680, "replies": [], "quotes": []},
    {"id": "x20", "u": "q2", "time": "4시간", "feed": ["rec"], "text": "나 이날 못 잊음..\n남자 말투 >>>웅 잘자 사랑해<<<\n우리 없을때는 뒤에서 이랬다고?ㅈㄴ열오름 ", "media": {"c1": "#c9d3e6", "c2": "#8fa3c7", "label": "", "img": "images/tweet3.jpg"}, "quote": {"name": "VIXX KEN", "handle": "@jaehwany0406", "text": "우이태구우우우우우우니 나보다 애교많아지자나컼!!!! 심.쿵.!!!!!!💕💕😚😚😚😚"}, "likes": 8600, "rts": 3200, "rep": 0, "qn": 137, "views": 96000, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x21", "u": "q3", "time": "5시간", "feed": ["rec"], "text": "paw, paw! - #한상혁 들어보세요🐾", "media": {"c1": "#c9d3e6", "c2": "#8fa3c7", "label": "", "img": "images/tweet8.png"}, "likes": 1900, "rts": 140, "rep": 12, "qn": 5, "views": 20900, "replies": [], "quotes": []},
    {"id": "x22", "u": "q4", "time": "6시간", "feed": ["rec"], "text": "아니 왜 자꾸 공식 계정 댓글에 씨피 얘기함?꺼져좀..", "likes": 671, "rts": 108, "rep": 1, "qn": 204, "views": 7381, "replies": [{"u": "f01", "time": "3분", "text": "ㄹㅇㅠ 친한 거랑 엮는 건 다른 문제라고요 제발~~~", "likes": 3}], "quotes": [{"u": "f02", "time": "10분", "text": "불편하면 뮤트하시긔", "likes": 33}, {"u": "f03", "time": "17분", "text": "공식 계정에서 티내는 건 좀 그렇긴해ㅜ;;", "likes": 2}, {"u": "f04", "time": "24분", "text": "돌판에서 없을 수가 있나?", "likes": 2}]},
    {"id": "x23", "u": "q5", "time": "7시간", "feed": ["rec"], "text": "ㅈㅌㅇ이랑 ㅎㅈㅎ 같그룹이였으면 어땠을까 싶음\n혃이 븫이랑 잘 어울리는듯 근데 ㅅㅎ이 뽀뽀 당하느라 눈뜰 시간도 없었겠지", "likes": 284, "rts": 0, "rep": 0, "qn": 0, "views": 3124, "repliesOff": true, "replies": [], "quotes": []},
    {"id": "x24", "u": "q6", "time": "9시간", "feed": ["rec"], "text": "앤더스 팝업 의류 분철\n저: 후드집업 포카\n님: 후드집업 5.0\n\n17일 13시회차 입장예정 \n현장 거래 가능 배송 가능\n\nopen.kakao.com/o/hloool1110\n#ANDUS #앤더스 #팝업 #분철", "likes": 1, "rts": 0, "rep": 0, "qn": 0, "views": 300, "repliesOff": true, "replies": [], "quotes": []}
  ],

  /* 기본 답글 / 인용 (답글이 따로 없는 게시물에 보여요) */
  defaultReplies: [
    { u: "ara",  time: "5분",  text: "ㅠㅠㅠ 진짜 공감", likes: 24 },
    { u: "nuri", time: "9분",  text: "나도 지금 이 상태임 ㅋㅋㅋ", likes: 17 },
    { u: "sora", time: "12분", text: "일단 다들 진정하고 공식 입장 기다리자", likes: 31 },
    { u: "bomi", time: "20분", text: "이 글 보고 조금 위로 됨", likes: 9 }
  ],
  defaultQuotes: [
    { u: "mina", text: "이 말 완전 공감해요" },
    { u: "yeon", text: "결국 기다리는 수밖에…" }
  ],

  /* 내가 단 답글 (프로필 > 답글 탭) */
  myReplies: [
    { to: "@mina_nova",  time: "3일", text: "고마워. 밥 꼭 챙겨 먹고 푹 자 🌙", likes: 12400 },
    { to: "@starlit_0412", time: "1주", text: "ㅋㅋㅋ 오늘 연습 열심히 했어~", likes: 9020 },
    { to: "@sora_nv",    time: "2주", text: "다음 콘서트에서 만나요!", likes: 15200 }
  ],

  /* ---------- 알림 ----------
     type : like / repost / follow / reply / mention / quote
     n    : 이 알림이 몇 개로 세어지는지 (읽지 않은 알림의 n 합계가 배지 숫자예요 → 멘션·답글 정리 후 12)
     ref  : 누르면 열릴 게시물 id */
  notifications: [
    { type: "like",    who: "pol",     more: "외 52명", text: "회원님의 게시물을 마음에 들어합니다", time: "5분", unread: true, n: 3, ref: "t5" },
    { type: "follow",  who: "nuri",    more: "외 13명", text: "회원님을 팔로우했습니다", time: "10분", unread: true, n: 2 },
    { type: "repost",  who: "mina",    more: "외 28명", text: "회원님의 게시물을 리포스트했습니다", time: "14분", unread: true, n: 2, ref: "t5" },
    { type: "like",    who: "haru",    more: "외 108명", text: "회원님의 답글을 마음에 들어합니다", time: "40분", unread: true, n: 3, ref: "t5" },
    { type: "quote",   who: "ara",     text: "팬들한테 직접 말하는 거 쉽지 않았을 텐데 고맙다", time: "1시간", unread: true, n: 2, ref: "t5" },

    { type: "like",    who: "sora",    more: "외 41명", text: "회원님의 게시물을 마음에 들어합니다", time: "어제", unread: false, ref: "p2" },
    { type: "follow",  who: "yeon",    more: "외 6명",  text: "회원님을 팔로우했습니다", time: "어제", unread: false },
    { type: "repost",  who: "pol",     more: "외 90명", text: "회원님의 게시물을 리포스트했습니다", time: "2일", unread: false, ref: "p3" }
  ],

  /* ---------- 쪽지(DM) ----------
     msgs 의 from : "them"(상대) / "me"(나)
     unread: true 면 받은 편지함에 파란 점이 떠요 (지금 24개 → 배지 24) */
  dms: [
    { u: "starlit", unread: true, time: "방금", msgs: [
      { from: "them", day: "오늘", time: "오전 7:05", text: "저 어제 입덕했는데 이거 진짜에요 오빠?" }
    ]},
    { u: "moon", unread: true, time: "7:03", msgs: [
      { from: "them", day: "오늘", time: "오전 7:01", text: "입장문 안 내시나요?" },
      { from: "them", time: "오전 7:03", text: "언제까지 무대응하실 건데요" }
    ]},
    { u: "d1", unread: true, time: "7:00", msgs: [
      { from: "them", day: "오늘", time: "오전 6:58", text: "짜굔이랑 사귀는게 아니였다고?" },
      { from: "them", time: "오전 6:59", text: "말도안돼" },
      { from: "them", time: "오전 7:00", text: "고영이짓잔뜩하더니 날 속였어.." }
    ]},
    { u: "pol", unread: true, time: "6:52", msgs: [
      { from: "them", day: "오늘", time: "오전 6:51", text: "저는 당신의 열혈팬입니다." },
      { from: "them", time: "오전 6:52", text: "당신이 매우 실망스럽습니다. 레오는 남자를 좋아하다" }
    ]},
    { u: "jun", unread: true, time: "6:40", msgs: [
      { from: "them", day: "오늘", time: "오전 6:40", text: "내 티켓 어쩔거임ㅆㅂ" }
    ]},
    { u: "mina", unread: true, time: "6:28", msgs: [
      { from: "them", day: "오늘", time: "오전 6:27", text: "그래도 오래 좋아했는데 이건 아니잖아.." },
      { from: "them", time: "오전 6:28", text: "조용히 만나기라도 하지 왜 이렇게까지 됐어..." }
    ]},
    { u: "d3", unread: true, time: "6:10", msgs: [
      { from: "them", day: "오늘", time: "오전 6:09", text: "왠지 모르게 감사하다.." },
      { from: "them", time: "오전 6:10", text: "혁이랑 오래오래 행복하세요" }
    ]},
    { u: "file", unread: true, time: "5:58", msgs: [
      { from: "them", day: "오늘", time: "오전 5:58", text: "그럴줄 알았다" }
    ]},
    { u: "haru", unread: true, time: "5:40", msgs: [
      { from: "them", day: "오늘", time: "오전 5:40", text: "탈덕 절대 안해요 마음 잘 추스리고 콘서트에서 봐요ㅠㅠㅠㅠㅜㅜ" }
    ]},
    { u: "d4", unread: true, time: "5:20", msgs: [
      { from: "them", day: "오늘", time: "오전 5:19", text: "저였어도 ㅅㅎ님이라는분이랑 결혼 생각 했을 것 같아요" },
      { from: "them", time: "오전 5:20", text: "잘 어울리세요.." }
    ]},
    { u: "q17", unread: true, time: "5:05", msgs: [
      { from: "them", day: "오늘", time: "오전 5:03", text: "택운님 혹시 단독 기사 보셨어요……? " },
      { from: "them", time: "오전 5:04", text: "보자마자 너무 놀라서 디엠드려요 ㅠㅠㅠㅠ" },
      { from: "them", time: "오전 5:05", text: "괜찮으세요……?" }
    ]},
    { u: "d2", unread: true, time: "4:50", msgs: [
      { from: "them", day: "오늘", time: "오전 4:49", text: "되게 잘 어울리세요" },
      { from: "them", time: "오전 4:50", text: "왜이렇게 기분이 날아갈 것 같지" }
    ]},
    { u: "q18", unread: true, time: "4:35", msgs: [
      { from: "them", day: "오늘", time: "오전 4:34", text: "그동안 팬들한테 바쁘다 피곤하다 할 때 뒤에서는 그러고 계셨던 거예요? " },
      { from: "them", time: "오전 4:35", text: "우리가 응원하고 앨범 사준 건 연애 맘 편히 하라고 보탠 게 아닌데요" }
    ]},
    { u: "q19", unread: true, time: "4:20", msgs: [
      { from: "them", day: "오늘", time: "오전 4:19", text: "팀 지키려고 이악물고 뛸 때 기사 메인에 게이 열애설 단독 뜨게 만드네ㅋㅋㅋㅋ 진짜 멤버들한테 안 미안해요? " },
      { from: "them", time: "오전 4:20", text: "팀 이미지는 어떡할 건데" }
    ]},
    { u: "q20", unread: true, time: "4:05", msgs: [
      { from: "them", day: "오늘", time: "오전 4:04", text: "이제 더 이상 응원할 마음은 안 드네요." },
      { from: "them", time: "오전 4:05", text: "그동안 좋은 추억 만들어줘서 고마웠어요. " }
    ]},
    { u: "q21", unread: true, time: "3:50", msgs: [
      { from: "them", day: "오늘", time: "오전 3:49", text: "택운아 기사 보고 너무 놀랐지… 본인 의지도 아닌데 강제로 밝혀져서 얼마나 무섭고 힘들었을까 " },
      { from: "them", time: "오전 3:50", text: "너무 죄책감 갖지 말고 밥 잘 챙겨 먹어… 별빛들은 항상 네 편이야." }
    ]},
    { u: "d5", unread: true, time: "3:30", msgs: [
      { from: "them", day: "오늘", time: "오전 3:28", text: "이 여우같은것." },
      { from: "them", time: "오전 3:29", text: "내가 짝사랑하던 오빠를 뺏어가?........" },
      { from: "them", time: "오전 3:30", text: "구미호 같은것" }
    ]},
    { u: "q22", unread: true, time: "3:15", msgs: [
      { from: "them", day: "오늘", time: "오전 3:14", text: "너가 잘못한거 하나도 없으니까 고개 숙이지 마" },
      { from: "them", time: "오전 3:15", text: "우리가 끝까지 지켜줄게" }
    ]},
    { u: "q23", unread: true, time: "3:00", msgs: [
      { from: "them", day: "오늘", time: "오전 2:58", text: "기사 뜬 거 사실이에요?" },
      { from: "them", time: "오전 2:59", text: "아니라고 한마디만 해주면 안 돼요? " },
      { from: "them", time: "오전 3:00", text: "지금 팬들 사방에서 비웃음 당하고 피눈물 흘리고 있는데 본인 입으로 해명 좀 해주세요 제발.." }
    ]},
    { u: "q24", unread: true, time: "2:45", msgs: [
      { from: "them", day: "오늘", time: "오전 2:45", text: "제발 버블 켜서 밥 잘 먹고 있다고 한마디만 해줘.." }
    ]},
    { u: "q25", unread: true, time: "2:30", msgs: [
      { from: "them", day: "오늘", time: "오전 2:27", text: "본인 연애 관리 하나 못 해서 사진 찍히고 " },
      { from: "them", time: "오전 2:28", text: "멤버들이 수년 동안 쌓아 올린 팀 커리어 한순간에 깎아먹은 건 진짜 너무한 거 아닌가요" },
      { from: "them", time: "오전 2:29", text: "택운님이 이러면 저희는 대체 누굴 믿어요" },
      { from: "them", time: "오전 2:30", text: "덕분에 헛돈 잘 썼다는 거 깨달았습니다" }
    ]},
    { u: "ara", unread: true, time: "1:50", msgs: [
      { from: "them", day: "오늘", time: "오전 1:42", text: "택운님 안녕하세요, 오랫동안 팬으로 지켜보다 처음 쪽지 드려요." },
      { from: "them", time: "오전 1:44", text: "데뷔 때부터 지금까지 무대 위의 모습만 봐 왔는데, 이번 일로 많이 놀랐어요. 솔직히 처음에는 배신감도 들었고, 하루 종일 일이 손에 안 잡혔어요." },
      { from: "them", time: "오전 1:46", text: "그런데 생각해 보니 제가 택운님한테 바라는 건 결국 행복하게 오래 노래해 주는 거더라고요. 사람은 누구나 사랑할 자유가 있는 건데 그걸 잠깐 잊고 있었어요." },
      { from: "them", time: "오전 1:48", text: "그래도 한 가지만 부탁드리고 싶어요. 소속사 입장문 말고, 도윤님의 말로 팬들에게 한 번만 더 이야기해 주세요. 길지 않아도 괜찮아요. 저희는 기다릴 수 있어요." },
      { from: "them", time: "오전 1:50", text: "마지막으로, 밥 꼭 챙겨 드시고 푹 주무세요. 늘 응원하겠습니다. 긴 글 읽어줘서 고마워요." }
    ]},
    { u: "nuri", unread: true, time: "어제", msgs: [
      { from: "them", day: "어제", time: "오후 11:07", text: "오빠 아니죠????" },
      { from: "them", time: "오후 11:08", text: "진짜 게이에요?" },
      { from: "them", time: "오후 11:09", text: "아니죠? 아니라고해" },
      { from: "them", time: "오후 11:10", text: "아니죠??" }
    ]},
    { u: "yeon", unread: true, time: "어제", msgs: [
      { from: "them", day: "어제", time: "오후 8:12", text: "너 때문에 내 인생 망했어" },
      { from: "them", time: "오후 8:13", text: "나랑 결혼하는 줄 알았는데" }
    ]}
  ],

  /* ---------- 검색 > 트렌드 ---------- */
  trends: [
    { cat: "엔터테인먼트 · 트렌드", tag: "앤더스 콘서트", count: "게시물 3.8만 개" },
    { cat: "엔터테인먼트 · 트렌드", tag: "앤더스 혁", count: "게시물 2.6만 개" },
    { cat: "대한민국 트렌드", tag: "뙈지", count: "게시물 1.7만 개" },
    { cat: "대한민국 트렌드", tag: "대회", count: "게시물 1.2만 개" },
    { cat: "엔터테인먼트 · 트렌드", tag: "남돌 이상형 월드컵", count: "게시물 8,430개" },
    { cat: "대한민국 트렌드", tag: "맛집", count: "게시물 5,912개" }
  ],

  disclaimer: ""
};
