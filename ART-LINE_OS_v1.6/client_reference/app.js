const roleNames={manager:'Менеджер',designer:'Дизайнер',technologist:'Технолог',printer:'Печатник',accountant:'Бухгалтер',leader:'Руководитель'};
const sectionTitles={
  dashboard:['Главная','Рабочий центр компании: сотрудники, клиенты, задачи, календарь, новости и заказы.'],
  pulse:['Пульс компании','Центр руководителя: решения на сегодня, риски, деньги, узкие места, нагрузка сотрудников и быстрые действия.'],
  workflow:['Сквозная логика','Сквозной путь заказа, единый профиль объекта, глобальный поиск, связи, быстрые действия и проверка пустых мест.'],
  mobilepwa:['Мобильная версия','Мобильный рабочий стол, быстрые действия после звонка, нижнее меню, PWA-установка и офлайн-заглушка.'],
  audit:['Аудит v1.6','Финальная проверка прототипа: сценарии, блокировки, матрица прав, журнал действий, карта данных и готовность к серверу.'],
  workspace:['Рабочий стол','Личный день сотрудника: задачи, напоминания, вопросы, новости и события.'],
  employees:['Сотрудники','Кабинеты сотрудников, роли, логины, временные пароли и права доступа.'],
  calendar:['Календарь','Личные и общие события: клиенты, задачи, договоры, заказы и отгрузки.'],
  tasks:['Задачи','Поручения руководителя, задачи по клиентам и заказам, сроки и статусы.'],
  news:['Новости','Объявления руководителя и важные новости компании с отметкой ознакомления.'],
  notifications:['Уведомления','Единый центр событий: вопросы, задачи, напоминания, новости и статусы заказов.'],
  clients:['Клиенты','Центральная карточка клиента: файлы, история, расчёты, заказы, бланки и вопросы.'],
  crm:['CRM','Глубокая CRM менеджера: воронка, напоминания, горячие клиенты, касания и клиенты без следующего шага.'],
  import:['Импорт базы','Загрузка таблиц менеджеров, ИИ-разбор, поиск дублей и создание карточек клиентов.'],
  funnel:['Воронка','Путь клиента до договора и активной работы.'],
  calculator:['Калькулятор','Расчётный модуль Арт-Лайн внутри корпоративной системы.'],
  calculations:['Расчёты','Сохранённые расчёты клиента, КП и связь с заказами.'],
  contracts:['Договоры','Согласование рамочных условий с клиентом.'],
  requests:['Запросы','Реальные запросы клиента на конкретные партии и заказы.'],
  specifications:['Спецификации','Состав заказа, стоимость, сроки, доставка и условия оплаты.'],
  orders:['Заказы','Полная рабочая карточка заказа: запрос, расчёт, спецификация, бланк, запуск, вопросы, ножи, формы и печать.'],
  approvals:['Бланки согласования','Техническое согласование макета и параметров с клиентом.'],
  questions:['Вопросы','Подзадачи и проблемы внутри конкретного заказа с уведомлением специалистов.'],
  tooling:['Ножи и формы','Оснастка, ножи, флексоформы и технологический пакет.'],
  production:['Производство','Производственный план: статусы, сроки, материал, формы, штамп, машины, отгрузка, задачи, вопросы и риски.'],
  finance:['Финансы','Счета, оплаты, отсрочки, задолженности, допуск к отгрузке и финансовая карточка клиента.'],
  documents:['Документы','Спецификации, бланки, счета, письма в работу, производственные пакеты, версии и проверки.'],
  ai:['ИИ','Будущий помощник для менеджера, дизайнера, технолога и производства.'],
  settings:['Настройки','Базовые данные, пользователи, шаблоны и права доступа.']
};
const roleVisibility={
  manager:['dashboard','pulse','workflow','mobilepwa','audit','workspace','clients','crm','import','calendar','tasks','news','notifications','funnel','calculator','calculations','contracts','requests','specifications','orders','approvals','questions','tooling','production','finance','documents','ai'],
  designer:['dashboard','pulse','workflow','mobilepwa','audit','workspace','clients','calendar','tasks','news','notifications','calculations','requests','orders','approvals','questions','tooling','production','documents','ai'],
  technologist:['dashboard','pulse','workflow','mobilepwa','audit','workspace','clients','calendar','tasks','news','notifications','calculations','orders','approvals','questions','tooling','production','documents','ai'],
  printer:['dashboard','pulse','workflow','mobilepwa','audit','workspace','clients','calendar','tasks','news','notifications','orders','questions','tooling','production','documents'],
  accountant:['dashboard','pulse','workflow','mobilepwa','audit','workspace','clients','crm','import','calendar','tasks','news','notifications','funnel','calculator','calculations','contracts','requests','specifications','orders','questions','tooling','production','finance','documents','settings'],
  leader:['dashboard','pulse','workflow','mobilepwa','audit','workspace','employees','clients','crm','import','calendar','tasks','news','notifications','funnel','calculator','calculations','contracts','requests','specifications','orders','approvals','questions','tooling','production','finance','documents','ai','settings']
};
const baseClients=[
  {company:'ООО «ЭНДЖОЙ ФУД»',inn:'7810641453',status:'Договор подписан · новый запрос'},
  {company:'ООО «ТМК Мясо»',inn:'',status:'КП отправлено · ждём ответ'},
  {company:'Grass',inn:'',status:'Переговоры · условия'}
];
let historyItems=JSON.parse(localStorage.getItem('artline_os_history_v06')||'null')||[
{type:'Контакт',author:'Константин',role:'Менеджер',date:'11.07.2026 · 09:20',text:'Возник контакт с клиентом. Обсудили потребность в этикетках для попкорна и возможные сроки.'},
{type:'КП',author:'Константин',role:'Менеджер',date:'11.07.2026 · 10:05',text:'Сделан предварительный расчёт, отправлены варианты по тиражам. Клиенту подходит цена и сроки.'},
{type:'Договор',author:'Бухгалтерия',role:'Бухгалтер',date:'11.07.2026 · 11:10',text:'Договор согласован и прикреплён к карточке клиента. Условия будут использоваться для последующих заказов.'},
{type:'Запрос',author:'Клиент',role:'Заказчик',date:'11.07.2026 · 12:40',text:'Клиент прислал реальный запрос: пакеты, ТЗ, макеты и адрес доставки. Нужно подготовить расчёт и спецификацию.'},
{type:'Бланк',author:'Дизайнер',role:'Дизайнер',date:'11.07.2026 · 14:00',text:'Бланк технического согласования подготовлен по макетам и передан менеджеру для отправки клиенту.'}
];
let questions=JSON.parse(localStorage.getItem('artline_os_questions_v06')||'null')||[
{title:'Уточнить намотку по бланку',text:'В бланке указана одна намотка, а в комментарии менеджера другая. Нужно подтвердить перед запуском.',stage:'Бланк согласования',to:['Менеджер','Дизайнер','Технолог'],status:'Открыт'},
{title:'Нужен новый нож?',text:'Размер похож на архивный, но нужно проверить зазор и ручьи перед заказом нового ножа.',stage:'Нож',to:['Бухгалтер','Дизайнер'],status:'Ждём ответ'},
{title:'Проверить Pantone',text:'На макете есть Pantone, но расход не подтверждён. Нужно уточнить у клиента или дизайнера.',stage:'Формы',to:['Дизайнер','Технолог'],status:'В работе'}
];
let importedClients=JSON.parse(localStorage.getItem('artline_os_imported_clients_v06')||'[]');
let clientFiles=JSON.parse(localStorage.getItem('artline_os_client_files_v06')||'null')||[
  {name:'ДОГОВОР_пример.doc',category:'Договор',source:'assets/ДОГОВОР_пример.doc',linked:'Клиент'},
  {name:'Спецификация_пример.docx',category:'Спецификация',source:'assets/Спецификация_пример.docx',linked:'Заказ AL-2026-0711-01'},
  {name:'Бланк согласования 1.jpg',category:'Бланк',source:'assets/blank_sample_1.jpg',linked:'Бланк согласования'},
  {name:'Бланк согласования 2.jpg',category:'Бланк',source:'assets/blank_sample_2.jpg',linked:'Бланк согласования'},
  {name:'Макет Попкорн 100×100.pdf',category:'Макет',source:'#',linked:'Дизайнер'},
  {name:'ТЗ клиента по попкорну.docx',category:'ТЗ',source:'#',linked:'Запрос клиента'}
];
let activeFileFilter='all';
let lastImportPreview=[];
let lastImportMapping=[];

