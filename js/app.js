/* =========================================================
   편집기 로직 (탭별 메이커 팩토리)
   - 상세페이지 / 썸네일 등 여러 메이커를 동일 엔진으로 구동
   ========================================================= */
const clone = o => JSON.parse(JSON.stringify(o));

/* 경로(get/set) : "s1.special.0.title" 형태 지원 */
function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setPath(obj, path, val) {
  const ks = path.split('.');
  const last = ks.pop();
  const t = ks.reduce((o, k) => o[k], obj);
  t[last] = val;
}

/* 상세페이지 구버전 호환 마이그레이션 */
function migrateDetail(content) {
  if (content.s1 && content.s1.product === undefined) {
    content.s1.product = content.s1.product1 || DEFAULT_CONTENT.s1.product;
    delete content.s1.product1; delete content.s1.product2;
  }
  if (content.s3 && content.s3.kit === undefined) {
    content.s3.kit = content.s3.kit1 || DEFAULT_CONTENT.s3.kit;
    delete content.s3.kit1; delete content.s3.kit2; delete content.s3.kit3;
  }
  if (content.s3 && content.s3.gosi === undefined) {
    content.s3.gosi = content.s3.gosi1 || DEFAULT_CONTENT.s3.gosi;
    delete content.s3.gosi1; delete content.s3.gosi2;
  }
  if (content.s4) {
    if (content.s4.title === undefined) {
      const t1 = content.s4.title1, t2 = content.s4.title2;
      content.s4.title = (t1 != null || t2 != null) ? `*${t1 || ''}*\n${t2 || ''}`.trim() : DEFAULT_CONTENT.s4.title;
      delete content.s4.title1; delete content.s4.title2;
    }
    if (content.s4.image === undefined) {
      content.s4.image = content.s4.dino || DEFAULT_CONTENT.s4.image;
      delete content.s4.dino; delete content.s4.clay;
    }
  }
  if (content.s2 && Array.isArray(content.s2.points)) {
    content.s2.points.forEach(p => {
      if (p && p.noteOn === undefined) p.noteOn = !!(p.note && String(p.note).trim());
    });
  }
}

/* 배너 구버전(분리 타이틀) → 단일 *별표* 타이틀 호환 */
function migrateBanner(c) {
  if (c.title === undefined) {
    if (c.title1 !== undefined || c.title2 !== undefined) c.title = `${c.title1 || ''}\n*${c.title2 || ''}*`.trim();
    else if (c.titleA !== undefined || c.titleB !== undefined) c.title = `*${c.titleA || ''}* ${c.titleB || ''}`.trim();
  }
  delete c.title1; delete c.title2; delete c.titleA; delete c.titleB;
  // 교과연계 원형 뱃지 필드(b1·b3) 기본값 보강 — 기존 저장본 호환
  if (c.gwa === undefined) c.gwa = '교과\n연계';
  if (c.gwaOn === undefined) c.gwaOn = true;
}

/* 캐러셀: 가격 뒤 배너(블롭) 가로폭을 가격 텍스트 폭에 맞춤 */
function sizeCzBlob(pageEl) {
  const price = pageEl.querySelector('.cz-price');
  const blob = pageEl.querySelector('.cz-blob');
  if (!price || !blob) return;
  const w = price.offsetWidth;           // 레이아웃 폭(스케일 영향 없음)
  if (!w) return;
  const pad = pageEl.classList.contains('cz1') ? 8 : 0;   // cz2는 텍스트폭에 딱 맞춤
  blob.style.width = (w + pad) + 'px';
}

/* 폰트 임베드 CSS는 한 번만 계산해 캐시 (export 속도 향상) */
let _fontCSS = null;
async function getFontCSS(node) {
  if (_fontCSS === null) {
    try { _fontCSS = await htmlToImage.getFontEmbedCSS(node); }
    catch (e) { _fontCSS = ''; }
  }
  return _fontCSS;
}

/* =========================================================
   메이커 팩토리
   ========================================================= */
