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
const membersButton = document.querySelector("#members-button");
const filesTab = document.querySelector("#files-tab");
const discussionTab = document.querySelector("#discussion-tab");
const chatTab = document.querySelector("#chat-tab");
const chatTabBadge = document.querySelector("#chat-tab-badge");
const filesView = document.querySelector("#files-view");
const discussionView = document.querySelector("#discussion-view");
const discussionList = document.querySelector("#discussion-list");
const discussionEmpty = document.querySelector("#discussion-empty");
const discussionScopeText = document.querySelector("#discussion-scope-text");
const discussionPermission = document.querySelector("#discussion-permission");
const discussionAllButton = document.querySelector("#discussion-all-button");
const discussionClearDocument = document.querySelector("#discussion-clear-document");
const newThreadButton = document.querySelector("#new-thread-button");
const threadFormDialog = document.querySelector("#thread-form-dialog");
const threadForm = document.querySelector("#thread-form");
const threadTitle = document.querySelector("#thread-title");
const threadDocument = document.querySelector("#thread-document");
const threadBody = document.querySelector("#thread-body");
const threadFormMessage = document.querySelector("#thread-form-message");
const threadSubmit = document.querySelector("#thread-submit");
const threadDialog = document.querySelector("#thread-dialog");
const threadDetailTitle = document.querySelector("#thread-detail-title");
const threadDetailMeta = document.querySelector("#thread-detail-meta");
const threadDetailBody = document.querySelector("#thread-detail-body");
const threadDelete = document.querySelector("#thread-delete");
const commentList = document.querySelector("#comment-list");
const commentForm = document.querySelector("#comment-form");
const commentBody = document.querySelector("#comment-body");
const commentSubmit = document.querySelector("#comment-submit");
const commentPermission = document.querySelector("#comment-permission");
const chatView = document.querySelector("#chat-view");
const chatPermission = document.querySelector("#chat-permission");
const newChatButton = document.querySelector("#new-chat-button");
const chatRoomList = document.querySelector("#chat-room-list");
const chatRoomEmpty = document.querySelector("#chat-room-empty");
const chatPlaceholder = document.querySelector("#chat-placeholder");
const chatRoomPanel = document.querySelector("#chat-room-panel");
const chatBackButton = document.querySelector("#chat-back-button");
const chatRoomTitle = document.querySelector("#chat-room-title");
const chatRoomMembers = document.querySelector("#chat-room-members");
const chatMessageList = document.querySelector("#chat-message-list");
const chatComposeForm = document.querySelector("#chat-compose-form");
const chatMessageInput = document.querySelector("#chat-message-input");
const chatImageInput = document.querySelector("#chat-image-input");
const chatImagePreview = document.querySelector("#chat-image-preview");
const chatSendButton = document.querySelector("#chat-send-button");
const newChatDialog = document.querySelector("#new-chat-dialog");
const newChatForm = document.querySelector("#new-chat-form");
const newChatName = document.querySelector("#new-chat-name");
const newChatMembers = document.querySelector("#new-chat-members");
const newChatMessage = document.querySelector("#new-chat-message");
const newChatSubmit = document.querySelector("#new-chat-submit");

const membersDialog = document.querySelector("#members-dialog");
const memberApproveForm = document.querySelector("#member-approve-form");
const memberApproveLogin = document.querySelector("#member-approve-login");
const memberApproveSubmit = document.querySelector("#member-approve-submit");
const membersList = document.querySelector("#members-list");
const membersMessage = document.querySelector("#members-message");

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
let uploadPreviewPanel = null;

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
let currentView = "files";
let discussionDocumentFilter = "";
let chatRooms = [];
let currentChatRoom = null;
let chatLastMessageId = 0;
let chatMessagesLoading = false;
let chatRoomsTimer = null;
let chatMessagesTimer = null;
let pendingChatImage = null;
let pendingChatImageUrl = "";
const chatImageUrls = new Map();
let currentThread = null;
let discussionsLoading = false;
let memberAuthInitialized = false;
let pendingUploadPreviewUrls = [];

let adminSession = {
  token: sessionStorage.getItem(TOKEN_KEY) || "",
  owner: githubConfig.owner || inferOwner(),
  repo: githubConfig.repo || inferRepo(),
  branch: githubConfig.branch || "main",
  filesDir: normalizeDir(githubConfig.filesDir || "files")
};


function captureMemberSessionFromFragment() {
  if (!window.location.hash) return false;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get("vault_session");
  if (!token) return false;

  memberSessionToken = token;
  sessionStorage.setItem(MEMBER_SESSION_KEY, token);

  // 세션 토큰이 주소창/복사 링크에 남지 않도록 즉시 fragment를 제거합니다.
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  return true;
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
    const label = memberUser.admin
      ? "관리자 회원"
      : memberUser.approved
        ? "승인 회원"
        : memberUser.status === "blocked" ? "차단 회원" : "승인 대기";
    memberStatus.textContent = `${label} · @${memberUser.login}`;
    memberStatus.classList.remove("hidden");
    memberButton.textContent = "로그아웃";
    memberButton.title = "이 브라우저 탭의 회원 세션을 종료합니다.";
  } else {
    memberStatus.classList.add("hidden");
    memberStatus.textContent = "";
    memberButton.textContent = "GitHub로 로그인";
    memberButton.title = "GitHub 계정으로 문건함 회원 인증";
  }

  if (membersButton) membersButton.classList.toggle("hidden", !memberUser?.admin);
  renderDiscussionPermission();
  renderChatPermission();
}

