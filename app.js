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
const folderChips = document.querySelector("#folder-chips");
const tagChips = document.querySelector("#tag-chips");
const tagFilterRow = document.querySelector("#tag-filter-row");
const favoritesToggle = document.querySelector("#favorites-toggle");
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

const memberStatus = document.querySelector("#member-status");
const memberButton = document.querySelector("#member-button");

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
const uploadLimitNote = document.querySelector("#upload-limit-note");
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
const manageTags = document.querySelector("#manage-tags");
const tagsSave = document.querySelector("#tags-save");

const CATEGORY_LABELS = ["전체", "문서", "표", "이미지", "압축", "기타"];
const DOCUMENTS = new Set(["pdf", "hwp", "hwpx", "doc", "docx", "ppt", "pptx", "txt", "md", "rtf"]);
const TABLES = new Set(["xls", "xlsx", "xlsm", "csv", "tsv", "ods"]);
const IMAGES = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tif", "tiff", "heic"]);
const ARCHIVES = new Set(["zip", "7z", "rar", "tar", "gz", "bz2", "xz"]);
const PREVIEWABLE_IMAGES = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);
const PREVIEWABLE_TEXT = new Set(["txt", "md", "csv", "tsv"]);
const MAX_UPLOAD_BYTES = 95 * 1024 * 1024;
const LARGE_FILE_WARNING_BYTES = 50 * 1024 * 1024;
const MEMBER_MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const API_VERSION = "2026-03-10";
const TOKEN_KEY = "documentVault.githubToken";
const FAVORITES_KEY = "documentVault.favorites.v1";
const METADATA_PATH = "metadata.json";
const AUTH_WORKER = "https://optatio-vault-auth.optatio.workers.dev";
const MEMBER_SESSION_KEY = "documentVault.memberSession.v1";

let allFiles = [];
const localPreviewUrls = new Map();
let metadata = { version: 1, files: {} };
let activeCategory = "전체";
let activeFolder = "전체";
let activeTag = "전체";
let favoritesOnly = false;
let favoritePaths = loadFavoritePaths();
let currentPreviewPath = "";
let currentManageFile = null;
let selectedUploadFiles = [];
let imageScale = 1;
let imageRotation = 0;
let toastTimer = null;
let memberSessionToken = sessionStorage.getItem(MEMBER_SESSION_KEY) || "";
let memberUser = null;
let memberAuthLoading = false;

let adminSession = {
  token: sessionStorage.getItem(TOKEN_KEY) || "",
  owner: githubConfig.owner || inferOwner(),
  repo: githubConfig.repo || inferRepo(),
  branch: githubConfig.branch || "main",
  filesDir: normalizeDir(githubConfig.filesDir || "files")
};


function captureMemberSessionFromFragment() {
  if (!window.location.hash) return;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get("vault_session");
  if (!token) return;

  memberSessionToken = token;
  sessionStorage.setItem(MEMBER_SESSION_KEY, token);

  // 세션 토큰이 주소창/복사 링크에 남지 않도록 즉시 fragment를 제거합니다.
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}

function renderMemberState() {
  if (!memberStatus || !memberButton) return;

  memberButton.disabled = memberAuthLoading;

  if (memberAuthLoading) {
    memberStatus.classList.add("hidden");
    memberButton.textContent = "로그인 확인 중…";
    return;
  }

  if (memberUser?.login) {
    memberStatus.textContent = `회원 · @${memberUser.login}`;
    memberStatus.classList.remove("hidden");
    memberButton.textContent = "로그아웃";
    memberButton.title = "이 브라우저 탭의 회원 세션을 종료합니다.";
  } else {
    memberStatus.classList.add("hidden");
    memberStatus.textContent = "";
    memberButton.textContent = "GitHub로 로그인";
    memberButton.title = "GitHub 계정으로 문건함 회원 인증";
  }
}

function clearMemberSession(showMessage = false) {
  memberSessionToken = "";
  memberUser = null;
  sessionStorage.removeItem(MEMBER_SESSION_KEY);
  renderMemberState();
  renderAdminState();
  if (showMessage) showToast("회원 로그아웃이 완료되었습니다.");
}

