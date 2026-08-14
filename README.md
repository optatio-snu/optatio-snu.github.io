# 문건함 — GitHub Pages용 파일 공유 사이트

HWP, PDF, 이미지, 엑셀/CSV, 압축파일 등 여러 종류의 문건을 `files/` 폴더에 넣고 GitHub Pages에서 보기 좋게 공유하는 정적 사이트입니다.

## 특징

- 파일명/폴더명/확장자 검색
- 문서 / 표 / 이미지 / 압축 / 기타 자동 분류
- 최근 수정순 / 이름순 / 큰 파일순 정렬
- PDF·이미지·텍스트·CSV/TSV 브라우저 미리보기
- HWP/HWPX·엑셀 등은 바로 다운로드
- 파일별 공유 링크 복사
- `files/`에 파일을 추가하면 GitHub Actions가 `files.json`을 자동 재생성
- 별도 서버나 데이터베이스 없음

## 1. GitHub에 올리기

1. 새 GitHub 저장소를 만듭니다. 예: `document-vault`
2. 이 폴더의 내용을 저장소 루트에 그대로 업로드/푸시합니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment → Source**에서 **Deploy from a branch**를 선택합니다.
5. Branch는 `main`, 폴더는 `/ (root)`를 선택하고 저장합니다.

잠시 뒤 `https://사용자명.github.io/저장소명/` 형태의 주소가 생깁니다.

## 2. 파일 추가하기

공유할 파일을 `files/` 아래에 넣고 커밋/푸시하면 됩니다. 폴더를 여러 단계로 나눠도 됩니다.

예시:

```text
files/
├── 경제학/
│   ├── 발표자료.pdf
│   └── 데이터.xlsx
├── 학생회/
│   └── 회칙.hwp
└── 이미지/
    └── 포스터.png
```

푸시 후 GitHub Actions가 자동으로 파일 목록을 갱신합니다.

## 3. 제목 바꾸기

`site.config.js`에서 아래 세 값을 수정하세요.

```js
window.SITE_CONFIG = {
  title: "문건함",
  description: "PDF, HWP, 이미지, 엑셀 등 자주 공유하는 파일을 한곳에 모아둡니다.",
  repoUrl: "https://github.com/USERNAME/REPOSITORY"
};
```

`repoUrl`을 비워두면 우측 상단 GitHub 버튼은 자동으로 숨겨집니다.

## 4. 주의할 점

- **공개 저장소 + GitHub Pages라면 `files/`의 파일도 공개됩니다.** 개인정보, 시험지 원본, 비공개 연구자료 등은 올리지 않는 편이 좋습니다.
- GitHub는 일반 Git 저장소에서 큰 바이너리 파일을 자주 바꾸는 용도에는 썩 잘 맞지 않습니다. 매우 큰 파일이나 버전이 자주 바뀌는 파일은 Git LFS 또는 별도 저장소를 고려하세요.
- HWP/HWPX/XLSX는 브라우저 자체 미리보기가 안정적이지 않아 이 사이트에서는 다운로드 방식으로 처리합니다.

## 로컬에서 확인하기

브라우저가 `files.json`을 `fetch()`하므로 HTML 파일을 더블클릭하기보다 간단한 로컬 서버를 띄우는 게 좋습니다.

```bash
python -m http.server 8000
```

그 뒤 `http://localhost:8000`을 열면 됩니다.