const sampleCsv=`Дата;Компания;ИНН;Адрес / локация;Направление / потребность;Контакты;ЛПР / контактное лицо;Результат контакта;Что отправлено;Следующий шаг;Дата следующего контакта;Статус;Комментарии
05.07.2026;ООО «Торговый Дом Шоколада»;;Москва / МО;Продукты питания / шоколад / этикетки;"+7 (495) 575-34-00; WhatsApp +7 (963) 990-13-82; info@domchoco.ru";"Камила — отдел закупок; Анжела — секретарь";Анжела направила к Камиле. Письмо отправлено Камиле.;Письмо с предложением расчёта этикеток;"Проверить ответ Камилы; при отсутствии ответа повторить касание 13.07.2026.";13.07.2026;Письмо отправлено;Последнее касание 03.07.2026. Основная база, строка 251.
05.07.2026;ProffSyrup — ООО «ПРОФСИРОП»;;Москва;Пищевое производство / сиропы / этикетки;"+7 (495) 211-54-11; zakaz@proffsyrup.ru";Отдел закупок;По телефону не ответили. Письмо отправлено в отдел закупок.;Письмо на zakaz@proffsyrup.ru;"Проверить ответ отдела закупок; при отсутствии ответа повторить касание 13.07.2026.";13.07.2026;Письмо отправлено;Основная база, строка 252.
05.07.2026;ООО «Микояновский мясокомбинат»;;Москва;Мясная отрасль / этикетки;"zakupki@mmkom.ru; +7 (495) 785-65-67";Отдел закупок;Письмо отправлено в отдел закупок на zakupki@mmkom.ru 03.07.2026.;Письмо в отдел закупок;Проверить ответ отдела закупок; изучить регистрацию поставщика.;13.07.2026;Письмо отправлено;Основная база, строка 253.`;

function save(){
  localStorage.setItem('artline_os_history_v06',JSON.stringify(historyItems));
  localStorage.setItem('artline_os_questions_v06',JSON.stringify(questions));
  localStorage.setItem('artline_os_imported_clients_v06',JSON.stringify(importedClients));
  localStorage.setItem('artline_os_client_files_v06',JSON.stringify(clientFiles));
}
function navTo(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active-section'));
  document.getElementById(id)?.classList.add('active-section');
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===id));
  const t=sectionTitles[id]||['ART-LINE OS',''];
  document.getElementById('pageTitle').textContent=t[0];
  document.getElementById('pageSubtitle').textContent=t[1];
  document.getElementById('sidebar').classList.remove('open');
  document.querySelectorAll('.mobile-bottom-nav-v15 button').forEach(b=>b.classList.toggle('active',b.dataset.go===id));
}

