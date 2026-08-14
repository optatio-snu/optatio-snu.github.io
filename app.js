const config = window.SITE_CONFIG || {};
const githubConfig = config.github || {};

const siteTitle = document.querySelector("#site-title");
const siteDescription = document.querySelector("#site-description");
const repoLink = document.querySelector("#repo-link");
const grid = document.querySelector("#file-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const chips = document.querySelector("#chips");
const summary = document.querySelector("#summary");
const toast = document.querySelector("#toast");

const previewDialog = document.querySelector("#preview-dialog");
const previewTitle = document.querySelector("#preview-title");
const previewBody = document.querySelector("#preview-body");
const previewDownload = document.querySelector("#preview-download");
const previewOpen = document.querySelector("#preview-open");
const previewCopy = document.querySelector("#preview-copy");
const previewToolbar = document.querySelector("#preview-toolbar");
const previewPrev = document.querySelector("#preview-prev");
const previewNext = document.querySelector("#preview-next");
const imageTools = document.querySelector("#image-tools");
const zoomOut = document.querySelector("#zoom-out");
const zoomIn = document.querySelector("#zoom-in");
const zoomReset = document.querySelector("#zoom-reset");
const rotateImage = document.querySelector("#rotate-image");

const adminButton = document.querySelector("#admin-button");
const adminStatus = document.querySelector("#admin-status");
const adminPanel = document.querySelector("#admin-panel");
const adminDialog = document.querySelector("#admin-dialog");
const adminForm = document.querySelector("#admin-form");
const adminFormMessage = document.querySelector("#admin-form-message");
const adminDisconnect = document.querySelector("#admin-disconnect");
const githubOwnerInput = document.querySelector("#github-owner");
const githubRepoInput = document.querySelector("#github-repo");
const githubBranchInput = document.querySelector("#github-branch");
const githubTokenInput = document.querySelector("#github-token");
const uploadFolder = document.querySelector("#upload-folder");
const uploadInput = document.querySelector("#upload-input");
const uploadSubmit = document.querySelector("#upload-submit");
const uploadSelection = document.querySelector("#upload-selection");
const dropZone = document.querySelector("#drop-zone");
const refreshIndexButton = document.querySelector("#refresh-index");

const manageDialog = document.querySelector("#manage-dialog");
const manageTitle = document.querySelector("#manage-title");
const managePath = document.querySelector("#manage-path");
const renameSubmit = document.querySelector("#rename-submit");
const replaceInput = document.querySelector("#replace-input");
const replaceSubmit = document.querySelector("#replace-submit");
const deleteSubmit = document.querySelector("#delete-submit");
const manageMessage = document.querySelector("#manage-message");
const textEditorWrap = document.querySelector("#text-editor-wrap");
const textEditor = document.querySelector("#text-editor");
const textSave = document.querySelector("#text-save");

const CATEGORY_LABELS = ["전체", "문서", "표", "이미지", "압축", "기타"];
const DOCUMENTS = new Set(["pdf", "hwp", "hwpx", "doc", "docx", "ppt", "pptx", "txt", "md", "rtf"]);
const TABLES = new Set(["xls", "xlsx", "xlsm", "csv", "tsv", "ods"]);
const IMAGES = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tif", "tiff", "heic"]);
const ARCHIVES = new Set(["zip", "7z", "rar", "tar", "gz", "bz2", "xz"]);
const PREVIEWABLE_IMAGES = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);
const PREVIEWABLE_TEXT = new Set(["txt", "md", "csv", "tsv"]);
const MAX_UPLOAD_BYTES = 95 * 1024 * 1024;
const LARGE_FILE_WARNING_BYTES = 50 * 1024 * 1024;
const API_VERSION = "2026-03-10";
const TOKEN_KEY = "documentVault.githubToken";

let allFiles = [];
let activeCategory = "전체";
let currentPreviewPath = "";
let currentManageFile = null;
let selectedUploadFiles = [];
let imageScale = 1;
let imageRotation = 0;
let toastTimer = null;
let adminSession = {
  token: sessionStorage.getItem(TOKEN_KEY) || "",
  owner: githubConfig.owner || inferOwner(),
  repo: githubConfig.repo || inferRepo(),
  branch: githubConfig.branch || "main",
  filesDir: normalizeDir(githubConfig.filesDir || "files")
};

