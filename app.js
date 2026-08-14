const config = window.SITE_CONFIG || {};

document.title = config.title || "문건함";
document.querySelector("#site-title").textContent = config.title || "문건함";
document.querySelector("#site-description").textContent = config.description || "파일 공유 공간";

const repoLink = document.querySelector("#repo-link");
if (config.repoUrl) {
  repoLink.href = config.repoUrl;
  repoLink.classList.remove("hidden");
}

const grid = document.querySelector("#file-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const chips = document.querySelector("#chips");
const summary = document.querySelector("#summary");
const previewDialog = document.querySelector("#preview-dialog");
const previewTitle = document.querySelector("#preview-title");
const previewBody = document.querySelector("#preview-body");
const previewDownload = document.querySelector("#preview-download");
const previewCopy = document.querySelector("#preview-copy");

let allFiles = [];
let activeCategory = "전체";

const CATEGORY_LABELS = ["전체", "문서", "표", "이미지", "압축", "기타"];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));
}

function humanSize(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value >= 10 || i === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[i]}`;
}

function formatDate(iso) {
  if (!iso) return "날짜 정보 없음";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "날짜 정보 없음";
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function extensionOf(file) {
  return (file.extension || file.name.split(".").pop() || "FILE").toUpperCase().slice(0, 6);
}

function canPreview(file) {
  return ["pdf", "png", "jpg", "jpeg", "gif", "webp", "svg", "txt", "md", "csv", "tsv"].includes((file.extension || "").toLowerCase());
}

function fileUrl(file) {
  return file.path.split("/").map(encodeURIComponent).join("/");
}

function renderChips() {
  const counts = Object.fromEntries(CATEGORY_LABELS.map(label => [label, 0]));
  counts["전체"] = allFiles.length;
  allFiles.forEach(file => { counts[file.category] = (counts[file.category] || 0) + 1; });

  chips.innerHTML = CATEGORY_LABELS.map(label => `
    <button type="button" class="chip ${activeCategory === label ? "active" : ""}" data-category="${label}">
      ${label}<span class="count">${counts[label] || 0}</span>
    </button>
  `).join("");

  chips.querySelectorAll(".chip").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderChips();
      renderFiles();
    });
  });
}

function filteredFiles() {
  const query = searchInput.value.trim().toLowerCase();
  let list = allFiles.filter(file => {
    const categoryOk = activeCategory === "전체" || file.category === activeCategory;
    const haystack = `${file.name} ${file.path} ${file.extension} ${file.category}`.toLowerCase();
    return categoryOk && (!query || haystack.includes(query));
  });

  const sort = sortSelect.value;
  list.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name, "ko");
    if (sort === "size") return (b.size || 0) - (a.size || 0);
    return new Date(b.modified || 0) - new Date(a.modified || 0) || a.name.localeCompare(b.name, "ko");
  });
  return list;
}

function renderFiles() {
  const list = filteredFiles();
  summary.textContent = `총 ${allFiles.length}개 중 ${list.length}개 표시`;
  emptyState.classList.toggle("hidden", list.length !== 0);
  grid.innerHTML = list.map(file => {
    const url = fileUrl(file);
    const safeName = escapeHtml(file.name);
    return `
      <article class="file-card">
        <div class="file-top">
          <span class="file-badge">${escapeHtml(extensionOf(file))}</span>
          <span class="file-category">${escapeHtml(file.category || "기타")}</span>
        </div>
        <h2 class="file-name">${safeName}</h2>
        <p class="file-path">${escapeHtml(file.path.replace(/^files\//, ""))}</p>
        <div class="card-bottom">
          <div class="file-meta">${humanSize(file.size)}<br>${formatDate(file.modified)}</div>
          <div class="card-actions">
            ${canPreview(file) ? `<button class="action-button preview-button" type="button" data-path="${escapeHtml(file.path)}">보기</button>` : ""}
            <a class="action-button" href="${url}" download>받기</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".preview-button").forEach(button => {
    button.addEventListener("click", () => {
      const file = allFiles.find(item => item.path === button.dataset.path);
      if (file) openPreview(file);
    });
  });
}

async function openPreview(file) {
  const url = fileUrl(file);
  const ext = (file.extension || "").toLowerCase();
  previewTitle.textContent = file.name;
  previewDownload.href = url;
  previewDownload.setAttribute("download", file.name);
  previewCopy.dataset.url = new URL(url, window.location.href).href;
  previewBody.innerHTML = `<div class="preview-message">미리보기를 불러오는 중…</div>`;
  previewDialog.showModal();

  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
    previewBody.innerHTML = `<img src="${url}" alt="${escapeHtml(file.name)}" />`;
    return;
  }
  if (ext === "pdf") {
    previewBody.innerHTML = `<iframe src="${url}#view=FitH" title="${escapeHtml(file.name)}"></iframe>`;
    return;
  }
  if (["txt", "md", "csv", "tsv"].includes(ext)) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("fetch failed");
      const text = await response.text();
      const clipped = text.length > 200000 ? `${text.slice(0, 200000)}\n\n…(미리보기는 앞부분만 표시)` : text;
      previewBody.innerHTML = `<pre>${escapeHtml(clipped)}</pre>`;
    } catch {
      previewBody.innerHTML = `<div class="preview-message">브라우저에서 내용을 읽지 못했어요.<br>다운로드 버튼으로 파일을 열어줘.</div>`;
    }
    return;
  }
  previewBody.innerHTML = `<div class="preview-message">이 형식은 브라우저 미리보기를 지원하지 않아요.<br>다운로드해서 열어줘.</div>`;
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const old = button.textContent;
    button.textContent = "복사됨 ✓";
    setTimeout(() => { button.textContent = old; }, 1200);
  } catch {
    window.prompt("아래 주소를 복사해줘.", text);
  }
}

document.querySelector("#close-preview").addEventListener("click", () => previewDialog.close());
previewDialog.addEventListener("click", event => {
  if (event.target === previewDialog) previewDialog.close();
});
previewCopy.addEventListener("click", () => copyText(previewCopy.dataset.url, previewCopy));
document.querySelector("#copy-page-link").addEventListener("click", event => copyText(window.location.href, event.currentTarget));
searchInput.addEventListener("input", renderFiles);
sortSelect.addEventListener("change", renderFiles);

async function init() {
  try {
    const response = await fetch(`./files.json?v=${Date.now()}`);
    if (!response.ok) throw new Error("files.json not found");
    const data = await response.json();
    allFiles = Array.isArray(data.files) ? data.files : [];
    renderChips();
    renderFiles();
  } catch (error) {
    summary.textContent = "파일 목록을 불러오지 못했어요.";
    grid.innerHTML = `<div class="preview-message">GitHub Actions가 아직 <code>files.json</code>을 만들지 않았거나 파일을 읽지 못했습니다.</div>`;
  }
}

init();