function createMaker(cfg) {
  let content;
  try {
    const saved = localStorage.getItem(cfg.storeKey);
    content = saved ? JSON.parse(saved) : clone(cfg.defaultContent);
  } catch (e) { content = clone(cfg.defaultContent); }
  if (cfg.migrate) cfg.migrate(content);

  const pageEl = document.getElementById(cfg.ids.page);
  const frameEl = document.getElementById(cfg.ids.frame);
  const escrollEl = document.getElementById(cfg.ids.escroll);
  const viewportEl = document.getElementById(cfg.ids.viewport);

  /* ---- 렌더 + 스케일 ---- */
  function rerender() {
    pageEl.innerHTML = cfg.render(content);
    if (cfg.afterRender) cfg.afterRender(pageEl);
    requestAnimationFrame(fitScale);
    saveLocal();
  }
  function fitScale() {
    if (!viewportEl) return;
    const avail = viewportEl.clientWidth - 56;
    if (avail <= 0) return;                 // 숨겨진 탭은 패스
    if (cfg.afterRender) cfg.afterRender(pageEl);   // 보일 때 폭 재계산
    const s = Math.min(1, avail / cfg.width);
    pageEl.style.transform = `scale(${s})`;
    const h = pageEl.offsetHeight || pageEl.scrollHeight;   // 캔버스 실제 높이(넘침 제외)
    frameEl.style.width = (cfg.width * s) + 'px';
    frameEl.style.height = (h * s) + 'px';
  }
  function saveLocal() {
    try { localStorage.setItem(cfg.storeKey, JSON.stringify(content)); } catch (e) {}
  }

  /* ---- 편집 폼 ---- */
  function buildEditor() {
    escrollEl.innerHTML = '';
    cfg.schema.forEach((grp, gi) => {
      const det = document.createElement('details');
      det.className = 'group';
      if (gi === 0) det.open = true;
      det.innerHTML = `<summary>${grp.section}</summary>`;
      if (grp.dynamic) {
        renderDynamic(det, grp.dynamic);
        escrollEl.appendChild(det);
        return;
      }
      grp.fields.forEach(f => {
        if (f.dynamicList) {
          const wrap = document.createElement('div');
          wrap.className = 'dynlist';
          if (f.dynamicList.title) {
            const h = document.createElement('div');
            h.className = 'dynlist-title';
            h.textContent = f.dynamicList.title;
            wrap.appendChild(h);
          }
          renderDynamic(wrap, f.dynamicList);
          det.appendChild(wrap);
        } else if (f.subsection || f.fields) {
          const sub = document.createElement('details');
          sub.className = 'group subgroup';
          const lockable = f.lock === true;
          sub.innerHTML =
            `<summary><span class="sg-title">${f.subsection || ''}</span>` +
            (lockable ? `<button type="button" class="lockbtn" aria-label="잠금"></button>` : '') +
            `</summary>`;
          f.fields.forEach(sf => sub.appendChild(buildField(sf)));
          det.appendChild(sub);
          if (lockable) {
            let locked = true;
            const lockBtn = sub.querySelector('.lockbtn');
            const summary = sub.querySelector('summary');
            const paint = () => {
              lockBtn.textContent = locked ? '🔒' : '🔓';
              lockBtn.title = locked ? '잠금 해제하고 펼치기' : '잠그고 접기';
              sub.classList.toggle('locked', locked);
            };
            paint();
            summary.addEventListener('click', e => {
              if (e.target.closest('.lockbtn')) return;
              if (locked) e.preventDefault();
            });
            lockBtn.addEventListener('click', e => {
              e.preventDefault(); e.stopPropagation();
              locked = !locked; sub.open = !locked; paint();
            });
          }
        } else {
          det.appendChild(buildField(f));
        }
      });
      escrollEl.appendChild(det);
    });
  }

  /* ---- 동적 목록 (추가/삭제) ---- */
  function renderDynamic(host, dyn) {
    const prefix = dyn.itemTitle || 'POINT';
    const rebuild = () => {
      [...host.querySelectorAll(':scope > .dyn-managed')].forEach(e => e.remove());
      const arr = getPath(content, dyn.arrayPath) || [];
      arr.forEach((item, i) => {
        const block = document.createElement('div');
        block.className = 'point-block dyn-managed';
        const head = document.createElement('div');
        head.className = 'point-block-head';
        head.innerHTML = `<span>${prefix} ${i + 1}</span>`;
        const del = document.createElement('button');
        del.type = 'button'; del.className = 'btn-del-point'; del.textContent = '삭제';
        del.disabled = arr.length <= (dyn.minItems || 1);
        del.addEventListener('click', () => {
          if (!confirm(`${prefix} ${i + 1} 항목을 삭제할까요?`)) return;
          arr.splice(i, 1); rebuild(); rerender();
        });
        head.appendChild(del);
        block.appendChild(head);
        dyn.itemFields.forEach(tpl => {
          const f = { path: `${dyn.arrayPath}.${i}.${tpl.sub}`, label: tpl.label, type: tpl.type, hint: tpl.hint, help: tpl.help };
          if (tpl.toggleSub) f.toggle = `${dyn.arrayPath}.${i}.${tpl.toggleSub}`;
          block.appendChild(buildField(f));
        });
        host.appendChild(block);
      });
      const add = document.createElement('button');
      add.type = 'button'; add.className = 'btn-add-point dyn-managed';
      add.textContent = dyn.addLabel || '＋ 추가';
      add.addEventListener('click', () => {
        const list = getPath(content, dyn.arrayPath);
        list.push(dyn.makeNew(list.length));
        rebuild(); rerender();
      });
      host.appendChild(add);
    };
    rebuild();
  }

  /* ---- 개별 필드 ---- */
  function buildField(f) {
    const wrap = document.createElement('div');
    wrap.className = 'field';
    const val = getPath(content, f.path);

    if (f.type === 'image') {
      wrap.innerHTML = `
        <label>${f.label}${f.hint ? `<span class="img-hint">권장 ${f.hint}</span>` : ''}</label>
        <div class="imgfield">
          <div class="imgthumb" style="background-image:url('${val}')"></div>
          <div class="btns">
            <label class="btn-up">이미지 변경<input type="file" accept="image/*"></label>
            <button type="button" class="btn-reset">기본값</button>
          </div>
        </div>`;
      const file = wrap.querySelector('input[type=file]');
      const thumb = wrap.querySelector('.imgthumb');
      file.addEventListener('change', e => {
        const fl = e.target.files[0]; if (!fl) return;
        const reader = new FileReader();
        reader.onload = () => {
          setPath(content, f.path, reader.result);
          thumb.style.backgroundImage = `url('${reader.result}')`;
          rerender();
        };
        reader.readAsDataURL(fl);
      });
      wrap.querySelector('.btn-reset').addEventListener('click', () => {
        const def = getPath(cfg.defaultContent, f.path);
        setPath(content, f.path, def);
        thumb.style.backgroundImage = `url('${def}')`;
        rerender();
      });
    } else if (f.type === 'toggle') {
      const on = getPath(content, f.path) !== false;
      wrap.innerHTML =
        `<label class="lbl-row"><span>${f.label}</span>` +
        `<span class="tgl"><input type="checkbox" ${on ? 'checked' : ''}><span>표시</span></span></label>`;
      wrap.querySelector('.tgl input').addEventListener('change', e => {
        setPath(content, f.path, e.target.checked); rerender();
      });
    } else {
      const isList = f.type === 'list';
      const isArea = isList || f.type === 'textarea';
      const hasTgl = !!f.toggle;
      const on = hasTgl ? getPath(content, f.toggle) !== false : true;
      wrap.innerHTML =
        `<label class="lbl-row"><span>${f.label}${f.help ? ` <span class="img-hint">${f.help}</span>` : ''}</span>` +
          (hasTgl ? `<span class="tgl"><input type="checkbox" ${on ? 'checked' : ''}><span>노출</span></span>` : '') +
        `</label>` +
        (isArea
          ? `<textarea rows="${isList ? 5 : (f.maxLines || 3)}"${f.placeholder ? ` placeholder="${f.placeholder}"` : ''}></textarea>`
          : `<input type="text" class="txt">`);
      const inp = wrap.querySelector(isArea ? 'textarea' : 'input.txt');
      if (hasTgl && !on) inp.disabled = true;
      // 줄 수 제한 (Enter 차단)
      if (f.maxLines) {
        inp.addEventListener('keydown', e => {
          if (e.key === 'Enter' && inp.value.split('\n').length >= f.maxLines) e.preventDefault();
        });
      }
      if (isList) {
        const arr = Array.isArray(val) ? val : (val == null ? [] : [val]);
        inp.value = arr.join('\n');
        inp.addEventListener('input', () => {
          setPath(content, f.path, inp.value.split('\n').filter(s => s.trim() !== ''));
          rerender();
        });
      } else {
        inp.value = val;
        inp.addEventListener('input', () => {
          if (f.maxLines) {
            const lines = inp.value.split('\n');
            if (lines.length > f.maxLines) inp.value = lines.slice(0, f.maxLines).join('\n');
          }
          setPath(content, f.path, inp.value);
          rerender();
        });
      }
      if (hasTgl) {
        const chk = wrap.querySelector('.tgl input');
        chk.addEventListener('change', () => {
          setPath(content, f.toggle, chk.checked);
          inp.disabled = !chk.checked;
          rerender();
        });
      }
    }
    return wrap;
  }

  /* ---- PNG 생성 (다운로드 없이 dataURL 반환) ---- */
  async function makePng() {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    fitScale();
    const h = pageEl.offsetHeight;
    const fontEmbedCSS = await getFontCSS(pageEl);   // 폰트 임베드 CSS 1회 계산 후 캐시
    const cbg = getComputedStyle(pageEl).backgroundColor;
    const bgColor = (cbg && cbg !== 'rgba(0, 0, 0, 0)' && cbg !== 'transparent') ? cbg : '#ffffff';
    // 출력 해상도: Figma 내보내기(1배)와 동일하게 원본 크기 그대로.
    // cfg.pixelRatio로 개별 상향 가능(캔버스 최대 ~16000px 자동 제한).
    const MAXDIM = 16000;
    const baseRatio = cfg.pixelRatio || 1;
    const ratio = Math.max(1, Math.min(baseRatio, MAXDIM / cfg.width, MAXDIM / h));
    const opts = {
      width: cfg.width, height: h, pixelRatio: ratio, cacheBust: false, fontEmbedCSS,
      backgroundColor: bgColor,   // 캔버스 실제 배경색 (예: 캐러셀 청록)
      style: { transform: 'none', transformOrigin: 'top left', margin: '0' },
    };
    // 1회 렌더, 간헐 실패(이미지 디코딩 등) 시에만 재시도
    try {
      return await htmlToImage.toPng(pageEl, opts);
    } catch (e) {
      await new Promise(r => setTimeout(r, 150));
      return htmlToImage.toPng(pageEl, opts);
    }
  }
  /* ---- PNG 저장 ---- */
  async function exportPng() {
    const overlay = document.getElementById('overlay');
    const btn = document.getElementById(cfg.ids.export);
    overlay.classList.add('on');
    btn.disabled = true;
    try {
      const dataUrl = await makePng();
      const a = document.createElement('a');
      a.download = `${cfg.exportName}_${new Date().toISOString().slice(0, 10)}.png`;
      a.href = dataUrl;
      a.click();
    } catch (err) {
      alert('이미지 저장 중 오류가 발생했어요.\n' + (err && err.message ? err.message : err));
      console.error(err);
    } finally {
      overlay.classList.remove('on');
      btn.disabled = false;
      fitScale();
    }
  }

  /* ---- 설정(JSON) ---- */
  function exportJson() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.download = `${cfg.exportName}_설정_${new Date().toISOString().slice(0, 10)}.json`;
    a.href = URL.createObjectURL(blob);
    a.click();
  }
  function importJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try { content = JSON.parse(reader.result); buildEditor(); rerender(); }
      catch (e) { alert('설정 파일을 읽을 수 없어요.'); }
    };
    reader.readAsText(file);
  }
  function resetAll() {
    if (!confirm('모든 내용을 기본값으로 되돌릴까요?')) return;
    content = clone(cfg.defaultContent);
    localStorage.removeItem(cfg.storeKey);
    buildEditor(); rerender();
  }

  /* ---- 버튼 바인딩 ---- */
  document.getElementById(cfg.ids.export).addEventListener('click', exportPng);
  document.getElementById(cfg.ids.reset).addEventListener('click', resetAll);
  document.getElementById(cfg.ids.save).addEventListener('click', exportJson);
  document.getElementById(cfg.ids.load).addEventListener('change', e => {
    if (e.target.files[0]) importJson(e.target.files[0]);
    e.target.value = '';
  });

  buildEditor();
  rerender();
  return { fitScale, makePng, name: cfg.exportName };
}