function inferOwner() {
  const host = window.location.hostname;
  if (host.endsWith(".github.io")) return host.split(".")[0];
  return "";
}

function inferRepo() {
  const host = window.location.hostname;
  if (host.endsWith(".github.io")) {
    const owner = host.split(".")[0];
    const firstPath = window.location.pathname.split("/").filter(Boolean)[0];
    return firstPath || `${owner}.github.io`;
  }
  return "";
}

function normalizeDir(value = "files") {
  return String(value).trim().replace(/^\/+|\/+$/g, "") || "files";
}

function normalizeRepoPath(value, ensureFilesDir = true) {
  let path = String(value || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/{2,}/g, "/");

  const parts = path.split("/").filter(Boolean);
  if (!parts.length || parts.some(part => part === "." || part === "..")) {
    throw new Error("올바른 파일 경로를 입력해줘.");
  }

  path = parts.join("/");
  if (ensureFilesDir && path !== adminSession.filesDir && !path.startsWith(`${adminSession.filesDir}/`)) {
    path = `${adminSession.filesDir}/${path}`;
  }
  if (path === adminSession.filesDir) throw new Error("파일 이름까지 포함한 경로가 필요해.");
  return path;
}

function joinUploadPath(folder, filename) {
  const cleanFolder = String(folder || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/{2,}/g, "/");
  const relative = cleanFolder ? `${cleanFolder}/${filename}` : filename;
  return normalizeRepoPath(relative, true);
}

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

function extensionFromName(name = "") {
  const last = String(name).split("/").pop() || "";
  if (!last.includes(".")) return "";
  return last.split(".").pop().toLowerCase();
}

function categoryFor(ext = "") {
  if (DOCUMENTS.has(ext)) return "문서";
  if (TABLES.has(ext)) return "표";
  if (IMAGES.has(ext)) return "이미지";
  if (ARCHIVES.has(ext)) return "압축";
  return "기타";
}

function extensionOf(file) {
  return (file.extension || extensionFromName(file.name) || "FILE").toUpperCase().slice(0, 6);
}

function canPreview(file) {
  const ext = (file.extension || extensionFromName(file.name)).toLowerCase();
  return ext === "pdf" || PREVIEWABLE_IMAGES.has(ext) || PREVIEWABLE_TEXT.has(ext);
}

function fileUrl(file) {
  return file.path.split("/").map(encodeURIComponent).join("/");
}

function isAdmin() {
  return Boolean(adminSession.token);
}

function showToast(message, duration = 2600) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove("hidden");
  requestAnimationFrame(() => toast.classList.add("visible"));
  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.classList.add("hidden"), 180);
  }, duration);
}

function setButtonBusy(button, busy, busyText = "처리 중…") {
  if (!button) return;
  if (busy) {
    button.dataset.oldText = button.textContent;
    button.textContent = busyText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.oldText || button.textContent;
    button.disabled = false;
  }
}

