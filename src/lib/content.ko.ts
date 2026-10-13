/**
 * The Korean home page (/kr), approved by Ju Sheen on 2026-10-12 for the
 * investors and dealmakers he meets in Seoul (first: the Oct 15 Cheongdam
 * event, Jira SAI-100). Same claims as the English page and no new ones.
 *
 * Rules for this file:
 * - Every line translates a line in HOME_EN or CHROME_EN (content.ts). Change
 *   the English first, then this, so the two pages never say different things.
 * - 합니다체 for page copy; 해요체 only in the client quote and inside the
 *   example app windows, where it is how people actually talk.
 * - 원무실장 for "office manager", never 사무장 (사무장병원 is an illegal clinic).
 * - Four short glosses are the only additions, and they define, not claim:
 *   BAA(환자정보 보호 계약), EHR(전자건강기록), HIPAA(미국 의료정보 보호법),
 *   회계 프로그램 QuickBooks.
 * - Product and tier names stay in English: Opportunity Map, Foundation,
 *   Growth, Partner, Front Desk. Prices stay in dollars.
 * - Links to pages that exist only in English say (영문).
 * - Line breaks: "\u00a0" keeps two short words on one line in a headline;
 *   "\u2060" glues a particle to the closing parenthesis before it, where
 *   browsers otherwise allow a break even with word-break: keep-all.
 */
import {
  CALENDLY,
  CASE_STUDY_URL,
  CONTACT_EMAIL,
  CONTACT_EMAIL_JUSHEEN,
  FOUNDERS,
  PROOF_LINKS,
  QUOTE,
  V7_PRICING,
  type ChromeCopy,
  type HomeCopy,
  type QuoteCard,
} from "./content";
import { HOME_TESTIMONIALS, type Testimonial } from "./testimonials";

export const KR_PATH = "/kr";

export const SITE_TAGLINE_KO = "병원·치과·안과의 잡무를 줄여 드립니다";

export const SITE_DESCRIPTION_KO =
  "병원이 수작업에 시간을 빼앗기는 곳을 찾아, 지금 쓰는 도구에 맞춰 그 일을 대신하는 소프트웨어를 만듭니다. 무료 진단 상담으로 시작해 보세요.";

const CTA_KO = { label: "시작하기", short: "시작하기", href: CALENDLY };

/**
 * The quote belt in Korean (2026-10-13). The English quotes are generated from
 * the vault's quote book and checked word for word against the recording or
 * email, so a translation never stands alone: each card keeps the person's own
 * words under it (원문). Spoken 해요체, like the case study quote.
 *
 * Each entry repeats the exact English it translates. If the quote book changes
 * a quote, its entry stops matching and /kr shows that quote in English until
 * it is retranslated, so a translation can never drift from what was said.
 * A new quote with no entry also shows in English.
 */
const QUOTES_KO: { id: string; en: string; ko: string }[] = [
  {
    id: "wfv-008",
    en: "I am loving the tool… you've done a great job creating it!",
    ko: "이 툴 너무 마음에 들어요… 정말 잘 만들어 주셨어요!",
  },
  {
    id: "taima-018",
    en: "I don't ever feel like you're rushing me, I always feel like you're trying to understand me, and that means a lot to me.",
    ko: "재촉받는다는 느낌은 한 번도 든 적이 없어요. 늘 저를 이해하려고 하신다는 게 느껴지고, 그게 저한테는 정말 큰 의미예요.",
  },
  {
    id: "wfv-005",
    en: "It is already saving me some time, and I am getting information back to the team much quicker.",
    ko: "벌써 시간이 좀 절약되고 있고, 팀에 정보를 훨씬 빨리 전달하고 있어요.",
  },
  {
    id: "taima-020",
    en: "I appreciate your clear communication… especially the way that you brought me along.",
    ko: "명확하게 소통해 주셔서 감사해요… 특히 과정 내내 저를 함께하게 해 주신 방식이요.",
  },
  {
    id: "wfv-010",
    en: "It's made it a lot simpler in terms of tracking when someone's out of the office… that's been a wonderful addition to the payroll.",
    ko: "누가 언제 자리를 비우는지 파악하기가 훨씬 간단해졌어요… 급여 업무에 정말 훌륭한 보탬이 됐어요.",
  },
];

/** Titles, organisation first as Korean writes them. Jill is 원무실장 everywhere on /kr; Gabe's broader title is 실장. */
const ROLES_KO: Record<string, string> = {
  "Front Office Manager, Wichita Family Vision": "Wichita Family Vision 원무실장",
  "Office Manager, Wichita Family Vision": "Wichita Family Vision 실장",
  "Bookkeeper, Wichita Family Vision": "Wichita Family Vision 경리 담당",
  "Founder, Workthentic": "Workthentic 창업자",
};