/* 원형 뱃지: 기본 폰트 크기 유지, 원을 벗어날 때만 글자 크기 자동 축소.
   원(반지름 r) 안에 각 줄이 들어가도록 줄의 세로 위치별 가용 가로폭을 계산해 맞춤. */
function fitCircleBadge(badge, BASE) {
  if (!badge) return;
  const ps = Array.prototype.slice.call(badge.querySelectorAll('p'));
  if (!ps.length) return;
  badge.style.fontSize = '';                 // 인라인 제거 → CSS 기본값 측정
  const cs = getComputedStyle(badge);
  if (BASE == null) BASE = parseFloat(cs.fontSize) || 24;
  let LH = parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);  // line-height 비율(unitless 기준)
  if (!isFinite(LH) || LH <= 0) LH = 1.1;
  const MIN = 10;
  const r = badge.clientWidth / 2;
  if (!r) return;
  const PAD = r * 0.1;   // 원 크기에 비례한 안전 여백
  let size = BASE;
  for (; size > MIN; size--) {
    badge.style.fontSize = size + 'px';
    const L = size * LH;             // 한 줄 높이
    const N = ps.length;
    const H = N * L;                 // 전체 텍스트 블록 높이(세로 중앙 정렬)
    let ok = (H / 2) <= (r - PAD);   // 세로로 원 안에 들어가는가
    if (ok) {
      for (let i = 0; i < N; i++) {
        // i번째 줄이 차지하는 띠의 바깥쪽 가장자리 y(원 중심 기준)
        const yEdge = Math.max(Math.abs(-H / 2 + L * i), Math.abs(-H / 2 + L * (i + 1)));
        const half = Math.sqrt(Math.max(0, r * r - yEdge * yEdge)) - PAD; // 그 높이에서 허용 반폭
        if (ps[i].scrollWidth / 2 > half) { ok = false; break; }
      }
    }
    if (ok) break;
  }
  badge.style.fontSize = size + 'px';
}
function fitDetailBadge(pageEl) { fitCircleBadge(pageEl.querySelector('.s1-product .badge'), 56); }
function fitThumbBadge(pageEl) { fitCircleBadge(pageEl.querySelector('.th-badge'), 64); }
function fitBannerGwa(pageEl) { fitCircleBadge(pageEl.querySelector('.bn-gwa'), 24); }
function fitCzBadges(pageEl) {
  fitCircleBadge(pageEl.querySelector('.cz-badges .disc'), null);  // base는 CSS에서 자동 감지(cz1:60 / cz2:32)
  fitCircleBadge(pageEl.querySelector('.cz-badges .free'), null);
  fitCircleBadge(pageEl.querySelector('.cz-badges .gwa'), null);
}
/* 캐러셀 타이틀: 시안 크기(120/130 등) 기준, 폭 넘치면 자동 축소(--czt) */
function fitCzTitle(pageEl) {
  const title = pageEl.querySelector('.cz-title');
  if (!title) return;
  title.style.setProperty('--czt', '1');
  const avail = title.clientWidth * 0.98;   // 좌우 약간 여백
  if (!avail) return;
  let widest = 0;
  title.querySelectorAll('p').forEach(p => { widest = Math.max(widest, p.scrollWidth); });
  if (widest > avail) title.style.setProperty('--czt', (avail / widest).toFixed(4));
}
function afterRenderCz(pageEl) { sizeCzBlob(pageEl); fitCzBadges(pageEl); fitCzTitle(pageEl); }
/* 캐러셀 교과연계/무료배송 원형 뱃지 필드 기본값 보강 — 기존 저장본 호환 */
function migrateCz(c) {
  if (c.discText === undefined) c.discText = '*45*%\nOFF';
  if (c.discOn === undefined) c.discOn = false;
  if (c.freeText === undefined) c.freeText = '무료\n배송';
  if (c.freeOn === undefined) c.freeOn = true;
  if (c.gwaText === undefined) c.gwaText = '교과\n연계';
  if (c.gwaOn === undefined) c.gwaOn = true;
}