function renderAdminState() {
  const active = isAdmin();
  adminStatus.classList.toggle("hidden", !active);
  adminPanel.classList.toggle("hidden", !active);
  adminButton.textContent = active ? "관리 설정" : "관리";
  adminDisconnect.classList.toggle("hidden", !active);

  githubOwnerInput.value = adminSession.owner || "";
  githubRepoInput.value = adminSession.repo || "";
  githubBranchInput.value = adminSession.branch || "main";
  githubTokenInput.value = active ? adminSession.token : "";

  renderFiles();
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
  const list = allFiles.filter(file => {
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
  summary.textContent = `총 ${allFiles.length}개 중 ${list.length}개 표시${isAdmin() ? " · 관리자 모드" : ""}`;
  emptyState.classList.toggle("hidden", list.length !== 0);

  grid.innerHTML = list.map(file => {
    const url = fileUrl(file);
    const safeName = escapeHtml(file.name);
    const safePath = escapeHtml(file.path);
    return `
      <article class="file-card">
        <div class="file-top">
          <span class="file-badge">${escapeHtml(extensionOf(file))}</span>
          <span class="file-category">${escapeHtml(file.category || "기타")}</span>
        </div>
        <h2 class="file-name">${safeName}</h2>
        <p class="file-path">${escapeHtml(file.path.replace(new RegExp(`^${adminSession.filesDir}/`), ""))}</p>
        <div class="card-bottom">
          <div class="file-meta">${humanSize(file.size)}<br>${formatDate(file.modified)}</div>
          <div class="card-actions">
            ${canPreview(file) ? `<button class="action-button preview-button" type="button" data-path="${safePath}">보기</button>` : ""}
            <a class="action-button" href="${url}" download>받기</a>
            ${isAdmin() ? `<button class="action-button manage-button" type="button" data-path="${safePath}">관리</button>` : ""}
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

  grid.querySelectorAll(".manage-button").forEach(button => {
    button.addEventListener("click", () => {
      const file = allFiles.find(item => item.path === button.dataset.path);
      if (file) openManageDialog(file);
    });
  });
}

function previewableList() {
  return filteredFiles().filter(canPreview);
}

function updatePreviewNavigation() {
  const list = previewableList();
  const index = list.findIndex(file => file.path === currentPreviewPath);
  previewToolbar.classList.toggle("hidden", list.length <= 1 && imageTools.classList.contains("hidden"));
  previewPrev.disabled = index <= 0;
  previewNext.disabled = index < 0 || index >= list.length - 1;
}

function resetImageTransform() {
  imageScale = 1;
  imageRotation = 0;
  applyImageTransform();
}

function applyImageTransform() {
  const image = previewBody.querySelector(".viewer-image");
  if (!image) return;
  image.style.transform = `scale(${imageScale}) rotate(${imageRotation}deg)`;
  zoomReset.textContent = `${Math.round(imageScale * 100)}%`;
}

async function openPreview(file) {
  const url = fileUrl(file);
  const ext = (file.extension || extensionFromName(file.name)).toLowerCase();
  currentPreviewPath = file.path;
  previewTitle.textContent = file.name;
  previewDownload.href = url;
  previewDownload.setAttribute("download", file.name);
  previewOpen.href = url;
  previewCopy.dataset.url = new URL(url, window.location.href).href;
  previewBody.innerHTML = `<div class="preview-message">미리보기를 불러오는 중…</div>`;
  imageTools.classList.add("hidden");
  resetImageTransform();

  if (!previewDialog.open) previewDialog.showModal();

  if (PREVIEWABLE_IMAGES.has(ext)) {
    imageTools.classList.remove("hidden");
    previewBody.innerHTML = `<div class="image-stage"><img class="viewer-image" src="${url}" alt="${escapeHtml(file.name)}" /></div>`;
    applyImageTransform();
    updatePreviewNavigation();
    return;
  }

  if (ext === "pdf") {
    previewBody.innerHTML = `<iframe src="${url}#toolbar=1&navpanes=0&view=FitH" title="${escapeHtml(file.name)}"></iframe>`;
    updatePreviewNavigation();
    return;
  }

  if (PREVIEWABLE_TEXT.has(ext)) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("fetch failed");
      const text = await response.text();
      const clipped = text.length > 300000 ? `${text.slice(0, 300000)}\n\n…(미리보기는 앞부분만 표시)` : text;
      previewBody.innerHTML = `<pre>${escapeHtml(clipped)}</pre>`;
    } catch {
      previewBody.innerHTML = `<div class="preview-message">브라우저에서 내용을 읽지 못했어.<br>다운로드 버튼으로 파일을 열어줘.</div>`;
    }
    updatePreviewNavigation();
    return;
  }

  previewBody.innerHTML = `<div class="preview-message">이 형식은 브라우저 미리보기를 지원하지 않아.<br>다운로드해서 열어줘.</div>`;
  updatePreviewNavigation();
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

async function loadFiles(showError = true) {
  try {
    const response = await fetch(`./files.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("files.json not found");
    const data = await response.json();
    allFiles = Array.isArray(data.files) ? data.files : [];
    renderChips();
    renderFiles();
    return true;
  } catch (error) {
    if (showError) {
      summary.textContent = "파일 목록을 불러오지 못했어.";
      grid.innerHTML = `<div class="preview-message">GitHub Actions가 아직 <code>files.json</code>을 만들지 않았거나 파일을 읽지 못했어.</div>`;
    }
    return false;
  }
}

function githubApiUrl(path) {
  return `https://api.github.com${path}`;
}

function repoApiPath(suffix = "") {
  const owner = encodeURIComponent(adminSession.owner);
  const repo = encodeURIComponent(adminSession.repo);
  return `/repos/${owner}/${repo}${suffix}`;
}

async function githubRequest(path, options = {}) {
  if (!adminSession.token) throw new Error("먼저 관리자 연결을 해줘.");

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${adminSession.token}`,
    "X-GitHub-Api-Version": API_VERSION,
    ...options.headers
  };

  const response = await fetch(githubApiUrl(path), { ...options, headers });
  let payload = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    payload = await response.json().catch(() => null);
  } else if (response.status !== 204) {
    payload = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const message = payload?.message || `GitHub API 오류 (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

async function validateAdminConnection() {
  await githubRequest(repoApiPath());
  await githubRequest(repoApiPath(`/branches/${encodeURIComponent(adminSession.branch)}`));
}

function contentApiPath(path) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return repoApiPath(`/contents/${encodedPath}`);
}

async function getContentMeta(path) {
  const query = `?ref=${encodeURIComponent(adminSession.branch)}&t=${Date.now()}`;
  return githubRequest(`${contentApiPath(path)}${query}`);
}

async function getBlobBase64(sha) {
  const blob = await githubRequest(repoApiPath(`/git/blobs/${encodeURIComponent(sha)}`));
  if (!blob?.content) throw new Error("기존 파일 내용을 불러오지 못했어.");
  return blob.content.replace(/\s/g, "");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("파일을 읽지 못했어."));
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      if (comma < 0) return reject(new Error("파일 인코딩에 실패했어."));
      resolve(result.slice(comma + 1));
    };
    reader.readAsDataURL(file);
  });
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
  }
  return btoa(binary);
}