function applyRole(role){
  document.getElementById('roleName').textContent=roleNames[role];
  const allowed=roleVisibility[role];
  document.querySelectorAll('.nav button').forEach(btn=>{btn.style.display=allowed.includes(btn.dataset.section)?'block':'none'});
  const active=document.querySelector('.section.active-section')?.id;
  if(!allowed.includes(active)) navTo('dashboard');
}
function renderHistory(){
  const el=document.getElementById('clientTimeline');
  if(!el)return;
  el.innerHTML=historyItems.map(item=>`<div class="timeline-item"><div class="meta"><span>${esc(item.date)}</span><span>·</span><span>${esc(item.author)}</span><span>·</span><span>${esc(item.role)}</span></div><strong>${esc(item.type)}</strong><div>${esc(item.text)}</div></div>`).join('');
}
function renderQuestions(){
  const card=(q,i)=>`<div class="question-card"><strong>${esc(q.id||('ВОП-'+String(48+i).padStart(4,'0')))} · ${esc(q.title)}</strong><p>${esc(q.text)}</p><div class="question-meta"><span>ООО «ЭНДЖОЙ ФУД»</span><span>AL-2026-0711-01</span><span>${esc(q.stage)}</span><span>${esc(q.status)}</span>${(q.to||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="linked-nav mini"><button class="small-btn" data-go="clients">К клиенту</button><button class="small-btn" data-go="orders">К заказу</button></div></div>`;
  const html=questions.map(card).join('');
  const ql=document.getElementById('questionList'); if(ql) ql.innerHTML=html;
  const oq=document.getElementById('orderQuestionsMini'); if(oq) oq.innerHTML=questions.slice(0,2).map(card).join('');
  const ch=document.getElementById('clientQuestionHistory'); if(ch) ch.innerHTML=questions.map(q=>`<div><strong>${esc(q.title)}</strong><span>${esc(q.stage)} · ${esc(q.status)} · адресаты: ${(q.to||[]).map(esc).join(', ')}</span><button class="small-btn" data-go="questions">Открыть вопрос</button></div>`).join('');
  if(document.getElementById('questionCount')) document.getElementById('questionCount').textContent=questions.length;
  if(document.getElementById('questionCountBadge')) document.getElementById('questionCountBadge').textContent=questions.length;
  if(document.getElementById('clientOpenQuestionsBadge')) document.getElementById('clientOpenQuestionsBadge').textContent=questions.length;
}
function renderClientFiles(){
  const vault=document.getElementById('clientFileVault');
  if(!vault)return;
  const list=clientFiles.filter(f=>activeFileFilter==='all'||f.category===activeFileFilter);
  vault.innerHTML=list.map(f=>{
    const href=f.source&&f.source!=='#'?f.source:'#';
    const attrs=href==='#'?'':'download';
    return `<a href="${esc(href)}" ${attrs}><span>${esc(f.category)}</span><strong>${esc(f.name)}</strong><small>${esc(f.linked||'Карточка клиента')}</small></a>`;
  }).join('')||'<div class="empty-state">Файлы этой категории пока не добавлены.</div>';
  updateClientCounters();
}
function updateClientCounters(){
  const n=clientFiles.length;
  const badge=document.getElementById('clientFilesBadge'); if(badge) badge.textContent=n;
  const overview=document.getElementById('clientFileOverviewCount'); if(overview) overview.textContent=n+' '+declOfNum(n,['файл','файла','файлов']);
}
function declOfNum(n,words){n=Math.abs(n)%100;let n1=n%10;if(n>10&&n<20)return words[2];if(n1>1&&n1<5)return words[1];if(n1===1)return words[0];return words[2];}
function openClientTab(id){
  navTo('clients');
  const tab=document.querySelector(`.client-tabs .tab[data-tab="${id}"]`);
  const panel=document.getElementById(id);
  if(!tab||!panel)return;
  document.querySelectorAll('.client-tabs .tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.client-card .tab-panel').forEach(p=>p.classList.remove('active'));
  tab.classList.add('active');
  panel.classList.add('active');
}
function bindClientFiles(){
  document.querySelectorAll('.file-filter').forEach(btn=>btn.addEventListener('click',()=>{
    activeFileFilter=btn.dataset.fileFilter;
    document.querySelectorAll('.file-filter').forEach(b=>b.classList.toggle('active',b===btn));
    renderClientFiles();
  }));
  const upload=document.getElementById('clientFileUpload');
  if(upload){
    upload.addEventListener('change',()=>{
      const files=[...upload.files].map(file=>({name:file.name,category:guessFileCategory(file.name),source:'#',linked:'Загружено в карточку клиента'}));
      clientFiles=[...files,...clientFiles];
      const now=new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',',' ·');
      historyItems.push({type:'Файлы',author:'Овечкин Константин',role:roleNames[document.getElementById('roleSelect').value],date:now,text:`В карточку клиента добавлено файлов: ${files.length}.`});
      save(); renderClientFiles(); renderHistory(); updateClientCounters(); upload.value='';
    });
  }
}
function guessFileCategory(name){
  const n=String(name||'').toLowerCase();
  if(/договор|contract/.test(n))return 'Договор';
  if(/специф/.test(n))return 'Спецификация';
  if(/бланк|соглас/.test(n))return 'Бланк';
  if(/тз|задани/.test(n))return 'ТЗ';
  if(/pdf|ai|cdr|eps|макет|layout/.test(n))return 'Макет';
  return 'Другое';
}