function inKorean(q: Testimonial): QuoteCard {
  const role = ROLES_KO[q.role] ?? q.role;
  const t = QUOTES_KO.find((x) => x.id === q.id && x.en === q.text);
  return t ? { ...q, text: t.ko, role, original: q.text } : { ...q, role };
}

export const HOME_KO: HomeCopy = {
  cta: CTA_KO,
  hero: {
    kicker: "개인 병·의원을 위한",
    headline: { lead: "잡무는 줄이고,", accent: "환자에게는 더\u00a0많은 시간을." },
    sub: "병원이 어디서 시간을 아끼고 수익을 높일 수 있는지 진단한 뒤, 그 목표를 이룰 솔루션을 만들어 드립니다.",
    secondary: { label: "서비스 보기", href: `${KR_PATH}#work` },
  },
  heroWindow: {
    ariaLabel:
      "데스크 현황: 월요일 이후 약 5시간 절약, 원무실장 없이 답한 질문 20건, QuickBooks에 입력된 청구서 12건, 승인된 휴가 신청 3건. '예약 늦은 환자'를 검색하면 해당 규정이 열립니다.",
    query: "예약 늦은 환자",
    brand: "Front Desk",
    brandInitials: "FD",
    navFront: "데스크",
    navFrontItems: [["홈", ""], ["답변", "35"], ["가격", "41"], ["의료진", "4"], ["보험", "12"]],
    navOffice: "사무",
    navOfficeItems: ["청구서", "휴가", "급여 보고서"],
    me: "원무실장",
    meInitials: "원",
    title: "데스크 현황",
    meta: "실시간 반영",
    stats: [
      { n: "약 5시간", l: "월요일 이후 아낀 시간" },
      { n: "20", l: "원무실장 없이 답한 질문" },
      { n: "12", l: "QuickBooks에 입력된 청구서" },
      { n: "3", l: "승인된 휴가 신청" },
    ],
    today: "오늘",
    feed: [
      { t: "9:14", what: "예약 늦은 환자", out: "답변 완료" },
      { t: "9:31", what: "의료 소모품 청구서, $1,284.60", out: "QuickBooks 입력" },
      { t: "10:02", what: "금요일 반차", out: "승인" },
    ],
    billsBar: "QuickBooks · 오늘 입력된 청구서",
    bills: [["의료 소모품", "$1,284.60"], ["청소 용역", "$642.00"], ["사무용품", "$89.47"]],
    popQ: "환자분이 늦으셨는데, 진료 가능한가요?",
    popRows: [["15분 이내", "접수하세요."], ["15분 초과", "가장 빠른 빈 시간을 안내하세요."]],
    popFoot: "검색 한 번에 찾았습니다. 누구에게 물어볼 필요도 없었습니다.",
    caption: "실제 운영 중인 시스템을 바탕으로 했습니다. 이름과 금액은 예시입니다.",
  },
  logosLabel: "파트너",
  work: {
    kicker: "서비스",
    title: "직원은 환자에게 집중하고, 나머지는 저희가 맡습니다.",
    tablistLabel: "서비스",
    items: [
      {
        title: "데스크 업무 가이드",
        body: "모든 규정과 가격, 예외 사항을 직원 누구나 검색할 수 있게 한곳에 모으고, 내용은 원무실장님이 늘 최신으로 관리합니다. 캔자스부터 캘리포니아까지 실제로 운영되고 있는 시스템입니다.",
        link: { label: "사례 연구 보기(영문)", href: CASE_STUDY_URL },
      },
      {
        title: "청구서를 QuickBooks로",
        body: "Intuit의 승인을 받은 자체 앱이 청구서를 읽고 분류해 회계 프로그램 QuickBooks에 바로 입력합니다. 경리 담당자는 일일이 입력하는 대신 확인만 하면 됩니다.",
        link: { label: "한 페이지 요약(영문)", href: PROOF_LINKS.items[1].href },
      },
      {
        title: "휴가와 급여",
        body: "아직 종이 신청서나 스프레드시트로 관리하는 병원을 위해, 신청과 승인, 캘린더, 급여 보고서를 한곳에 모았습니다.",
        link: { label: "한 페이지 요약(영문)", href: PROOF_LINKS.items[0].href },
      },
      {
        title: "병원에 꼭 맞춘 시스템",
        body: "일상적인 행정 업무를 위한 AI 워크플로 구축부터, EHR(전자건강기록)\u2060과 연동해 환자 기록을 다루는 HIPAA(미국 의료정보 보호법) 준수 시스템까지, 병원에 필요한 것이라면 무엇이든 만듭니다. 병원이 변화하는 동안에도 시스템이 잘 돌아가도록 계속 곁에서 관리합니다.",
      },
    ],
    previews: {
      answers: {
        query: "예약 늦은 환자",
        question: "환자분이 늦으셨는데, 진료 가능한가요?",
        cases: [
          { k: "15분 이내", v: "접수 후 진료 보조 직원에게 알리세요." },
          { k: "15분 초과", v: "오늘 가장 빠른 빈 시간을 안내하거나 예약을 다시 잡으세요." },
        ],
        meta: "규정 · 원무실장 업데이트",
      },
      bills: {
        bar: "QuickBooks · 오늘 입력된 청구서",
        rows: [
          ["의료 소모품", "소모품", "$1,284.60"],
          ["청소 용역", "청소", "$642.00"],
          ["사무용품", "사무용품", "$89.47"],
          ["인터넷", "공과금", "$129.99"],
        ],
        meta: "거래처별 폴더에 맞게 정리했습니다. 중복 입력은 없습니다.",
      },
      timeoff: {
        title: "휴가 신청",
        rows: [["신청자", "데스크"], ["일시", "금요일 반차"], ["잔여", "올해 32시간 남음"]],
        steps: ["휴대폰으로 승인", "병원 캘린더에 등록", "이번 급여 기간 보고서에 반영"],
      },
      systems: {
        nodes: [
          { k: "병원 EHR", v: "환자 기록" },
          { k: "병원 AWS 계정", v: "BAA 적용" },
          { k: "병원 직원", v: "업무 처리 완료" },
        ],
        meta: "환자 데이터는 병원 명의의 계정 안에만 있고, 저희 서버로는 오지 않습니다.",
      },
    },
  },
  patient: {
    label: "환자 데이터",
    points: [
      "시작하기 전에 BAA(환자정보 보호 계약)\u2060를 체결합니다.",
      "저희가 만드는 것 대부분은 환자 데이터를 전혀 다루지 않습니다.",
      "다뤄야 할 때도, 데이터를 보호할 인프라를 갖추고 있습니다.",
    ],
  },
  proof: {
    kicker: "사례 연구 · Wichita Family Vision",
    title: {
      lead: "모든 질문이 한 사람을 거쳐야 했습니다.",
      accent: "이제는 데스크에서 일하는 누구나 몇 초 만에 답을 찾습니다.",
    },
    problem:
      "“이 환자분은 어느 선생님이 진료하실 수 있나요?” “이건 바로 수납하나요, 보험으로 청구하나요?” 이런 질문이 하루 종일 이어졌고, 그때마다 환자를 기다리게 하고 원무실장님을 하던 일에서 불러내야 했습니다.",
    text: "이건 단기적으로도 장기적으로도 정말 가치가 커요. 벌써 시간을 많이 아껴 주고 있어요.",
    original: { label: "원문", text: QUOTE.text },
    who: QUOTE.who,
    role: "원무실장",
    payoff: [
      { n: "약 200시간", l: "매년 데스크에서 되찾은 시간" },
      { n: "약 $4,500", l: "연간 데스크 인건비 상당" },
    ],
    payoffNote: "병원 자체 수치를 바탕으로 한 추정치입니다.",
    status: "실제 운영 중",
    links: {
      full: { label: "사례 연구 전문 보기(영문)", href: PROOF_LINKS.full.href },
      more: "다른 사례도 한 페이지씩 정리했습니다(영문):",
      items: [
        { label: "휴가와 급여", href: PROOF_LINKS.items[0].href },
        { label: "거래처 청구서", href: PROOF_LINKS.items[1].href },
      ],
    },
  },
  how: {
    kicker: "함께 일하는 방식",
    title: "일부러 단순하게.",
    steps: [
      {
        n: "01",
        title: "진단",
        body: "이 단계는 무료입니다. 병원에서 가장 좋은 결과를 낼 수 있는 곳을 함께 찾고, 이후 진행 여부와 관계없이 저희 분석 결과는 그대로 가지셔도 됩니다.",
        shows: "Opportunity Map 보기",
      },
      {
        n: "02",
        title: "구축",
        body: "분석 결과를 바탕으로, 지금 쓰고 계신 도구에 맞춰 직원들의 시간을 되찾아 줄 솔루션을 만듭니다. 가격은 정액으로, 서면으로 확정합니다.",
        shows: "구축 현황 보기",
      },
      {
        n: "03",
        title: "최적화",
        body: "운영을 시작한 뒤에도 매달 시스템이 잘 돌아가도록 관리하고 계속 개선합니다. 시스템은 언제나 병원의 것입니다.",
        shows: "운영 모습 보기",
      },
    ],
    tablistLabel: "함께 일하는 과정, 단계별 안내",
    start: "여기서 시작",
    shownBelow: "아래에서 보기",
    windows: {
      map: {
        bar: ["Opportunity Map", "진단"],
        title: "병원이 가장 많이 잃고 있는 곳",
        meta: "우선순위대로, 각각의 해결 방안과 함께",
        rows: [
          { where: "지급되지 않고 남은 보험 청구", fix: "모든 청구 건을 지급될 때까지 추적 관리" },
          { where: "끝나지 않은 치료와 밀린 정기 검진", fix: "환자에게 알리고 다시 예약" },
          { where: "데스크를 멈춰 세우는 전화와 질문", fix: "직원 누구나 몇 초 만에 찾는 답" },
          { where: "손으로 입력하는 청구서와 서류", fix: "읽고 입력까지 마쳐, 검토만 하면 됩니다" },
        ],
      },
      build: {
        bar: ["구축 현황", "구축"],
        title: "병원을 위해 만들고 있는 것",
        meta: "Opportunity Map을 바탕으로, 한 번에 하나씩",
        rows: [
          { what: "데스크 업무 가이드", state: "운영 중", good: true },
          { what: "청구서를 QuickBooks로", state: "직원과 테스트 중", good: false },
          { what: "치료 후속 관리", state: "구축 중", good: false },
          { what: "보험 청구 후속 관리", state: "다음 순서", good: false },
        ],
        foot: "병원 업무 프로그램 안이 아니라, 그 옆에서 작동합니다.",
      },
      month: {
        bar: ["이번 달", "월 단위"],
        title: "안정적으로 운영하며, 계속 더 좋게",
        meta: "지난달 이후 달라진 점",
        rows: [
          { what: "새 보험 규정 추가", state: "완료", good: true },
          { what: "후속 연락 시점을 병원 일정에 맞게 조정", state: "완료", good: true },
          { what: "원장님께 월간 보고서 발송", state: "발송", good: true },
          { what: "원무실장님과 월간 점검", state: "예약됨", good: false },
        ],
        foot: "무엇이든 직원이 직접 바꿀 수 있습니다.",
      },
    },
    satellites: {
      discover: { k: "상담 후 보내 드립니다", t: "다음 단계와 관계없이 그대로 가지셔도 됩니다." },
      deliver: { k: "서면으로 확정하는 정액 가격" },
      optimize: { k: "월 단위", t: "모든 시스템이 제\u00a0역할을 계속합니다. 멈추면 저희가 고칩니다." },
    },
  },
  pricing: {
    kicker: "가격",
    title: "병원마다 맞는 플랜이 있습니다.",
    tiers: [
      {
        name: "Foundation",
        slug: V7_PRICING.tiers[0].slug,
        price: "$4,500",
        monthly: "이후 월 $399",
        lead: "가장 큰 골칫거리 하나를 해결합니다.",
        body: "병원의 시간을 가장 많이 잡아먹는 문제 하나를 찾아 해결하고, 약 30일 안에 실제 운영을 시작합니다.",
      },
      {
        name: "Growth",
        slug: V7_PRICING.tiers[1].slug,
        price: "$7,500",
        monthly: "이후 월 $699",
        lead: "가장 큰 문제 두 가지를 해결합니다.",
        body: "시스템 두 가지를 구축하고, 업무를 더디게 만드는 서류 작업을 Claude나 ChatGPT로 처리할 수 있도록 직원 교육도 해 드립니다.",
        note: "대부분의 병원에 추천하는 플랜입니다.",
      },
      {
        name: "Partner",
        slug: V7_PRICING.tiers[2].slug,
        price: "$20,000",
        monthly: "이후 월 $1,499",
        lead: "채용 없이 꾸리는 기술팀.",
        body: "Growth의 모든 내용에 더해, 비용을 회수할 수 있는 곳이라면 어디든 맞춤 소프트웨어를 만들고, 매달 저희 두 사람과 함께 일하는 시간을 드립니다.",
      },
    ],
    guarantee: {
      lead: "약속한 대로 만들지 못하면,",
      accent: "비용을 돌려 드립니다.",
      sub: "보장합니다. 무엇을 만들지는 시작 전에 서면으로 합의하고, 합의한 대로 작동하지 않으면 비용을 받지 않습니다.",
    },
    fine: "월 이용료는 저희의 보증입니다. 저희가 만든 모든 것이 제\u00a0역할을 계속하도록 하고, 멈추면 고칩니다. 장기 계약은 없습니다. 언제든 해지할 수 있으며, 해지 후에도 콘텐츠는 병원의 것입니다.",
  },
  inTheirWords: {
    kicker: "고객의 목소리",
    title: { lead: "저희가 만든 것을 쓰는 분들이", accent: "직접\u00a0전하는 이야기." },
    beltLabel: "저희가 만든 시스템을 쓰는 분들의 말",
    originalLabel: "원문",
    items: HOME_TESTIMONIALS.map(inKorean),
  },
  founders: {
    kicker: "팀 소개",
    title: "공동 창업자를 소개합니다",
    note: "첫 상담부터 매달 진행하는 점검까지, 모든 시스템을 저희 두 사람이 만듭니다.",
    people: [
      {
        ...FOUNDERS[0],
        name: "알렉 스티븐스",
        nameLatin: "Alec Stephens",
        role: "공동 창업자",
        bio: "알렉은 5년 넘게 여러 업계의 사업주들과 나란히 일하며, 지금 그분들이 매일 쓰는 시스템을 만들어 왔습니다.",
      },
      {
        ...FOUNDERS[1],
        name: "김주신",
        nameLatin: "Ju Sheen Kim",
        role: "공동 창업자",
        bio: "UC 버클리에서 컴퓨터공학을 전공했고, 이후 J.P. 모건에서 리드 소프트웨어 엔지니어로 일했습니다.",
      },
    ],
  },
  contact: {
    kicker: "진단",
    titleLead: "가장 큰 성과를 낼 곳을 함께 찾아보겠습니다.",
    titleAccent: "첫\u00a0단계는 무료입니다.",
    body: "병원 업무를 더디게 만드는 일을 알려 주세요. 가장 좋은 결과를 낼 수 있는 곳을 찾아 분석 결과인 Opportunity Map을 보내 드립니다. 이후 진행 여부와 관계없이 그대로 가지셔도 됩니다.",
    bookLabel: "시작하기",
    bookHref: CALENDLY,
    ariaLabel: "문의",
    // Ju Sheen first: he reads Korean.
    emails: [CONTACT_EMAIL_JUSHEEN, CONTACT_EMAIL],
  },
  form: {
    locale: "ko",
    name: "이름",
    namePlaceholder: "성함",
    email: "이메일",
    emailPlaceholder: "you@company.com",
    message: "문의 내용",
    messagePlaceholder: "한 주 동안 가장 많은 시간을 잡아먹는 일은 무엇인가요?",
    send: "보내기",
    sending: "보내는 중...",
    sentTitle: "메시지를 보냈습니다.",
    sentBody: "다음 영업일 오전까지 답장 드리겠습니다.",
    sendAnother: "메시지 하나 더 보내기",
    showServerError: false,
    errorFallback: "메시지를 보내지 못했습니다.",
    errorEmail: CONTACT_EMAIL_JUSHEEN,
    errorLead: "",
    errorTail: "로 직접 메일 주셔도 됩니다.",
  },
};

