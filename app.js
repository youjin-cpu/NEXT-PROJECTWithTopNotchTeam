// Firebase 초기화
const _fbConfig={apiKey:"AIzaSyDDPMbpqzH4rFQ7V92xv2qOXl516cMwGb0",authDomain:"task-tracker-7ac8b.firebaseapp.com",projectId:"task-tracker-7ac8b",storageBucket:"task-tracker-7ac8b.firebasestorage.app",messagingSenderId:"504396798851",appId:"1:504396798851:web:8566a8c59c33cd43ff74b6"};
firebase.initializeApp(_fbConfig);
const db=firebase.firestore();
// 비밀번호 (SHA-256 해시)
const PW_HASH="72d557fdce78feb82e547333b23957507eb6e03e10ebdd393c22d82b863c1736";
async function sha256(msg){const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(msg));return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");}
async function checkPw(){const val=document.getElementById("pw-input").value;const hash=await sha256(val);if(hash===PW_HASH){sessionStorage.setItem("pw-ok","1");document.getElementById("pw-screen").style.display="none";document.getElementById("loading-overlay").style.display="flex";await loadAll();document.getElementById("loading-overlay").style.display="none";document.getElementById("login-screen").style.display="flex";renderLoginList();}else{const err=document.getElementById("pw-error");err.style.display="block";document.getElementById("pw-input").value="";document.getElementById("pw-input").focus();setTimeout(()=>{err.style.display="none";},3000);}}
const SVG={plus:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,x:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,check:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,edit:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,trash:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4h6v2"/></svg>`,chevronRight:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,users:`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,inbox:`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,history:`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>`,listDetails:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,calendarEvent:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="1" fill="currentColor"/></svg>`,list:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`};
let TRACK_META={common:{name:"공통",cls:"t-common",color:"#C2610A"},core:{name:"브랜드 코어 & 보이스",cls:"t-core",color:"#1D4ED8"},identity:{name:"브랜드 아이덴티티",cls:"t-id",color:"#15803D"},asset:{name:"브랜드 에셋",cls:"t-asset",color:"#4B5563"},site:{name:"브랜드 에셋 사이트",cls:"t-site",color:"#6D28D9"},film:{name:"브랜드 Film",cls:"t-film",color:"#BE123C"},collab:{name:"공동브랜딩",cls:"t-collab",color:"#7E22CE"}};
const TRACK_META_INIT={...TRACK_META};
const SEP_MAP={};
const MAX_HISTORY=500;
function xlDate(s){const d=new Date(Math.round((s-25569)*86400*1000));return`${d.getUTCMonth()+1}/${d.getUTCDate()}`;}
const WEEK_DATES_INIT={W0:`${xlDate(46169)}–${xlDate(46171)}`,W1:`${xlDate(46174)}–${xlDate(46179)}`,W2:`${xlDate(46181)}–${xlDate(46185)}`,W3:`${xlDate(46188)}–${xlDate(46192)}`,W4:`${xlDate(46194)}–${xlDate(46199)}`,W5:`${xlDate(46202)}–${xlDate(46206)}`,W6:`${xlDate(46209)}–${xlDate(46213)}`,W7:`${xlDate(46216)}–${xlDate(46220)}`,W8:`${xlDate(46223)}–${xlDate(46227)}`,W9:`${xlDate(46230)}–${xlDate(46234)}`,W10:`${xlDate(46237)}–${xlDate(46241)}`,W11:`${xlDate(46244)}–${xlDate(46248)}`,W12:`${xlDate(46251)}–${xlDate(46255)}`,W13:`${xlDate(46258)}–${xlDate(46262)}`,W14:`${xlDate(46265)}–${xlDate(46269)}`,W15:`${xlDate(46272)}–${xlDate(46276)}`,W16:`${xlDate(46279)}–${xlDate(46283)}`};
const WEEK_ORDER_INIT=["W0","W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12","W13","W14","W15","W16"];
const AV_COLORS=["#DBEAFE,#1E40AF","#DCFCE7,#166534","#FCE7F3,#9D174D","#FEF3C7,#92400E","#EDE9FE,#5B21B6","#FFF7ED,#9A3412","#F0FDF4,#15803D","#FEF2F2,#991B1B"];
const INIT_DATA=[
  {w:"W0",m:"킥오프 주간",b:"킥오프",t:"common",task:"킥오프 미팅"},{w:"W0",t:"common",task:"각 카테고리별 업무 항목 정의"},{w:"W0",t:"common",task:"상세 업무 계획 수립"},
  {w:"W1",m:"리서치 & 코어 착수",b:"진행",t:"core",task:"글로벌 대응 메시지 레퍼런스 리서치"},{w:"W1",t:"core",task:"브랜드 현황 파악 - 1차 결과물 검토 및 업데이트 범위 확인"},{w:"W1",t:"identity",task:"로고 마스터 시스템 정의 : 확정 로고 그리드 시스템 별 적용 / 메인로고 조형 수정"},{w:"W1",t:"identity",task:"브랜드 아키텍처 전체 로고(서브브랜드) 대입 : 일관성 검토"},{w:"W1",t:"collab",task:"인터뷰지 분석 및 우선순위 정리"},{w:"W1",t:"collab",task:"네이밍 아이데이션 및 1차 선별 (조합형, 설명, 합성, 약어)"},{w:"W1",t:"collab",task:"인터뷰 질문지 그룹화"},{w:"W1",t:"identity",task:"브랜드 아이덴티티 항목 정렬 - 기준 사례 리서치"},{w:"W1",t:"identity",task:"로고 모션그래픽 현황 및 비주얼 레퍼런스 조사 / 로고·벡터 모션 중심"},{w:"W1",t:"collab",task:"네이밍 1차 선별 항목 고도화 (50%)및 추가 아이데이션"},
  {w:"W2",m:"코어 초안",b:"진행",t:"core",task:"(보류) 내부 인터뷰 실시 - 브랜드 인식 분석 (검토)"},{w:"W2",t:"core",task:"글로벌 대응 메시지 인사이트 정리 및 방향성 제안"},{w:"W2",t:"core",task:"글로벌 보이스 원칙 초안 - 'Beyond the Standard' 체계화"},{w:"W2",t:"identity",task:"브랜드 아키텍처 전체 로고(서브브랜드): 세로형 고려 / 가로형·세로형 방향 제작"},{w:"W2",t:"identity",task:"브랜드 컬러 체계 초안 착수(1차) / 메인 + 서브 브랜드 컬러"},{w:"W2",t:"asset",task:"기존 키비주얼 현황 체크 및 에셋 레퍼런스 조사 / 3D 굿즈·공간 중심"},{w:"W2",t:"collab",task:"[리뷰] 네이밍 1차 선별 항목 고도화 및 추가 아이데이션"},{w:"W2",t:"identity",task:"브랜드 아이덴티티 BestCase 리서치 인사이트 도출 & 항목 정렬 및 확정"},
  {w:"W3",m:"브랜드 전략 및 내러티브",b:"진행",t:"core",task:"브랜드 내러티브 시스템 구조화 (기업BI, 서비스BI)"},{w:"W3",t:"core",task:"시장별 메시지 코어 초안 (대표 시장 선정)"},{w:"W3",t:"core",task:"태그라인 후보군 1차 도출 및 내부 검토"},{w:"W3",t:"identity",task:"브랜드 컬러 체계 초안 착수(2차) / 메인 + 서브 브랜드 컬러"},{w:"W3",t:"identity",task:"로고 마스터 시스템 1차 내부 보고: 방향성 확정 / 로고+서브브랜드로고+컬러 보고장표 제작"},{w:"W3",t:"film",task:"로고 모션그래픽 비주얼 제안 / 로고·벡터 모션 중심"},
  {w:"W4",m:"전략 확정 및 1차 중간보고",b:"마일스톤",t:"core",task:"브랜드 원칙, MVC 내부 보고 및 확정"},{w:"W4",t:"core",task:"톤앤매너 가이드라인 초안 작성"},{w:"W4",t:"core",task:"채널별 커뮤니케이션 기준 정리"},{w:"W4",t:"identity",task:"브랜드 로고 + 컬러 체계 확정 / 로고 시스템 전반 보완, 레터링 셋, 가이드 작성 착수"},{w:"W4",t:"identity",task:"타이포그래피 시스템 구축 - KR/EN 서체 선정 및 스케일 정의 / 브랜드 폰트"},{w:"W4",t:"identity",task:"기존 키비주얼 보완 및 에셋 리소스 제작 / 3D 씬 제작"},{w:"W4",t:"film",task:"로고 모션그래픽 제작"},
  {w:"W5",m:"비주얼 시스템 구축 착수",b:"진행",t:"core",task:"태그라인 확정 및 글로벌 버전 병행 작업"},{w:"W5",t:"core",task:"브랜드 보이스 예시 콘텐츠 초안 (In-use, Misuse)"},{w:"W5",t:"identity",task:"브랜드 그래픽 모티브 라이브러리 방향 설정 / 레퍼런스·작업방향 싱크"},{w:"W5",t:"identity",task:"브랜드 키비주얼 시안 제작 / (2D) 패턴 배리에이션 / (3D) 굿즈·오프라인 배리에이션"},{w:"W5",t:"asset",task:"브랜드 모션&영상 아이덴티티(1/4차): 기획안 작성 / 로고모션·아이덴티티 제작 싱크"},{w:"W5",t:"asset",task:"브랜드 모션&영상 아이덴티티(2/4차): 컨셉방향"},
  {w:"W6",m:"키비주얼, 아이콘, 모션 설계",b:"진행",t:"identity",task:"아이콘 시스템(1/2차) : 구조 설계(스타일 가이드) / 니즈 파악 및 목업제작"},{w:"W6",t:"asset",task:"브랜드 모션&영상 아이덴티티(2/4차): 제작 / 제작 디밸롭"},{w:"W6",t:"asset",task:"브랜드 모션&영상 아이덴티티(2/4차): 가이드 작성 / 트랜지션 원칙, 속도감"},{w:"W6",t:"film",task:"브랜드 Film 기획 작업"},{w:"W6",t:"film",task:"브랜드 Film 기획 작업 / 비주얼 레퍼런스 수집·컨셉방향"},
  {w:"W7",m:"프로토타입",b:"진행",t:"identity",task:"디자인 토큰 정의: 컬러, 타이포, 스페이스, 모션 / 개발 연동을 위한 수치화"},{w:"W7",t:"identity",task:"모듈러 방식 비주얼 에셋 구조화 / 리소스, 영상 비주얼가이드, 템플릿 가이드 정리·제작"},{w:"W7",t:"film",task:"브랜드 Film 키스크린 작업 / 이미지 컨셉 작업"},
  {w:"W8",m:"가이드라인 고도화",b:"마일스톤",t:"identity",task:"프로토타입 (업비트 서비스 목업) 적용 테스트 및 보완"},{w:"W8",t:"identity",task:"아이콘 시스템(2/2차): 키비주얼 / 목업 테스트"},{w:"W8",t:"film",task:"브랜드 Film 키스크린 작업 2차"},{w:"W8",t:"film",task:"브랜드 Film 3D 에셋 상세 착수"},
  {w:"W9",m:"브랜드 에셋 사이트 설계",b:"진행",t:"identity",task:"온 오프라인 적용 목업"},{w:"W9",t:"asset",task:"AI 기반 브랜드 에셋 설계(1/3차): 재조합 컴포넌트 워크플로우 설계 / 아이콘·비주얼 에셋"},{w:"W9",t:"asset",task:"커뮤니케이션 비주얼 템플릿(1/1차): 제작 착수 (Slide, SNS용)"},{w:"W9",t:"site",task:"에셋 사이트 IA 설계"},{w:"W9",t:"site",task:"콘텐츠 분류 체계 확정"},{w:"W9",t:"film",task:"브랜드 Film 키스크린 최종 확정"},{w:"W9",t:"film",task:"브랜드 Film 3D 에셋 제작 방향성 검토"},{w:"W9",t:"film",task:"브랜드 Film 편집 진행"},
  {w:"W10",m:"사이트 와이어프레임 작업",b:"진행",t:"asset",task:"AI 기반 브랜드 에셋(2/3차): 에셋 자동화 워크플로우 테스트"},{w:"W10",t:"asset",task:"AI 기반 브랜드 에셋(2/3차): 거버넌스 룰 초안 작성"},{w:"W10",t:"site",task:"사이트 인터랙션 정의"},{w:"W10",t:"site",task:"콘텐츠 내용 와이어프레임 적용"},
  {w:"W11",m:"사이트 구축 및 에셋 통합",b:"진행",t:"identity",task:"Figma 가이드 정비 진행"},{w:"W11",t:"asset",task:"커뮤니케이션 비주얼 템플릿(2/2차): 완성 및 목업 검증"},{w:"W11",t:"asset",task:"브랜드 에셋 및 에셋 사이트 중간 보고"},{w:"W11",t:"asset",task:"AI 기반 브랜드 에셋(3/3차): 생성 가이드 작성"},{w:"W11",t:"site",task:"에셋 사이트 내부 리뷰"},{w:"W11",t:"site",task:"에셋 사이트 주요 섹션 개발"},{w:"W11",t:"film",task:"브랜드 Film 편집 1차본 검토"},
  {w:"W12",m:"사이트 QA",b:"마일스톤",t:"site",task:"에셋 사이트 전체 검증"},{w:"W12",t:"film",task:"브랜드 Film 편집 2차 (수정안) 검토"},
  {w:"W13",m:"최종 리뷰 준비",b:"마무리",t:"identity",task:"최종 보고 문서 작성 및 방향성 싱크 / 문서용 비주얼 재정의·추가제작"},{w:"W13",t:"film",task:"브랜드 Film 편집 최종 검토"},
  {w:"W14",m:"문서 덱작업",b:"마무리",t:"identity",task:"최종 보고 덱작업 / 슬라이드용 비주얼 업데이트·제작"},
  {w:"W15",m:"최종보고",b:"최종",t:"identity",task:"C레벨 최종 보고 / 덱 비주얼 디밸롭"},
  {w:"W16",m:"산출물 정리",b:"마무리",t:"identity",task:"산출물 배포 준비 / 에셋, 가이드, 템플릿 등"}
];
let WEEK_DATES={W0:"5/27–5/29",W1:"6/1–6/6",W2:"6/8–6/12",W3:"6/15–6/19",W4:"6/21–6/26",W5:"6/29–7/3",W6:"7/6–7/10",W7:"7/13–7/17",W8:"7/20–7/24",W9:"7/27–7/31",W10:"8/3–8/7",W11:"8/10–8/14",W12:"8/17–8/21",W13:"8/24–8/28",W14:"8/31–9/4",W15:"9/7–9/11",W16:"9/14–9/18"};
let WEEK_ORDER=["W0","W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12","W13","W14","W15","W16"];
let BADGES=[];
const SK={data:"dunamu-tracker-v1",members:"dunamu-tracker-members-v1"};
let members=[];
let currentUser=null,nextMId=8,nextId=83;
let tasks=[];
let checks={};
let assignees={};
let currentFilter="all",currentTrackFilter="all",hideDone=false,workloadWeekFilter=null,pendingDeleteId=null,history_log=[],sectionOpen={track:true,week:true},currentDetailMid=null,saveTimer=null,lastBlockCollapsed=false;
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function avColors(i){const p=AV_COLORS[i%AV_COLORS.length].split(",");return{bg:p[0],ft:p[1]};}
function initials(n){return n.slice(0,2);}
function nowStr(){return new Date().toLocaleString("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"});}
function getCurrentWeek(){const today=new Date();let ff=null;for(let i=0;i<WEEK_ORDER.length;i++){const w=WEEK_ORDER[i],d=WEEK_DATES[w];if(!d)continue;const pts=d.split("–");if(pts.length<2)continue;const[sm,sd]=pts[0].trim().split("/").map(Number);const[em,ed]=pts[1].trim().split("/").map(Number);const yr=today.getFullYear();const s=new Date(yr,sm-1,sd),e=new Date(yr,em-1,ed,23,59,59);if(today>=s&&today<=e)return w;if(today<s&&!ff)ff=w;}return ff||WEEK_ORDER[WEEK_ORDER.length-1];}
function toggleSection(k){sectionOpen[k]=!sectionOpen[k];document.getElementById("toggle-body-"+k).classList.toggle("open",sectionOpen[k]);document.getElementById("toggle-icon-"+k).classList.toggle("open",sectionOpen[k]);}
function positionEl(el,trig,w){el.style.display="block";const r=trig.getBoundingClientRect(),eh=el.offsetHeight||160,vw=window.innerWidth,vh=window.innerHeight;let left=r.left,top=r.bottom+8;if(left+w>vw-8)left=vw-w-8;if(left<8)left=8;if(top+eh>vh-8)top=r.top-eh-8;el.style.left=left+"px";el.style.top=top+"px";}
function showSaving(){const el=document.getElementById("save-indicator");el.className="save-indicator saving";document.getElementById("save-text").textContent="저장 중...";}
function showSaved(){const el=document.getElementById("save-indicator");el.className="save-indicator saved";document.getElementById("save-text").textContent="저장됨";setTimeout(()=>el.className="save-indicator hidden",2000);}
function scheduleSave(){showSaving();if(saveTimer)clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{try{await db.collection("tracker").doc("data").set({tasks,checks,assignees,history_log,WEEK_DATES,WEEK_ORDER,BADGES,nextId,TRACK_ORDER,TRACK_META});await db.collection("tracker").doc("members").set({members,nextMId});showSaved();}catch(e){document.getElementById("save-indicator").className="save-indicator hidden";console.error("저장 실패:",e);}finally{saveTimer=null;}},500);}
async function loadAll(){try{const mDoc=await db.collection("tracker").doc("members").get();if(mDoc.exists){const mData=mDoc.data();members=mData.members||[];nextMId=mData.nextMId||1;}const dDoc=await db.collection("tracker").doc("data").get();if(dDoc.exists){const dData=dDoc.data();tasks=dData.tasks||[];const fc={};Object.entries(dData.checks||{}).forEach(([k,v])=>{fc[parseInt(k)]=v;});checks=fc;const fa={};Object.entries(dData.assignees||{}).forEach(([k,v])=>{fa[parseInt(k)]=v;});assignees=fa;history_log=dData.history_log||[];WEEK_DATES=dData.WEEK_DATES||{...WEEK_DATES_INIT};WEEK_ORDER=dData.WEEK_ORDER||[...WEEK_ORDER_INIT];BADGES=dData.BADGES||BADGES;nextId=dData.nextId||0;if(dData.TRACK_ORDER)TRACK_ORDER=dData.TRACK_ORDER;if(dData.TRACK_META)TRACK_META=dData.TRACK_META;return true;}}catch(e){console.error("로드 실패:",e);}return false;}
async function startApp(){if(!sessionStorage.getItem("pw-ok")){document.getElementById("loading-overlay").style.display="none";document.getElementById("pw-screen").style.display="flex";return;}await loadAll();document.getElementById("loading-overlay").style.display="none";document.getElementById("login-screen").style.display="flex";renderLoginList();}
startApp();
function addHistory(t,d,dt=""){history_log.unshift({type:t,who:currentUser?.name||"?",when:nowStr(),desc:d,detail:dt});if(history_log.length>MAX_HISTORY)history_log.length=MAX_HISTORY;scheduleSave();}
function renderLoginList(){const el=document.getElementById("login-member-list");el.innerHTML=members.length?"":`<p style="font-size:13px;color:var(--text2);text-align:center;padding:8px 0">아직 등록된 팀원이 없어요</p>`;members.forEach(m=>{const c=avColors(m.colorIdx);const btn=document.createElement("button");btn.className="member-btn";btn.innerHTML=`<div class="avatar" style="width:40px;height:40px;font-size:14px;background:${c.bg};color:${c.ft}">${esc(initials(m.name))}</div><div class="member-info"><div class="member-name-lg">${esc(m.name)}</div><div class="member-role-sm">${esc(m.role)}</div></div>`;btn.onclick=()=>login(m);el.appendChild(btn);});}
function registerAndLogin(){const name=document.getElementById("login-new-name").value.trim(),role=document.getElementById("login-new-role").value.trim();if(!name){alert("이름을 입력하세요.");return;}if(members.find(m=>m.name===name)){alert("이미 등록된 이름입니다.");return;}const m={id:nextMId++,name,role:role||"팀원",colorIdx:members.length};members.push(m);scheduleSave();login(m);}
let _syncUnsub=null;
function setupRealtimeSync(){if(_syncUnsub)_syncUnsub();_syncUnsub=db.collection("tracker").doc("data").onSnapshot(doc=>{if(!doc.exists||saveTimer)return;const d=doc.data();tasks=d.tasks||tasks;const fc={};Object.entries(d.checks||{}).forEach(([k,v])=>{fc[parseInt(k)]=v;});checks=fc;const fa={};Object.entries(d.assignees||{}).forEach(([k,v])=>{fa[parseInt(k)]=v;});assignees=fa;history_log=d.history_log||history_log;if(d.WEEK_DATES)WEEK_DATES=d.WEEK_DATES;if(d.WEEK_ORDER)WEEK_ORDER=d.WEEK_ORDER;if(d.nextId)nextId=d.nextId;if(d.TRACK_ORDER)TRACK_ORDER=d.TRACK_ORDER;if(d.TRACK_META)TRACK_META=d.TRACK_META;renderAll();renderMemberGrid();});}
function login(m){currentUser=m;document.getElementById("login-screen").style.display="none";document.getElementById("app").style.display="block";const c=avColors(m.colorIdx);const av=document.getElementById("cur-av");av.textContent=initials(m.name);av.style.background=c.bg;av.style.color=c.ft;document.getElementById("cur-name").textContent=m.name;renderAll();renderMemberGrid();setupRealtimeSync();}
function logout(){if(_syncUnsub){_syncUnsub();_syncUnsub=null;}currentUser=null;currentDetailMid=null;document.getElementById("app").style.display="none";document.getElementById("login-screen").style.display="flex";document.getElementById("login-new-name").value="";document.getElementById("login-new-role").value="";renderLoginList();}
function showPage(id,btn){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));document.querySelectorAll(".nav-tab").forEach(b=>b.classList.remove("active"));document.getElementById("page-"+id).classList.add("active");if(btn)btn.classList.add("active");if(id==="history")renderHistory();if(id==="workload")renderWorkload();if(id==="members")renderMemberGrid();if(id==="weekly")renderWeekly();}
function getWeeklyContext(){const idx=WEEK_ORDER.indexOf(getCurrentWeek());return{lastW:idx>0?WEEK_ORDER[idx-1]:null,curW:WEEK_ORDER[idx]||null,nextW:WEEK_ORDER[idx+1]||null,curIdx:idx,total:WEEK_ORDER.length};}
function renderWeekly(){const{lastW,curW,nextW,curIdx,total}=getWeeklyContext();document.getElementById("weekly-week-label").textContent=curW?`${curW} / ${total}W`:"—";const nav=document.getElementById("weekly-nav");const slots=[{key:"last",label:"지난주",w:lastW,cls:"wn-last"},{key:"cur",label:"이번주",w:curW,cls:"wn-cur"},{key:"next",label:"다음주",w:nextW,cls:"wn-next"}];nav.innerHTML=slots.map(s=>`<button class="wn-btn ${s.cls}" onclick="document.getElementById('wk-anchor-${s.key}')?.scrollIntoView({behavior:'smooth',block:'start'})">${s.label}${s.w?" · "+s.w:""}</button>`).join("");const top=document.getElementById("weekly-top");const bottom=document.getElementById("weekly-bottom");top.innerHTML="";bottom.innerHTML="";top.appendChild(buildBlock("last",lastW,true));bottom.appendChild(buildBlock("cur",curW,false));bottom.appendChild(buildBlock("next",nextW,false));}
function buildBlock(key,wKey,toggleable){const labels={last:"지난주 주요 업무",cur:"이번주 주요 업무",next:"다음주 주요 업무"};const wTasks=wKey?tasks.filter(t=>t.w===wKey):[];const done=wTasks.filter(t=>checks[t.id]).length;const pct=wTasks.length?Math.round(done/wTasks.length*100):0;const block=document.createElement("div");block.className=`wk-block wk-${key}`;block.id=`wk-anchor-${key}`;const chevron=toggleable?`<svg class="wk-toggle-icon${lastBlockCollapsed?" collapsed":""}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`:"";const headRight=`<div style="display:flex;align-items:center;gap:8px">${wKey?`<span class="wk-block-week">${wKey}${WEEK_DATES[wKey]?" · "+WEEK_DATES[wKey]:""}</span>`:""}${key!=="next"&&wTasks.length?`<span class="wk-block-pct">${pct}%</span>`:""}${chevron}</div>`;const head=document.createElement("div");head.className="wk-block-head";head.innerHTML=`<span class="wk-block-title">${labels[key]}</span>${headRight}`;if(toggleable){head.onclick=()=>{lastBlockCollapsed=!lastBlockCollapsed;const body=block.querySelector(".wk-body");const icon=head.querySelector(".wk-toggle-icon");body.classList.toggle("collapsed",lastBlockCollapsed);icon.classList.toggle("collapsed",lastBlockCollapsed);};}block.appendChild(head);const body=document.createElement("div");body.className="wk-body"+(toggleable&&lastBlockCollapsed?" collapsed":"");if(!wKey||!wTasks.length){body.innerHTML=`<div class="wk-empty">업무 항목이 없습니다</div>`;}else{TRACK_ORDER.forEach(trackKey=>{const trackTasks=wTasks.filter(t=>t.t===trackKey);if(!trackTasks.length)return;const tm=TRACK_META[trackKey]||{name:trackKey,color:"#888"};const trackHeader=document.createElement("div");trackHeader.className="wk-track-header";trackHeader.innerHTML=`<span style="width:7px;height:7px;border-radius:50%;background:${tm.color};display:inline-block;flex-shrink:0"></span>${esc(tm.name)}<span style="margin-left:auto;font-size:10px;font-weight:600;color:var(--text3)">${trackTasks.filter(t=>checks[t.id]).length}/${trackTasks.length}</span>`;body.appendChild(trackHeader);trackTasks.forEach(task=>body.appendChild(makeWkRow(task,key)));});}block.appendChild(body);return block;}
function makeWkRow(task,slot){const row=document.createElement("div");row.className="wk-row";const isDone=checks[task.id];const tm=TRACK_META[task.t]||{name:task.t,color:"#888"};if(isDone){row.style.background="var(--bg2)";row.style.opacity=".55";}const trackBadge=`<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;padding:1px 6px;border-radius:4px;background:${tm.color}18;color:${tm.color};flex-shrink:0;white-space:nowrap"><span style="width:6px;height:6px;border-radius:50%;background:${tm.color};display:inline-block"></span>${esc(tm.name)}</span>`;const rightCol=(slot!=="next"&&isDone)?`<span class="wk-status" style="background:#E5E7EB;color:#6B7280;flex-shrink:0">완료</span>`:``;row.innerHTML=`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${trackBadge}<span class="wk-task">${esc(task.task)}</span></div><div style="flex-shrink:0">${rightCol}</div>`;return row;}
function toggle(id){checks[id]=!checks[id];if(hideDone&&checks[id]){renderTable();}else{const row=document.getElementById("row-"+id);if(row){row.classList.toggle("done-row",checks[id]);const cb=row.querySelector("input[type=checkbox]");if(cb)cb.checked=checks[id];}}calcStats();renderWeekMini();renderTrackBars();if(currentDetailMid!==null){refreshDetailStats(currentDetailMid);refreshDetailItem(id);}scheduleSave();}
function refreshDetailStats(mid){const all=tasks.filter(t=>assignees[t.id]?.includes(mid));const done=all.filter(t=>checks[t.id]).length,total=all.length,pct=total?Math.round(done/total*100):0;const nums=document.querySelectorAll("#detail-header .detail-stat-num");if(nums.length>=4){nums[0].textContent=total;nums[1].textContent=done;nums[2].textContent=total-done;nums[3].textContent=pct+"%";}}
function refreshDetailItem(taskId){const item=document.getElementById("ditem-"+taskId);if(!item)return;const isDone=checks[taskId];item.classList.toggle("done",isDone);const cb=item.querySelector("input[type=checkbox]");if(cb)cb.checked=isDone;}
function renderWorkload(){const el=document.getElementById("workload-grid");el.innerHTML="";if(!members.length){el.innerHTML=`<div class="empty-state">${SVG.users}팀원을 먼저 등록하세요</div>`;return;}populateWorkloadWeekSelect();const cw=workloadWeekFilter||getCurrentWeek();members.forEach(m=>{const c=avColors(m.colorIdx),all=tasks.filter(t=>assignees[t.id]?.includes(m.id)),tw=all.filter(t=>t.w===cw);const done=all.filter(t=>checks[t.id]).length,total=all.length,pct=total?Math.round(done/total*100):0;const div=document.createElement("div");div.className="wl-card";const tHtml=tw.slice(0,3).map(t=>{const tm=TRACK_META[t.t];const label=t.task.length>22?t.task.slice(0,22)+"…":t.task;return`<div class="wl-task-row"><span style="width:7px;height:7px;border-radius:50%;background:${tm?.color||"#888"};display:inline-block;flex-shrink:0"></span><span style="${checks[t.id]?"text-decoration:line-through;opacity:.4":""}">${esc(label)}</span></div>`;}).join("");div.innerHTML=`<div class="wl-header"><div class="avatar" style="width:36px;height:36px;font-size:13px;background:${c.bg};color:${c.ft}">${esc(initials(m.name))}</div><div style="flex:1;min-width:0"><div class="wl-name">${esc(m.name)}</div><div class="wl-count">${done}/${total} 완료 · ${pct}%</div></div></div><div class="wl-bar-wrap"><div class="wl-bar-fill" style="width:${pct}%;background:${c.ft}"></div></div>${tw.length?`<div style="font-size:11px;font-weight:600;color:var(--text3);letter-spacing:.04em;text-transform:uppercase;margin-bottom:6px">${cw} 이번 주 업무</div>`:""}<div class="wl-tasks">${tHtml||`<div style="font-size:13px;color:var(--text2)">이번 주 배정 항목 없음</div>`}</div>${total>0?`<div class="wl-more" onclick="showMemberDetail(${m.id})">${SVG.listDetails} 전체 ${total}개 보기</div>`:""}`;el.appendChild(div);});}
function showMemberDetail(mid){currentDetailMid=mid;const m=members.find(x=>x.id===mid);if(!m)return;const c=avColors(m.colorIdx),all=tasks.filter(t=>assignees[t.id]?.includes(mid));const done=all.filter(t=>checks[t.id]).length,total=all.length,pct=total?Math.round(done/total*100):0,cw=getCurrentWeek();document.getElementById("detail-header").innerHTML=`<div class="avatar" style="width:48px;height:48px;font-size:16px;background:${c.bg};color:${c.ft}">${esc(initials(m.name))}</div><div><div style="font-size:18px;font-weight:600;letter-spacing:-.02em">${esc(m.name)}</div><div style="font-size:13px;color:var(--text2);margin-top:2px">${esc(m.role)}</div></div><div class="detail-stats"><div class="detail-stat"><div class="detail-stat-num">${total}</div><div class="detail-stat-lbl">전체</div></div><div class="detail-stat"><div class="detail-stat-num" style="color:#059669">${done}</div><div class="detail-stat-lbl">완료</div></div><div class="detail-stat"><div class="detail-stat-num" style="color:var(--b-md)">${total-done}</div><div class="detail-stat-lbl">진행중</div></div><div class="detail-stat"><div class="detail-stat-num">${pct}%</div><div class="detail-stat-lbl">완성율</div></div></div>`;const tw=all.filter(t=>t.w===cw),others=all.filter(t=>t.w!==cw);function tItem(t){const tm=TRACK_META[t.t];const isDone=checks[t.id];return`<div class="detail-task-item${isDone?" done":""}" id="ditem-${t.id}"><input type="checkbox" ${isDone?"checked":""} onchange="toggle(${t.id})" style="width:15px;height:15px;margin-top:3px;cursor:pointer;accent-color:var(--b-md);flex-shrink:0"><div style="flex:1;min-width:0"><div class="detail-task-text">${esc(t.task)}</div><div class="detail-task-meta"><span class="week-info-badge"><span>${esc(t.w)}</span><span style="opacity:.4;font-size:10px">|</span><span>${esc(t.d||"—")}</span></span><span class="tp ${tm?.cls||""}"><span style="width:6px;height:6px;border-radius:50%;background:${tm?.color||"#888"};display:inline-block;flex-shrink:0"></span>${tm?.name||esc(t.t)}</span></div></div></div>`;}let body="";if(tw.length){body+=`<div class="detail-section-title">${SVG.calendarEvent}${cw} 이번 주 업무<span style="background:#DCFCE7;color:#15803D;font-size:11px;padding:2px 8px;border-radius:999px;font-weight:600;text-transform:none;letter-spacing:0">${tw.filter(t=>checks[t.id]).length}/${tw.length}</span></div><div class="detail-task-list">${tw.map(tItem).join("")}</div>`;}if(others.length){body+=`<div class="detail-section-title">${SVG.list} 전체 업무 목록</div><div class="detail-task-list">${others.map(tItem).join("")}</div>`;}if(!total)body=`<div class="empty-state">${SVG.inbox}배정된 업무가 없습니다</div>`;document.getElementById("detail-body").innerHTML=body;document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));document.getElementById("page-workload-detail").classList.add("active");}
function showWorkloadList(){currentDetailMid=null;document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));document.getElementById("page-workload").classList.add("active");document.querySelectorAll(".nav-tab").forEach(b=>b.classList.toggle("active",b.textContent==="담당자 현황"));renderWorkload();}
function addMember(){const name=document.getElementById("new-m-name").value.trim(),role=document.getElementById("new-m-role").value.trim();if(!name){alert("이름을 입력하세요.");return;}if(members.find(m=>m.name===name)){alert("이미 등록된 이름입니다.");return;}members.push({id:nextMId++,name,role:role||"팀원",colorIdx:members.length,editing:false});document.getElementById("new-m-name").value="";document.getElementById("new-m-role").value="";renderMemberGrid();renderLoginList();scheduleSave();}
function toggleEditMember(id){members=members.map(m=>({...m,editing:m.id===id?!m.editing:false}));renderMemberGrid();}
function saveMemberEdit(id){const nn=document.getElementById("medit-name-"+id)?.value.trim(),nr=document.getElementById("medit-role-"+id)?.value.trim();if(!nn){alert("이름을 입력하세요.");return;}if(members.find(m=>m.name===nn&&m.id!==id)){alert("이미 존재하는 이름입니다.");return;}members=members.map(m=>m.id===id?{...m,name:nn,role:nr||m.role,editing:false}:m);if(currentUser?.id===id){currentUser={...currentUser,name:nn,role:nr||currentUser.role};const c=avColors(currentUser.colorIdx);const av=document.getElementById("cur-av");av.textContent=initials(currentUser.name);av.style.background=c.bg;av.style.color=c.ft;document.getElementById("cur-name").textContent=currentUser.name;}renderMemberGrid();renderLoginList();scheduleSave();}
function deleteMember(id,trig){const m=members.find(x=>x.id===id);if(!m)return;if(m.id===currentUser?.id){alert("현재 로그인 중인 계정은 삭제할 수 없어요.");return;}pendingDeleteId="member_"+id;document.getElementById("del-pop-msg").textContent=`'${m.name}'님을 팀원에서 삭제합니다.`;document.getElementById("del-overlay").style.display="block";setTimeout(()=>positionEl(document.getElementById("del-pop"),trig,280),0);}
function renderMemberGrid(){const el=document.getElementById("member-grid");el.innerHTML="";if(!members.length){el.innerHTML=`<p style="font-size:14px;color:var(--text2)">등록된 팀원이 없습니다.</p>`;return;}members.forEach(m=>{const c=avColors(m.colorIdx);const isCur=m.id===currentUser?.id;const div=document.createElement("div");div.className="member-card";if(m.editing){div.innerHTML=`<div class="mc-top"><div class="avatar" style="width:36px;height:36px;font-size:13px;background:${c.bg};color:${c.ft}">${esc(initials(m.name))}</div><div class="mc-info"><div class="mc-name">${esc(m.name)}</div><div class="mc-role">${esc(m.role)}</div></div></div><div class="mc-edit-row"><input class="form-input" id="medit-name-${m.id}" value="${esc(m.name)}" placeholder="이름"><input class="form-input" id="medit-role-${m.id}" value="${esc(m.role)}" placeholder="역할"></div><div class="mc-actions"><button class="btn btn-sm btn-ghost" onclick="toggleEditMember(${m.id})">취소</button><button class="btn btn-primary btn-sm" onclick="saveMemberEdit(${m.id})">${SVG.check} 저장</button></div>`;}else{div.innerHTML=`<div class="mc-top"><div class="avatar" style="width:36px;height:36px;font-size:13px;background:${c.bg};color:${c.ft}">${esc(initials(m.name))}</div><div class="mc-info"><div class="mc-name">${esc(m.name)}${isCur?' <span style="font-size:11px;color:var(--b-md)">(나)</span>':""}</div><div class="mc-role">${esc(m.role)}</div></div></div><div class="mc-actions"><button class="btn btn-sm btn-ghost" onclick="toggleEditMember(${m.id})">${SVG.edit} 수정</button>${!isCur?`<button class="btn btn-sm btn-ghost btn-danger" onclick="deleteMember(${m.id},this)">${SVG.trash} 삭제</button>`:""}</div>`;}el.appendChild(div);});}
function renderHistory(){const el=document.getElementById("history-list");if(!history_log.length){el.innerHTML=`<div class="empty-state">${SVG.history}아직 변경 내역이 없습니다</div>`;return;}el.innerHTML=`<div class="history-list-wrap">${history_log.map(h=>`<div class="history-item h-${h.type}"><div class="history-meta"><span class="history-badge">${h.type==="add"?"추가":h.type==="edit"?"수정":"삭제"}</span><span class="history-who">${esc(h.who)}</span><span class="history-when">${esc(h.when)}</span></div><div class="history-content">${esc(h.desc)}</div>${h.detail?`<div class="history-detail">${esc(h.detail)}</div>`:""}</div>`).join("")}</div>`;}
function clearHistory(){history_log=[];renderHistory();scheduleSave();}
function populateWeekSelect(sel){const el=document.getElementById("f-week");el.innerHTML="";WEEK_ORDER.forEach(w=>{const o=document.createElement("option");o.value=w;o.textContent=w+(WEEK_DATES[w]?" ("+WEEK_DATES[w]+")":"");if(w===sel)o.selected=true;el.appendChild(o);});const nw=document.createElement("option");nw.value="__new__";nw.textContent="+ 새 주차 추가...";el.appendChild(nw);}
function onWeekChange(){const val=document.getElementById("f-week").value;if(val==="__new__"){document.getElementById("new-week-row").style.display="block";document.getElementById("f-dates").value="";document.getElementById("f-main").value="";document.getElementById("f-main").disabled=false;document.getElementById("main-hint").textContent="(새 주차)";}else{document.getElementById("new-week-row").style.display="none";document.getElementById("f-dates").value=WEEK_DATES[val]||"";updateMainField(val);}}
function updateMainField(w,eid){const inp=document.getElementById("f-main"),hint=document.getElementById("main-hint");const ex=tasks.find(t=>t.w===w&&t.m&&(eid===undefined||t.id!==eid));if(ex){inp.value=ex.m;inp.disabled=true;hint.textContent="(기존 주차)";}else{inp.value="";inp.disabled=false;hint.textContent="(새 주차)";}}
function renderAssigneeChecks(sids){const el=document.getElementById("assignee-checks");el.innerHTML="";if(!members.length){el.innerHTML=`<div style="font-size:13px;color:var(--text2)">팀원을 먼저 등록하세요</div>`;return;}members.forEach(m=>{const c=avColors(m.colorIdx);const sel=sids.includes(m.id);const row=document.createElement("div");row.className="ac-row"+(sel?" selected":"");row.dataset.mid=m.id;row.innerHTML=`<div style="position:relative"><div class="avatar" style="width:32px;height:32px;font-size:12px;background:${c.bg};color:${c.ft}">${esc(initials(m.name))}</div>${sel?`<span style="position:absolute;bottom:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:var(--b-md);display:flex;align-items:center;justify-content:center;border:2px solid var(--bg)">${SVG.check.replace('width="13" height="13"','width="8" height="8"').replace('stroke-width="2.5"','stroke-width="3"')}</span>`:""}</div><span style="font-size:11px;font-weight:600;color:${sel?"var(--b-dk)":"var(--text)"};margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px">${esc(m.name)}</span>`;row.onclick=()=>{row.classList.toggle("selected");renderAssigneeChecks(getSelectedAssignees());};el.appendChild(row);});}
function getSelectedAssignees(){return[...document.querySelectorAll(".ac-row.selected")].map(r=>parseInt(r.dataset.mid));}
function positionPopover(trig){const pop=document.getElementById("popover");pop.style.display="block";const r=trig.getBoundingClientRect(),pw=320,ph=pop.offsetHeight||520,vw=window.innerWidth,vh=window.innerHeight;let left=r.right+10,top=r.top;if(left+pw>vw-8)left=r.left-pw-10;if(left<8)left=8;if(top+ph>vh-8)top=Math.max(8,vh-ph-8);pop.style.left=left+"px";pop.style.top=top+"px";}
function openAddPopover(){document.getElementById("pop-title").textContent="항목 추가";document.getElementById("edit-id").value="";document.getElementById("btn-delete").style.display="none";document.getElementById("new-week-row").style.display="none";const dw=currentFilter!=="all"?currentFilter:getCurrentWeek();populateWeekSelect(dw);document.getElementById("f-dates").value=WEEK_DATES[dw]||"";document.getElementById("f-new-name").value="";document.getElementById("f-new-dates").value="";document.getElementById("f-track").value="core";document.getElementById("f-task").value="";updateMainField(dw);renderAssigneeChecks([]);document.getElementById("overlay").style.display="block";positionPopover(document.getElementById("btn-add-main"));}
function openEditPopover(id,trig){const task=tasks.find(t=>t.id===id);if(!task)return;document.getElementById("pop-title").textContent="항목 수정";document.getElementById("edit-id").value=id;document.getElementById("btn-delete").style.display="inline-flex";document.getElementById("new-week-row").style.display="none";populateWeekSelect(task.w);document.getElementById("f-dates").value=task.d;document.getElementById("f-new-name").value="";document.getElementById("f-new-dates").value="";document.getElementById("f-track").value=task.t;document.getElementById("f-task").value=task.task;updateMainField(task.w,task.id);renderAssigneeChecks(assignees[id]||[]);document.getElementById("overlay").style.display="block";positionPopover(trig);}
function closePopover(){document.getElementById("popover").style.display="none";document.getElementById("overlay").style.display="none";}
function saveTask(){let w=document.getElementById("f-week").value,d="";if(w==="__new__"){const nn=document.getElementById("f-new-name").value.trim(),nd=document.getElementById("f-new-dates").value.trim();if(!nn){alert("새 주차 이름을 입력하세요.");return;}if(!nd){alert("새 주차 기간을 입력하세요.");return;}if(WEEK_ORDER.includes(nn)){alert("이미 존재하는 주차 이름입니다.");return;}w=nn;d=nd;WEEK_DATES[w]=d;WEEK_ORDER.push(w);}else{d=WEEK_DATES[w]||"";}const mInp=document.getElementById("f-main"),m=mInp.disabled?(tasks.find(t=>t.w===w&&t.m)||{m:""}).m:mInp.value.trim();const t=document.getElementById("f-track").value,task=document.getElementById("f-task").value.trim();if(!task){alert("업무 내용은 필수입니다.");return;}const sel=getSelectedAssignees(),editId=document.getElementById("edit-id").value;if(editId===""){const nt={id:nextId++,w,d,m,b:"",t,task};tasks.push(nt);checks[nt.id]=false;assignees[nt.id]=sel;addHistory("add",`"${task}" 추가`);}else{const idx=tasks.findIndex(tk=>tk.id===parseInt(editId));if(idx>-1){tasks[idx]={...tasks[idx],w,d,m,t,task};assignees[parseInt(editId)]=sel;}addHistory("edit",`"${task}" 수정`);}closePopover();renderAll();}
function confirmDelete(evt){const editId=document.getElementById("edit-id").value;if(!editId)return;pendingDeleteId=parseInt(editId);const task=tasks.find(t=>t.id===pendingDeleteId);document.getElementById("del-pop-msg").textContent=`"${task?.task||""}" 항목을 삭제합니다.`;document.getElementById("del-overlay").style.display="block";setTimeout(()=>positionEl(document.getElementById("del-pop"),document.getElementById("btn-delete"),280),0);}
function closeDelPop(){document.getElementById("del-pop").style.display="none";document.getElementById("del-overlay").style.display="none";if(typeof pendingDeleteId==="string"&&pendingDeleteId.startsWith("member_"))pendingDeleteId=null;}
function executeDelete(){if(pendingDeleteId===null)return;if(typeof pendingDeleteId==="string"&&pendingDeleteId.startsWith("member_")){members=members.filter(x=>x.id!==parseInt(pendingDeleteId.replace("member_","")));closeDelPop();renderMemberGrid();renderLoginList();scheduleSave();return;}const task=tasks.find(t=>t.id===pendingDeleteId);addHistory("del",`"${task?.task||""}" 삭제`);tasks=tasks.filter(t=>t.id!==pendingDeleteId);delete checks[pendingDeleteId];delete assignees[pendingDeleteId];pendingDeleteId=null;closeDelPop();closePopover();renderAll();}
function calcStats(){const total=tasks.length,done=tasks.filter(t=>checks[t.id]).length,pct=total?Math.round(done/total*100):0;document.getElementById("d-total-pct").textContent=pct+"%";document.getElementById("d-total-sub").textContent=`${done} / ${total} 완료`;document.getElementById("d-total-bar").style.width=pct+"%";document.getElementById("top-sub-count").textContent=`총 ${total}개 항목`;const cw=getCurrentWeek();if(cw){const cwt=tasks.filter(t=>t.w===cw),cwd=cwt.filter(t=>checks[t.id]).length,cwp=cwt.length?Math.round(cwd/cwt.length*100):0;document.getElementById("d-week-pct").textContent=cwp+"%";document.getElementById("d-week-sub").textContent=`${cw} · ${cwd}/${cwt.length} 완료`;document.getElementById("d-week-bar").style.width=cwp+"%";}else{document.getElementById("d-week-pct").textContent="—";document.getElementById("d-week-sub").textContent="현재 주차 없음";document.getElementById("d-week-bar").style.width="0%";}const incomplete=tasks.filter(t=>!checks[t.id]).length;document.getElementById("d-ms-pct").textContent=incomplete;document.getElementById("d-ms-sub").textContent=`전체 ${total}개 중`;document.getElementById("d-ms-bar").style.width=total?Math.round((total-incomplete)/total*100)+"%":"0%";}
function renderTrackBars(){const el=document.getElementById("track-bars");el.innerHTML="";Object.entries(TRACK_META).forEach(([k,m])=>{const tt=tasks.filter(t=>t.t===k);if(!tt.length)return;const done=tt.filter(t=>checks[t.id]).length,pct=Math.round(done/tt.length*100);el.innerHTML+=`<div class="track-row"><div class="track-name"><span style="width:8px;height:8px;border-radius:50%;background:${m.color};display:inline-block;flex-shrink:0"></span>${m.name}</div><div class="track-bw"><div class="track-bf" style="width:${pct}%;background:${m.color}"></div></div><div class="track-pct">${pct}%</div></div>`;});}
function renderWeekMini(){const el=document.getElementById("week-mini");el.innerHTML="";[...new Set(tasks.map(t=>t.w))].sort((a,b)=>WEEK_ORDER.indexOf(a)-WEEK_ORDER.indexOf(b)).forEach(w=>{const wt=tasks.filter(t=>t.w===w),done=wt.filter(t=>checks[t.id]).length,pct=wt.length?Math.round(done/wt.length*100):0,isActive=currentFilter===w;const d=document.createElement("div");d.className="wm-item";d.style.opacity=isActive?"1":".6";d.onclick=()=>filterWeek(w,null);d.innerHTML=`<div class="wm-bw"><div class="wm-bf" style="height:${pct}%;background:${isActive?"#0B3D91":"#1A5FB4"}"></div></div><div class="wm-lbl">${w}</div><div class="wm-pct">${pct}%</div>`;el.appendChild(d);});}
function renderWeekFilterBtns(){const el=document.getElementById("week-filter-btns");el.innerHTML="";[...new Set(tasks.map(t=>t.w))].sort((a,b)=>WEEK_ORDER.indexOf(a)-WEEK_ORDER.indexOf(b)).forEach(w=>{const btn=document.createElement("button");btn.className="wf-btn"+(currentFilter===w?" active":"");btn.textContent=w;btn.onclick=()=>filterWeek(w,btn);el.appendChild(btn);});}
function filterWeek(w,btn){currentFilter=w;document.querySelectorAll(".wf-btn").forEach(b=>b.classList.remove("active"));if(btn)btn.classList.add("active");else document.querySelectorAll(".wf-btn").forEach(b=>{if(b.textContent===w)b.classList.add("active");});if(w==="all")document.querySelector(".wf-btn")?.classList.add("active");renderTable();calcStats();renderWeekMini();}
let TRACK_ORDER=["common","core","identity","asset","site","film","collab"];
const TRACK_ORDER_INIT=[...TRACK_ORDER];
function renderTable(){const tbody=document.getElementById("tbody");tbody.innerHTML="";let filteredTasks=currentFilter==="all"?tasks:tasks.filter(t=>t.w===currentFilter);if(hideDone)filteredTasks=filteredTasks.filter(t=>!checks[t.id]);if(currentTrackFilter!=="all")filteredTasks=filteredTasks.filter(t=>t.t===currentTrackFilter);const MAX_AV=2;const weeks=[...new Set(tasks.map(t=>t.w))].sort((a,b)=>WEEK_ORDER.indexOf(a)-WEEK_ORDER.indexOf(b));const weekList=currentFilter==="all"?weeks:[currentFilter];weekList.forEach(w=>{const weekTasks=filteredTasks.filter(t=>t.w===w);if(!weekTasks.length)return;if(currentFilter==="all"&&SEP_MAP[w]){const sepMonth=document.createElement("tr");sepMonth.className="sep-row";sepMonth.innerHTML=`<td colspan="8">${SEP_MAP[w]}</td>`;tbody.appendChild(sepMonth);}const weekMeta=weekTasks.find(t=>t.m);const bdgHtml=weekMeta&&weekMeta.b?(()=>{const bg=BADGES.find(x=>x.name===weekMeta.b);return bg?`<span style="display:inline-block;font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;background:${bg.bg};color:${bg.ft};margin-left:6px;vertical-align:middle">${esc(weekMeta.b)}</span>`:""})():"";const weekHeaderTr=document.createElement("tr");weekHeaderTr.className="week-header-row";weekHeaderTr.innerHTML=`<td class="tc"></td><td class="td-week tc" style="font-size:14px;font-weight:700;color:var(--b-dk)">${w}</td><td class="td-date" style="color:var(--text2)">${weekMeta?.d||""}</td><td class="td-main" colspan="5"><span style="display:inline-flex;align-items:center;gap:8px">${weekMeta?.m?esc(weekMeta.m):""}${bdgHtml}<button class="btn btn-sm btn-ghost week-edit-btn" onclick="editWeekTitle('${w}')">${SVG.edit}</button></span></td>`;tbody.appendChild(weekHeaderTr);TRACK_ORDER.forEach(trackKey=>{const trackTasks=weekTasks.filter(t=>t.t===trackKey);if(!trackTasks.length)return;const tm=TRACK_META[trackKey]||{name:trackKey,cls:"t-core",color:"#888"};trackTasks.forEach(task=>{const isDone=checks[task.id];const av=assignees[task.id]||[];const avHtml=(()=>{const vis=av.slice(0,MAX_AV);const rest=av.length-MAX_AV;const allNames=av.map(mid=>{const m=members.find(x=>x.id===mid);return m?m.name:"";}).filter(Boolean).join(", ");const html=vis.map(mid=>{const m=members.find(x=>x.id===mid);if(!m)return"";const c=avColors(m.colorIdx);return`<span class="av-sm" style="background:${c.bg};color:${c.ft}" title="${esc(allNames)}">${esc(initials(m.name))}</span>`;}).join("");return html+(rest>0?`<span class="av-more" title="${esc(allNames)}">+${rest}</span>`:"");})();const tr=document.createElement("tr");tr.id="row-"+task.id;if(isDone)tr.classList.add("done-row");tr.innerHTML=`<td class="tc"><input type="checkbox" ${isDone?"checked":""} onchange="toggle(${task.id})"></td><td class="td-week tc"></td><td class="td-date"></td><td class="td-main"></td><td>${trackPillHtml(task.t)}</td><td><span class="task-text">${esc(task.task)}</span></td><td><div class="assignees">${avHtml||`<span style="font-size:12px;color:var(--text3)">—</span>`}</div></td><td class="tc"><div class="act-btns"><button class="btn btn-sm btn-ghost" onclick="openEditPopover(${task.id},this)">${SVG.edit}</button></div></td>`;tbody.appendChild(tr);});});});}
function trackPillHtml(key){const tm=TRACK_META[key]||{name:key,color:"#888",cls:""};const isPredefined=tm.cls&&tm.cls!=="t-custom";const spanStyle=isPredefined?`class="tp ${tm.cls}"`:`class="tp" style="background:${tm.color}1a;color:${tm.color}"`;return`<span ${spanStyle}><span style="width:7px;height:7px;border-radius:50%;background:${tm.color};display:inline-block;flex-shrink:0"></span>${esc(tm.name)}</span>`;}
function renderAll(){renderWeekFilterBtns();renderTrackFilterBtns();renderTable();calcStats();renderTrackBars();renderWeekMini();}
function toggleHideDone(){hideDone=!hideDone;const btn=document.getElementById("btn-hide-done");btn.style.background=hideDone?"var(--b-lt)":"";btn.style.color=hideDone?"var(--b-md)":"";btn.style.borderColor=hideDone?"var(--b-md)":"";renderTable();}
function filterTrack(t,btn){currentTrackFilter=t;document.querySelectorAll("#track-filter-row .wf-btn").forEach(b=>b.classList.remove("active"));if(btn)btn.classList.add("active");renderTable();}
function renderTrackFilterBtns(){const el=document.getElementById("track-filter-btns");if(!el)return;el.innerHTML="";TRACK_ORDER.forEach(key=>{const tm=TRACK_META[key];const btn=document.createElement("button");btn.className="wf-btn"+(currentTrackFilter===key?" active":"");btn.innerHTML=`<span style="width:7px;height:7px;border-radius:50%;background:${tm.color};display:inline-block;margin-right:4px;flex-shrink:0"></span>${tm.name}`;btn.onclick=()=>filterTrack(key,btn);el.appendChild(btn);});}
function onWorkloadWeekChange(){workloadWeekFilter=document.getElementById("workload-week-select").value;renderWorkload();}
function populateWorkloadWeekSelect(){const sel=document.getElementById("workload-week-select");if(!sel)return;const cw=workloadWeekFilter||getCurrentWeek();sel.innerHTML=WEEK_ORDER.map(w=>`<option value="${w}"${w===cw?" selected":""}>${w}${WEEK_DATES[w]?" · "+WEEK_DATES[w]:""}</option>`).join("");}
function openTrackMgr(){renderTrackMgrList();document.getElementById("track-mgr-modal").style.display="flex";}
function closeTrackMgr(){document.getElementById("track-mgr-modal").style.display="none";}
function renderTrackMgrList(){const ul=document.getElementById("track-mgr-list");ul.innerHTML="";TRACK_ORDER.forEach(key=>{const tm=TRACK_META[key];const row=document.createElement("div");row.className="track-mgr-row";row.dataset.key=key;row.innerHTML=`<input type="color" value="${tm.color}" class="track-color-input" title="색상 선택"><input type="text" value="${esc(tm.name)}" class="form-input track-name-input" style="flex:1"><button class="btn btn-sm btn-danger" onclick="this.closest('.track-mgr-row').remove()" title="삭제"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>`;ul.appendChild(row);});}
function addTrackItem(){const ul=document.getElementById("track-mgr-list");const row=document.createElement("div");row.className="track-mgr-row";row.dataset.key="new_"+Date.now();row.innerHTML=`<input type="color" value="#6366f1" class="track-color-input" title="색상 선택"><input type="text" value="" class="form-input track-name-input" placeholder="트랙명 입력" style="flex:1"><button class="btn btn-sm btn-danger" onclick="this.closest('.track-mgr-row').remove()" title="삭제"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>`;ul.appendChild(row);row.querySelector(".track-name-input").focus();}
function saveTrackMgr(){const rows=document.querySelectorAll("#track-mgr-list .track-mgr-row");const newOrder=[],newMeta={};rows.forEach(row=>{const key=row.dataset.key;const name=row.querySelector(".track-name-input").value.trim();const color=row.querySelector(".track-color-input").value;if(!name)return;const realKey=key.startsWith("new_")?"t_"+key.slice(4):key;newOrder.push(realKey);newMeta[realKey]={name,color,cls:TRACK_META[realKey]?.cls||"t-custom"};});if(!newOrder.length){alert("최소 1개의 트랙이 있어야 합니다.");return;}TRACK_ORDER=newOrder;TRACK_META=newMeta;scheduleSave();renderAll();closeTrackMgr();}
let _csvParsed=[];
function openCsvImport(){
  document.getElementById("csv-import-modal").style.display="flex";
  document.getElementById("csv-preview-wrap").style.display="none";
  document.getElementById("csv-import-btn").style.display="none";
  document.getElementById("csv-paste-area").style.display="none";
  document.getElementById("csv-paste-area").value="";
  document.getElementById("csv-file-input").value="";
  _csvParsed=[];
}
function closeCsvImport(){document.getElementById("csv-import-modal").style.display="none";}
function onCsvFileLoad(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{document.getElementById("csv-paste-area").value=ev.target.result;document.getElementById("csv-paste-area").style.display="block";parseCsvPreview();};
  reader.readAsText(file,"UTF-8");
}
function parseCSVText(text){
  const lines=text.split(/\r?\n/).filter(l=>l.trim());
  return lines.map(line=>{
    const cols=[];let cur="",inQ=false;
    for(let i=0;i<line.length;i++){
      if(line[i]==='"'){if(inQ&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ;}
      else if(line[i]===','&&!inQ){cols.push(cur.trim());cur="";}
      else cur+=line[i];
    }
    cols.push(cur.trim());return cols;
  });
}
function parseCsvPreview(){
  const text=document.getElementById("csv-paste-area").value.trim();
  if(!text){alert("CSV 내용을 입력하세요.");return;}
  const rows=parseCSVText(text);
  if(rows.length<2){alert("데이터가 없습니다.");return;}
  const header=rows[0].map(h=>h.toLowerCase().replace(/"/g,""));
  const idxOf=name=>header.findIndex(h=>h.includes(name));
  const iId=idxOf("id"),iW=idxOf("주차"),iTr=idxOf("트랙"),iTask=idxOf("업무내용"),iAv=idxOf("담당자"),iDates=idxOf("기간"),iMain=idxOf("메인업무");
  if(iTask===-1){alert("컬럼 형식이 맞지 않습니다.\n내보낸 CSV를 수정해서 가져오세요.");return;}
  _csvParsed=[];
  const body=rows.slice(1);
  const trackNameMap={};TRACK_ORDER.forEach(k=>{trackNameMap[TRACK_META[k].name]=k;});
  body.forEach(cols=>{
    if(!cols[iTask]||cols[iTask]==="")return;
    const id=iId>=0?cols[iId].replace(/"/g,""):"";
    const w=iW>=0?cols[iW].replace(/"/g,""):"";
    const taskText=cols[iTask].replace(/"/g,"");
    const trName=iTr>=0?cols[iTr].replace(/"/g,""):"";
    const trKey=trackNameMap[trName]||TRACK_ORDER.find(k=>k===trName)||"common";
    const avStr=iAv>=0?cols[iAv].replace(/"/g,""):"";
    const dates=iDates>=0?cols[iDates].replace(/"/g,""):"";
    const main=iMain>=0?cols[iMain].replace(/"/g,""):"";
    const isDel=taskText==="*삭제*";
    const numId=id!==""&&!isNaN(parseInt(id))?parseInt(id):null;
    const existing=numId!==null?tasks.find(t=>t.id===numId):null;
    let status;
    if(isDel)status="삭제";
    else if(existing)status="수정";
    else status="추가";
    _csvParsed.push({id:numId,w,task:taskText,t:trKey,avStr,dates,main,status,existing});
  });
  const tbody=document.getElementById("csv-preview-body");
  tbody.innerHTML=_csvParsed.map(r=>{
    const color=r.status==="삭제"?"#FEE2E2":r.status==="수정"?"#DBEAFE":"#DCFCE7";
    const tc=r.status==="삭제"?"#991B1B":r.status==="수정"?"#1D4ED8":"#15803D";
    const tm=TRACK_META[r.t]||{name:r.t,color:"#888"};
    return`<tr style="border-bottom:.5px solid var(--border)">
      <td style="padding:5px 10px"><span style="font-size:11px;font-weight:600;padding:2px 7px;border-radius:999px;background:${color};color:${tc}">${r.status}</span></td>
      <td style="padding:5px 10px;font-weight:600;color:var(--b-md)">${esc(r.w)}</td>
      <td style="padding:5px 10px"><span style="font-size:11px;padding:2px 6px;border-radius:999px;background:${tm.color}18;color:${tm.color}">${esc(tm.name)}</span></td>
      <td style="padding:5px 10px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r.task)}</td>
      <td style="padding:5px 10px;font-size:12px;color:var(--text2)">${esc(r.avStr)}</td>
    </tr>`;
  }).join("");
  document.getElementById("csv-preview-count").textContent=`${_csvParsed.filter(r=>r.status==="추가").length}추가 / ${_csvParsed.filter(r=>r.status==="수정").length}수정 / ${_csvParsed.filter(r=>r.status==="삭제").length}삭제`;
  document.getElementById("csv-preview-wrap").style.display="block";
  document.getElementById("csv-import-btn").style.display="inline-flex";
}
function executeImportCSV(){
  const mode=document.querySelector("input[name='import-mode']:checked").value;
  if(mode==="full"){if(!confirm("모든 업무가 CSV 내용으로 교체됩니다. 계속하시겠습니까?"))return;}
  const trackNameMap={};TRACK_ORDER.forEach(k=>{trackNameMap[TRACK_META[k].name]=k;});
  if(mode==="full"){
    tasks=[];checks={};assignees={};nextId=0;
  } else if(mode==="week"){
    const weeks=[...new Set(_csvParsed.filter(r=>r.status!=="삭제").map(r=>r.w))];
    weeks.forEach(w=>{
      tasks.filter(t=>t.w===w).forEach(t=>{delete checks[t.id];delete assignees[t.id];});
      tasks=tasks.filter(t=>t.w!==w);
    });
  }
  _csvParsed.forEach(r=>{
    if(mode==="smart"){
      if(r.status==="삭제"&&r.existing){
        addHistory("del",`[CSV] "${r.existing.task}" 삭제`);
        tasks=tasks.filter(t=>t.id!==r.existing.id);
        delete checks[r.existing.id];delete assignees[r.existing.id];
        return;
      }
      if(r.status==="수정"&&r.existing){
        const idx=tasks.findIndex(t=>t.id===r.existing.id);
        if(idx>-1){tasks[idx]={...tasks[idx],t:r.t,task:r.task,w:r.w,d:r.dates||tasks[idx].d,m:r.main||tasks[idx].m};}
        assignees[r.existing.id]=resolveAvIds(r.avStr);
        addHistory("edit",`[CSV] "${r.task}" 수정`);return;
      }
    }
    if(r.status==="삭제")return;
    const nid=nextId++;
    const mTask=tasks.find(t=>t.w===r.w&&t.m);
    tasks.push({id:nid,w:r.w,d:r.dates||WEEK_DATES[r.w]||"",m:r.main||(mTask?mTask.m:""),b:"",t:r.t,task:r.task});
    checks[nid]=false;assignees[nid]=resolveAvIds(r.avStr);
    addHistory("add",`[CSV] "${r.task}" 추가`);
  });
  renderAll();scheduleSave();closeCsvImport();
  alert(`가져오기 완료! 총 ${_csvParsed.length}개 행 처리됨`);
}
function resolveAvIds(avStr){
  if(!avStr)return[];
  return avStr.split(/[,/]/).map(n=>{const m=members.find(x=>x.name.trim()===n.trim());return m?m.id:null;}).filter(Boolean);
}
function openBulkEdit(){
  const sel=document.getElementById("bulk-week-select");
  const cw=currentFilter!=="all"?currentFilter:getCurrentWeek();
  sel.innerHTML=WEEK_ORDER.map(w=>`<option value="${w}"${w===cw?" selected":""}>${w}${WEEK_DATES[w]?" · "+WEEK_DATES[w]:""}</option>`).join("");
  renderBulkList(cw);
  document.getElementById("bulk-modal").style.display="flex";
}
function closeBulkEdit(){document.getElementById("bulk-modal").style.display="none";}
function onBulkWeekChange(){renderBulkList(document.getElementById("bulk-week-select").value);}
function renderBulkList(w){
  const el=document.getElementById("bulk-task-list");
  const wTasks=tasks.filter(t=>t.w===w);
  el.innerHTML="";
  wTasks.forEach(task=>{el.appendChild(makeBulkRow(task));});
}
function makeBulkRow(task){
  const row=document.createElement("div");
  row.dataset.id=task.id;
  row.style.cssText="display:grid;grid-template-columns:120px 1fr 90px 32px;gap:6px;align-items:center";
  const trackOpts=TRACK_ORDER.map(k=>`<option value="${k}"${task.t===k?" selected":""}>${TRACK_META[k].name}</option>`).join("");
  const avNames=(assignees[task.id]||[]).map(mid=>{const m=members.find(x=>x.id===mid);return m?m.name:"";}).filter(Boolean).join(", ");
  row.innerHTML=`
    <select class="form-input" style="font-size:12px;padding:5px 8px" data-field="track">${trackOpts}</select>
    <input class="form-input" style="font-size:13px;padding:6px 8px" data-field="task" value="${esc(task.task)}" placeholder="업무 내용">
    <input class="form-input" style="font-size:12px;padding:5px 8px" data-field="assignees" value="${esc(avNames)}" placeholder="담당자 (쉼표 구분)">
    <button class="btn btn-sm btn-ghost btn-danger" onclick="removeBulkRow(this)" title="삭제">${SVG.trash}</button>`;
  return row;
}
function addBulkRow(){
  const w=document.getElementById("bulk-week-select").value;
  const dummy={id:"new_"+Date.now(),w,d:WEEK_DATES[w]||"",m:"",b:"",t:"common",task:""};
  document.getElementById("bulk-task-list").appendChild(makeBulkRow(dummy));
}
function removeBulkRow(btn){btn.closest("[data-id]").remove();}
function saveBulkEdit(){
  const w=document.getElementById("bulk-week-select").value;
  const rows=document.querySelectorAll("#bulk-task-list [data-id]");
  const kept=[];
  rows.forEach(row=>{
    const id=row.dataset.id;
    const trackVal=row.querySelector("[data-field='track']").value;
    const taskVal=row.querySelector("[data-field='task']").value.trim();
    const avVal=row.querySelector("[data-field='assignees']").value.trim();
    if(!taskVal)return;
    const avIds=avVal?avVal.split(/[,/]/).map(n=>{const m=members.find(x=>x.name.trim()===n.trim());return m?m.id:null;}).filter(Boolean):[];
    if(id.startsWith("new_")){
      const nid=nextId++;
      const mTask=tasks.find(t=>t.w===w&&t.m);
      tasks.push({id:nid,w,d:WEEK_DATES[w]||"",m:mTask?mTask.m:"",b:"",t:trackVal,task:taskVal});
      checks[nid]=false;assignees[nid]=avIds;
      kept.push(nid);
      addHistory("add",`[일괄편집] "${taskVal}" 추가`);
    } else {
      const tid=parseInt(id);
      const idx=tasks.findIndex(t=>t.id===tid);
      if(idx>-1){
        const old=tasks[idx];
        if(old.task!==taskVal||old.t!==trackVal){
          addHistory("edit",`[일괄편집] "${taskVal}" 수정`);
        }
        tasks[idx]={...old,t:trackVal,task:taskVal};
        assignees[tid]=avIds;
      }
      kept.push(tid);
    }
  });
  const removed=tasks.filter(t=>t.w===w&&!kept.includes(t.id));
  removed.forEach(t=>{
    addHistory("del",`[일괄편집] "${t.task}" 삭제`);
    tasks=tasks.filter(x=>x.id!==t.id);
    delete checks[t.id];delete assignees[t.id];
  });
  renderAll();scheduleSave();closeBulkEdit();
}
function exportCSV(){const list=currentFilter==="all"?tasks:tasks.filter(t=>t.w===currentFilter);const rows=[["id","주차","기간","메인업무","트랙","업무내용","담당자","완료"]];list.forEach(t=>{const tm=TRACK_META[t.t]||{name:t.t};const av=(assignees[t.id]||[]).map(mid=>{const m=members.find(x=>x.id===mid);return m?m.name:"";}).filter(Boolean).join("/");rows.push([t.id,t.w,t.d,t.m,tm.name,t.task,av,checks[t.id]?"완료":"미완료"]);});const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");const blob=new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`dunamu-tasks-${new Date().toLocaleDateString("ko-KR").replace(/\.\s/g,"-").replace(".","")}.csv`;a.click();}
function editWeekTitle(w){const cur=tasks.find(t=>t.w===w&&t.m)?.m||"";const val=prompt("주간 메인 업무 수정",cur);if(val===null)return;const trimmed=val.trim();let updated=false;tasks.forEach(t=>{if(t.w===w&&t.m){t.m=trimmed;updated=true;}});if(!updated&&trimmed){const f=tasks.find(t=>t.w===w);if(f)f.m=trimmed;}addHistory("edit",`${w} 주간 타이틀 → "${trimmed}"`);renderAll();scheduleSave();}