function clearMemberSession(showMessage = false) {
  memberSessionToken = "";
  memberUser = null;
  sessionStorage.removeItem(MEMBER_SESSION_KEY);
  renderMemberState();
  renderAdminState();
  stopChatPolling();
  chatRooms = [];
  currentChatRoom = null;
  if (currentView === "chat") renderChatPermission();
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

    memberUser = {
      ...data.user,
      ...(data.member || {}),
      login: data.user.login
    };
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
  if (memberAuthInitialized) return;
  memberAuthInitialized = true;

  const freshLogin = captureMemberSessionFromFragment();
  renderMemberState();

  if (memberSessionToken) {
    const ok = await validateMemberSession();
    // 로그인 직후 한 번만 알리고, 새로고침/재렌더 때는 반복하지 않습니다.
    if (freshLogin && ok) showToast(`@${memberUser.login} 계정으로 로그인했습니다.`);
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

function pagesFileUrl(file) {
  const path = file.path.split("/").map(encodeURIComponent).join("/");
  const version = file.modified ? `?v=${encodeURIComponent(file.modified)}` : "";
  return `${path}${version}`;
}

function rawFileUrl(file) {
  const owner = encodeURIComponent(adminSession.owner || githubConfig.owner || inferOwner());
  const repo = encodeURIComponent(adminSession.repo || githubConfig.repo || inferRepo());
  const branch = encodeURIComponent(adminSession.branch || githubConfig.branch || "main");
  const path = file.path.split("/").map(encodeURIComponent).join("/");
  const version = file.modified ? `?v=${encodeURIComponent(file.modified)}` : "";
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}${version}`;
}

function fileUrlCandidates(file) {
  const candidates = [];
  const local = localPreviewUrls.get(file.path);
  if (local) candidates.push(local);
  candidates.push(rawFileUrl(file), pagesFileUrl(file));
  return [...new Set(candidates.filter(Boolean))];
}

function fileUrl(file) {
  return fileUrlCandidates(file)[0];
}

function bindResilientImage(image, file, onFailure = null) {
  if (!image || !file) return;
  const candidates = fileUrlCandidates(file);
  let index = Math.max(0, candidates.indexOf(image.getAttribute("src")));

  image.addEventListener("error", () => {
    index += 1;
    if (index < candidates.length) {
      image.src = candidates[index];
      return;
    }
    image.classList.add("image-load-failed");
    if (onFailure) onFailure();
  });
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
  return Boolean(memberUser?.login && memberSessionToken && memberUser?.approved && memberUser?.status !== "blocked");
}

function canDiscuss() {
  return isMemberEditor();
}

function canChat() {
  return isMemberEditor();
}

function canEdit() {
  return isAdmin() || isMemberEditor();
}

function currentUploadMaxBytes() {
  return isAdmin() ? MAX_UPLOAD_BYTES : MEMBER_MAX_UPLOAD_BYTES;
}

function editorModeLabel() {
  if (isAdmin()) return "관리자 모드";
  if (isMemberEditor()) return `승인 회원 · @${memberUser.login}`;
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
      : "승인 회원 · 여러 파일 동시 선택 가능 · 파일당 20 MiB 이하";
  }

  if (deleteSubmit) {
    deleteSubmit.classList.toggle("hidden", !editable);
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
    return `<div class="file-thumbnail image-thumbnail"><img src="${url}" data-file-path="${escapeHtml(file.path)}" alt="" loading="lazy" decoding="async" fetchpriority="low" /></div>`;
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
            <button class="action-button discussion-file-button" type="button" data-path="${safePath}">토론</button>
            <a class="action-button" href="${url}" download>받기</a>
            ${canEdit() ? `<button class="action-button manage-button" type="button" data-path="${safePath}">관리</button>` : ""}
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".image-thumbnail img[data-file-path]").forEach(image => {
    const file = allFiles.find(item => item.path === image.dataset.filePath);
    if (file) bindResilientImage(image, file);
  });

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

  grid.querySelectorAll(".discussion-file-button").forEach(button => {
    button.addEventListener("click", () => openDiscussionView(button.dataset.path));
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
  previewCopy.classList.remove("hidden");
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
    const viewerImage = previewBody.querySelector(".viewer-image");
    bindResilientImage(viewerImage, file, () => {
      previewBody.innerHTML = `<div class="preview-message">이미지를 아직 불러오지 못했습니다.<br>잠시 후 다시 열거나 새 탭에서 확인해주세요.</div>`;
    });
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

async function memberDeleteFile(path) {
  return memberRequest("/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path })
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

function revokePendingUploadPreviewUrls() {
  for (const url of pendingUploadPreviewUrls) URL.revokeObjectURL(url);
  pendingUploadPreviewUrls = [];
}

function ensureUploadPreviewPanel() {
  if (uploadPreviewPanel?.isConnected) return uploadPreviewPanel;
  uploadPreviewPanel = document.createElement("div");
  uploadPreviewPanel.id = "upload-preview-panel";
  uploadPreviewPanel.className = "upload-preview-panel hidden";
  uploadPreviewPanel.setAttribute("aria-label", "업로드 전 미리보기");
  dropZone.insertAdjacentElement("afterend", uploadPreviewPanel);
  return uploadPreviewPanel;
}

function openPendingUploadPreview(index) {
  const file = selectedUploadFiles[index];
  if (!file) return;
  const ext = extensionFromName(file.name);
  if (!PREVIEWABLE_IMAGES.has(ext)) return;

  const url = URL.createObjectURL(file);
  previewTitle.textContent = `${file.name} · 업로드 전 미리보기`;
  previewDownload.href = url;
  previewDownload.setAttribute("download", file.name);
  previewOpen.href = url;
  previewCopy.dataset.url = "";
  previewCopy.classList.add("hidden");
  currentPreviewPath = "";
  imageTools.classList.remove("hidden");
  previewToolbar.classList.remove("hidden");
  resetImageTransform();
  previewBody.innerHTML = `<div class="image-stage"><img class="viewer-image" src="${url}" alt="${escapeHtml(file.name)}" /></div>`;
  if (!previewDialog.open) previewDialog.showModal();
  applyImageTransform();

  const cleanup = () => {
    URL.revokeObjectURL(url);
    previewCopy.classList.remove("hidden");
    previewDialog.removeEventListener("close", cleanup);
  };
  previewDialog.addEventListener("close", cleanup);
}

function renderUploadSelectionPreview() {
  const panel = ensureUploadPreviewPanel();
  revokePendingUploadPreviewUrls();

  if (!selectedUploadFiles.length) {
    panel.innerHTML = "";
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");
  const items = selectedUploadFiles.map((file, index) => {
    const ext = extensionFromName(file.name);
    let visual = `<div class="upload-preview-generic">${escapeHtml((ext || "FILE").toUpperCase().slice(0, 6))}</div>`;
    let previewClass = "";

    if (PREVIEWABLE_IMAGES.has(ext)) {
      const url = URL.createObjectURL(file);
      pendingUploadPreviewUrls.push(url);
      visual = `<img src="${url}" alt="${escapeHtml(file.name)}" />`;
      previewClass = " upload-preview-clickable";
    } else if (IMAGES.has(ext)) {
      visual = `<div class="upload-preview-generic"><span>IMG</span><small>브라우저 미리보기 미지원</small></div>`;
    }

    return `<article class="upload-preview-item${previewClass}" data-upload-preview-index="${index}">
      <div class="upload-preview-visual">${visual}</div>
      <div class="upload-preview-info">
        <strong title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</strong>
        <span>${humanSize(file.size)}</span>
      </div>
      <button class="upload-preview-remove" type="button" data-remove-upload-index="${index}" aria-label="${escapeHtml(file.name)} 선택 해제">×</button>
    </article>`;
  }).join("");

  panel.innerHTML = `<div class="upload-preview-head"><strong>업로드 전 미리보기</strong><span>이미지를 누르면 크게 볼 수 있습니다.</span></div><div class="upload-preview-grid">${items}</div>`;

  panel.querySelectorAll(".upload-preview-clickable").forEach(item => {
    item.addEventListener("click", event => {
      if (event.target.closest(".upload-preview-remove")) return;
      openPendingUploadPreview(Number(item.dataset.uploadPreviewIndex));
    });
  });

  panel.querySelectorAll(".upload-preview-remove").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeUploadIndex);
      selectedUploadFiles.splice(index, 1);
      updateUploadSelection();
    });
  });
}

function updateUploadSelection() {
  const files = selectedUploadFiles;
  uploadSelection.textContent = files.length
    ? `${files.length}개 선택 · ${humanSize(files.reduce((sum, file) => sum + file.size, 0))}`
    : "선택된 파일 없음";
  uploadSubmit.disabled = files.length === 0 || !canEdit();
  renderUploadSelectionPreview();
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
  if (!canEdit()) {
    manageMessage.textContent = "관리자가 승인한 회원만 파일을 삭제할 수 있습니다.";
    return;
  }
  const file = currentManageFile;
  const ok = window.confirm(`정말 ${file.name} 파일을 삭제할까요?\nGit 기록에는 남지만 현재 사이트에서는 삭제됩니다.`);
  if (!ok) return;

  setButtonBusy(deleteSubmit, true, "삭제 중…");
  manageMessage.textContent = "삭제하는 중입니다…";
  try {
    if (isAdmin()) {
      const meta = await getContentMeta(file.path);
      await deleteFile(file.path, meta.sha, `docs: delete ${file.path}`);
    } else {
      await memberDeleteFile(file.path);
    }

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

function setView(view) {
  currentView = ["discussion", "chat"].includes(view) ? view : "files";
  const filesActive = currentView === "files";
  const discussionActive = currentView === "discussion";
  const chatActive = currentView === "chat";

  filesView.classList.toggle("hidden", !filesActive);
  discussionView.classList.toggle("hidden", !discussionActive);
  chatView.classList.toggle("hidden", !chatActive);
  filesTab.classList.toggle("active", filesActive);
  discussionTab.classList.toggle("active", discussionActive);
  chatTab.classList.toggle("active", chatActive);
  filesTab.setAttribute("aria-pressed", String(filesActive));
  discussionTab.setAttribute("aria-pressed", String(discussionActive));
  chatTab.setAttribute("aria-pressed", String(chatActive));

  if (discussionActive) loadDiscussions();
  if (chatActive) openChatView();
  else stopChatPolling();
}

function renderDiscussionPermission() {
  if (!discussionPermission || !newThreadButton) return;
  newThreadButton.classList.toggle("hidden", !canDiscuss());
  if (!memberUser?.login) {
    discussionPermission.textContent = "토론 작성은 GitHub 로그인 후 관리자 승인이 필요합니다.";
  } else if (memberUser.status === "blocked") {
    discussionPermission.textContent = "현재 이 계정은 토론 작성 권한이 차단되어 있습니다.";
  } else if (!memberUser.approved) {
    discussionPermission.textContent = "로그인되었습니다. 관리자 승인 후 토론 작성과 문서 편집이 활성화됩니다.";
  } else {
    discussionPermission.textContent = `@${memberUser.login} · 토론 작성 가능`;
  }
}

function openDiscussionView(documentPath = "") {
  discussionDocumentFilter = documentPath || "";
  if (discussionDocumentFilter) {
    const file = allFiles.find(item => item.path === discussionDocumentFilter);
    discussionScopeText.textContent = `${file?.name || discussionDocumentFilter} 문서에 대한 토론입니다.`;
    discussionClearDocument.classList.remove("hidden");
    discussionAllButton.classList.remove("active");
  } else {
    discussionScopeText.textContent = "문건함 전체 토론입니다. 읽기는 누구나 가능하고, 작성은 승인된 회원만 가능합니다.";
    discussionClearDocument.classList.add("hidden");
    discussionAllButton.classList.add("active");
  }
  setView("discussion");
}


function renderChatPermission() {
  if (!chatPermission || !newChatButton) return;
  const approved = canChat();
  newChatButton.classList.toggle("hidden", !approved);
  chatComposeForm?.classList.toggle("chat-compose-disabled", !approved);
  if (!memberUser?.login) {
    chatPermission.textContent = "채팅은 GitHub 로그인 후 관리자 승인이 필요합니다.";
  } else if (memberUser.status === "blocked") {
    chatPermission.textContent = "현재 이 계정은 채팅 이용이 차단되어 있습니다.";
  } else if (!memberUser.approved) {
    chatPermission.textContent = "로그인되었습니다. 관리자 승인 후 채팅을 이용할 수 있습니다.";
  } else {
    chatPermission.textContent = `@${memberUser.login} · 채팅 가능`;
  }
}

function stopChatPolling() {
  if (chatRoomsTimer) clearInterval(chatRoomsTimer);
  if (chatMessagesTimer) clearInterval(chatMessagesTimer);
  chatRoomsTimer = null;
  chatMessagesTimer = null;
}

async function openChatView() {
  renderChatPermission();
  stopChatPolling();
  if (!canChat()) {
    chatRoomList.innerHTML = "";
    chatRoomEmpty.classList.remove("hidden");
    chatRoomEmpty.textContent = memberUser?.login ? "관리자 승인 후 채팅을 이용할 수 있습니다." : "로그인 후 승인된 회원만 채팅을 이용할 수 있습니다.";
    chatPlaceholder.classList.remove("hidden");
    chatRoomPanel.classList.add("hidden");
    updateChatTabBadge(0);
    return;
  }
  chatRoomEmpty.classList.add("hidden");
  await loadChatRooms();
  chatRoomsTimer = setInterval(() => {
    if (currentView === "chat" && canChat()) loadChatRooms(true);
  }, 5000);
  chatMessagesTimer = setInterval(() => {
    if (currentView === "chat" && currentChatRoom && canChat()) loadChatMessages(true);
  }, 1800);
}

function updateChatTabBadge(count) {
  const total = Math.max(0, Number(count || 0));
  chatTabBadge.textContent = total > 99 ? "99+" : String(total);
  chatTabBadge.classList.toggle("hidden", total === 0);
}

function formatChatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(date);
}

function formatChatRoomTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return formatChatTime(value);
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

async function loadChatRooms(silent = false) {
  if (!canChat()) return;
  if (!silent) chatRoomList.innerHTML = `<div class="preview-message">채팅방을 불러오는 중…</div>`;
  try {
    const data = await memberRequest("/api/chat/rooms");
    chatRooms = data?.rooms || [];
    const unread = chatRooms.reduce((sum, room) => sum + Number(room.unread_count || 0), 0);
    updateChatTabBadge(unread);
    renderChatRooms();
    if (currentChatRoom) {
      const fresh = chatRooms.find(room => room.id === currentChatRoom.id);
      if (fresh) {
        currentChatRoom = fresh;
        renderChatRoomHeader();
      }
    }
  } catch (error) {
    if (!silent) chatRoomList.innerHTML = `<div class="preview-message">채팅방을 불러오지 못했습니다.<br>${escapeHtml(error.message)}</div>`;
  }
}

function roomAvatarHtml(room) {
  if (room.type === "public") return `<span class="chat-room-avatar chat-room-avatar-public">#</span>`;
  const others = (room.members || []).filter(m => String(m.login).toLowerCase() !== String(memberUser?.login || "").toLowerCase());
  const first = others[0];
  if (first?.avatar_url) return `<img class="chat-room-avatar" src="${escapeHtml(first.avatar_url)}" alt="" loading="lazy" />`;
  return `<span class="chat-room-avatar">@</span>`;
}

function renderChatRooms() {
  if (!chatRooms.length) {
    chatRoomList.innerHTML = "";
    chatRoomEmpty.classList.remove("hidden");
    return;
  }
  chatRoomEmpty.classList.add("hidden");
  chatRoomList.innerHTML = chatRooms.map(room => {
    const preview = room.last_has_image && !room.last_message ? "사진" : room.last_message || "아직 메시지가 없습니다.";
    const active = currentChatRoom?.id === room.id ? " active" : "";
    return `<button class="chat-room-item${active}" type="button" data-room-id="${room.id}">
      ${roomAvatarHtml(room)}
      <span class="chat-room-copy"><strong>${escapeHtml(room.name)}</strong><span>${escapeHtml(preview)}</span></span>
      <span class="chat-room-meta"><time>${escapeHtml(formatChatRoomTime(room.updated_at))}</time>${Number(room.unread_count || 0) ? `<b>${Math.min(99, Number(room.unread_count))}</b>` : ""}</span>
    </button>`;
  }).join("");
  chatRoomList.querySelectorAll(".chat-room-item").forEach(button => {
    button.addEventListener("click", () => selectChatRoom(Number(button.dataset.roomId)));
  });
}

function renderChatRoomHeader() {
  if (!currentChatRoom) return;
  chatRoomTitle.textContent = currentChatRoom.name;
  const members = (currentChatRoom.members || []).map(m => `@${m.login}`);
  chatRoomMembers.textContent = currentChatRoom.type === "public" ? "승인 회원 전체" : `${members.length}명 · ${members.join(", ")}`;
}

async function selectChatRoom(roomId) {
  const room = chatRooms.find(item => item.id === roomId);
  if (!room) return;
  currentChatRoom = room;
  chatLastMessageId = 0;
  chatMessageList.innerHTML = `<div class="preview-message">메시지를 불러오는 중…</div>`;
  chatPlaceholder.classList.add("hidden");
  chatRoomPanel.classList.remove("hidden");
  chatView.classList.add("room-open");
  renderChatRoomHeader();
  renderChatRooms();
  await loadChatMessages(false);
  chatMessageInput.focus();
}

function closeChatRoomMobile() {
  chatView.classList.remove("room-open");
}

async function loadChatMessages(incremental = false) {
  if (!currentChatRoom || chatMessagesLoading || !canChat()) return;
  chatMessagesLoading = true;
  try {
    const after = incremental ? chatLastMessageId : 0;
    const data = await memberRequest(`/api/chat/rooms/${currentChatRoom.id}/messages?after=${after}`);
    const messages = data?.messages || [];
    if (!incremental) {
      chatMessageList.innerHTML = "";
      chatLastMessageId = 0;
    }
    if (messages.length) {
      const nearBottom = chatMessageList.scrollHeight - chatMessageList.scrollTop - chatMessageList.clientHeight < 120;
      appendChatMessages(messages);
      chatLastMessageId = Math.max(chatLastMessageId, ...messages.map(m => Number(m.id || 0)));
      await markCurrentChatRead();
      if (!incremental || nearBottom) chatMessageList.scrollTop = chatMessageList.scrollHeight;
      if (incremental) loadChatRooms(true);
    } else if (!incremental && !chatMessageList.children.length) {
      chatMessageList.innerHTML = `<div class="chat-empty-messages">첫 메시지를 보내보세요.</div>`;
    }
  } catch (error) {
    if (!incremental) chatMessageList.innerHTML = `<div class="preview-message">메시지를 불러오지 못했습니다.<br>${escapeHtml(error.message)}</div>`;
  } finally {
    chatMessagesLoading = false;
  }
}

function appendChatMessages(messages) {
  const empty = chatMessageList.querySelector(".chat-empty-messages, .preview-message");
  if (empty) empty.remove();
  const html = messages.map(message => {
    const mine = String(message.author_login).toLowerCase() === String(memberUser?.login || "").toLowerCase();
    const deleted = Boolean(message.deleted);
    const avatar = !mine && message.avatar_url ? `<img class="chat-message-avatar" src="${escapeHtml(message.avatar_url)}" alt="" loading="lazy" />` : (!mine ? `<span class="chat-message-avatar chat-avatar-fallback">@</span>` : "");
    const image = message.has_image && !deleted ? `<button class="chat-message-image-wrap" type="button"><img class="chat-message-image" data-message-id="${message.id}" alt="${escapeHtml(message.image_name || "채팅 이미지")}" /></button>` : "";
    const body = message.body ? `<div class="chat-bubble${deleted ? " deleted" : ""}">${escapeHtml(message.body).replace(/\n/g, "<br>")}</div>` : "";
    const canDelete = !deleted && (mine || memberUser?.admin);
    return `<article class="chat-message-row ${mine ? "mine" : "other"}" data-message-id="${message.id}">
      ${avatar}
      <div class="chat-message-stack">
        ${!mine ? `<span class="chat-message-author">@${escapeHtml(message.author_login)}</span>` : ""}
        <div class="chat-message-line">
          ${mine ? `<span class="chat-message-time">${escapeHtml(formatChatTime(message.created_at))}</span>` : ""}
          <div class="chat-message-content">${image}${body}</div>
          ${!mine ? `<span class="chat-message-time">${escapeHtml(formatChatTime(message.created_at))}</span>` : ""}
        </div>
        ${canDelete ? `<button class="chat-message-delete" type="button" data-message-id="${message.id}">삭제</button>` : ""}
      </div>
    </article>`;
  }).join("");
  chatMessageList.insertAdjacentHTML("beforeend", html);
  hydrateChatImages(messages);
  chatMessageList.querySelectorAll(".chat-message-delete").forEach(button => {
    if (button.dataset.bound) return;
    button.dataset.bound = "1";
    button.addEventListener("click", () => deleteChatMessage(Number(button.dataset.messageId)));
  });
}

async function fetchChatImageObjectUrl(messageId) {
  if (chatImageUrls.has(messageId)) return chatImageUrls.get(messageId);
  const response = await fetch(`${AUTH_WORKER}/api/chat/messages/${messageId}/image`, {
    headers: { Authorization: `Bearer ${memberSessionToken}` }, cache: "force-cache"
  });
  if (!response.ok) throw new Error("이미지를 불러오지 못했습니다.");
  const url = URL.createObjectURL(await response.blob());
  chatImageUrls.set(messageId, url);
  return url;
}

function hydrateChatImages(messages) {
  for (const message of messages) {
    if (!message.has_image || message.deleted) continue;
    const image = chatMessageList.querySelector(`.chat-message-image[data-message-id="${message.id}"]`);
    if (!image || image.dataset.loaded) continue;
    image.dataset.loaded = "1";
    fetchChatImageObjectUrl(message.id).then(url => { image.src = url; }).catch(() => { image.alt = "이미지를 불러오지 못했습니다."; });
    image.closest(".chat-message-image-wrap")?.addEventListener("click", async () => {
      try {
        const url = await fetchChatImageObjectUrl(message.id);
        previewTitle.textContent = message.image_name || "채팅 이미지";
        previewBody.innerHTML = `<div class="image-stage"><img src="${url}" alt="채팅 이미지" /></div>`;
        previewToolbar.classList.add("hidden");
        previewOpen.href = url;
        previewDownload.href = url;
        previewDownload.download = message.image_name || "chat-image";
        previewCopy.dataset.url = "";
        previewCopy.classList.add("hidden");
        previewDialog.showModal();
      } catch (error) { showToast(error.message); }
    });
  }
}

async function markCurrentChatRead() {
  if (!currentChatRoom || !chatLastMessageId) return;
  try {
    await memberRequest(`/api/chat/rooms/${currentChatRoom.id}/read`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageId: chatLastMessageId })
    });
  } catch { /* 다음 갱신 때 다시 시도 */ }
}

