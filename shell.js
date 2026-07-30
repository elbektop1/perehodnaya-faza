const roleNames={director:'Директор',admin:'Администратор',assistant:'Помощник директора',manager:'Менеджер',designer:'Дизайнер',technologist:'Технолог',economist:'Экономист',accountant:'Бухгалтер',worker:'Печатник',production_manager:'Менеджер производства'};
const sectionTitles={
  dashboard:['Главная','Рабочий центр компании: сотрудники, клиенты, задачи, календарь, новости и заказы.'],
  pulse:['Пульс компании','Центр руководителя: решения на сегодня, риски, деньги, узкие места, нагрузка сотрудников и быстрые действия.'],
  workspace:['Рабочий стол','Личный день сотрудника: задачи, напоминания, вопросы, новости и события.'],
  employees:['Сотрудники','Кабинеты сотрудников, роли, логины, временные пароли и права доступа.'],
  calendar:['Календарь','Личные и общие события: клиенты, задачи, договоры, заказы и отгрузки.'],
  tasks:['Задачи','Поручения руководителя, задачи по клиентам и заказам, сроки и статусы.'],
  news:['Новости','Объявления руководителя и важные новости компании с отметкой ознакомления.'],
  notifications:['Уведомления','Единый центр событий: вопросы, задачи, напоминания, новости и статусы заказов.'],
  clients:['Клиенты','Центральная карточка клиента: файлы, история, расчёты, заказы, бланки и вопросы.'],
  crm:['CRM','Глубокая CRM менеджера: воронка, напоминания, горячие клиенты, касания и клиенты без следующего шага.'],
  import:['Импорт базы','Загрузка таблиц менеджеров, автоматический разбор, поиск дублей и создание карточек клиентов.'],
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
  director:['dashboard','workspace','calendar','tasks','news','notifications','pulse','employees','clients','crm','import','funnel','calculator','calculations','contracts','requests','specifications','orders','approvals','questions','tooling','production','finance','documents','ai','settings'],
  admin:['dashboard','workspace','calendar','tasks','news','notifications','employees','orders','tooling','production','documents','settings'],
  assistant:['dashboard','workspace','calendar','tasks','news','notifications','clients','crm','import','funnel','calculations','contracts','requests','specifications','orders','approvals','questions','tooling','production','documents'],
  manager:['dashboard','workspace','calendar','tasks','news','notifications','clients','crm','import','funnel','calculations','contracts','requests','specifications','orders','approvals','questions','tooling','production','finance','documents'],
  designer:['dashboard','workspace','calendar','tasks','news','notifications','orders','approvals','questions','tooling','production','documents','calculations','requests'],
  technologist:['dashboard','workspace','calendar','tasks','news','notifications','orders','approvals','questions','tooling','production','documents','calculations'],
  production_manager:['dashboard','workspace','calendar','tasks','news','notifications','orders','production','tooling','questions','documents'],
  economist:['dashboard','workspace','calendar','tasks','news','notifications','orders','calculator','calculations','tooling','finance','documents'],
  accountant:['dashboard','workspace','calendar','tasks','news','notifications','clients','crm','finance','contracts','requests','specifications','calculations','orders','questions','production','documents','settings'],
  worker:['dashboard','workspace','calendar','tasks','news','notifications','orders','questions','tooling','production','documents']
};
let lastImportPreview=[];
let lastImportMapping=[];

const sampleCsv=`Дата;Компания;ИНН;Адрес / локация;Направление / потребность;Контакты;ЛПР / контактное лицо;Результат контакта;Что отправлено;Следующий шаг;Дата следующего контакта;Статус;Комментарии
05.07.2026;ООО «Торговый Дом Шоколада»;;Москва / МО;Продукты питания / шоколад / этикетки;"+7 (495) 575-34-00; WhatsApp +7 (963) 990-13-82; info@domchoco.ru";"Камила — отдел закупок; Анжела — секретарь";Анжела направила к Камиле. Письмо отправлено Камиле.;Письмо с предложением расчёта этикеток;"Проверить ответ Камилы; при отсутствии ответа повторить касание 13.07.2026.";13.07.2026;Письмо отправлено;Последнее касание 03.07.2026. Основная база, строка 251.
05.07.2026;ProffSyrup — ООО «ПРОФСИРОП»;;Москва;Пищевое производство / сиропы / этикетки;"+7 (495) 211-54-11; zakaz@proffsyrup.ru";Отдел закупок;По телефону не ответили. Письмо отправлено в отдел закупок.;Письмо на zakaz@proffsyrup.ru;"Проверить ответ отдела закупок; при отсутствии ответа повторить касание 13.07.2026.";13.07.2026;Письмо отправлено;Основная база, строка 252.
05.07.2026;ООО «Микояновский мясокомбинат»;;Москва;Мясная отрасль / этикетки;"zakupki@mmkom.ru; +7 (495) 785-65-67";Отдел закупок;Письмо отправлено в отдел закупок на zakupki@mmkom.ru 03.07.2026.;Письмо в отдел закупок;Проверить ответ отдела закупок; изучить регистрацию поставщика.;13.07.2026;Письмо отправлено;Основная база, строка 253.`;