function esc(v){return String(v??'').replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));}
function norm(v){return String(v||'').toLowerCase().replace(/[«»"'`]/g,'').replace(/ооо|зао|ао|ип|общество с ограниченной ответственностью/g,'').replace(/[^а-яa-z0-9]/gi,'').trim();}
function getEmail(text){return (String(text||'').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig)||[''])[0];}
function getPhone(text){return (String(text||'').match(/(?:\+7|8)[\s\-\(\)]*\d{3}[\s\-\(\)]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}/)||[''])[0];}
function splitRows(text){
  text=String(text||'').replace(/^\uFEFF/,'').trim();
  if(!text)return [];
  const delimiter = detectDelimiter(text.split(/\r?\n/)[0]);
  const rows=[]; let row=[], cell='', inQuotes=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(c==='"' && inQuotes && n==='"'){ cell+='"'; i++; continue; }
    if(c==='"'){ inQuotes=!inQuotes; continue; }
    if(c===delimiter && !inQuotes){ row.push(cell); cell=''; continue; }
    if((c==='\n'||c==='\r') && !inQuotes){ if(c==='\r'&&n==='\n')i++; row.push(cell); if(row.some(x=>String(x).trim()!=='')) rows.push(row); row=[]; cell=''; continue; }
    cell+=c;
  }
  row.push(cell); if(row.some(x=>String(x).trim()!=='')) rows.push(row);
  return rows.map(r=>r.map(x=>String(x||'').trim()));
}
function detectDelimiter(line){
  const candidates=[';','\t',','];
  return candidates.map(d=>[d,(line.match(new RegExp(d==='\t'?'\\t':escapeReg(d),'g'))||[]).length]).sort((a,b)=>b[1]-a[1])[0][0];
}
function escapeReg(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function mapHeader(h){
  const x=String(h||'').toLowerCase().trim();
  if(/компан|клиент|организац|назван/.test(x))return 'company';
  if(/инн/.test(x))return 'inn';
  if(/адрес|локац|город/.test(x))return 'address';
  if(/направ|потреб|сегмент|отрасл/.test(x))return 'segment';
  if(/контакты|телефон|почта|email|e-mail|whatsapp/.test(x))return 'contacts';
  if(/лпр|контактное|контакт$|лицо|должност/.test(x))return 'person';
  if(/результат/.test(x))return 'result';
  if(/что отправлено|отправлено/.test(x))return 'sent';
  if(/следующ.*шаг|следующее действие/.test(x))return 'nextStep';
  if(/дата следующ/.test(x))return 'nextDate';
  if(/^дата$|последнее касание/.test(x))return 'date';
  if(/статус/.test(x))return 'status';
  if(/коммент|примеч/.test(x))return 'comment';
  if(/сайт|url/.test(x))return 'site';
  return 'extra';
}
function labelField(k){return ({company:'Компания',inn:'ИНН',address:'Адрес / локация',segment:'Сегмент / потребность',contacts:'Контакты',person:'ЛПР / контактное лицо',result:'Результат контакта',sent:'Что отправлено',nextStep:'Следующий шаг',nextDate:'Дата следующего контакта',date:'Дата касания',status:'Статус',comment:'Комментарий',site:'Сайт',extra:'Дополнительное поле'})[k]||k;}
function analyzeImportText(text){
  const rows=splitRows(text);
  if(rows.length<2) return {mapping:[],clients:[],warnings:['Не найдены строки с данными. Проверьте, что первая строка содержит заголовки.']};
  const headers=rows[0];
  const mapping=headers.map((h,i)=>({index:i,source:h,field:mapHeader(h)}));
  const clients=[];
  for(const row of rows.slice(1)){
    const obj={raw:{}};
    mapping.forEach(m=>{ const val=(row[m.index]||'').trim(); obj.raw[m.source]=val; if(m.field!=='extra') obj[m.field]=obj[m.field]?`${obj[m.field]} ${val}`:val; });
    obj.company=obj.company||obj.raw[headers[0]]||'Без названия';
    obj.email=getEmail((obj.contacts||'')+' '+(obj.raw.Email||''));
    obj.phone=getPhone(obj.contacts||'');
    obj.status=obj.status||'Новый';
    obj.segment=obj.segment||'Не указан';
    obj.person=obj.person||'Не указан';
    obj.nextStep=obj.nextStep||'Не указано';
    obj.date=obj.date||new Date().toLocaleDateString('ru-RU');
    obj.comment=[obj.result,obj.sent,obj.comment].filter(Boolean).join(' · ');
    obj.id='client_'+Date.now()+'_'+Math.random().toString(16).slice(2);
    obj.duplicate=isDuplicateClient(obj);
    clients.push(obj);
  }
  const warnings=[];
  const noContacts=clients.filter(c=>!c.email&&!c.phone).length;
  const dupes=clients.filter(c=>c.duplicate).length;
  if(noContacts) warnings.push(`${noContacts} клиент(ов) без найденного телефона/email.`);
  if(dupes) warnings.push(`${dupes} возможных дублей по названию или ИНН.`);
  if(!clients.some(c=>c.company && c.company!=='Без названия')) warnings.push('Не удалось уверенно определить колонку «Компания».');
  return {mapping,clients,warnings};
}
function isDuplicateClient(c){
  const all=[...baseClients,...importedClients];
  return all.some(x=>(c.inn && x.inn && c.inn===x.inn) || (norm(c.company) && norm(c.company)===norm(x.company)));
}
function renderImportResult(result){
  lastImportPreview=result.clients;
  lastImportMapping=result.mapping;
  const mappingTable=document.getElementById('mappingTable');
  const preview=document.getElementById('importPreview');
  const quality=document.getElementById('qualityReport');
  const stats=document.getElementById('importStats');
  const status=document.getElementById('mappingStatus');
  const confirm=document.getElementById('confirmImportBtn');
  if(mappingTable){
    mappingTable.classList.remove('empty-state');
    mappingTable.innerHTML=result.mapping.map(m=>`<div><span>${esc(m.source||`Колонка ${m.index+1}`)}</span><b>→</b><strong>${esc(labelField(m.field))}</strong></div>`).join('');
  }
  if(preview){
    preview.classList.remove('empty-state');
    preview.innerHTML=result.clients.slice(0,12).map(c=>`<article class="preview-card ${c.duplicate?'dupe':''}"><div class="preview-top"><strong>${esc(c.company)}</strong>${c.duplicate?'<span>дубль?</span>':''}</div><p>${esc(c.segment)}</p><div class="preview-meta"><span>${esc(c.person)}</span><span>${esc(c.status)}</span></div><small>${esc(c.email||c.phone||'контакт не найден')}</small><em>${esc(c.nextStep)}</em></article>`).join('') || 'Нет строк для предпросмотра.';
  }
  if(quality){
    quality.classList.remove('empty-state');
    const items=result.warnings.length?result.warnings:['Критичных замечаний нет. Можно подтвердить импорт.'];
    quality.innerHTML=items.map(w=>`<div class="quality-item">${esc(w)}</div>`).join('');
  }
  if(stats) stats.textContent=`${result.clients.length} строк`;
  if(status){ status.textContent='Сопоставлено'; status.className='status ok'; }
  if(confirm) confirm.disabled=result.clients.length===0;
}
function renderImportedClients(){
  const mini=document.getElementById('importedClientList');
  const panel=document.getElementById('clientImportedPanel');
  const badge=document.getElementById('importedCountBadge');
  if(badge) badge.textContent=importedClients.length;
  const html=importedClients.slice(0,8).map(c=>`<button class="client-item imported"><strong>${esc(c.company)}</strong><span>${esc(c.status||'Новый')} · ${esc(c.email||c.phone||'контакт не найден')}</span></button>`).join('');
  if(mini) mini.innerHTML=importedClients.length?`<div class="imported-title">Импортированные</div>${html}`:'';
  if(panel) panel.innerHTML=importedClients.length?importedClients.map(c=>`<div><strong>${esc(c.company)}</strong><span>${esc(c.status)} · ${esc(c.person)} · ${esc(c.nextStep)}</span></div>`).join(''):'<div><strong>Импорт пока не выполнен</strong><span>Загрузите таблицу в разделе «Импорт базы», подтвердите предпросмотр, и карточки появятся здесь.</span></div>';
}
function confirmImport(){
  if(!lastImportPreview.length)return;
  const fresh=lastImportPreview.filter(c=>!c.duplicate);
  importedClients=[...fresh,...importedClients];
  const now=new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',',' ·');
  historyItems.push({type:'Импорт базы',author:'Овечкин Константин',role:roleNames[document.getElementById('roleSelect').value],date:now,text:`Создано карточек клиентов: ${fresh.length}. Возможных дублей пропущено: ${lastImportPreview.length-fresh.length}.`});
  save(); renderImportedClients(); renderClientFiles(); renderHistory(); navTo('clients');
}
function bindImport(){
  const file=document.getElementById('importFile');
  const text=document.getElementById('importText');
  if(file){
    file.addEventListener('change',()=>{
      const f=file.files[0]; if(!f)return;
      if(/\.xlsx?$/.test(f.name.toLowerCase())){
        text.value='Этот XLSX-файл выбран: '+f.name+'\n\nВ прототипе v0.5 полноценный разбор XLSX заложен как серверная функция. Для демо сохраните таблицу как CSV или вставьте строки из Google Sheets сюда.';
        return;
      }
      const reader=new FileReader();
      reader.onload=()=>{text.value=reader.result;};
      reader.readAsText(f,'utf-8');
    });
  }
  document.getElementById('loadSampleBtn')?.addEventListener('click',()=>{text.value=sampleCsv; renderImportResult(analyzeImportText(sampleCsv));});
  document.getElementById('analyzeImportBtn')?.addEventListener('click',()=>renderImportResult(analyzeImportText(text.value)));
  document.getElementById('clearImportBtn')?.addEventListener('click',()=>{text.value=''; lastImportPreview=[]; ['mappingTable','qualityReport','importPreview'].forEach(id=>{const el=document.getElementById(id); if(el){el.classList.add('empty-state'); el.textContent=id==='mappingTable'?'Здесь появится таблица: колонка из файла → поле ART-LINE OS.':id==='qualityReport'?'После анализа появится список найденных дублей, пустых контактов и замечаний.':'Пока нет данных для предпросмотра.';}}); const c=document.getElementById('confirmImportBtn'); if(c)c.disabled=true;});
  document.getElementById('confirmImportBtn')?.addEventListener('click',confirmImport);
}