export const CHROME_KO: ChromeCopy = {
  lang: "ko",
  home: KR_PATH,
  homeLabel: "Stephens AI 홈",
  skip: "본문 바로가기",
  nav: [
    { label: "서비스", href: `${KR_PATH}#work` },
    { label: "진행 방식", href: `${KR_PATH}#how` },
    { label: "가격", href: `${KR_PATH}#pricing` },
    { label: "창업자", href: `${KR_PATH}#about` },
    { label: "FAQ(영문)", href: "/faq" },
  ],
  cta: CTA_KO,
  navLabel: "주요 메뉴",
  mobileNavLabel: "모바일 메뉴",
  menuLabel: "사이트 메뉴",
  openMenu: "메뉴 열기",
  closeMenu: "메뉴 닫기",
  close: "닫기",
  footer: {
    label: "사이트 하단 정보",
    navLabel: "하단 메뉴",
    caseStudy: "사례 연구(영문)",
    workWithUs: { label: "진행 방식", href: `${KR_PATH}#how` },
    portfolio: "알렉의 포트폴리오(영문)",
    email: { label: "이메일", href: `mailto:${CONTACT_EMAIL_JUSHEEN}` },
    llc: "Stephens AI LLC는 미국 캔자스주 위치토에 있는 캔자스주 유한책임회사입니다.",
    privacy: "개인정보처리방침(영문)",
    terms: "이용약관(영문)",
  },
};