async function validateMemberSession() {
  if (!memberSessionToken) {
    renderMemberState();
    return false;
  }

  memberAuthLoading = true;
  renderMemberState();

  try {
    const response = await fetch(`${AUTH_WORKER}/api/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${memberSessionToken}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      clearMemberSession(false);
      return false;
    }

    const data = await response.json();
    if (!data?.authenticated || !data?.user?.login) {
      clearMemberSession(false);
      return false;
    }

    memberUser = data.user;
    renderAdminState();
    return true;
  } catch (error) {
    console.warn("회원 세션 확인 실패", error);
    // 네트워크 오류일 때는 세션 자체를 지우지 않습니다.
    memberUser = null;
    return false;
  } finally {
    memberAuthLoading = false;
    renderMemberState();
  }
}

async function initializeMemberAuth() {
  captureMemberSessionFromFragment();
  renderMemberState();

  if (memberSessionToken) {
    const ok = await validateMemberSession();
    if (ok) showToast(`@${memberUser.login} 계정으로 로그인했습니다.`);
  }
}

function handleMemberButton() {
  if (memberAuthLoading) return;

  if (memberUser || memberSessionToken) {
    clearMemberSession(true);
    return;
  }

  window.location.href = `${AUTH_WORKER}/auth/login`;
}

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

function loadFavoritePaths() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter(value => typeof value === "string") : []);
  } catch {
    return new Set();
  }
}

function saveFavoritePaths() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoritePaths]));
}

function isFavorite(path) {
  return favoritePaths.has(path);
}

function toggleFavorite(path) {
  if (favoritePaths.has(path)) favoritePaths.delete(path);
  else favoritePaths.add(path);
  saveFavoritePaths();
  renderFiles();
  updateFavoritesToggle();
}

function moveFavorite(oldPath, newPath) {
  if (!favoritePaths.has(oldPath)) return;
  favoritePaths.delete(oldPath);
  favoritePaths.add(newPath);
  saveFavoritePaths();
}

function removeFavorite(path) {
  if (!favoritePaths.delete(path)) return;
  saveFavoritePaths();
}

function metadataFor(path) {
  return metadata?.files?.[path] || {};
}

function tagsFor(file) {
  const tags = metadataFor(file.path).tags;
  return Array.isArray(tags) ? tags.filter(tag => typeof tag === "string" && tag.trim()).map(tag => tag.trim()) : [];
}

function folderFor(file) {
  const prefix = `${adminSession.filesDir}/`;
  const relative = file.path.startsWith(prefix) ? file.path.slice(prefix.length) : file.path;
  const parts = relative.split("/").filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join("/") : "/";
}

function updateFavoritesToggle() {
  favoritesToggle.classList.toggle("active", favoritesOnly);
  favoritesToggle.setAttribute("aria-pressed", favoritesOnly ? "true" : "false");
  favoritesToggle.textContent = favoritesOnly ? "★ 즐겨찾기만" : "☆ 즐겨찾기";
}

function normalizeRepoPath(value, ensureFilesDir = true) {
  let path = String(value || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/{2,}/g, "/");

  const parts = path.split("/").filter(Boolean);
  if (!parts.length || parts.some(part => part === "." || part === "..")) {
    throw new Error("올바른 파일 경로를 입력해주세요.");
  }

  path = parts.join("/");
  if (ensureFilesDir && path !== adminSession.filesDir && !path.startsWith(`${adminSession.filesDir}/`)) {
    path = `${adminSession.filesDir}/${path}`;
  }
  if (path === adminSession.filesDir) throw new Error("파일 이름까지 포함한 경로가 필요합니다.");
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
  const local = localPreviewUrls.get(file.path);
  if (local) return local;
  return file.path.split("/").map(encodeURIComponent).join("/");
}

function cacheLocalPreview(path, blob) {
  const previous = localPreviewUrls.get(path);
  if (previous) URL.revokeObjectURL(previous);
  localPreviewUrls.set(path, URL.createObjectURL(blob));
}

function removeLocalPreview(path) {
  const previous = localPreviewUrls.get(path);
  if (previous) URL.revokeObjectURL(previous);
  localPreviewUrls.delete(path);
}

function moveLocalPreview(oldPath, newPath) {
  const previous = localPreviewUrls.get(oldPath);
  if (!previous) return;
  const overwritten = localPreviewUrls.get(newPath);
  if (overwritten) URL.revokeObjectURL(overwritten);
  localPreviewUrls.delete(oldPath);
  localPreviewUrls.set(newPath, previous);
}

function isAdmin() {
  return Boolean(adminSession.token);
}

function isMemberEditor() {
  return Boolean(memberUser?.login && memberSessionToken);
}

function canEdit() {
  return isAdmin() || isMemberEditor();
}

function currentUploadMaxBytes() {
  return isAdmin() ? MAX_UPLOAD_BYTES : MEMBER_MAX_UPLOAD_BYTES;
}

function editorModeLabel() {
  if (isAdmin()) return "관리자 모드";
  if (isMemberEditor()) return `회원 편집 · @${memberUser.login}`;
  return "";
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
  const editable = canEdit();
  adminStatus.classList.toggle("hidden", !active);
  adminPanel.classList.toggle("hidden", !editable);
  adminButton.textContent = active ? "관리 설정" : "관리";
  adminDisconnect.classList.toggle("hidden", !active);

  githubOwnerInput.value = adminSession.owner || "";
  githubRepoInput.value = adminSession.repo || "";
  githubBranchInput.value = adminSession.branch || "main";
  githubTokenInput.value = active ? adminSession.token : "";

  if (uploadLimitNote) {
    uploadLimitNote.textContent = isAdmin()
      ? "여러 파일 동시 선택 가능 · 파일당 95 MiB 이하"
      : "회원 편집 · 여러 파일 동시 선택 가능 · 파일당 20 MiB 이하";
  }

  if (deleteSubmit) {
    deleteSubmit.classList.toggle("hidden", !active);
  }

  renderFiles();
}

function renderOrganizer() {
  const folderCounts = new Map();
  const tagCounts = new Map();

  allFiles.forEach(file => {
    const folder = folderFor(file);
    folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
    tagsFor(file).forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
  });

  const folders = [...folderCounts.keys()].sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b, "ko");
  });
  if (activeFolder !== "전체" && !folderCounts.has(activeFolder)) activeFolder = "전체";

  folderChips.innerHTML = [
    `<button type="button" class="filter-chip ${activeFolder === "전체" ? "active" : ""}" data-folder="전체">전체 <span>${allFiles.length}</span></button>`,
    ...folders.map(folder => `<button type="button" class="filter-chip ${activeFolder === folder ? "active" : ""}" data-folder="${escapeHtml(folder)}">${folder === "/" ? "최상위" : escapeHtml(folder)} <span>${folderCounts.get(folder)}</span></button>`)
  ].join("");

  folderChips.querySelectorAll("[data-folder]").forEach(button => {
    button.addEventListener("click", () => {
      activeFolder = button.dataset.folder;
      renderOrganizer();
      renderFiles();
    });
  });

  const tags = [...tagCounts.keys()].sort((a, b) => a.localeCompare(b, "ko"));
  if (activeTag !== "전체" && !tagCounts.has(activeTag)) activeTag = "전체";
  tagFilterRow.classList.toggle("hidden", tags.length === 0);
  tagChips.innerHTML = [
    `<button type="button" class="filter-chip ${activeTag === "전체" ? "active" : ""}" data-tag="전체">전체</button>`,
    ...tags.map(tag => `<button type="button" class="filter-chip ${activeTag === tag ? "active" : ""}" data-tag="${escapeHtml(tag)}">#${escapeHtml(tag)} <span>${tagCounts.get(tag)}</span></button>`)
  ].join("");

  tagChips.querySelectorAll("[data-tag]").forEach(button => {
    button.addEventListener("click", () => {
      activeTag = button.dataset.tag;
      renderOrganizer();
      renderFiles();
    });
  });

  updateFavoritesToggle();
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
    const folderOk = activeFolder === "전체" || folderFor(file) === activeFolder;
    const fileTags = tagsFor(file);
    const tagOk = activeTag === "전체" || fileTags.includes(activeTag);
    const favoriteOk = !favoritesOnly || isFavorite(file.path);
    const haystack = `${file.name} ${file.path} ${file.extension} ${file.category} ${folderFor(file)} ${fileTags.join(" ")}`.toLowerCase();
    return categoryOk && folderOk && tagOk && favoriteOk && (!query || haystack.includes(query));
  });

  const sort = sortSelect.value;
  list.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name, "ko");
    if (sort === "size") return (b.size || 0) - (a.size || 0);
    return new Date(b.modified || 0) - new Date(a.modified || 0) || a.name.localeCompare(b.name, "ko");
  });
  return list;
}