function fileToBase64Payload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
    reader.onerror = () => reject(reader.error || new Error("이미지를 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
}

function clearPendingChatImage() {
  pendingChatImage = null;
  chatImageInput.value = "";
  if (pendingChatImageUrl) URL.revokeObjectURL(pendingChatImageUrl);
  pendingChatImageUrl = "";
  chatImagePreview.classList.add("hidden");
  chatImagePreview.innerHTML = "";
}

function handleChatImageSelected() {
  const file = chatImageInput.files?.[0];
  clearPendingChatImage();
  if (!file) return;
  if (!/^image\/(jpeg|png|gif|webp)$/i.test(file.type)) { showToast("JPG, PNG, GIF, WebP 이미지만 첨부할 수 있습니다."); return; }
  if (file.size > 1200 * 1024) { showToast("채팅 이미지는 1.2 MiB 이하로 올려주세요."); return; }
  pendingChatImage = file;
  pendingChatImageUrl = URL.createObjectURL(file);
  chatImagePreview.innerHTML = `<img src="${pendingChatImageUrl}" alt="첨부 이미지 미리보기" /><span>${escapeHtml(file.name)}</span><button id="chat-image-remove" type="button">×</button>`;
  chatImagePreview.classList.remove("hidden");
  chatImagePreview.querySelector("#chat-image-remove").addEventListener("click", clearPendingChatImage);
}

async function submitChatMessage(event) {
  event.preventDefault();
  if (!currentChatRoom || !canChat()) return;
  const body = chatMessageInput.value.trim();
  if (!body && !pendingChatImage) return;
  setButtonBusy(chatSendButton, true, "전송 중…");
  try {
    let image = null;
    if (pendingChatImage) image = { name: pendingChatImage.name, mime: pendingChatImage.type, data: await fileToBase64Payload(pendingChatImage) };
    const data = await memberRequest(`/api/chat/rooms/${currentChatRoom.id}/messages`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body, image })
    });
    chatMessageInput.value = "";
    chatMessageInput.style.height = "auto";
    clearPendingChatImage();
    if (data?.message) {
      appendChatMessages([data.message]);
      chatLastMessageId = Math.max(chatLastMessageId, Number(data.message.id || 0));
      chatMessageList.scrollTop = chatMessageList.scrollHeight;
    }
    loadChatRooms(true);
  } catch (error) {
    showToast(error.message, 4200);
  } finally {
    setButtonBusy(chatSendButton, false);
  }
}