document.querySelectorAll('.nav button').forEach(btn=>btn.addEventListener('click',()=>navTo(btn.dataset.section)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>navTo(btn.dataset.go)));
document.addEventListener('click',e=>{const btn=e.target.closest('[data-go]'); if(btn){e.preventDefault(); navTo(btn.dataset.go);}
  const clientTab=e.target.closest('[data-open-client-tab]'); if(clientTab){e.preventDefault(); openClientTab(clientTab.dataset.openClientTab);}
});
document.getElementById('roleSelect').addEventListener('change',e=>applyRole(e.target.value));
document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  const wrap=tab.closest('.client-card')||document;
  wrap.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  wrap.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tab)?.classList.add('active');
}));
document.getElementById('addHistoryBtn').addEventListener('click',()=>{const input=document.getElementById('historyInput');const val=input.value.trim();if(!val)return;historyItems.push({type:'Комментарий',author:'Овечкин Константин',role:roleNames[document.getElementById('roleSelect').value],date:new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',',' ·'),text:val});input.value='';save();renderHistory();});
document.getElementById('createQuestionBtn').addEventListener('click',()=>{const to=[...document.querySelectorAll('.recipient-grid input:checked')].map(x=>x.value);questions.unshift({id:'ВОП-'+String(50+questions.length).padStart(4,'0'),title:document.getElementById('qTitle').value||'Новый вопрос',text:document.getElementById('qText').value||'Описание вопроса',stage:document.getElementById('qStage').value,to,status:'Открыт'});historyItems.push({type:'Вопрос',author:'Овечкин Константин',role:roleNames[document.getElementById('roleSelect').value],date:new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',',' ·'),text:'Создан вопрос по заказу: '+(document.getElementById('qTitle').value||'Новый вопрос')+'. Адресаты: '+to.join(', ')});save();renderQuestions();renderHistory();navTo('questions');});
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){navigator.serviceWorker.register('service-worker.js').catch(()=>{});}
bindImport();
bindClientFiles();
renderClientFiles();
updateClientCounters();
renderHistory();
renderQuestions();
renderImportedClients();
applyRole('manager');


function updateOrderGates(){
  const gates=[...document.querySelectorAll('[data-order-gate]')];
  if(!gates.length)return;
  const done=gates.filter(g=>g.checked).length;
  const badge=document.getElementById('gateProgress');
  const btn=document.getElementById('acceptOrderBtn');
  const status=document.getElementById('orderMainStatus');
  if(badge) badge.textContent=`${done} / ${gates.length}`;
  if(btn) btn.disabled=done!==gates.length;
  if(status && status.textContent!=='Принят в работу'){
    status.textContent=done===gates.length?'Готов к принятию в работу':'Не хватает данных';
    status.className=done===gates.length?'status warning':'status danger';
  }
}
function acceptOrderToWork(){
  const status=document.getElementById('orderMainStatus');
  if(status){status.textContent='Принят в работу'; status.className='status ok';}
  const now=new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',',' ·');
  const log=document.getElementById('autoTasksLog');
  if(log){
    const extra=[
      ['ЗАД-0156','Передать техпакет печатнику','Технолог · автоматически создано после запуска'],
      ['ЗАД-0157','Проверить оплату / отсрочку','Менеджер · связано с СЧ-1319 и ОТС-0007']
    ];
    extra.reverse().forEach(t=>log.insertAdjacentHTML('afterbegin',`<article><b>${t[0]}</b><strong>${t[1]}</strong><span>${t[2]}</span></article>`));
  }
  const oh=document.getElementById('orderHistoryLog');
  if(oh){oh.insertAdjacentHTML('afterbegin',`<article><span>${now}</span><strong>Заказ принят в работу</strong><small>Система создала номерованные задачи ЗАД-0156–0157, уведомления и финансовый контроль.</small></article>`);}
  historyItems.push({type:'Заказ принят в работу',author:'Овечкин Константин',role:roleNames[document.getElementById('roleSelect').value],date:now,text:'Создано событие: «ПРОШУ ПРИНЯТЬ В РАБОТУ ЗАКАЗ · AL-2026-0711-01». Система сформировала задачи, вопросы, историю и финансовый контроль.'});
  save(); renderHistory();
  alert('Заказ принят в работу. В прототипе созданы номерованные задачи, запись в истории и финансовая задача по оплате.');
}
document.querySelectorAll('[data-order-gate]').forEach(g=>g.addEventListener('change',updateOrderGates));
document.getElementById('acceptOrderBtn')?.addEventListener('click',acceptOrderToWork);
updateOrderGates();


