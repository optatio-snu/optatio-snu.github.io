# 문건함 — GitHub Pages용 파일 공유 + 웹 관리 사이트

`files/` 아래의 PDF, HWP, 이미지, 엑셀/CSV, 압축파일 등을 GitHub Pages에서 찾아보고 공유하는 정적 사이트입니다. 이번 버전은 **브라우저에서 직접 업로드·교체·경로/이름 변경·삭제**까지 할 수 있습니다.

## 현재 기능

- 파일명/폴더명/확장자 검색
- 문서 / 표 / 이미지 / 압축 / 기타 자동 분류
- 최근 수정순 / 이름순 / 큰 파일순 정렬
- PDF 브라우저 뷰어
- 이미지 뷰어: 확대·축소·회전, 이전/다음
- TXT/MD/CSV/TSV 미리보기
- HWP/HWPX·엑셀 등 다운로드
- 파일별 공유 링크 복사
- 관리자 모드에서 웹 업로드
- 기존 파일 교체
- 파일 경로/이름 변경
- 파일 삭제
- TXT/MD/CSV/TSV 내용 직접 편집
- `files/` 변경 시 GitHub Actions가 `files.json` 자동 재생성

## optatio-snu.github.io 설정

`site.config.js`는 현재 아래 저장소를 기본값으로 잡아둔 상태입니다.

```js
window.SITE_CONFIG = {
  title: "문건함",
  description: "PDF, HWP, 이미지, 엑셀 등 자주 공유하는 파일을 한곳에 모아둡니다.",
  repoUrl: "https://github.com/optatio-snu/optatio-snu.github.io",
  github: {
    owner: "optatio-snu",
    repo: "optatio-snu.github.io",
    branch: "main",
    filesDir: "files"
  }
};
```

다른 저장소에서 쓸 경우 이 값만 바꾸면 됩니다.

## 관리자 기능을 처음 켜는 법

GitHub Pages는 정적 사이트이므로 서버 비밀번호를 둘 곳이 없습니다. 대신 관리 버튼을 누른 뒤 **fine-grained personal access token**을 직접 입력해 GitHub REST API로 파일을 커밋합니다.

토큰 권장 설정:

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Repository access는 `Only select repositories`
3. `optatio-snu.github.io`만 선택
4. Repository permissions → **Contents: Read and write**
5. 가능한 짧은 만료 기간 설정
6. 생성한 토큰을 사이트 우측 상단 **관리** 버튼에서 입력

토큰은 소스 코드, `files.json`, GitHub 저장소에 저장하지 않습니다. 현재 구현은 브라우저의 `sessionStorage`에만 넣으므로 **해당 탭을 닫거나 관리자 종료를 누르면 제거**됩니다.

> 공용 PC에서는 관리자 토큰을 입력하지 않는 것을 권장합니다.

## 웹에서 파일 올리기

1. 우측 상단 `관리` 클릭
2. GitHub 저장소 정보와 fine-grained PAT 입력
3. 관리자 패널의 `업로드 폴더`에 원하는 하위 폴더 입력
4. 파일 선택 또는 드래그앤드롭
5. `업로드`

예를 들어 업로드 폴더를 `경제학/발표자료`로 두고 `week1.pdf`를 올리면 다음 경로로 커밋됩니다.

```text
files/경제학/발표자료/week1.pdf
```

같은 경로의 파일이 이미 있으면 교체 여부를 확인합니다.

## 수정 / 삭제

관리자 모드에서 각 파일 카드에 `관리` 버튼이 생깁니다.

- **경로·이름 변경**: `files/...` 경로를 수정하고 저장
- **파일 교체**: 같은 경로에 새 바이너리를 올림
- **텍스트 직접 편집**: TXT/MD/CSV/TSV만 제공
- **삭제**: 현재 브랜치에서 파일 삭제 커밋 생성

경로 변경은 새 경로에 파일을 만든 뒤 기존 경로를 삭제하는 방식이라 GitHub 기록에는 두 커밋이 남습니다.

## PDF / 이미지 뷰어

- PDF는 같은 GitHub Pages 도메인의 파일을 브라우저 내장 PDF 뷰어로 엽니다.
- 이미지는 사이트 내부 뷰어에서 확대/축소/회전할 수 있습니다.
- `새 탭에서 열기`, `다운로드`, `파일 링크 복사`도 제공합니다.

## 파일 크기

일반 GitHub 저장소는 100 MiB보다 큰 파일을 차단합니다. 이 웹 UI는 API/브라우저 메모리 여유를 위해 **95 MiB 초과 업로드를 막고**, 50 MiB 초과부터 경고를 표시합니다. 큰 파일을 많이 다룰 경우 Git LFS나 다른 스토리지를 쓰는 편이 낫습니다.

## files.json 자동 갱신

`.github/workflows/build-index.yml`이 `files/**` 변경을 감지해 `scripts/build_index.py`를 실행합니다. 여러 파일을 연속 업로드할 때 Actions 작업이 서로 충돌하지 않도록 concurrency 설정도 포함되어 있습니다.

웹에서 성공적으로 변경한 직후에는 현재 탭의 목록을 즉시 갱신합니다. 새로 접속한 사용자는 Actions가 생성한 최신 `files.json`을 읽습니다.

## 보안상 주의

- 공개 저장소 + GitHub Pages라면 `files/`의 파일도 공개됩니다.
- 민감한 개인정보, 비공개 연구자료, 시험지 원본 등은 올리지 않는 편이 좋습니다.
- PAT를 JavaScript 파일에 직접 적어 넣지 마세요.
- 가능하면 이 저장소 하나만 접근 가능한 fine-grained PAT를 사용하세요.
- 토큰이 노출됐다고 의심되면 GitHub에서 즉시 revoke 하세요.

## 로컬 확인

브라우저가 `files.json`을 `fetch()`하므로 HTML을 더블클릭하지 말고 간단한 서버를 띄우세요.

```bash
python -m http.server 8000
```

그 뒤 `http://localhost:8000`을 열면 됩니다.