async function deleteChatMessage(messageId) {
  if (!window.confirm("이 메시지를 삭제할까요?")) return;
  try {
    await memberRequest(`/api/chat/messages/${messageId}`, { method: "DELETE" });
    await loadChatMessages(false);
    loadChatRooms(true);
  } catch (error) { showToast(error.message, 4200); }
}

async function openNewChatDialog() {
  if (!canChat()) return;
  newChatMessage.textContent = "";
  newChatMembers.innerHTML = `<div class="preview-message">회원 목록을 불러오는 중…</div>`;
  newChatDialog.showModal();
  try {
    const data = await memberRequest("/api/chat/members");
    const members = (data?.members || []).filter(m => !m.self);
    newChatMembers.innerHTML = members.map(member => `
      <label class="new-chat-member">
        <input type="checkbox" value="${escapeHtml(member.login)}" />
        ${member.avatar_url ? `<img src="${escapeHtml(member.avatar_url)}" alt="" />` : `<span class="chat-room-avatar">@</span>`}
        <span><strong>@${escapeHtml(member.login)}</strong>${member.admin ? `<small>관리자</small>` : ""}</span>
      </label>`).join("") || `<p class="discussion-muted">함께 채팅할 다른 승인 회원이 아직 없습니다.</p>`;
  } catch (error) { newChatMembers.innerHTML = ""; newChatMessage.textContent = error.message; }
}