function thumbnailHtml(file) {
  const url = fileUrl(file);
  const ext = (file.extension || extensionFromName(file.name)).toLowerCase();
  if (PREVIEWABLE_IMAGES.has(ext)) {
    return `<div class="file-thumbnail image-thumbnail"><img src="${url}" alt="" loading="lazy" decoding="async" fetchpriority="low" /></div>`;
  }
  // PDF를 카드마다 iframe으로 미리 불러오면 브라우저 PDF 엔진이 여러 번 실행되어
  // 문건함 전체가 크게 느려집니다. PDF 본문은 '보기'를 눌렀을 때만 로드합니다.
  if (ext === "pdf") {
    return `<div class="file-thumbnail generic-thumbnail"><span>PDF</span></div>`;
  }
  return `<div class="file-thumbnail generic-thumbnail"><span>${escapeHtml(extensionOf(file))}</span></div>`;
}

function renderFiles() {
  const list = filteredFiles();
  const filterBits = [];
  if (activeFolder !== "전체") filterBits.push(activeFolder === "/" ? "최상위 폴더" : `폴더 ${activeFolder}`);
  if (activeTag !== "전체") filterBits.push(`#${activeTag}`);
  if (favoritesOnly) filterBits.push("즐겨찾기");
  summary.textContent = `총 ${allFiles.length}개 중 ${list.length}개 표시${filterBits.length ? ` · ${filterBits.join(" · ")}` : ""}${canEdit() ? ` · ${editorModeLabel()}` : ""}`;
  emptyState.classList.toggle("hidden", list.length !== 0);

  grid.innerHTML = list.map(file => {
    const url = fileUrl(file);
    const safeName = escapeHtml(file.name);
    const safePath = escapeHtml(file.path);
    const fileTags = tagsFor(file);
    return `
      <article class="file-card">
        ${thumbnailHtml(file)}
        <div class="file-top">
          <div class="file-type-line">
            <span class="file-badge">${escapeHtml(extensionOf(file))}</span>
            <span class="file-category">${escapeHtml(file.category || "기타")}</span>
          </div>
          <button class="favorite-button ${isFavorite(file.path) ? "active" : ""}" type="button" data-favorite-path="${safePath}" aria-label="${isFavorite(file.path) ? "즐겨찾기 해제" : "즐겨찾기 추가"}">${isFavorite(file.path) ? "★" : "☆"}</button>
        </div>
        <h2 class="file-name">${safeName}</h2>
        <p class="file-path">${escapeHtml(file.path.replace(new RegExp(`^${adminSession.filesDir}/`), ""))}</p>
        ${fileTags.length ? `<div class="file-tags">${fileTags.map(tag => `<button type="button" class="file-tag" data-card-tag="${escapeHtml(tag)}">#${escapeHtml(tag)}</button>`).join("")}</div>` : ""}
        <div class="card-bottom">
          <div class="file-meta">${humanSize(file.size)}<br>${formatDate(file.modified)}</div>
          <div class="card-actions">
            ${canPreview(file) ? `<button class="action-button preview-button" type="button" data-path="${safePath}">보기</button>` : ""}
            <a class="action-button" href="${url}" download>받기</a>
            ${canEdit() ? `<button class="action-button manage-button" type="button" data-path="${safePath}">관리</button>` : ""}
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

  grid.querySelectorAll(".favorite-button").forEach(button => {
    button.addEventListener("click", () => toggleFavorite(button.dataset.favoritePath));
  });

  grid.querySelectorAll(".file-tag").forEach(button => {
    button.addEventListener("click", () => {
      activeTag = button.dataset.cardTag;
      renderOrganizer();
      renderFiles();
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
      previewBody.innerHTML = `<div class="preview-message">브라우저에서 내용을 읽지 못했습니다.<br>다운로드 버튼으로 파일을 열어주세요.</div>`;
    }
    updatePreviewNavigation();
    return;
  }

  previewBody.innerHTML = `<div class="preview-message">이 형식은 브라우저 미리보기를 지원하지 않습니다.<br>다운로드해서 열어주세요.</div>`;
  updatePreviewNavigation();
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const old = button.textContent;
    button.textContent = "복사됨 ✓";
    setTimeout(() => { button.textContent = old; }, 1200);
  } catch {
    window.prompt("아래 주소를 복사해주세요.", text);
  }
}

async function loadMetadata() {
  try {
    const response = await fetch(`./${METADATA_PATH}`, { cache: "no-cache" });
    if (!response.ok) throw new Error("metadata not found");
    const data = await response.json();
    metadata = { version: 1, files: data && typeof data.files === "object" && data.files ? data.files : {} };
  } catch {
    metadata = { version: 1, files: {} };
  }
}

async function loadFiles(showError = true) {
  try {
    const [response] = await Promise.all([
      fetch(`./files.json`, { cache: "no-cache" }),
      loadMetadata()
    ]);
    if (!response.ok) throw new Error("files.json not found");
    const data = await response.json();
    allFiles = Array.isArray(data.files) ? data.files : [];
    renderChips();
    renderOrganizer();
    renderFiles();
    return true;
  } catch (error) {
    if (showError) {
      summary.textContent = "파일 목록을 불러오지 못했습니다.";
      grid.innerHTML = `<div class="preview-message">GitHub Actions가 아직 <code>files.json</code>을 만들지 않았거나 파일을 읽지 못했습니다.</div>`;
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
  if (!adminSession.token) throw new Error("먼저 관리자 연결을 해주세요.");

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

async function memberRequest(path, options = {}) {
  if (!memberSessionToken || !memberUser?.login) throw new Error("GitHub 회원 로그인이 필요합니다.");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${memberSessionToken}`,
    ...options.headers
  };
  const response = await fetch(`${AUTH_WORKER}${path}`, { ...options, headers });
  let payload = null;
  const type = response.headers.get("content-type") || "";
  if (type.includes("application/json")) payload = await response.json().catch(() => null);
  else if (response.status !== 204) payload = await response.text().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.error || `회원 편집 API 오류 (${response.status})`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

async function getContentMeta(path) {
  if (isAdmin()) {
    const query = `?ref=${encodeURIComponent(adminSession.branch)}&t=${Date.now()}`;
    return githubRequest(`${contentApiPath(path)}${query}`);
  }
  return memberRequest(`/api/content-meta?path=${encodeURIComponent(path)}&t=${Date.now()}`);
}

async function getBlobBase64(sha) {
  if (!isAdmin()) throw new Error("이 작업은 관리자 모드에서만 직접 불러올 수 있습니다.");
  const blob = await githubRequest(repoApiPath(`/git/blobs/${encodeURIComponent(sha)}`));
  if (!blob?.content) throw new Error("기존 파일 내용을 불러오지 못했습니다.");
  return blob.content.replace(/\s/g, "");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("파일을 읽지 못했습니다."));
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      if (comma < 0) return reject(new Error("파일 인코딩에 실패했습니다."));
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

async function putFile(path, base64Content, message, sha = null, mode = "upsert") {
  if (isAdmin()) {
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

  return memberRequest("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      content: base64Content,
      message,
      expectedSha: sha || undefined,
      mode
    })
  });
}

