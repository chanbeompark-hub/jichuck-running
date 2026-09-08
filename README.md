# 🏃 1986 RUNNING CLUB

혼자 뛰지 말고, 같이 꾸준히.
1986 FITNESS 지축점이 운영하는 지축 지역 러닝 커뮤니티 소개 사이트.

- 매주 수요일 19:00–20:00
- 지축역 인근 창릉천 집결
- 왕복 약 5km · EASY / RUN / RUN+ 페이스 그룹
- RUNNING MISSION (1km 이상 러닝 = 인증 1회)

빌드 도구 없는 정적 사이트입니다. HTML/CSS/JS 파일만 있고, Cloudflare Workers 정적 호스팅으로 배포합니다.

**배포 주소** — https://running-club-1986.pcbpcb1990.workers.dev

> 오픈채팅방 개설, 구글폼 문항, 시트 자동 집계, 주간 공지 템플릿은
> [docs/운영-가이드.md](docs/운영-가이드.md) 에 정리해 두었습니다.

---

## 폴더 구조

```
public/
  index.html            # 사이트 전체 (원페이지)
  404.html              # 없는 주소로 들어왔을 때
  robots.txt
  sitemap.xml
  assets/
    css/style.css       # 전체 스타일
    js/main.js          # 카운트다운 · 메뉴 · 스크롤 모션
    favicon.svg
    og.png              # 카카오톡·검색 공유 썸네일 (1200x630)
docs/
  운영-가이드.md         # 오픈채팅 · 가입 폼 · 주간 인증 · 공지 템플릿
wrangler.jsonc          # Cloudflare 배포 설정
```

---

## 고칠 일이 있다면 여기 한 곳

### 링크 연결 — `public/index.html` 상단 `window.SITE`

주소가 생기면 여기에만 넣으면 사이트 전체 버튼에 반영됩니다.

```js
window.SITE = {
  kakaoOpenChat: "https://open.kakao.com/o/pxirsJLi",  // 오픈채팅 (연결 완료)
  joinForm:      "https://naver.me/5rebl60q",          // 가입 신청 (연결 완료)
  missionForm:   "",                                    // 인증은 오픈채팅으로 받으므로 비워둡니다
  instagram:     "https://instagram.com/...",
  naverMap:      "https://naver.me/xxxxx",             // 집결 장소 지도
  phone:         "031-000-0000"
};
```

비워두면 버튼은 그대로 보이되 "아직 신청 링크가 연결되지 않았습니다" 안내가 뜹니다.

집결 장소나 요금처럼 문구만 바꾸실 때도 `public/index.html` 한 파일만 고치면 됩니다.

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

## RUNNING MISSION 운영

1km 이상 러닝 1건 = 인증 1회.
매주 일요일, 회원이 카카오톡 오픈채팅방에 기록 사진을 올립니다 (여러 장 한 번에).
운영진은 일요일 저녁 10분 정도 시트에 옮겨 적고, 10회를 채운 회원에게 단백질 음료를 드립니다.

자세한 절차와 공지 문구는 [docs/운영-가이드.md](docs/운영-가이드.md) 에 있습니다.