async function submitNewChat(event) {
  event.preventDefault();
  const members = Array.from(newChatMembers.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
  if (!members.length) { newChatMessage.textContent = "대화할 회원을 선택해주세요."; return; }
  setButtonBusy(newChatSubmit, true, "생성 중…");
  try {
    const data = await memberRequest("/api/chat/rooms", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ members, name: newChatName.value.trim() })
    });
    newChatDialog.close();
    newChatName.value = "";
    await loadChatRooms();
    if (data?.room?.id) selectChatRoom(Number(data.room.id));
  } catch (error) { newChatMessage.textContent = error.message; }
  finally { setButtonBusy(newChatSubmit, false); }
}

async function publicWorkerRequest(path, options = {}) {
  const response = await fetch(`${AUTH_WORKER}${path}`, {
    ...options,
    headers: { Accept: "application/json", ...(options.headers || {}) },
    cache: "no-store"
  });
  const type = response.headers.get("content-type") || "";
  const payload = type.includes("application/json") ? await response.json().catch(() => null) : null;
  if (!response.ok) throw new Error(payload?.error || `토론 API 오류 (${response.status})`);
  return payload;
}

function discussionAuthorHtml(login, avatarUrl, date) {
  const avatar = avatarUrl
    ? `<img class="discussion-avatar" src="${escapeHtml(avatarUrl)}" alt="" loading="lazy" />`
    : `<span class="discussion-avatar discussion-avatar-fallback">@</span>`;
  return `<div class="discussion-author">${avatar}<span>@${escapeHtml(login || "unknown")}</span><time>${escapeHtml(formatDate(date))}</time></div>`;
}