function textToBase64(text) {
  return bytesToBase64(new TextEncoder().encode(text));
}

async function putFile(path, base64Content, message, sha = null) {
  const body = {
    message,
    content: base64Content,
    branch: adminSession.branch
  };
  if (sha) body.sha = sha;
  return githubRequest(contentApiPath(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

async function deleteFile(path, sha, message) {
  return githubRequest(contentApiPath(path), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: adminSession.branch })
  });
}

function localFileRecord(path, size, modified = new Date().toISOString()) {
  const name = path.split("/").pop();
  const extension = extensionFromName(name);
  return {
    name,
    path,
    extension,
    category: categoryFor(extension),
    size,
    modified
  };
}

function upsertLocalFile(record, oldPath = null) {
  if (oldPath && oldPath !== record.path) {
    allFiles = allFiles.filter(file => file.path !== oldPath);
  }
  const index = allFiles.findIndex(file => file.path === record.path);
  if (index >= 0) allFiles[index] = { ...allFiles[index], ...record };
  else allFiles.push(record);
  renderChips();
  renderFiles();
}

function removeLocalFile(path) {
  allFiles = allFiles.filter(file => file.path !== path);
  renderChips();
  renderFiles();
}

async function uploadOneFile(file, destinationPath) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name}: 95 MiB를 넘는 파일은 이 웹 업로더로 올리지 않도록 막아뒀어.`);
  }
  if (file.size > LARGE_FILE_WARNING_BYTES) {
    const ok = window.confirm(`${file.name}은 ${humanSize(file.size)}야. GitHub는 50 MiB 초과 파일을 큰 파일로 경고해. 그래도 올릴까?`);
    if (!ok) return null;
  }

  let existing = null;
  try {
    existing = await getContentMeta(destinationPath);
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  if (existing) {
    const overwrite = window.confirm(`${destinationPath} 파일이 이미 있어. 이 파일로 교체할까?`);
    if (!overwrite) return null;
  }

  const base64 = await fileToBase64(file);
  await putFile(
    destinationPath,
    base64,
    existing ? `docs: replace ${destinationPath}` : `docs: upload ${destinationPath}`,
    existing?.sha || null
  );
  const record = localFileRecord(destinationPath, file.size);
  upsertLocalFile(record);
  return record;
}

async function performUpload(files) {
  const fileList = Array.from(files || []);
  if (!fileList.length) return;

  setButtonBusy(uploadSubmit, true, `업로드 중 0/${fileList.length}`);
  let completed = 0;
  let changed = 0;
  try {
    for (const file of fileList) {
      uploadSubmit.textContent = `업로드 중 ${completed}/${fileList.length}`;
      const destination = joinUploadPath(uploadFolder.value, file.name);
      const result = await uploadOneFile(file, destination);
      completed += 1;
      if (result) changed += 1;
    }
    if (changed) showToast(`${changed}개 파일을 GitHub에 반영했어.`);
    selectedUploadFiles = [];
    uploadInput.value = "";
    updateUploadSelection();
  } catch (error) {
    showToast(`업로드 실패: ${error.message}`, 4800);
  } finally {
    setButtonBusy(uploadSubmit, false);
    uploadSubmit.disabled = selectedUploadFiles.length === 0;
  }
}

function updateUploadSelection() {
  const files = selectedUploadFiles;
  uploadSelection.textContent = files.length
    ? `${files.length}개 선택 · ${humanSize(files.reduce((sum, file) => sum + file.size, 0))}`
    : "선택된 파일 없음";
  uploadSubmit.disabled = files.length === 0;
}

async function openManageDialog(file) {
  currentManageFile = file;
  manageTitle.textContent = file.name;
  managePath.value = file.path;
  replaceInput.value = "";
  manageMessage.textContent = "";
  textEditorWrap.classList.add("hidden");
  textEditor.value = "";
  manageDialog.showModal();

  const ext = (file.extension || extensionFromName(file.name)).toLowerCase();
  if (PREVIEWABLE_TEXT.has(ext)) {
    textEditorWrap.classList.remove("hidden");
    textEditor.placeholder = "내용을 불러오는 중…";
    textEditor.disabled = true;
    try {
      const response = await fetch(`${fileUrl(file)}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("fetch failed");
      textEditor.value = await response.text();
      textEditor.placeholder = "";
    } catch {
      try {
        const meta = await getContentMeta(file.path);
        const base64 = await getBlobBase64(meta.sha);
        const bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
        textEditor.value = new TextDecoder().decode(bytes);
      } catch (error) {
        manageMessage.textContent = `텍스트를 불러오지 못했어: ${error.message}`;
      }
    } finally {
      textEditor.disabled = false;
    }
  }
}