/* v0.7 — сотрудники, рабочий стол, календарь, задачи, новости, уведомления */
let readNews = JSON.parse(localStorage.getItem('artline_os_read_news_v07')||'[]');
function updateReadNews(){
  const el=document.getElementById('readNewsCount');
  if(el) el.textContent=`${readNews.length} из 3`;
  document.querySelectorAll('.news-ack').forEach(btn=>{
    const id=btn.dataset.news;
    if(readNews.includes(id)){ btn.textContent='Ознакомлен ✓'; btn.classList.add('done'); }
  });
}
document.querySelectorAll('.news-ack').forEach(btn=>btn.addEventListener('click',()=>{
  const id=btn.dataset.news;
  if(!readNews.includes(id)) readNews.push(id);
  localStorage.setItem('artline_os_read_news_v07',JSON.stringify(readNews));
  updateReadNews();
}));
document.getElementById('demoAssignTaskBtn')?.addEventListener('click',()=>{
  alert('Задача назначена в прототипе. В рабочей версии она появится у сотрудника, в календаре, уведомлениях и связанной карточке клиента/заказа.');
});
document.getElementById('demoCreateEmployeeBtn')?.addEventListener('click',()=>{
  alert('Кабинет сотрудника создан в прототипе. В серверной версии руководитель сможет выдавать логин, временный пароль и роль.');
});
updateReadNews();


/* v0.8 — глубокая CRM менеджера */
document.getElementById('demoCrmReminderBtn')?.addEventListener('click',()=>{
  alert('CRM-напоминание создано в прототипе. В серверной версии оно будет связано с клиентом, календарём менеджера, уведомлениями и историей касаний.');
});


/* v0.9 — Производственный план */
function activateProductionView(view){
  document.querySelectorAll('[data-prod-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.prodView===view));
  document.querySelectorAll('.prod-view-panel').forEach(panel=>panel.classList.toggle('active',panel.id==='prod-view-'+view));
  navTo('production');
}
function filterProductionRows(filter){
  document.querySelectorAll('[data-prod-filter]').forEach(btn=>btn.classList.toggle('active',btn.dataset.prodFilter===filter));
  document.querySelectorAll('[data-prod-row]').forEach(row=>{
    const status=(row.dataset.status||'');
    const show=filter==='all'||status.split(/\s+/).includes(filter);
    row.classList.toggle('hidden',!show);
  });
}
function selectProductionRow(row){
  if(!row)return;
  document.querySelectorAll('[data-prod-row]').forEach(r=>r.classList.toggle('active-row',r===row));
  const set=(id,val)=>{const el=document.getElementById(id); if(el) el.textContent=val;};
  set('pulseReady',row.dataset.ready||'—');
  set('pulseOrder',(row.dataset.order||'Заказ')+' · '+(row.dataset.client||'Клиент'));
  const cells=row.querySelectorAll('td');
  set('pulseProduct',((cells[2]&&cells[2].textContent)||'Позиция')+' · '+((cells[5]&&cells[5].textContent)||''));
  set('pulseNext','Следующее действие: '+(row.dataset.next||'проверить заказ'));
  set('pulseRisk',row.dataset.risk||'Риск срока: не указан');
  document.getElementById('prodPulseCard')?.scrollIntoView({behavior:'smooth',block:'nearest'});
}
document.querySelectorAll('[data-prod-view]').forEach(btn=>btn.addEventListener('click',()=>activateProductionView(btn.dataset.prodView)));
document.querySelectorAll('[data-prod-filter]').forEach(btn=>btn.addEventListener('click',()=>filterProductionRows(btn.dataset.prodFilter)));
document.querySelectorAll('[data-prod-row]').forEach(row=>row.addEventListener('click',()=>selectProductionRow(row)));
document.querySelectorAll('[data-prod-select]').forEach(btn=>btn.addEventListener('click',()=>{
  const id=btn.dataset.prodSelect;
  const row=[...document.querySelectorAll('[data-prod-row]')].find(r=>r.dataset.order===id);
  activateProductionView('table');
  filterProductionRows('all');
  selectProductionRow(row);
}));
selectProductionRow(document.querySelector('[data-prod-row]'));


/* v1.0 — отсрочка и график платежей */
function formatRuDate(d){
  if(!(d instanceof Date)||isNaN(d)) return '—';
  return d.toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function updateDeferDueDate(){
  const daysEl=document.getElementById('deferDays');
  const startEl=document.getElementById('deferStart');
  const out=document.getElementById('deferDueDate');
  const pay=document.getElementById('payPartDue');
  if(!daysEl||!startEl||!out)return;
  const days=parseInt(daysEl.value||'0',10);
  const start=new Date(startEl.value+'T00:00:00');
  if(isNaN(start)){out.textContent='—'; return;}
  start.setDate(start.getDate()+days);
  const txt=formatRuDate(start);
  out.textContent=txt;
  if(pay) pay.textContent=txt;
}
['deferDays','deferStart','deferBase','deferStatus'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>{
  updateDeferDueDate();
  if(id==='deferDays'){
    const status=document.getElementById('deferStatus');
    if(status && status.value==='Согласована руководителем') status.value='Требует повторного согласования';
  }
}));
updateDeferDueDate();


/* v1.1 — переключение финансовых вкладок */
function activateFinanceView(view){
  document.querySelectorAll('[data-finance-view]').forEach(btn=>{
    if(btn.tagName==='BUTTON') btn.classList.toggle('active',btn.dataset.financeView===view);
  });
  document.querySelectorAll('.finance-view-panel').forEach(panel=>panel.classList.remove('active'));
  document.getElementById('finance-view-'+view)?.classList.add('active');
  if(!document.getElementById('finance')?.classList.contains('active-section')) navTo('finance');
}
document.querySelectorAll('[data-finance-view]').forEach(btn=>btn.addEventListener('click',()=>activateFinanceView(btn.dataset.financeView)));


/* v1.2 — переключение документных вкладок */
function activateDocView(view){
  document.querySelectorAll('[data-doc-view]').forEach(btn=>{
    if(btn.tagName==='BUTTON') btn.classList.toggle('active',btn.dataset.docView===view);
  });
  document.querySelectorAll('.doc-view-panel').forEach(panel=>panel.classList.remove('active'));
  document.getElementById('doc-view-'+view)?.classList.add('active');
  if(!document.getElementById('documents')?.classList.contains('active-section')) navTo('documents');
}
document.querySelectorAll('[data-doc-view]').forEach(btn=>btn.addEventListener('click',()=>activateDocView(btn.dataset.docView)));


/* v1.3 — Пульс компании / центр руководителя */
document.getElementById('onlyProblemsBtn')?.addEventListener('click',()=>{
  const pulse=document.getElementById('pulse');
  if(!pulse)return;
  const active=pulse.classList.toggle('only-problems-mode');
  document.getElementById('onlyProblemsBtn').textContent=active?'Показать всё':'Показать только проблемное';
  alert(active ? 'Режим проблем включён: в рабочей версии система покажет только критичные риски, зависшие процессы, просрочки и решения руководителя.' : 'Режим проблем выключен.');
});
document.querySelectorAll('.leader-fast-actions .small-btn,.decision-actions .small-btn').forEach(btn=>{
  btn.addEventListener('click',()=>alert('Демо-действие руководителя: в серверной версии это изменит статус, создаст задачу, запросит комментарий или запишет решение в историю.'));
});


/* v1.4 — сквозная логика, навигация, поиск и быстрые действия */
const workflowStageInfoMap={
  clients:['Этап: Клиентский центр','Здесь хранится основная карточка клиента, контакты, история, документы, счета, заказы, файлы и все связанные процессы.'],
  crm:['Этап: CRM и касания','Менеджер фиксирует следующий шаг, ставит напоминание, ведёт воронку, контролирует КП без ответа и клиентов без движения.'],
  calculations:['Этап: Расчёт / КП','Расчёт превращается в коммерческое предложение, далее — в согласование условий, спецификацию и реальный заказ.'],
  contracts:['Этап: Договор','Проверяются условия работы, сроки, оплата, отсрочка и правовая база для дальнейших заказов.'],
  orders:['Этап: Заказ','Заказ становится центральным объектом: документы, оплата, задачи, вопросы, производство, история и следующий шаг.'],
  documents:['Этап: Документы','Спецификация, бланк, производственный пакет, письмо в работу и изменения по повторному заказу связываются с заказом.'],
  finance:['Этап: Финансы','Счёт, график платежей, отсрочка, задолженность и финансовый допуск к отгрузке контролируются вместе с заказом.'],
  production:['Этап: Производство / отгрузка','Производственный план, очередь печати, материал, формы, штамп, готовность к отгрузке и финальный статус заказа.'],
  questions:['Этап: Задачи и вопросы','Номерованные ЗАД и ВОП фиксируют ответственность, сроки, причины остановки и историю решений.']
};
document.querySelectorAll('[data-stage-go]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-stage-go]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const go=btn.dataset.stageGo;
  const info=workflowStageInfoMap[go]||['Этап процесса','Связанный раздел ART-LINE OS.'];
  const box=document.getElementById('workflowStageInfo');
  if(box){box.innerHTML=`<strong>${info[0]}</strong><span>${info[1]}</span>`;}
  setTimeout(()=>navTo(go),260);
}));
document.querySelectorAll('[data-scroll-workflow]').forEach(btn=>btn.addEventListener('click',()=>{
  const el=document.getElementById(btn.dataset.scrollWorkflow);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}));