// данные в памяти (CLAUDE.md п.6 — никакого localStorage); save() убран,
// вызовы ниже по коду просто перестают что-либо сохранять между перезагрузками
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
  populateStaffSelect(role);
}

// «Вы» — конкретный сотрудник внутри выбранной роли (Фаза 4): нужен для
// «моих задач», «моего календаря» и учёта прочтения новостей — переключатель
// роли сам по себе не различает разных людей одной роли.
function populateStaffSelect(role){
  const sel=document.getElementById('staffSelect');
  if(!sel)return;
  const people=Store.getStaff().filter(p=>p.role===role);
  sel.innerHTML=people.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')||'<option value="">— нет сотрудников —</option>';
  updateTopbarStaffName();
}
function getCurrentStaffId(){
  const v=document.getElementById('staffSelect').value;
  return v?Number(v):null;
}
// топбар показывает выбранного в «Вы» сотрудника, а не захардкоженное имя
function updateTopbarStaffName(){
  const id=getCurrentStaffId();
  const person=id?Store.getStaff().find(p=>p.id===id):null;
  const el=document.getElementById('topbarStaffName');
  if(el) el.textContent=person?person.name:'—';
}
function refreshCurrentViews(){
  [ 'renderTasksBoard','renderAllQuestions','renderNewsFeed','renderCalendar',
    'renderClientQuestions','refreshCrmViews','renderFinance','renderProduction','renderApprovals',
    'renderNotifBell','renderNotificationsScreen' ].forEach(fn=>{
    if(typeof window[fn]==='function') window[fn]();
  });
}
// renderClientFiles/updateClientCounters/bindClientFiles/guessFileCategory —
// перенесены в documents.js (Фаза 9), источник данных теперь Store.getDocuments

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
  const all=Store.getClients();
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
function toIsoDate(ruDate){
  const m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(ruDate||'').trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}
function confirmImport(){
  if(!lastImportPreview.length)return;
  const fresh=lastImportPreview.filter(c=>!c.duplicate);
  const now=new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',',' ·');
  fresh.forEach(c=>{
    const client=Store.saveClient({
      company:c.company, inn:c.inn||'', city:c.address||'', segment:c.segment||'',
      source:'Импорт базы', manager:null, stage:'Первичный контакт',
      nextAction:c.nextStep||'', nextActionDate:toIsoDate(c.nextDate), lastTouch:toIsoDate(c.date), comment:c.comment||''
    });
    Store.addHistory({clientId:client.id, type:'Импорт базы', author:staffName(getCurrentStaffId())||'—', role:roleNames[document.getElementById('roleSelect').value], date:now, text:`Карточка создана импортом. Результат: ${c.result||'—'}.`});
  });
  const badge=document.getElementById('importedCountBadge');
  if(badge) badge.textContent=Store.getClients().filter(c=>c.source==='Импорт базы').length;
  if(typeof renderClientFiles==='function') renderClientFiles();
  if(typeof populateCrmFormClientSelect==='function') populateCrmFormClientSelect();
  if(typeof refreshCrmViews==='function') refreshCrmViews();
  navTo('clients');
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
document.getElementById('roleSelect').addEventListener('change',e=>{applyRole(e.target.value); refreshCurrentViews();});
document.getElementById('staffSelect').addEventListener('change',()=>{updateTopbarStaffName(); refreshCurrentViews();});
document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  const wrap=tab.closest('.client-card')||document;
  wrap.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  wrap.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tab)?.classList.add('active');
}));
// #createQuestionBtn, .news-ack и #demoAssignTaskBtn перенесены в questions.js/news.js/tasks.js (Фаза 4) —
// там же реальные Store.addQuestion/addNews/addTask с адресатом-сотрудником вместо alert()-заглушек.
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){navigator.serviceWorker.register('service-worker.js').catch(()=>{});}
bindImport();
applyRole('manager');


/* v0.7 — сотрудники, рабочий стол */
document.getElementById('demoCreateEmployeeBtn')?.addEventListener('click',()=>{
  alert('Кабинет сотрудника создан в прототипе. В серверной версии руководитель сможет выдавать логин, временный пароль и роль.');
});


/* v1.5 — PWA: регистрация service worker */
window.addEventListener('load',()=>{
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')){
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }
});
