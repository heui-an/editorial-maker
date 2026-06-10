/* =========================================================
   기본 콘텐츠 (원본 디자인 그대로) + 편집 항목 정의
   - 텍스트: *별표* 로 감싸면 강조색(섹션별 포인트 컬러)으로 표시됩니다.
     예) "지구는 *양파처럼* 생겼어요"  →  '양파처럼'이 강조색
   - 줄바꿈(Enter)은 그대로 줄바꿈으로 반영됩니다.
   ========================================================= */
const A = 'assets/';

const DEFAULT_CONTENT = {
  "s1": {
    "badge": "교과서 밖 과학 만나기 '지층과 화석'",
    "title1": "지점토에 꾹꾹",
    "title2": "공룡 화석 만들기",
    "sub": "공룡의 뼈와 발자국은\n오랜 시간이 지나 화석으로 남아요.\n지점토와 석고를 활용해\n화석이 생기는 원리를 알아봐요.",
    "bubble": "교과서 속 과학 만나기 \n‘지층과 화석’공룡은 \n어떻게 화석이 됐을까?\n",
    "badgeCircle": "교과\n연계",
    "brandBar": "Brand Story",
    "brandTitle": "도전! 편집부 메이커",
    "brandBody": "매달 *어린이과학동아 15일자 154p*에 소개되는 스마트스쿨 속\n다른 주제의 다양한 과학키트를 만날 수 있는 홈스쿨링 시간",
    "specialBar": "도전! 편집부 메이커만의 Special",
    "special": [
      {
        "icon": "assets/ico_special1.svg",
        "title": "과학 지식 쌓기",
        "color": "teal",
        "body": "매 다른 과학 주제로\n기사글을 통한\n원리 및 과학 지식 레벨 up"
      },
      {
        "icon": "assets/ico_special2.svg",
        "title": "탐구 활동 강화",
        "color": "orange",
        "body": "조립하고 키트를\n작동해봄으로써\n창의력과 탐구력 강화"
      },
      {
        "icon": "assets/ico_special3.svg",
        "title": "교감 형성",
        "color": "orange",
        "body": "부모의 도움과 함께\n조립하고 완성함으로써\n교감 교류"
      },
      {
        "icon": "assets/ico_special4.svg",
        "title": "이해와 습득 향상",
        "color": "teal",
        "body": "동영상을 통한 제작과정을\n보고 만들며 키트의\n원리 이해 가능"
      }
    ],
    "product": "assets/userdef_s1_product.png",
    "title1On": true,
    "title2On": true,
    "badgeOn": true
  },
  "s2": {
    "points": [
      {
        "label": "POINT 01",
        "color": "teal",
        "title": "*화석은 과거 생물의 흔적*이에요.\n공룡의 뼈, 발자국 모두\n공룡이 살았다는 증거랍니다. ",
        "note": "",
        "image": "assets/userdef_s2_point1.png",
        "noteOn": false
      },
      {
        "label": "POINT 02",
        "color": "orange",
        "title": "죽은 생물이나 흔적은\n땅 속에 묻히고 *오랜 시간동안 굳으면 화석*으로 남게돼요",
        "note": "",
        "image": "assets/userdef_s2_point2.png",
        "noteOn": false
      },
      {
        "label": "POINT 03",
        "color": "teal",
        "title": "화석을 관찰하면 *어떤생물*이\n살았는지 *그때의 환경*은\n어땠는지 추측할 수 있어요.",
        "note": "*지구는 약 46억 년 전에 만들어졌어요.",
        "image": "assets/userdef_s2_point3.png",
        "noteOn": false
      },
      {
        "label": "POINT 04",
        "color": "orange",
        "title": "이제 화석키트를 이용해\n*직접 공룡화석을 만들어봐요!*",
        "note": "",
        "image": "assets/userdef_s2_point4.png",
        "noteOn": false
      }
    ]
  },
  "s3": {
    "kitBar": "구성품",
    "infoTag": "구성품 안내",
    "infoBody": "클레이(200g), 비둘기표석고가루(200g),공룡미니어처(1ea)\n자연물(에그스톤, 나뭇가지, 흰조개(1), 우드칩), 종이컵2종(대,소)",
    "infoOn": true,
    "cautionTag": "주의사항",
    "cautionOn": true,
    "cautions": [
      "클레이(도우)에 소금을 천연방부제로 사용하여 자연건조시 하얀 소금꽃이 피어오릅니다. 곰팡이가 아니니 걱정하지 마세요.",
      "자연성분으로 피부가 민감한 자녀들도 사용할 수 있습니다."
    ],
    "gosiBar": "상품 고시 정보",
    "table": [
      {
        "name": "상품명",
        "value": "몽클 공룡 화석 만들기 키트",
        "sm": false
      },
      {
        "name": "사용연령",
        "value": "14세 미만의 어린이는\n보호자와 함께 사용하세요.",
        "sm": true
      },
      {
        "name": "크기/중량",
        "value": "도우 200g, 석고가루(200g)",
        "sm": false
      },
      {
        "name": "구성",
        "value": "본 구성품",
        "sm": false
      },
      {
        "name": "항목명",
        "value": "내용",
        "sm": false
      }
    ],
    "gosiNote": "* 실제 제품 사이즈와 약간의 차이가 있을 수 있습니다.",
    "kit": "assets/userdef_s3_kit.png",
    "gosi": "assets/userdef_s3_gosi.png",
    "gosiNoteOn": false
  },
  "s4": {
    "bar": "다음 시간 예고편",
    "body": "다음 시간에는 보행로봇 솔라S를\n만들며 태양열의 원리를 알아봐요!",
    "title": "*보행로봇 솔라S*\n만들기",
    "image": "assets/userdef_s4.png"
  }
};