async function renameCurrentFile() {
  if (!currentManageFile) return;
  let newPath;
  try {
    newPath = normalizeRepoPath(managePath.value, true);
  } catch (error) {
    manageMessage.textContent = error.message;
    return;
  }

  const oldPath = currentManageFile.path;
  if (newPath === oldPath) {
    manageMessage.textContent = "경로가 바뀌지 않았어.";
    return;
  }

  setButtonBusy(renameSubmit, true);
  manageMessage.textContent = "기존 파일을 읽고 새 경로로 옮기는 중…";
  try {
    let targetExists = false;
    try {
      await getContentMeta(newPath);
      targetExists = true;
    } catch (error) {
      if (error.status !== 404) throw error;
    }
    if (targetExists) throw new Error("바꾸려는 경로에 이미 파일이 있어.");

    const meta = await getContentMeta(oldPath);
    const base64 = await getBlobBase64(meta.sha);
    await putFile(newPath, base64, `docs: move ${oldPath} to ${newPath}`);
    await deleteFile(oldPath, meta.sha, `docs: remove old path ${oldPath}`);

    const updated = localFileRecord(newPath, currentManageFile.size);
    upsertLocalFile(updated, oldPath);
    currentManageFile = updated;
    manageTitle.textContent = updated.name;
    managePath.value = updated.path;
    manageMessage.textContent = "경로와 이름을 바꿨어.";
    showToast("파일 경로를 변경했어.");
  } catch (error) {
    manageMessage.textContent = `변경 실패: ${error.message}`;
  } finally {
    setButtonBusy(renameSubmit, false);
  }
}