/* =========================================================
   메이커 인스턴스 생성
   ========================================================= */
const makers = [
  createMaker({
    storeKey: 'detailmaker_v1',
    defaultContent: DEFAULT_CONTENT,
    schema: EDITOR_SCHEMA,
    render: renderPage,
    width: 1240,
    exportName: '상세페이지',
    afterRender: fitDetailBadge,
    migrate: migrateDetail,
    ids: { page: 'page-detail', frame: 'frame-detail', escroll: 'escroll-detail', viewport: 'viewport-detail',
           export: 'btn-export-detail', save: 'btn-save-detail', load: 'btn-load-detail', reset: 'btn-reset-detail' },
  }),
  createMaker({
    storeKey: 'thumbmaker_v1',
    defaultContent: THUMB_CONTENT,
    schema: THUMB_SCHEMA,
    render: renderThumb,
    width: 1000,
    exportName: '썸네일',
    afterRender: fitThumbBadge,
    ids: { page: 'page-thumb', frame: 'frame-thumb', escroll: 'escroll-thumb', viewport: 'viewport-thumb',
           export: 'btn-export-thumb', save: 'btn-save-thumb', load: 'btn-load-thumb', reset: 'btn-reset-thumb' },
  }),
];

/* ---- 배너 4종 메이커 ---- */
const BANNER_DEFS = [
  { key: 'b1', w: 840,  render: renderBanner1, name: '배너_840x400' },
  { key: 'b2', w: 1080, render: renderBanner2, name: '배너_1080x144' },
  { key: 'b3', w: 1080, render: renderBanner3, name: '배너_1080x388' },
  { key: 'b4', w: 1080, render: renderBanner4, name: '배너_1080x216' },
];
const bannerMakers = {};
BANNER_DEFS.forEach(b => {
  const m = createMaker({
    storeKey: 'banner_' + b.key + '_v1',
    defaultContent: BANNER_CONTENT[b.key],
    schema: BANNER_SCHEMA[b.key],
    render: b.render,
    width: b.w,
    exportName: b.name,
    migrate: migrateBanner,
    afterRender: (b.key === 'b1' || b.key === 'b3') ? fitBannerGwa : undefined,
    ids: { page: 'page-' + b.key, frame: 'frame-' + b.key, escroll: 'escroll-' + b.key, viewport: 'viewport-' + b.key,
           export: 'btn-export-' + b.key, save: 'btn-save-' + b.key, load: 'btn-load-' + b.key, reset: 'btn-reset-' + b.key },
  });
  makers.push(m);
  bannerMakers[b.key] = m;
});