/* =========================================================
   썸네일 (1000×1000) 기본 콘텐츠 + 편집 항목
   ========================================================= */
const THUMB_CONTENT = {
  product: A + 'thumb_product.png',
  logoOn: true,
  eatdongOn: true,
  badgeText: '교과\n연계',
  badgeOn: true,
};

const THUMB_SCHEMA = [
  {
    section: '썸네일 (1000 × 1000)',
    fields: [
      { path: 'product',   label: '제품 이미지', type: 'image', hint: '정사각 1000 × 1000px' },
      { path: 'badgeText', label: '원형 뱃지', type: 'textarea', toggle: 'badgeOn', help: '줄바꿈(Enter)으로 최대 2줄', maxLines: 2 },
      { path: 'logoOn',    label: '편집부 메이커 로고', type: 'toggle' },
      { path: 'eatdongOn', label: '어린이 과학동아 뱃지', type: 'toggle' },
    ],
  },
];

/* =========================================================
   배너 (4종) 기본 콘텐츠 + 편집 항목
   ========================================================= */
const BP = A + 'banner_product.png';
const BSUB = '교과서 밖 과학 만나기 ‘지층과 화석‘';

const BANNER_CONTENT = {
  b1: { title: '지점토에 꾹꾹!\n*공룡 화석 만들기*', sub: BSUB, product: BP, dateLine1: '6/15일자', dateLine2: '154p', gwa: '교과\n연계', gwaOn: true },
  b2: { title: '*어린이과학동아와 함께* 실험해보는 시간!', product: BP },
  b3: { title: '지점토에 꾹꾹!\n*공룡 화석 만들기 최저가*', sub: BSUB, product: BP, dateLine1: '6/15일자', dateLine2: '154p', gwa: '교과\n연계', gwaOn: true },
  b4: { sub: BSUB, title: '*공룡 화석* 만들기 최저가', product: BP, dateLine1: '6/15일자', dateLine2: '154p' },
};

const _bnDateFields = [
  { path: 'dateLine1', label: '날짜 1줄', type: 'text' },
  { path: 'dateLine2', label: '날짜 2줄', type: 'text' },
];
const _bnGwaField = { path: 'gwa', label: '원형 뱃지 (교과연계)', type: 'textarea', toggle: 'gwaOn', help: '줄바꿈(Enter)으로 최대 2줄', maxLines: 2 };
const BANNER_SCHEMA = {
  b1: [{ section: '메인 배너 (840 × 400)', fields: [
    { path: 'title', label: '타이틀', type: 'textarea', help: '*별표*로 강조 · 최대 2줄', maxLines: 2 },
    { path: 'sub',   label: '부제', type: 'text' },
    { path: 'product', label: '제품 이미지', type: 'image', hint: '정사각 (예: 600 × 600)' },
    ..._bnDateFields,
    _bnGwaField,
  ] }],
  b2: [{ section: '띠배너 (1080 × 144)', fields: [
    { path: 'title', label: '문구', type: 'text', help: '*별표*로 강조' },
    { path: 'product', label: '제품 이미지', type: 'image', hint: '정사각 (예: 600 × 600)' },
  ] }],
  b3: [{ section: '하단 AD 배너 (1080 × 388)', fields: [
    { path: 'title', label: '타이틀', type: 'textarea', help: '*별표*로 강조 · 최대 2줄', maxLines: 2 },
    { path: 'sub',   label: '부제', type: 'text' },
    { path: 'product', label: '제품 이미지', type: 'image', hint: '정사각 (예: 600 × 600)' },
    ..._bnDateFields,
    _bnGwaField,
  ] }],
  b4: [{ section: '서브메인 배너 (1080 × 216)', fields: [
    { path: 'sub',   label: '부제 (상단)', type: 'text' },
    { path: 'title', label: '타이틀', type: 'text', help: '*별표*로 강조' },
    { path: 'product', label: '제품 이미지', type: 'image', hint: '정사각 (예: 600 × 600)' },
    ..._bnDateFields,
  ] }],
};

