/* =========================================================
   콘텐츠 → 상세페이지 DOM 생성
   ========================================================= */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/* *별표* → 강조 <em> */
function acc(s) {
  return esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
/* 여러 줄(개행) → 강조 적용한 <p> 목록 */
function ml(str) {
  return String(str || '').split('\n').map(l => `<p>${acc(l)}</p>`).join('');
}
/* 여러 줄 → 강조 없이(별표를 글자 그대로) <p> 목록 */
function mlPlain(str) {
  return String(str || '').split('\n').map(l => `<p>${esc(l)}</p>`).join('');
}
/* 배경 이미지 스타일 */
function bg(url) {
  return `background-image:url('${String(url).replace(/'/g, "\\'")}')`;
}

function renderPage(c) {
  const tailFor = col => col === 'orange' ? A + 'deco_tail_orange.svg' : A + 'deco_tail_teal.svg';

  /* ---------- 01 ---------- */
  const special = c.s1.special.map(sp => `
    <div class="card special-card">
      <div class="ico"><img src="${esc(sp.icon)}" alt=""></div>
      <p class="t ${sp.color}">${esc(sp.title)}</p>
      <div class="b">${ml(sp.body)}</div>
    </div>`).join('');

  const s1 = `
  <section class="sec sec01 col">
    <div class="bg-deco"></div>
    <div class="col w1080 s1-title">
      <div class="s1-bub">${esc(c.s1.badge)}<img class="tail" src="${A}deco_tail.svg" alt=""></div>
      <div class="s1-headline">${
        (c.s1.title1On !== false ? `<p>${esc(c.s1.title1)}</p>` : '') +
        (c.s1.title2On !== false ? `<p class="l2">${esc(c.s1.title2)}</p>` : '')
      }</div>
      <div class="s1-sub">${mlPlain(c.s1.sub)}</div>
    </div>
    <div class="s1-product">
      <div class="ph product" style="${bg(c.s1.product)}"></div>
      <div class="bubble">
        <img src="${A}deco_bubble.svg" alt="">
        <div class="txt">${mlPlain(c.s1.bubble)}</div>
      </div>
      ${c.s1.badgeOn !== false ? `<div class="badge">${mlPlain(c.s1.badgeCircle)}</div>` : ''}
    </div>
    <div class="col w1080 s1-brand">
      <div class="bar-title">${esc(c.s1.brandBar)}</div>
      <div class="card brand-box col">
        <p class="t">${esc(c.s1.brandTitle)}</p>
        <div class="b acc-teal">${ml(c.s1.brandBody)}</div>
      </div>
    </div>
    <div class="col w1080 s1-special">
      <div class="bar-title">${esc(c.s1.specialBar)}</div>
      <div class="special-grid">${special}</div>
    </div>
  </section>`;

  /* ---------- 02 ---------- */
  const points = c.s2.points.map(p => `
    <div class="col point">
      <div class="col head">
        <div class="label ${p.color === 'orange' ? 'orange' : ''}">${esc(p.label)}<img class="tail" src="${tailFor(p.color)}" alt=""></div>
        <div class="ptitle acc-${p.color}">${ml(p.title)}</div>
        ${(p.noteOn !== false && p.note) ? `<p class="pnote">${esc(p.note)}</p>` : ''}
      </div>
      <div class="imgbox" style="${bg(p.image)}"></div>
    </div>`).join('');
  const s2 = `<section class="sec sec02 col">${points}</section>`;

  /* ---------- 03 ---------- */
  const cautions = c.s3.cautions.map(t => `
    <div class="row"><div class="dot"><span></span></div><div class="txt">${esc(t)}</div></div>`).join('');
  const rows = c.s3.table.map(r => `
    <div class="trow">
      <div class="tname">${esc(r.name)}</div>
      <div class="tval ${r.sm ? 'sm' : ''}">${mlPlain(r.value)}</div>
    </div>`).join('');
  const s3 = `
  <section class="sec sec03 col">
    <div class="col s3-group">
      <div class="bar-title">${esc(c.s3.kitBar)}</div>
      <div class="s3-cont">
        <div class="kit-imgbox" style="${bg(c.s3.kit)}"></div>
        <div class="info-box">
          <div class="info-tag beige">${esc(c.s3.infoTag)}</div>
          <div class="single">${mlPlain(c.s3.infoBody)}</div>
        </div>
        <div class="info-box">
          <div class="info-tag orange">${esc(c.s3.cautionTag)}</div>
          <div class="info-list">${cautions}</div>
        </div>
      </div>
    </div>
    <div class="col s3-group">
      <div class="bar-title">${esc(c.s3.gosiBar)}</div>
      <div class="gosi">
        <div class="gosi-img" style="${bg(c.s3.gosi)}"></div>
        <div class="gosi-table">
          ${rows}
          ${(c.s3.gosiNoteOn !== false && c.s3.gosiNote) ? `<p class="gnote">${esc(c.s3.gosiNote)}</p>` : ''}
        </div>
      </div>
    </div>
  </section>`;

  /* ---------- 04 ---------- */
  const s4 = `
  <section class="sec sec04 col">
    <div class="bar-title">${esc(c.s4.bar)}</div>
    <div class="s4-card">
      <div class="s4-text">
        <div class="t acc-teal">${ml(c.s4.title)}</div>
        <div class="b">${mlPlain(c.s4.body)}</div>
      </div>
      <div class="s4-img" style="${bg(c.s4.image)}"></div>
    </div>
  </section>`;

  return s1 + s2 + s3 + s4;
}

/* =========================================================
   썸네일 (1000×1000) 렌더
   ========================================================= */
function renderThumb(c) {
  // 페이지 요소(.thumb) 내부에 들어갈 내용만 반환
  return `
    <div class="th-product" style="${bg(c.product)}"></div>
    ${c.logoOn !== false ? `<div class="th-logo" style="${bg(A + 'thumb_brandlogo.png')}"></div>` : ''}
    ${c.eatdongOn !== false ? `
      <div class="th-eatdong${c.logoOn === false ? ' shift-left' : ''}">
        <div class="bubble"><img src="${A}thumb_eatdong_bubble.svg" alt=""></div>
        <img class="logo" src="${A}thumb_eatdong.svg" alt="">
      </div>` : ''}
    ${(c.badgeOn !== false && c.badgeText) ? `<div class="th-badge">${mlPlain(c.badgeText)}</div>` : ''}`;
}

/* =========================================================
   배너 (4종) 렌더
   ========================================================= */
function bnDate(c) {
  return `<img class="bg" src="${A}banner_date_bg.svg" alt="">
          <img class="vec" src="${A}banner_date_vec.svg" alt="">
          <div class="dtxt"><p>${esc(c.dateLine1)}</p><p class="p2">${esc(c.dateLine2)}</p></div>`;
}
function bnEatdong() {
  return `<div class="bubble"><img src="${A}thumb_eatdong_bubble.svg" alt=""></div>
          <img class="logo" src="${A}thumb_eatdong.svg" alt="">`;
}
/* 메인/하단AD 공통 우측 라벨 블록 (400×400 내부) */
function bnRightBlock(c) {
  return `
    <div class="bn-prod" style="${bg(c.product)}"></div>
    <div class="bn-gwa"><p>교과</p><p>연계</p></div>
    <div class="bn-date">${bnDate(c)}</div>
    <div class="bn-eatdong">${bnEatdong()}</div>
    <div class="bn-logo" style="${bg(A + 'thumb_brandlogo.png')}"></div>`;
}

function renderBanner1(c) {
  return `
    <div class="bn-titleblock b1-title">
      <div class="bn-title">${ml(c.title)}</div>
      <p class="bn-sub">${esc(c.sub)}</p>
    </div>
    <div class="bn-imgbox b1-imgbox">${bnRightBlock(c)}</div>`;
}
function renderBanner3(c) {
  return `
    <div class="bn-titleblock b3-title">
      <div class="bn-title">${ml(c.title)}</div>
      <p class="bn-sub">${esc(c.sub)}</p>
    </div>
    <div class="bn-imgbox b3-imgbox">${bnRightBlock(c)}</div>`;
}
function renderBanner2(c) {
  return `
    <p class="bn2-text">${acc(c.title)}</p>
    <div class="bn2-imgbox">
      <div class="bn2-prod" style="${bg(c.product)}"></div>
      <div class="bn2-logo" style="${bg(A + 'thumb_brandlogo.png')}"></div>
    </div>`;
}
/* =========================================================
   캐러셀 (인스타 스토리 / 캐러셀) 렌더 — 구조 동일, 크기는 CSS(.cz1/.cz2)로 분기
   ========================================================= */
function renderCz(c, blob) {
  // z-order(뒤→앞): 블롭 → 상품박스 → 뱃지 → 날짜 → 가격 → 말풍선/타이틀 → 로고  (Figma 순서와 동일)
  return `
    <div class="cz-blob" style="${bg(A + blob)}"></div>
    <div class="cz-box">
      <div class="cz-img" style="${bg(c.image)}"></div>
      <div class="cz-cap"><p class="t">${esc(c.captionTop)}</p><p class="b">${esc(c.captionBottom)}</p></div>
    </div>
    <div class="cz-badges">
      <div class="bz free"><p>무료</p><p>배송</p></div>
      <div class="bz gwa"><p>교과</p><p>연계</p></div>
    </div>
    <div class="cz-date">
      <img class="bg" src="${A}cz_date_bg.svg" alt="">
      <img class="vec" src="${A}cz_date_vec.svg" alt="">
      <div class="dtxt"><p>${esc(c.dateLine1)}</p><p class="p2">${esc(c.dateLine2)}</p></div>
    </div>
    <div class="cz-price"><span class="lbl">${esc(c.priceLabel)}</span><span class="val">${esc(c.priceValue)}</span></div>
    <div class="cz-head">
      <div class="cz-pillwrap">
        <div class="cz-pill">${esc(c.pill)}</div>
        <img class="cz-tail" src="${A}cz_tail.svg" alt="">
      </div>
      <div class="cz-title">${ml(c.title)}</div>
    </div>
    <img class="cz-logo" src="${A}cz_logo.svg" alt="">`;
}
function renderCzInsta(c) { return renderCz(c, 'cz_blob_insta.svg'); }
function renderCzCarousel(c) { return renderCz(c, 'cz_blob_cz.svg'); }

function renderBanner4(c) {
  return `
    <div class="b4-imgbox">
      <div class="b4-prod" style="${bg(c.product)}"></div>
      <div class="b4-logo" style="${bg(A + 'thumb_brandlogo.png')}"></div>
      <div class="bn-date b4-date">${bnDate(c)}</div>
      <div class="bn-eatdong b4-eatdong">${bnEatdong()}</div>
    </div>
    <div class="b4-title">
      <p class="bn4-sub">${esc(c.sub)}</p>
      <p class="bn4-title">${acc(c.title)}</p>
    </div>`;
}
