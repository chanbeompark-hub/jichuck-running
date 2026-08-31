# 🏃 1986 RUNNING CLUB

혼자 뛰지 말고, 같이 꾸준히.
1986 FITNESS 지축점이 운영하는 지축 지역 러닝 커뮤니티 소개 사이트.

- 매주 수요일 19:00–20:00
- 지축역 인근 창릉천 집결
- 왕복 약 5km · EASY / RUN / RUN+ 페이스 그룹
- RUNNING MISSION (1km 이상 러닝 = 인증 1회)

빌드 도구 없는 정적 사이트입니다. HTML/CSS/JS 파일만 있고, Cloudflare Workers 정적 호스팅으로 배포합니다.

---

## 폴더 구조

```
public/
  index.html            # 사이트 전체 (원페이지)
  404.html              # 없는 주소로 들어왔을 때
  robots.txt
  assets/
    css/style.css       # 전체 스타일
    js/main.js          # 카운트다운 · 메뉴 · 보드 렌더링
    favicon.svg
  data/
    board.js            # RUNNING BOARD 데이터 (여기만 고치면 됨)
wrangler.jsonc          # Cloudflare 배포 설정
```

---

## 자주 고치게 되는 곳 2군데

### 1. 링크 연결 — `public/index.html` 상단 `window.SITE`

카카오톡 오픈채팅방, 구글폼 주소가 생기면 여기에만 넣으면 사이트 전체 버튼에 반영됩니다.

```js
window.SITE = {
  kakaoOpenChat: "https://open.kakao.com/o/xxxxxxx",  // 오픈채팅
  joinForm:      "https://forms.gle/xxxxxxx",         // 가입 신청 폼
  missionForm:   "https://forms.gle/yyyyyyy",         // 러닝 인증 제출 폼
  instagram:     "https://instagram.com/...",
  naverMap:      "https://naver.me/xxxxx",            // 집결 장소 지도
  phone:         "031-000-0000"
};
```

비워두면 버튼은 그대로 보이되 "아직 신청 링크가 연결되지 않았습니다" 안내가 뜹니다.

### 2. 러닝 보드 갱신 — `public/data/board.js`

구글 시트에서 집계된 회원별 인증 횟수·누적 거리를 옮겨 적습니다.

```js
window.BOARD = {
  updated: "2026-09-03",
  members: [
    { name: "김OO", count: 14, distance: 47.3 }
  ]
};
```

인증 횟수 순으로 자동 정렬되고, 20회 이상 🔥 / 10회 이상 🏃 / 그 외 👍 로 표시됩니다.

---

## 로컬에서 보기

```bash
npx wrangler dev
```

http://localhost:8787 로 열립니다.

## 배포

```bash
npx wrangler deploy
```

처음 한 번은 `npx wrangler login` 으로 Cloudflare 계정 연결이 필요합니다.
배포되면 `https://running-club-1986.<계정>.workers.dev` 주소가 나옵니다.
커스텀 도메인은 Cloudflare 대시보드 → Workers & Pages → 해당 프로젝트 → Settings → Domains & Routes 에서 연결합니다.

---

## RUNNING MISSION 인증 흐름 (운영)

```
회원 → 카카오톡 오픈채팅「러닝 인증하기」
     → Google Form (이름 / 날짜 / 거리 / 인증사진)
     → Google Sheets 자동 기록
     → 1km 이상 자동 판정 → 인증 횟수 누적
     → board.js 갱신 → 사이트 RUNNING BOARD 반영
```

혜택: 10회 🥤 단백질 음료 1개 (현재 운영) → 20회 🎟 → 30회 🎁 순으로 확대 예정.