/* =========================================================
   캐러셀 (인스타 스토리 / 캐러셀) 기본 콘텐츠 + 편집 항목
   ========================================================= */
const _czBase = {
  pill: '교과서 속 과학 만나기 ‘지구의 모습‘',
  title: '지구는 어떻게 생겼을까?\n*클레이 지구 만들기*',
  priceLabel: '최저가 보장',
  priceValue: '14,450원',
  captionTop: '어린이과학동아',
  captionBottom: '5월 15일자 소개',
  dateLine1: '154~155',
  dateLine2: '페이지',
  discText: '*45*%\nOFF', discOn: false,   // 무료배송 위 추가 뱃지 — 기본 숨김(*강조*=숫자 크게)
  freeText: '무료\n배송', freeOn: true,
  gwaText: '교과\n연계', gwaOn: true,
};
const CZ_CONTENT = {
  cz1: Object.assign({}, _czBase, { image: A + 'cz_img_insta.png' }),
  cz2: Object.assign({}, _czBase, { image: A + 'cz_img_cz.png' }),
};
function _czFields(imgHint) {
  return [
    { path: 'pill',          label: '상단 말풍선', type: 'text' },
    { path: 'title',         label: '타이틀', type: 'textarea', help: '*별표*로 강조(노랑) · 최대 2줄', maxLines: 2 },
    { path: 'priceLabel',    label: '가격 라벨 (노랑)', type: 'text' },
    { path: 'priceValue',    label: '가격', type: 'text' },
    { path: 'image',         label: '제품 이미지', type: 'image', hint: imgHint },
    { path: 'captionTop',    label: '박스 캡션 1줄 (청록)', type: 'text' },
    { path: 'captionBottom', label: '박스 캡션 2줄', type: 'text' },
    { path: 'dateLine1',     label: '페이지 1줄', type: 'text' },
    { path: 'dateLine2',     label: '페이지 2줄', type: 'text' },
    { path: 'discText',      label: '원형 뱃지 (상단·할인 등)', type: 'textarea', toggle: 'discOn', help: '기본 숨김 · *별표*=크게강조 · 최대 2줄', maxLines: 2 },
    { path: 'freeText',      label: '원형 뱃지 (무료배송)', type: 'textarea', toggle: 'freeOn', help: '줄바꿈(Enter)으로 최대 2줄', maxLines: 2 },
    { path: 'gwaText',       label: '원형 뱃지 (교과연계)', type: 'textarea', toggle: 'gwaOn', help: '줄바꿈(Enter)으로 최대 2줄', maxLines: 2 },
  ];
}
const CZ_SCHEMA = {
  cz1: [{ section: '인스타 스토리 (1080 × 1920)', fields: _czFields('700 × 560px') }],
  cz2: [{ section: '캐러셀 (600 × 800)', fields: _czFields('380 × 260px') }],
};