async function replaceCurrentFile() {
  if (!currentManageFile) return;
  const replacement = replaceInput.files?.[0];
  if (!replacement) {
    manageMessage.textContent = "교체할 파일을 먼저 골라줘.";
    return;
  }
  if (replacement.size > MAX_UPLOAD_BYTES) {
    manageMessage.textContent = "95 MiB를 넘는 파일은 이 웹 업로더로 교체하지 않도록 막아뒀어.";
    return;
  }

  setButtonBusy(replaceSubmit, true);
  manageMessage.textContent = "파일을 교체하는 중…";
  try {
    const meta = await getContentMeta(currentManageFile.path);
    const base64 = await fileToBase64(replacement);
    await putFile(currentManageFile.path, base64, `docs: replace ${currentManageFile.path}`, meta.sha);

    const updated = localFileRecord(currentManageFile.path, replacement.size);
    upsertLocalFile(updated);
    currentManageFile = updated;
    manageMessage.textContent = "파일을 교체했어.";
    replaceInput.value = "";
    showToast("파일을 교체했어.");
  } catch (error) {
    manageMessage.textContent = `교체 실패: ${error.message}`;
  } finally {
    setButtonBusy(replaceSubmit, false);
  }
}

async function saveTextCurrentFile() {
  if (!currentManageFile) return;
  setButtonBusy(textSave, true);
  manageMessage.textContent = "텍스트를 저장하는 중…";
  try {
    const meta = await getContentMeta(currentManageFile.path);
    const content = textEditor.value;
    await putFile(currentManageFile.path, textToBase64(content), `docs: edit ${currentManageFile.path}`, meta.sha);
    const size = new Blob([content]).size;
    const updated = localFileRecord(currentManageFile.path, size);
    upsertLocalFile(updated);
    currentManageFile = updated;
    manageMessage.textContent = "텍스트 내용을 저장했어.";
    showToast("텍스트 수정 내용을 저장했어.");
  } catch (error) {
    manageMessage.textContent = `저장 실패: ${error.message}`;
  } finally {
    setButtonBusy(textSave, false);
  }
}

async function deleteCurrentFile() {
  if (!currentManageFile) return;
  const file = currentManageFile;
  const ok = window.confirm(`정말 ${file.name} 파일을 삭제할까?\nGit 기록에는 남지만 현재 사이트에서는 없어져.`);
  if (!ok) return;

  setButtonBusy(deleteSubmit, true, "삭제 중…");
  manageMessage.textContent = "삭제하는 중…";
  try {
    const meta = await getContentMeta(file.path);
    await deleteFile(file.path, meta.sha, `docs: delete ${file.path}`);
    removeLocalFile(file.path);
    manageDialog.close();
    currentManageFile = null;
    showToast("파일을 삭제했어.");
  } catch (error) {
    manageMessage.textContent = `삭제 실패: ${error.message}`;
  } finally {
    setButtonBusy(deleteSubmit, false);
  }
}

async function connectAdmin(event) {
  event.preventDefault();
  adminFormMessage.textContent = "";

  adminSession.owner = githubOwnerInput.value.trim();
  adminSession.repo = githubRepoInput.value.trim();
  adminSession.branch = githubBranchInput.value.trim() || "main";
  adminSession.token = githubTokenInput.value.trim();

  if (!adminSession.owner || !adminSession.repo || !adminSession.token) {
    adminFormMessage.textContent = "사용자/저장소/토큰을 모두 입력해줘.";
    return;
  }

  const connectButton = document.querySelector("#admin-connect");
  setButtonBusy(connectButton, true, "확인 중…");
  try {
    await validateAdminConnection();
    sessionStorage.setItem(TOKEN_KEY, adminSession.token);
    adminFormMessage.textContent = "연결됐어. 이 탭에서만 관리자 기능이 켜져.";
    renderAdminState();
    setTimeout(() => adminDialog.close(), 450);
    showToast("관리자 모드를 켰어.");
  } catch (error) {
    adminSession.token = "";
    sessionStorage.removeItem(TOKEN_KEY);
    adminFormMessage.textContent = `연결 실패: ${error.message}`;
  } finally {
    setButtonBusy(connectButton, false);
  }
}