function runGlobalSearchDemo(){
  const q=(document.getElementById('globalSearchInput')?.value||'').toLowerCase().trim();
  const results=[...document.querySelectorAll('#globalSearchResults button')];
  let shown=0;
  results.forEach(r=>{
    const ok=!q||r.textContent.toLowerCase().includes(q)||q.includes('энджой')||q.includes('заказ')||q.includes('счет')||q.includes('сч');
    r.classList.toggle('hidden-search-result',!ok);
    if(ok) shown++;
  });
  if(!shown){
    results.forEach(r=>r.classList.remove('hidden-search-result'));
    alert('В прототипе показаны демонстрационные результаты. В серверной версии поиск будет работать по клиентам, ИНН, номерам заказов, задач, счетов, бланков, файлов и истории.');
  }
}
document.getElementById('globalSearchBtn')?.addEventListener('click',runGlobalSearchDemo);
document.getElementById('globalSearchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')runGlobalSearchDemo();});
document.querySelectorAll('[data-demo-action]').forEach(btn=>btn.addEventListener('click',()=>{
  const map={task:'создаст номерованную задачу и привяжет её к заказу, клиенту и календарю.',question:'создаст вопрос ВОП с адресатом, сроком ответа и влиянием на риск заказа.',responsible:'назначит текущего ответственного и запишет изменение в историю.',comment:'добавит комментарий в единую историю клиента и заказа.'};
  alert('Демо-действие: '+(map[btn.dataset.demoAction]||'в рабочей версии действие будет записано в историю.'));
}));


/* v1.5 — мобильная версия, быстрые действия и PWA */
document.querySelectorAll('[data-mobile-scroll]').forEach(btn=>btn.addEventListener('click',()=>{
  const el=document.getElementById(btn.dataset.mobileScroll);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}));