async function loadDiscussions() {
  if (discussionsLoading) return;
  discussionsLoading = true;
  discussionList.innerHTML = `<div class="preview-message">토론을 불러오는 중…</div>`;
  discussionEmpty.classList.add("hidden");
  try {
    const query = discussionDocumentFilter ? `?document=${encodeURIComponent(discussionDocumentFilter)}` : "";
    const data = await publicWorkerRequest(`/api/discussions${query}`);
    const threads = data?.threads || [];
    if (!threads.length) {
      discussionList.innerHTML = "";
      discussionEmpty.classList.remove("hidden");
      return;
    }
    discussionList.innerHTML = threads.map(thread => `
      <article class="discussion-card" data-thread-id="${thread.id}" tabindex="0">
        <div class="discussion-card-top">
          <h3>${escapeHtml(thread.title)}</h3>
          <span class="discussion-count">댓글 ${Number(thread.comment_count || 0)}</span>
        </div>
        ${discussionAuthorHtml(thread.author_login, thread.avatar_url, thread.updated_at)}
        ${thread.document_path ? `<button class="discussion-document-link" type="button" data-discussion-document="${escapeHtml(thread.document_path)}">문서 · ${escapeHtml(thread.document_path.replace(/^files\//, ""))}</button>` : ""}
        <p>${escapeHtml(String(thread.body || "").slice(0, 240))}${String(thread.body || "").length > 240 ? "…" : ""}</p>
      </article>
    `).join("");
    discussionList.querySelectorAll(".discussion-card").forEach(card => {
      card.addEventListener("click", event => {
        if (event.target.closest(".discussion-document-link")) return;
        openThread(Number(card.dataset.threadId));
      });
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") openThread(Number(card.dataset.threadId));
      });
    });
    discussionList.querySelectorAll(".discussion-document-link").forEach(button => {
      button.addEventListener("click", () => openDiscussionView(button.dataset.discussionDocument));
    });
  } catch (error) {
    discussionList.innerHTML = `<div class="preview-message">토론을 불러오지 못했습니다.<br>${escapeHtml(error.message)}</div>`;
  } finally {
    discussionsLoading = false;
  }
}

function openNewThread(documentPath = discussionDocumentFilter) {
  if (!canDiscuss()) {
    showToast("관리자 승인 후 토론을 작성할 수 있습니다.");
    return;
  }
  threadForm.reset();
  threadDocument.value = documentPath || "";
  threadFormMessage.textContent = "";
  threadFormDialog.showModal();
}

async function submitThread(event) {
  event.preventDefault();
  if (!canDiscuss()) return;
  setButtonBusy(threadSubmit, true, "등록 중…");
  threadFormMessage.textContent = "";
  try {
    const data = await memberRequest("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: threadTitle.value,
        body: threadBody.value,
        documentPath: threadDocument.value
      })
    });
    threadFormDialog.close();
    showToast("토론을 등록했습니다.");
    await loadDiscussions();
    if (data?.thread?.id) openThread(Number(data.thread.id));
  } catch (error) {
    threadFormMessage.textContent = error.message;
  } finally {
    setButtonBusy(threadSubmit, false);
  }
}

function canDeleteDiscussionItem(authorLogin) {
  if (!memberUser?.login || !canDiscuss()) return false;
  return Boolean(memberUser.admin || String(authorLogin || "").toLowerCase() === String(memberUser.login).toLowerCase());
}

async function openThread(id) {
  if (!threadDialog.open) threadDialog.showModal();
  threadDetailTitle.textContent = "토론을 불러오는 중…";
  threadDetailMeta.innerHTML = "";
  threadDetailBody.textContent = "";
  commentList.innerHTML = `<div class="preview-message">불러오는 중…</div>`;
  try {
    const data = await publicWorkerRequest(`/api/discussions/${id}`);
    currentThread = data.thread;
    threadDetailTitle.textContent = currentThread.title;
    threadDetailMeta.innerHTML = discussionAuthorHtml(currentThread.author_login, currentThread.avatar_url, currentThread.created_at)
      + (currentThread.document_path ? `<button class="discussion-document-link thread-document-link" type="button" data-discussion-document="${escapeHtml(currentThread.document_path)}">관련 문서 · ${escapeHtml(currentThread.document_path.replace(/^files\//, ""))}</button>` : "");
    threadDetailBody.textContent = currentThread.body;
    threadDelete.classList.toggle("hidden", !canDeleteDiscussionItem(currentThread.author_login));
    renderComments(data.comments || []);
    commentForm.classList.toggle("hidden", !canDiscuss());
    commentPermission.textContent = canDiscuss()
      ? ""
      : memberUser?.login ? "관리자 승인 후 댓글을 작성할 수 있습니다." : "댓글 작성은 로그인 및 관리자 승인이 필요합니다.";
    const docButton = threadDetailMeta.querySelector(".thread-document-link");
    if (docButton) docButton.addEventListener("click", () => {
      threadDialog.close();
      openDiscussionView(docButton.dataset.discussionDocument);
    });
  } catch (error) {
    threadDetailTitle.textContent = "토론을 불러오지 못했습니다";
    threadDetailBody.textContent = error.message;
    commentList.innerHTML = "";
  }
}

function renderComments(comments) {
  if (!comments.length) {
    commentList.innerHTML = `<p class="discussion-muted">아직 댓글이 없습니다.</p>`;
    return;
  }
  commentList.innerHTML = comments.map(comment => `
    <article class="comment-item">
      <div class="comment-head">
        ${discussionAuthorHtml(comment.author_login, comment.avatar_url, comment.created_at)}
        ${canDeleteDiscussionItem(comment.author_login) ? `<button class="text-button comment-delete" type="button" data-comment-id="${comment.id}">삭제</button>` : ""}
      </div>
      <p>${escapeHtml(comment.body)}</p>
    </article>
  `).join("");
  commentList.querySelectorAll(".comment-delete").forEach(button => {
    button.addEventListener("click", async () => {
      if (!window.confirm("이 댓글을 삭제할까요?")) return;
      try {
        await memberRequest(`/api/comments/${button.dataset.commentId}`, { method: "DELETE" });
        await openThread(currentThread.id);
      } catch (error) {
        showToast(error.message, 4200);
      }
    });
  });
}

async function submitComment(event) {
  event.preventDefault();
  if (!currentThread || !canDiscuss()) return;
  setButtonBusy(commentSubmit, true, "등록 중…");
  try {
    await memberRequest(`/api/discussions/${currentThread.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: commentBody.value })
    });
    commentBody.value = "";
    await openThread(currentThread.id);
    await loadDiscussions();
  } catch (error) {
    showToast(error.message, 4200);
  } finally {
    setButtonBusy(commentSubmit, false);
  }
}

async function deleteCurrentThread() {
  if (!currentThread || !canDeleteDiscussionItem(currentThread.author_login)) return;
  if (!window.confirm("이 토론과 모든 댓글을 삭제할까요?")) return;
  try {
    await memberRequest(`/api/discussions/${currentThread.id}`, { method: "DELETE" });
    threadDialog.close();
    currentThread = null;
    showToast("토론을 삭제했습니다.");
    await loadDiscussions();
  } catch (error) {
    showToast(error.message, 4200);
  }
}

async function openMembersDialog() {
  if (!memberUser?.admin) return;
  membersDialog.showModal();
  await loadMembers();
}

async function loadMembers() {
  if (!memberUser?.admin) return;
  membersMessage.textContent = "";
  membersList.innerHTML = `<div class="preview-message">회원 목록을 불러오는 중…</div>`;
  try {
    const data = await memberRequest("/api/admin/members");
    const members = data?.members || [];
    membersList.innerHTML = members.map(member => {
      const statusLabel = member.admin ? "관리자" : member.status === "approved" ? "승인" : member.status === "blocked" ? "차단" : "대기";
      const avatar = member.avatar_url ? `<img class="discussion-avatar" src="${escapeHtml(member.avatar_url)}" alt="" />` : `<span class="discussion-avatar discussion-avatar-fallback">@</span>`;
      return `<div class="member-row">
        <div class="member-identity">${avatar}<div><strong>@${escapeHtml(member.github_login)}</strong><span>${statusLabel}</span></div></div>
        <div class="member-actions">
          ${member.admin ? `<span class="member-admin-label">관리자</span>` : `
            <button class="text-button member-status-action" type="button" data-login="${escapeHtml(member.github_login)}" data-status="approved">승인</button>
            <button class="text-button member-status-action" type="button" data-login="${escapeHtml(member.github_login)}" data-status="pending">대기</button>
            <button class="text-button member-status-action danger-text" type="button" data-login="${escapeHtml(member.github_login)}" data-status="blocked">차단</button>`}
        </div>
      </div>`;
    }).join("") || `<p class="discussion-muted">등록된 회원이 없습니다.</p>`;
    membersList.querySelectorAll(".member-status-action").forEach(button => {
      button.addEventListener("click", () => updateMemberStatus(button.dataset.login, button.dataset.status));
    });
  } catch (error) {
    membersList.innerHTML = "";
    membersMessage.textContent = error.message;
  }
}

async function updateMemberStatus(login, status) {
  if (!memberUser?.admin) return;
  try {
    await memberRequest("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, status })
    });
    showToast(status === "approved" ? `@${login} 님을 승인했습니다.` : status === "blocked" ? `@${login} 님을 차단했습니다.` : `@${login} 님을 승인 대기로 변경했습니다.`);
    await loadMembers();
  } catch (error) {
    membersMessage.textContent = error.message;
  }
}

async function approveMemberFromForm(event) {
  event.preventDefault();
  const login = memberApproveLogin.value.trim();
  if (!login) return;
  setButtonBusy(memberApproveSubmit, true, "승인 중…");
  try {
    await updateMemberStatus(login, "approved");
    memberApproveLogin.value = "";
  } finally {
    setButtonBusy(memberApproveSubmit, false);
  }
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
  revokePendingUploadPreviewUrls();
  stopChatPolling();
  if (pendingChatImageUrl) URL.revokeObjectURL(pendingChatImageUrl);
  for (const url of chatImageUrls.values()) URL.revokeObjectURL(url);
  chatImageUrls.clear();
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
if (membersButton) membersButton.addEventListener("click", openMembersDialog);
filesTab.addEventListener("click", () => setView("files"));
discussionTab.addEventListener("click", () => openDiscussionView(""));
chatTab.addEventListener("click", () => setView("chat"));
newChatButton.addEventListener("click", openNewChatDialog);
newChatForm.addEventListener("submit", submitNewChat);
chatComposeForm.addEventListener("submit", submitChatMessage);
chatImageInput.addEventListener("change", handleChatImageSelected);
chatBackButton.addEventListener("click", closeChatRoomMobile);
chatMessageInput.addEventListener("input", () => { chatMessageInput.style.height = "auto"; chatMessageInput.style.height = `${Math.min(120, chatMessageInput.scrollHeight)}px`; });
discussionAllButton.addEventListener("click", () => openDiscussionView(""));
discussionClearDocument.addEventListener("click", () => openDiscussionView(""));
newThreadButton.addEventListener("click", () => openNewThread());
threadForm.addEventListener("submit", submitThread);
commentForm.addEventListener("submit", submitComment);
threadDelete.addEventListener("click", deleteCurrentThread);
memberApproveForm.addEventListener("submit", approveMemberFromForm);
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
renderDiscussionPermission();
initializeMemberAuth();
loadFiles();