function disconnectAdmin() {
  adminSession.token = "";
  sessionStorage.removeItem(TOKEN_KEY);
  githubTokenInput.value = "";
  adminFormMessage.textContent = "관리자 연결을 종료했어.";
  renderAdminState();
  adminDialog.close();
  showToast("관리자 모드를 종료했어.");
}

function openAdminDialog() {
  adminFormMessage.textContent = isAdmin() ? "현재 이 탭에 관리자 토큰이 연결돼 있어." : "";
  githubOwnerInput.value = adminSession.owner || "";
  githubRepoInput.value = adminSession.repo || "";
  githubBranchInput.value = adminSession.branch || "main";
  githubTokenInput.value = adminSession.token || "";
  adminDialog.showModal();
}

function wireDialogCloseButtons() {
  document.querySelectorAll(".dialog-close").forEach(button => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });

  [adminDialog, manageDialog].forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
  });
}

function movePreview(direction) {
  const list = previewableList();
  const index = list.findIndex(file => file.path === currentPreviewPath);
  const target = list[index + direction];
  if (target) openPreview(target);
}

siteTitle.textContent = config.title || "문건함";
siteDescription.textContent = config.description || "파일 공유 공간";
document.title = config.title || "문건함";
if (config.repoUrl) {
  repoLink.href = config.repoUrl;
  repoLink.classList.remove("hidden");
}

document.querySelector("#close-preview").addEventListener("click", () => previewDialog.close());
previewDialog.addEventListener("click", event => {
  if (event.target === previewDialog) previewDialog.close();
});
previewCopy.addEventListener("click", () => copyText(previewCopy.dataset.url, previewCopy));
document.querySelector("#copy-page-link").addEventListener("click", event => copyText(window.location.href, event.currentTarget));
searchInput.addEventListener("input", renderFiles);
sortSelect.addEventListener("change", renderFiles);
previewPrev.addEventListener("click", () => movePreview(-1));
previewNext.addEventListener("click", () => movePreview(1));
zoomOut.addEventListener("click", () => { imageScale = Math.max(0.25, imageScale - 0.25); applyImageTransform(); });
zoomIn.addEventListener("click", () => { imageScale = Math.min(5, imageScale + 0.25); applyImageTransform(); });
zoomReset.addEventListener("click", () => { imageScale = 1; applyImageTransform(); });
rotateImage.addEventListener("click", () => { imageRotation = (imageRotation + 90) % 360; applyImageTransform(); });

adminButton.addEventListener("click", openAdminDialog);
adminForm.addEventListener("submit", connectAdmin);
adminDisconnect.addEventListener("click", disconnectAdmin);
renameSubmit.addEventListener("click", renameCurrentFile);
replaceSubmit.addEventListener("click", replaceCurrentFile);
textSave.addEventListener("click", saveTextCurrentFile);
deleteSubmit.addEventListener("click", deleteCurrentFile);

uploadInput.addEventListener("change", () => {
  selectedUploadFiles = Array.from(uploadInput.files || []);
  updateUploadSelection();
});
uploadSubmit.addEventListener("click", () => performUpload(selectedUploadFiles));
refreshIndexButton.addEventListener("click", async () => {
  setButtonBusy(refreshIndexButton, true, "불러오는 중…");
  const ok = await loadFiles(false);
  setButtonBusy(refreshIndexButton, false);
  showToast(ok ? "files.json 목록을 다시 불러왔어." : "목록을 아직 불러오지 못했어.");
});

["dragenter", "dragover"].forEach(type => {
  dropZone.addEventListener(type, event => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});
["dragleave", "drop"].forEach(type => {
  dropZone.addEventListener(type, event => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});
dropZone.addEventListener("drop", event => {
  selectedUploadFiles = Array.from(event.dataTransfer?.files || []);
  updateUploadSelection();
});
dropZone.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") uploadInput.click();
});

wireDialogCloseButtons();
updateUploadSelection();
renderAdminState();
loadFiles();