/* ---- 편집 패널 구성 (주요 항목) ---- */
const EDITOR_SCHEMA = [
  {
    section: '01. 인트로 / 브랜드',
    fields: [
      { path: 's1.badge',       label: '상단 말풍선 텍스트', type: 'text' },
      { path: 's1.title1',      label: '메인 타이틀 1줄 (흰색)', type: 'text', toggle: 's1.title1On' },
      { path: 's1.title2',      label: '메인 타이틀 2줄 (노란색)', type: 'text', toggle: 's1.title2On' },
      { path: 's1.sub',         label: '소개 문구', type: 'textarea' },
      { path: 's1.bubble',      label: '손글씨 말풍선', type: 'textarea' },
      { path: 's1.product',     label: '제품 이미지', type: 'image', hint: '722 × 675px' },
      { path: 's1.badgeCircle', label: '원형 뱃지 (빨강)', type: 'textarea', toggle: 's1.badgeOn', help: '줄바꿈(Enter)으로 최대 2줄', maxLines: 2 },
      {
        subsection: '브랜드 / Special',
        lock: true,
        fields: [
          { path: 's1.brandBar',    label: '[Brand Story] 바 제목', type: 'text' },
          { path: 's1.brandTitle',  label: '브랜드 카드 제목', type: 'text' },
          { path: 's1.brandBody',   label: '브랜드 카드 본문', type: 'textarea', help: '*별표*로 강조' },
          { path: 's1.specialBar',  label: '[Special] 바 제목', type: 'text' },
          { path: 's1.special.0.title', label: 'Special ① 제목', type: 'text' },
          { path: 's1.special.0.body',  label: 'Special ① 본문', type: 'textarea' },
          { path: 's1.special.1.title', label: 'Special ② 제목', type: 'text' },
          { path: 's1.special.1.body',  label: 'Special ② 본문', type: 'textarea' },
          { path: 's1.special.2.title', label: 'Special ③ 제목', type: 'text' },
          { path: 's1.special.2.body',  label: 'Special ③ 본문', type: 'textarea' },
          { path: 's1.special.3.title', label: 'Special ④ 제목', type: 'text' },
          { path: 's1.special.3.body',  label: 'Special ④ 본문', type: 'textarea' },
        ],
      },
    ],
  },
  {
    section: '02. 학습 포인트',
    dynamic: {
      arrayPath: 's2.points',
      addLabel: '＋ 포인트 추가',
      minItems: 1,
      itemFields: [
        { sub: 'label', label: '라벨', type: 'text' },
        { sub: 'title', label: '제목', type: 'textarea', help: '*별표*로 강조' },
        { sub: 'note',  label: '각주', type: 'text', toggleSub: 'noteOn' },
        { sub: 'image', label: '이미지', type: 'image', hint: '1080 × 680px' },
      ],
      // 새 포인트 기본값 (청록/주황 번갈아)
      makeNew: (len) => ({
        label: 'POINT ' + String(len + 1).padStart(2, '0'),
        color: len % 2 === 0 ? 'teal' : 'orange',
        title: '제목을 입력하세요.',
        note: '',
        noteOn: false,
        image: '',
      }),
    },
  },
  {
    section: '03. 구성품 / 고시정보',
    fields: [
      { path: 's3.kitBar',     label: '[구성품] 바 제목', type: 'text' },
      { path: 's3.kit',        label: '구성품 이미지', type: 'image', hint: '1080 × 680px' },
      { path: 's3.infoBody',   label: '구성품 안내 내용', type: 'textarea', help: 'Enter로 줄바꿈', toggle: 's3.infoOn' },
      { path: 's3.cautions', label: '주의사항', type: 'list',
        help: 'Enter로 항목 구분', toggle: 's3.cautionOn',
        placeholder: '예) 거치대 구매시 비용 1,000원이 추가됩니다.\n예) 클레이에 소금을 천연방부제로 사용합니다.' },
      { path: 's3.gosiBar',    label: '[고시정보] 바 제목', type: 'text' },
      { path: 's3.gosi',       label: '고시정보 이미지', type: 'image', hint: '516 × 500px' },
      {
        dynamicList: {
          arrayPath: 's3.table',
          title: '고시 항목 (항목명·내용 편집 / 추가·삭제)',
          itemTitle: '항목',
          addLabel: '＋ 항목 추가',
          minItems: 1,
          itemFields: [
            { sub: 'name',  label: '항목명', type: 'text' },
            { sub: 'value', label: '내용', type: 'textarea' },
          ],
          makeNew: () => ({ name: '항목명', value: '내용', sm: false }),
        },
      },
      { path: 's3.gosiNote',   label: '고시 하단 안내', type: 'text', toggle: 's3.gosiNoteOn' },
    ],
  },
  {
    section: '04. 다음 시간 예고편',
    fields: [
      { path: 's4.bar',    label: '바 제목', type: 'text' },
      { path: 's4.title',  label: '제목', type: 'textarea', help: '*별표*로 강조 · 최대 2줄', maxLines: 2 },
      { path: 's4.body',   label: '본문', type: 'textarea' },
      { path: 's4.image',  label: '예고 이미지', type: 'image', hint: '420 × 500px' },
    ],
  },
];