async function memberMoveFile(oldPath, newPath) {
  return memberRequest("/api/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldPath, newPath })
  });
}

async function deleteFile(path, sha, message) {
  if (!isAdmin()) throw new Error("파일 삭제는 관리자 모드에서만 가능합니다.");
  return githubRequest(contentApiPath(path), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: adminSession.branch })
  });
}

async function saveMetadataToGitHub(message = "docs: update metadata") {
  let existing = null;
  // 회원 API는 Worker 안에서 최신 SHA를 확인하므로 브라우저에서 같은 조회를 반복하지 않습니다.
  if (isAdmin()) {
    try {
      existing = await getContentMeta(METADATA_PATH);
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
  const serialized = `${JSON.stringify({ version: 1, files: metadata.files || {} }, null, 2)}\n`;
  await putFile(METADATA_PATH, textToBase64(serialized), message, existing?.sha || null, "upsert");
}

function cleanTags(value) {
  const seen = new Set();
  return String(value || "")
    .split(/[,\n]/)
    .map(tag => tag.trim().replace(/^#+/, ""))
    .filter(tag => tag && tag.length <= 30)
    .filter(tag => {
      const key = tag.toLocaleLowerCase("ko");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
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
  renderOrganizer();
  renderFiles();
}

function removeLocalFile(path) {
  allFiles = allFiles.filter(file => file.path !== path);
  renderChips();
  renderOrganizer();
  renderFiles();
}

async function uploadOneFile(file, destinationPath) {
  const maxBytes = currentUploadMaxBytes();
  if (file.size > maxBytes) {
    throw new Error(isAdmin()
      ? `${file.name}: 95 MiB를 넘는 파일은 이 웹 업로더로 업로드할 수 없습니다.`
      : `${file.name}: 회원 업로드는 파일당 20 MiB까지 지원합니다. 더 큰 파일은 관리자 모드를 사용해주세요.`);
  }
  if (isAdmin() && file.size > LARGE_FILE_WARNING_BYTES) {
    const ok = window.confirm(`${file.name}은 ${humanSize(file.size)}입니다. GitHub는 50 MiB 초과 파일을 큰 파일로 경고합니다. 그래도 업로드할까요?`);
    if (!ok) return null;
  }

  let existing = null;
  if (isAdmin()) {
    try {
      existing = await getContentMeta(destinationPath);
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  } else {
    // 회원 업로드는 이미 화면에 있는 목록으로 중복 여부를 먼저 판단합니다.
    // 실제 충돌 검사는 Worker/GitHub가 다시 하므로 안전성은 유지됩니다.
    existing = allFiles.find(item => item.path === destinationPath) || null;
  }

  if (existing) {
    const overwrite = window.confirm(`${destinationPath} 파일이 이미 있습니다. 이 파일로 교체할까요?`);
    if (!overwrite) return null;
  }

  const base64 = await fileToBase64(file);
  await putFile(
    destinationPath,
    base64,
    existing ? `docs(member @${memberUser?.login || "admin"}): replace ${destinationPath}` : `docs(member @${memberUser?.login || "admin"}): upload ${destinationPath}`,
    isAdmin() ? (existing?.sha || null) : null,
    existing ? "replace" : "create"
  );

  cacheLocalPreview(destinationPath, file);
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
    if (changed) showToast(`${changed}개 파일을 GitHub에 반영했습니다.`);
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
  uploadSubmit.disabled = files.length === 0 || !canEdit();
}

async function openManageDialog(file) {
  currentManageFile = file;
  manageTitle.textContent = file.name;
  managePath.value = file.path;
  manageTags.value = tagsFor(file).join(", ");
  replaceInput.value = "";
  manageMessage.textContent = "";
  deleteSubmit.classList.toggle("hidden", !isAdmin());
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
        manageMessage.textContent = `텍스트를 불러오지 못했습니다: ${error.message}`;
      }
    } finally {
      textEditor.disabled = false;
    }
  }
}

async function saveTagsCurrentFile() {
  if (!currentManageFile) return;
  const tags = cleanTags(manageTags.value);
  const path = currentManageFile.path;
  const previous = JSON.parse(JSON.stringify(metadata));

  setButtonBusy(tagsSave, true, "저장 중…");
  manageMessage.textContent = "태그를 저장하는 중입니다…";
  try {
    const current = metadataFor(path);
    if (tags.length) metadata.files[path] = { ...current, tags };
    else {
      const next = { ...current };
      delete next.tags;
      if (Object.keys(next).length) metadata.files[path] = next;
      else delete metadata.files[path];
    }
    await saveMetadataToGitHub(`docs: update tags for ${path}`);
    manageTags.value = tags.join(", ");
    renderOrganizer();
    renderFiles();
    manageMessage.textContent = "태그를 저장했습니다.";
    showToast("태그를 저장했습니다.");
  } catch (error) {
    metadata = previous;
    manageMessage.textContent = `태그 저장 실패: ${error.message}`;
  } finally {
    setButtonBusy(tagsSave, false);
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
    manageMessage.textContent = "경로가 변경되지 않았습니다.";
    return;
  }

  setButtonBusy(renameSubmit, true);
  manageMessage.textContent = "기존 파일을 읽고 새 경로로 옮기는 중입니다…";
  try {
    if (isAdmin()) {
      let targetExists = false;
      try {
        await getContentMeta(newPath);
        targetExists = true;
      } catch (error) {
        if (error.status !== 404) throw error;
      }
      if (targetExists) throw new Error("변경하려는 경로에 이미 파일이 있습니다.");

      const meta = await getContentMeta(oldPath);
      const base64 = await getBlobBase64(meta.sha);
      await putFile(newPath, base64, `docs: move ${oldPath} to ${newPath}`, null, "create");
      await deleteFile(oldPath, meta.sha, `docs: remove old path ${oldPath}`);
    } else {
      // Worker가 대상 경로 충돌과 기존 파일 확인을 한 번에 처리합니다.
      await memberMoveFile(oldPath, newPath);
    }

    const oldMetadata = metadata.files[oldPath];
    if (oldMetadata) {
      metadata.files[newPath] = oldMetadata;
      delete metadata.files[oldPath];
      try {
        await saveMetadataToGitHub(`docs: move metadata ${oldPath} to ${newPath}`);
      } catch (metadataError) {
        showToast(`파일은 이동했지만 태그 정보 저장에 실패했습니다: ${metadataError.message}`, 5200);
      }
    }
    moveFavorite(oldPath, newPath);
    moveLocalPreview(oldPath, newPath);

    const updated = localFileRecord(newPath, currentManageFile.size);
    upsertLocalFile(updated, oldPath);
    currentManageFile = updated;
    manageTitle.textContent = updated.name;
    managePath.value = updated.path;
    manageTags.value = tagsFor(updated).join(", ");
    manageMessage.textContent = "경로와 이름을 변경했습니다.";
    showToast("파일 경로를 변경했습니다.");
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
    manageMessage.textContent = "교체할 파일을 먼저 선택해주세요.";
    return;
  }
  if (replacement.size > currentUploadMaxBytes()) {
    manageMessage.textContent = isAdmin()
      ? "95 MiB를 넘는 파일은 이 웹 업로더로 교체할 수 없습니다."
      : "회원 계정은 20 MiB 이하 파일만 교체할 수 있습니다. 더 큰 파일은 관리자 모드를 사용해주세요.";
    return;
  }

  setButtonBusy(replaceSubmit, true);
  manageMessage.textContent = "파일을 교체하는 중입니다…";
  try {
    const meta = isAdmin() ? await getContentMeta(currentManageFile.path) : null;
    const base64 = await fileToBase64(replacement);
    await putFile(currentManageFile.path, base64, `docs(member @${memberUser?.login || "admin"}): replace ${currentManageFile.path}`, meta?.sha || null, "replace");

    cacheLocalPreview(currentManageFile.path, replacement);
    const updated = localFileRecord(currentManageFile.path, replacement.size);
    upsertLocalFile(updated);
    currentManageFile = updated;
    manageMessage.textContent = "파일을 교체했습니다.";
    replaceInput.value = "";
    showToast("파일을 교체했습니다.");
  } catch (error) {
    manageMessage.textContent = `교체 실패: ${error.message}`;
  } finally {
    setButtonBusy(replaceSubmit, false);
  }
}

async function saveTextCurrentFile() {
  if (!currentManageFile) return;
  setButtonBusy(textSave, true);
  manageMessage.textContent = "텍스트를 저장하는 중입니다…";
  try {
    const meta = isAdmin() ? await getContentMeta(currentManageFile.path) : null;
    const content = textEditor.value;
    await putFile(currentManageFile.path, textToBase64(content), `docs(member @${memberUser?.login || "admin"}): edit ${currentManageFile.path}`, meta?.sha || null, "replace");
    const textBlob = new Blob([content], { type: "text/plain;charset=utf-8" });
    cacheLocalPreview(currentManageFile.path, textBlob);
    const size = textBlob.size;
    const updated = localFileRecord(currentManageFile.path, size);
    upsertLocalFile(updated);
    currentManageFile = updated;
    manageMessage.textContent = "텍스트 내용을 저장했습니다.";
    showToast("텍스트 수정 내용을 저장했습니다.");
  } catch (error) {
    manageMessage.textContent = `저장 실패: ${error.message}`;
  } finally {
    setButtonBusy(textSave, false);
  }
}

async function deleteCurrentFile() {
  if (!currentManageFile) return;
  if (!isAdmin()) {
    manageMessage.textContent = "파일 삭제는 관리자 모드에서만 가능합니다.";
    return;
  }
  const file = currentManageFile;
  const ok = window.confirm(`정말 ${file.name} 파일을 삭제할까요?\nGit 기록에는 남지만 현재 사이트에서는 삭제됩니다.`);
  if (!ok) return;

  setButtonBusy(deleteSubmit, true, "삭제 중…");
  manageMessage.textContent = "삭제하는 중입니다…";
  try {
    const meta = await getContentMeta(file.path);
    await deleteFile(file.path, meta.sha, `docs: delete ${file.path}`);
    if (metadata.files[file.path]) {
      delete metadata.files[file.path];
      try {
        await saveMetadataToGitHub(`docs: remove metadata for ${file.path}`);
      } catch (metadataError) {
        showToast(`파일은 삭제했지만 태그 정보 정리에 실패했습니다: ${metadataError.message}`, 5200);
      }
    }
    removeFavorite(file.path);
    removeLocalPreview(file.path);
    removeLocalFile(file.path);
    manageDialog.close();
    currentManageFile = null;
    showToast("파일을 삭제했습니다.");
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
    adminFormMessage.textContent = "사용자/저장소/토큰을 모두 입력해주세요.";
    return;
  }

  const connectButton = document.querySelector("#admin-connect");
  setButtonBusy(connectButton, true, "확인 중…");
  try {
    await validateAdminConnection();
    sessionStorage.setItem(TOKEN_KEY, adminSession.token);
    adminFormMessage.textContent = "연결되었습니다. 이 탭에서만 관리자 기능이 활성화됩니다.";
    renderAdminState();
    setTimeout(() => adminDialog.close(), 450);
    showToast("관리자 모드를 활성화했습니다.");
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
  adminFormMessage.textContent = "관리자 연결을 종료했습니다.";
  renderAdminState();
  adminDialog.close();
  showToast("관리자 모드를 종료했습니다.");
}

function openAdminDialog() {
  adminFormMessage.textContent = isAdmin() ? "현재 이 탭에 관리자 토큰이 연결되어 있습니다." : "";
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

window.addEventListener("pagehide", () => {
  for (const url of localPreviewUrls.values()) URL.revokeObjectURL(url);
  localPreviewUrls.clear();
});

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
favoritesToggle.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  updateFavoritesToggle();
  renderFiles();
});
previewPrev.addEventListener("click", () => movePreview(-1));
previewNext.addEventListener("click", () => movePreview(1));
zoomOut.addEventListener("click", () => { imageScale = Math.max(0.25, imageScale - 0.25); applyImageTransform(); });
zoomIn.addEventListener("click", () => { imageScale = Math.min(5, imageScale + 0.25); applyImageTransform(); });
zoomReset.addEventListener("click", () => { imageScale = 1; applyImageTransform(); });
rotateImage.addEventListener("click", () => { imageRotation = (imageRotation + 90) % 360; applyImageTransform(); });

memberButton.addEventListener("click", handleMemberButton);
adminButton.addEventListener("click", openAdminDialog);
adminForm.addEventListener("submit", connectAdmin);
adminDisconnect.addEventListener("click", disconnectAdmin);
renameSubmit.addEventListener("click", renameCurrentFile);
replaceSubmit.addEventListener("click", replaceCurrentFile);
textSave.addEventListener("click", saveTextCurrentFile);
tagsSave.addEventListener("click", saveTagsCurrentFile);
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
  showToast(ok ? "files.json 목록을 다시 불러왔습니다." : "목록을 아직 불러오지 못했습니다.");
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
updateFavoritesToggle();
renderAdminState();
initializeMemberAuth();
loadFiles();