document.querySelectorAll('[data-mobile-quick-action]').forEach(btn=>btn.addEventListener('click',()=>{
  navTo('mobilepwa');
  setTimeout(()=>document.getElementById('quick-action-panel-v15')?.scrollIntoView({behavior:'smooth',block:'center'}),80);
}));
document.getElementById('saveQuickMobileAction')?.addEventListener('click',()=>{
  const now=new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',',' ·');
  historyItems.push({type:'Мобильное действие',author:'Овечкин Константин',role:roleNames[document.getElementById('roleSelect').value],date:now,text:'После звонка с телефона добавлен комментарий, назначено следующее касание и зафиксирован дальнейший шаг по клиенту.'});
  save(); renderHistory(); alert('Демо: мобильное действие сохранено в историю клиента. В серверной версии оно создаст реальную запись, напоминание и уведомление.');
});
document.querySelectorAll('[data-mobile-demo-tab]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-mobile-demo-tab]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const screen=document.getElementById('mobileScreenV15');
  const tab=btn.dataset.mobileDemoTab;
  if(!screen)return;
  const content={
    today:`<div class="mobile-today-card-v15"><span class="mobile-chip-v15">Сегодня</span><h3>Рабочий день</h3><div class="mobile-kpi-row-v15"><b>7</b><span>задач сегодня</span></div><div class="mobile-kpi-row-v15 danger"><b>2</b><span>просрочено</span></div><div class="mobile-kpi-row-v15"><b>5</b><span>клиентов для касания</span></div><button class="mobile-primary-v15" data-mobile-quick-action>+ Быстро после звонка</button></div>`,
    clients:`<div class="mobile-order-card-v15"><div><strong>КЛ-0001</strong><span>ООО «ЭНДЖОЙ ФУД»</span></div><p>Контакт: Дарья · следующий шаг сегодня</p><small>Договор подписан, бланк ждёт подпись</small><div class="mobile-actions-v15"><button>Позвонить</button><button>Email</button><button>Комментарий</button></div></div><div class="mobile-order-card-v15 soft"><div><strong>КЛ-0008</strong><span>Grass</span></div><p>Переговоры · KPI снабжения</p><small>Отправлены образцы и презентация</small></div>`,
    orders:`<div class="mobile-order-card-v15"><div><strong>ЗАК-0187</strong><span>Высокий риск</span></div><p>Ждём материал · плановая отгрузка завтра</p><small>Ответственный: технолог</small><div class="mobile-actions-v15"><button>Открыть</button><button>Вопрос</button><button>Задача</button></div></div><div class="mobile-order-card-v15 soft"><div><strong>ЗАК-0188</strong><span>Норма</span></div><p>В печати · бланк подписан</p><small>Оплата согласована</small></div>`,
    tasks:`<div class="mobile-order-card-v15"><div><strong>ЗАД-0142</strong><span>Сегодня</span></div><p>Подготовить бланк согласования</p><small>Связано: ЗАК-0187</small></div><div class="mobile-order-card-v15"><div><strong>ВОП-0031</strong><span>Без ответа</span></div><p>Уточнить намотку перед печатью</p><small>Адресат: технолог</small></div>`,
    more:`<div class="mobile-order-card-v15"><div><strong>Ещё</strong><span>разделы</span></div><p>CRM · Производство · Финансы · Документы · Пульс компании · Новости · Настройки</p><small>В рабочей версии список зависит от роли сотрудника</small></div>`
  };
  screen.innerHTML=content[tab]||content.today;
  document.querySelectorAll('[data-mobile-quick-action]').forEach(b=>b.addEventListener('click',()=>document.getElementById('quick-action-panel-v15')?.scrollIntoView({behavior:'smooth',block:'center'})));
}));
function runMobileSearchDemo(){
  const q=(document.getElementById('mobileDemoSearch')?.value||'').trim();
  const screen=document.getElementById('mobileScreenV15');
  if(!screen)return;
  screen.innerHTML=`<div class="mobile-today-card-v15"><span class="mobile-chip-v15">Результаты поиска</span><h3>${esc(q||'ЭНДЖОЙ ФУД')}</h3><div class="mobile-order-card-v15"><div><strong>КЛ-0001</strong><span>клиент</span></div><p>ООО «ЭНДЖОЙ ФУД» · ИНН 7810641453</p><small>3 заказа · 2 документа · 1 счёт</small></div><div class="mobile-order-card-v15"><div><strong>ЗАК-0187</strong><span>заказ</span></div><p>Ждём материал · высокий риск</p><small>Открыть заказ, бланк, счёт или вопрос</small></div><button class="mobile-primary-v15" data-go="clients">Открыть карточку клиента</button></div>`;
}
document.getElementById('mobileSearchDemoBtn')?.addEventListener('click',runMobileSearchDemo);
document.getElementById('mobileDemoSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')runMobileSearchDemo();});
window.addEventListener('load',()=>{
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')){
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }
});


/* v1.6 — финальный аудит, сценарии, блокировки и готовность к серверу */
document.querySelectorAll('[data-audit-scroll]').forEach(btn=>btn.addEventListener('click',()=>{
  const el=document.getElementById(btn.dataset.auditScroll);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}));
document.getElementById('showCriticalScenariosV16')?.addEventListener('click',()=>{
  document.querySelectorAll('#scenarioGridV16 [data-scenario-risk]').forEach(card=>{
    card.classList.toggle('scenario-hidden-v16',card.dataset.scenarioRisk!=='critical');
  });
});
document.getElementById('showAllScenariosV16')?.addEventListener('click',()=>{
  document.querySelectorAll('#scenarioGridV16 [data-scenario-risk]').forEach(card=>card.classList.remove('scenario-hidden-v16'));
});
const readinessContentV16={
  launch:`<h4>Готовность к запуску</h4><p><span class="ok">✓</span> Договор есть</p><p><span class="ok">✓</span> Расчёт согласован</p><p><span class="ok">✓</span> Спецификация готова</p><p><span class="bad">✕</span> Бланк не подписан</p><p><span class="bad">✕</span> Счёт не выставлен</p>`,
  print:`<h4>Готовность к печати</h4><p><span class="ok">✓</span> Макет получен</p><p><span class="ok">✓</span> Цветность указана</p><p><span class="bad">✕</span> Формы не подтверждены</p><p><span class="bad">✕</span> Материал не отмечен как поступивший</p><p><span class="ok">✓</span> Производственный пакет собран</p>`,
  ship:`<h4>Готовность к отгрузке</h4><p><span class="ok">✓</span> Производство завершено</p><p><span class="ok">✓</span> Контроль качества пройден</p><p><span class="bad">✕</span> Оплата не подтверждена</p><p><span class="bad">✕</span> Отсрочка не согласована</p><p><span class="ok">✓</span> Адрес доставки указан</p>`,
  close:`<h4>Готовность к закрытию</h4><p><span class="ok">✓</span> Заказ отгружен</p><p><span class="ok">✓</span> Документы прикреплены</p><p><span class="bad">✕</span> Нет финального статуса оплаты</p><p><span class="ok">✓</span> История действий заполнена</p><p><span class="ok">✓</span> Следующее касание клиента назначено</p>`
};
document.querySelectorAll('[data-readiness-tab]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-readiness-tab]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const box=document.getElementById('readinessBoxV16');
  if(box) box.innerHTML=readinessContentV16[btn.dataset.readinessTab]||readinessContentV16.launch;
}));