/* ---- 배너 4종 일괄 저장 ---- */
async function exportAllBanners() {
  const overlay = document.getElementById('overlay');
  const allBtn = document.getElementById('btn-export-all-banner');
  const sizeBtns = [...document.querySelectorAll('.banner-sizes .bsize')];
  const activeBtn = document.querySelector('.banner-sizes .bsize.active');
  const stamp = new Date().toISOString().slice(0, 10);
  overlay.classList.add('on');
  if (allBtn) allBtn.disabled = true;
  const failed = [];
  const zip = (typeof JSZip !== 'undefined') ? new JSZip() : null;
  const folder = zip ? zip.folder('배너') : null;   // '배너' 폴더에 담기
  try {
    for (const key of ['b1', 'b2', 'b3', 'b4']) {
      // 해당 배너를 화면에 표시(렌더 캡처 위해)
      sizeBtns.forEach(b => b.classList.toggle('active', b.dataset.bsize === key));
      document.querySelectorAll('.bsub').forEach(p => p.classList.toggle('active', p.dataset.bsub === key));
      await new Promise(r => setTimeout(r, 120));   // 레이아웃 반영 대기(탭 비활성에서도 동작)
      const m = bannerMakers[key];
      m.fitScale();
      let url = null;
      try { url = await m.makePng(); }            // makePng 내부에서 1회 재시도함
      catch (e) { console.error('banner', key, e); }
      if (!url) { failed.push(key); continue; }
      const fname = `${m.name}.png`;
      if (folder) {
        folder.file(fname, url.split(',')[1], { base64: true });   // 폴더에 추가
      } else {
        const a = document.createElement('a'); a.download = fname; a.href = url; a.click();
        await new Promise(r => setTimeout(r, 400));
      }
    }
    // ZIP(배너 폴더) 한 파일로 저장
    if (folder && (4 - failed.length) > 0) {
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.download = `배너_${stamp}.zip`;
      a.href = URL.createObjectURL(blob);
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
    if (failed.length) alert('일부 배너 저장에 실패했어요: ' + failed.join(', ') + '\n다시 시도해 주세요.');
  } catch (err) {
    const msg = err && (err.message || err.type || err.name) || String(err);
    alert('일괄 저장 중 오류가 발생했어요.\n' + msg);
    console.error(err);
  } finally {
    overlay.classList.remove('on');
    if (allBtn) allBtn.disabled = false;
    if (activeBtn) {
      sizeBtns.forEach(b => b.classList.toggle('active', b === activeBtn));
      document.querySelectorAll('.bsub').forEach(p => p.classList.toggle('active', p.dataset.bsub === activeBtn.dataset.bsize));
    }
    setTimeout(fitAll, 0);
  }
}
document.getElementById('btn-export-all-banner').addEventListener('click', exportAllBanners);

/* ---- 캐러셀 2종 메이커 ---- */
const CZ_DEFS = [
  { key: 'cz1', w: 1080, render: renderCzInsta,    name: '캐러셀_인스타스토리_1080x1920' },
  { key: 'cz2', w: 600,  render: renderCzCarousel, name: '캐러셀_600x800' },
];
const czMakers = {};
CZ_DEFS.forEach(z => {
  const m = createMaker({
    storeKey: 'cz_' + z.key + '_v2',   // v2: disc 뱃지 기본값(숨김 + *강조*) 정정 — 옛 저장값 무효화
    defaultContent: CZ_CONTENT[z.key],
    schema: CZ_SCHEMA[z.key],
    render: z.render,
    width: z.w,
    exportName: z.name,
    afterRender: afterRenderCz,
    migrate: migrateCz,
    ids: { page: 'page-' + z.key, frame: 'frame-' + z.key, escroll: 'escroll-' + z.key, viewport: 'viewport-' + z.key,
           export: 'btn-export-' + z.key, save: 'btn-save-' + z.key, load: 'btn-load-' + z.key, reset: 'btn-reset-' + z.key },
  });
  makers.push(m);
  czMakers[z.key] = m;
});

/* ---- 캐러셀 2종 일괄 저장 (ZIP) ---- */
async function exportAllCz() {
  const overlay = document.getElementById('overlay');
  const allBtn = document.getElementById('btn-export-all-cz');
  const sizeBtns = [...document.querySelectorAll('.cz-sizes .czsize')];
  const activeBtn = document.querySelector('.cz-sizes .czsize.active');
  const stamp = new Date().toISOString().slice(0, 10);
  const failed = [];
  const zip = (typeof JSZip !== 'undefined') ? new JSZip() : null;
  const folder = zip ? zip.folder('캐러셀') : null;
  overlay.classList.add('on');
  if (allBtn) allBtn.disabled = true;
  try {
    for (const key of ['cz1', 'cz2']) {
      sizeBtns.forEach(b => b.classList.toggle('active', b.dataset.czsize === key));
      document.querySelectorAll('.czsub').forEach(p => p.classList.toggle('active', p.dataset.czsub === key));
      await new Promise(r => setTimeout(r, 120));
      const m = czMakers[key];
      m.fitScale();
      let url = null;
      try { url = await m.makePng(); } catch (e) { console.error('cz', key, e); }
      if (!url) { failed.push(key); continue; }
      if (folder) folder.file(`${m.name}.png`, url.split(',')[1], { base64: true });
      else { const a = document.createElement('a'); a.download = `${m.name}.png`; a.href = url; a.click(); await new Promise(r => setTimeout(r, 400)); }
    }
    if (folder && (2 - failed.length) > 0) {
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.download = `캐러셀_${stamp}.zip`;
      a.href = URL.createObjectURL(blob);
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
    if (failed.length) alert('일부 캐러셀 저장에 실패했어요: ' + failed.join(', ') + '\n다시 시도해 주세요.');
  } catch (err) {
    alert('일괄 저장 중 오류가 발생했어요.\n' + (err && (err.message || err.type || err.name) || String(err)));
    console.error(err);
  } finally {
    overlay.classList.remove('on');
    if (allBtn) allBtn.disabled = false;
    if (activeBtn) {
      sizeBtns.forEach(b => b.classList.toggle('active', b === activeBtn));
      document.querySelectorAll('.czsub').forEach(p => p.classList.toggle('active', p.dataset.czsub === activeBtn.dataset.czsize));
    }
    setTimeout(fitAll, 0);
  }
}
document.getElementById('btn-export-all-cz').addEventListener('click', exportAllCz);

/* ---- 캐러셀 사이즈 선택 ---- */
document.querySelectorAll('.cz-sizes .czsize').forEach(btn => {
  btn.addEventListener('click', () => {
    const s = btn.dataset.czsize;
    document.querySelectorAll('.cz-sizes .czsize').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.czsub').forEach(p => p.classList.toggle('active', p.dataset.czsub === s));
    setTimeout(fitAll, 0);   // 백그라운드 탭에서도 fire되도록 rAF 대신 setTimeout
  });
});

function fitAll() { makers.forEach(m => m.fitScale()); }
window.addEventListener('resize', fitAll);
window.addEventListener('load', () => setTimeout(fitAll, 300));

/* ---- 사이드 메뉴 탭 전환 ---- */
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
    setTimeout(fitAll, 0);   // 백그라운드 탭에서도 fire되도록 rAF 대신 setTimeout
  });
});

/* ---- 배너 사이즈 선택 ---- */
document.querySelectorAll('.banner-sizes .bsize').forEach(btn => {
  btn.addEventListener('click', () => {
    const s = btn.dataset.bsize;
    document.querySelectorAll('.banner-sizes .bsize').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.bsub').forEach(p => p.classList.toggle('active', p.dataset.bsub === s));
    setTimeout(fitAll, 0);   // 백그라운드 탭에서도 fire되도록 rAF 대신 setTimeout
  });
});
