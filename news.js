function audienceStaff(audience) {
  return audience === "all" ? Store.getStaff() : Store.getStaff().filter(p => p.role === audience);
}
function audienceLabel(audience) {
  return audience === "all" ? "Все сотрудники" : (roleNames[audience] || audience);
}

function renderNewsFeed() {
  const feed = document.getElementById("newsFeed");
  if (!feed) return;
  const me = getCurrentStaffId();
  const items = Store.getNews();
  feed.innerHTML = items.map((n, i) => {
    const read = me && n.readBy.includes(me);
    return `<article class="news-card${i === 0 ? " important" : ""}">
      <span>${esc(n.author)} · ${esc(n.createdAt)}</span>
      <strong>${esc(n.title)}</strong>
      <p>${esc(n.text)}</p>
      <button class="small-btn news-ack${read ? " done" : ""}" data-news-ack="${n.id}">${read ? "Ознакомлен ✓" : "Ознакомлен"}</button>
    </article>`;
  }).join("") || '<div class="empty-state">Новостей пока нет.</div>';

  feed.querySelectorAll("[data-news-ack]").forEach(btn =>
    btn.addEventListener("click", () => {
      Store.markNewsRead(btn.dataset.newsAck, getCurrentStaffId());
      renderNewsFeed();
      renderNewsReadStats();
    })
  );

  const publishBtn = document.getElementById("publishNewsBtn");
  if (publishBtn) publishBtn.style.display = getCurrentRole() === "director" ? "inline-flex" : "none";

  renderWorkspaceNews();
}

function renderWorkspaceNews() {
  const list = document.getElementById("workspaceNewsMini");
  const badge = document.getElementById("workspaceNewsUnread");
  if (!list && !badge) return;
  const me = getCurrentStaffId();
  const unread = Store.getNews().filter(n => !me || !n.readBy.includes(me));
  if (list) {
    list.innerHTML = unread.slice(0, 2).map(n =>
      `<article><strong>${esc(n.title)}</strong><span>${esc(n.text)}</span></article>`
    ).join("") || '<article><strong>Все новости прочитаны</strong><span>Новых объявлений нет.</span></article>';
  }
  if (badge) badge.textContent = `${unread.length} непрочитано`;
}

function renderNewsReadStats() {
  const box = document.getElementById("newsReadStats");
  if (!box) return;
  box.innerHTML = Store.getNews().map(n => {
    const eligible = audienceStaff(n.audience);
    const readCount = eligible.filter(p => n.readBy.includes(p.id)).length;
    const notRead = eligible.filter(p => !n.readBy.includes(p.id)).map(p => p.name);
    return `<article>
      <strong>${readCount} из ${eligible.length}</strong>
      <span>${esc(n.title)} · ${esc(audienceLabel(n.audience))}</span>
      ${notRead.length ? `<span>Не прочитали: ${esc(notRead.join(", "))}</span>` : `<span>Прочитали все.</span>`}
    </article>`;
  }).join("") || '<div class="empty-state">Пока нет новостей для статистики.</div>';
}

function openPublishNewsModal() {
  const audienceOptions = `<option value="all">Все сотрудники</option>` +
    Object.keys(roleNames).map(r => `<option value="${r}">${esc(roleNames[r])}</option>`).join("");
  openModal(`
    <div class="modal-header"><h3>Новая новость</h3></div>
    <div class="modal-body">
      <div class="field"><label class="field-label">Заголовок</label><input id="newNewsTitle" /></div>
      <div class="field"><label class="field-label">Текст</label><textarea id="newNewsText" rows="4"></textarea></div>
      <div class="field"><label class="field-label">Кому</label><select id="newNewsAudience">${audienceOptions}</select></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
      <button class="btn btn-primary" onclick="submitNews()">Опубликовать</button>
    </div>
  `);
}

function submitNews() {
  const title = document.getElementById("newNewsTitle").value.trim();
  const text = document.getElementById("newNewsText").value.trim();
  const audience = document.getElementById("newNewsAudience").value;
  if (!title || !text) return;
  const newsItem = Store.addNews({
    title, text, audience,
    author: staffName(getCurrentStaffId()) || "Руководитель",
    authorRole: getCurrentRole(),
    createdAt: nowLabel(),
  });
  if (typeof notifyNewsPublished === "function") notifyNewsPublished(newsItem);
  closeModal();
  renderNewsFeed();
  renderNewsReadStats();
}

document.getElementById("publishNewsBtn")?.addEventListener("click", openPublishNewsModal);

renderNewsFeed();
renderNewsReadStats();
