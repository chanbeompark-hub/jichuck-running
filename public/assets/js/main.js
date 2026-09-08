/* 1986 RUNNING CLUB — main.js */
(function () {
  'use strict';

  var SITE = window.SITE || {};

  /* ── 1. 링크 연결 ──────────────────────────────────────
     window.SITE 에 주소가 채워져 있으면 버튼이 실제 링크로 바뀌고,
     비어 있으면 안내 문구를 보여준다. */
  function wire(selector, url, label) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (url) {
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
        a.removeAttribute('aria-disabled');
      } else {
        a.setAttribute('href', '#join');
        a.setAttribute('data-pending', label || '');
      }
    }
  }

  wire('.js-join', SITE.joinForm, '가입 신청');
  wire('.js-kakao', SITE.kakaoOpenChat, '오픈채팅');
  wire('.js-mission', SITE.missionForm, '러닝 인증');

  if (SITE.naverMap) {
    var mapLinks = document.querySelectorAll('.js-map');
    for (var m = 0; m < mapLinks.length; m++) {
      mapLinks[m].hidden = false;
      mapLinks[m].setAttribute('href', SITE.naverMap);
      mapLinks[m].setAttribute('target', '_blank');
      mapLinks[m].setAttribute('rel', 'noopener');
    }
  }

  if (SITE.phone) {
    var phoneEls = document.querySelectorAll('.js-phone');
    for (var p = 0; p < phoneEls.length; p++) {
      phoneEls[p].hidden = false;
      phoneEls[p].innerHTML = '문의 <a href="tel:' + SITE.phone.replace(/[^0-9+]/g, '') + '">' + SITE.phone + '</a>';
    }
  }

  var footLinks = document.getElementById('footLinks');
  if (footLinks) {
    var items = [
      ['카카오톡 오픈채팅', SITE.kakaoOpenChat],
      ['가입 신청', SITE.joinForm],
      ['러닝 인증', SITE.missionForm],
      ['인스타그램', SITE.instagram]
    ];
    var html = '';
    for (var f = 0; f < items.length; f++) {
      if (items[f][1]) {
        html += '<li><a href="' + items[f][1] + '" target="_blank" rel="noopener">' + items[f][0] + ' ↗</a></li>';
      }
    }
    footLinks.innerHTML = html;
  }

  var joinNote = document.getElementById('joinNote');
  if (joinNote && (SITE.joinForm || SITE.kakaoOpenChat)) {
    joinNote.textContent = '가입 후 오픈채팅으로 집결 장소와 주차 안내를 보내드립니다.';
  }

  /* ── 2. 다음 수요일 19:00 카운트다운 ───────────────── */
  var cdValue = document.getElementById('countdownValue');

  function nextRun(now) {
    var target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0, 0);
    var days = (3 - now.getDay() + 7) % 7; // 3 = 수요일
    target.setDate(target.getDate() + days);
    if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 7);
    return target;
  }

  function tickCountdown() {
    if (!cdValue) return;
    var now = new Date();

    // 수요일 19:00~20:00 사이에는 "진행 중"
    if (now.getDay() === 3 && now.getHours() >= 19 && now.getHours() < 20) {
      cdValue.textContent = '지금 창릉천에서 진행 중 🏃';
      return;
    }

    var diff = nextRun(now).getTime() - now.getTime();
    var totalMin = Math.floor(diff / 60000);
    var d = Math.floor(totalMin / 1440);
    var h = Math.floor((totalMin % 1440) / 60);
    var mi = totalMin % 60;

    var out = [];
    if (d > 0) out.push(d + '일');
    if (d > 0 || h > 0) out.push(h + '시간');
    out.push(mi + '분');
    cdValue.textContent = out.join(' ');
  }

  tickCountdown();
  setInterval(tickCountdown, 30000);

  /* ── 3. 내비게이션 ────────────────────────────────── */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? '메뉴 열기' : '메뉴 닫기');
      mobileMenu.hidden = open;
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
        mobileMenu.hidden = true;
      }
    });
  }

  var navProgress = document.getElementById('navProgress');

  function onScroll() {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 12);

    if (navProgress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      navProgress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
  }

  var ticking = false;
  function requestScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }

  onScroll();
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });

  /* ── 4. 스크롤 등장 + 현재 섹션 표시 ──────────────── */
  // .stagger 도 함께 관찰한다. reveal 을 빼먹으면 자식이 계속 투명하게 남기 때문.
  var reveals = document.querySelectorAll('.reveal, .stagger');

  // 순차 등장용 순번 부여 (--i)
  var staggers = document.querySelectorAll('.stagger');
  for (var st = 0; st < staggers.length; st++) {
    var kids = staggers[st].children;
    for (var k = 0; k < kids.length; k++) {
      kids[k].style.setProperty('--i', String(k));
    }
  }
  var heroReveals = document.querySelectorAll('.hero .reveal');
  for (var hr = 0; hr < heroReveals.length; hr++) {
    heroReveals[hr].style.setProperty('--i', String(hr));
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    for (var r2 = 0; r2 < reveals.length; r2++) io.observe(reveals[r2]);

    var navLinks = document.querySelectorAll('.nav__links a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        for (var n = 0; n < navLinks.length; n++) {
          navLinks[n].classList.toggle(
            'is-active',
            navLinks[n].getAttribute('href') === '#' + en.target.id
          );
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    ['weekly', 'location', 'groups', 'mission', 'price'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  } else {
    for (var r3 = 0; r3 < reveals.length; r3++) reveals[r3].classList.add('is-in');
  }

  // 마지막 안전장치: 5초가 지나도 화면 안에 있는데 안 나타난 요소는 그냥 보여준다.
  setTimeout(function () {
    for (var g = 0; g < reveals.length; g++) {
      var el = reveals[g];
      if (el.classList.contains('is-in')) continue;
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) el.classList.add('is-in');
    }
  }, 5000);

  /* ── 5. 연도 ──────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
