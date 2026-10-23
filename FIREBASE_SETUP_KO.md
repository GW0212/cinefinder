# Cinefinder v10 — Google 계정 동기화 설정 (필수)

GitHub Pages는 정적 호스팅이므로 Google 로그인/클라우드 저장을 위해 본인 Firebase 프로젝트 설정이 필요합니다. Firebase 프로젝트가 생성되기 전에는 Google 로그인 기능이 작동하지 않으며 기존 로컬 저장은 계속 작동합니다.

1. https://console.firebase.google.com/ 에서 프로젝트 생성.
2. 프로젝트 설정 → 웹 앱 등록 → Firebase 구성 정보에서 apiKey/authDomain/projectId/appId 복사.
3. `firebase-config.js`에 위 4개 값을 채웁니다 (따옴표 안의 빈값 교체). **개인 서비스 계정 암호나 OAuth client secret은 넣지 마세요.**
4. 빌드 → Authentication → 시작하기 → 로그인 방법 → Google 제공업체 활성화. 지원 이메일 선택.
5. Authentication → 설정 → 승인된 도메인에 `gw0212.github.io` 추가. 프로젝트 기본 authDomain도 허용해야 합니다.
6. 빌드 → Firestore Database → 데이터베이스 생성(프로덕션 모드 권장), 규칙 탭에서 `firestore.rules` 전체 붙여 넣고 게시. 절대로 전체 공개 규칙을 사용하지 마세요.
7. `index.html`, `app.js`, `cloud-sync.js`, `firebase-config.js`, `style.css` 등 ZIP 전체를 GitHub Pages에 배포. HTTPS로 접속.
8. PC에서 Google 로그인 → 기존 세 목록과 클라우드 목록 최초 1회 병합 → 모바일에서 같은 계정 로그인해 확인.

### 연동 범위
- 즐겨찾기 / 나중에 보기 / 내 평점: 로그인된 동일 Google 계정 간 Firestore 실시간 동기화.
- 로그아웃 시: 기기 로컬 데이터는 지워지지 않음. 다른 Google 계정 사용 전 로컬 목록 공유 위험이 있으므로 공용 기기에는 주의.
- 최초 연결 시 기존 로컬과 클라우드 목록 병합. 이후 로그인 시 해당 계정의 클라우드 목록을 기준으로 반영.
- 평점 충돌: 최초 병합 시 높은 평점 유지. 이후 동시 편집 충돌은 마지막 저장이 우선할 수 있습니다.
- 데이터가 많아 Firestore 문서 1MiB 한도를 넘는 경우 저장 실패 메시지가 표시될 수 있습니다. 현재 JSON의 약 1,200개 평점은 통상 이보다 작으나 실제 저장 용량은 필드 길이에 따라 다릅니다.
- 인터넷이 끊겨도 로컬에서 저장 가능. 재연결 시 누락된 기록의 완전 자동 복구는 보장하지 않습니다. JSON 백업도 권장합니다.
- 모바일 redirect 로그인이 GitHub Pages와 다른 authDomain을 사용하면 Safari 등 브라우저의 제3자 저장소 제한으로 실패할 수 있습니다. Firebase 공식 안내에 따라 custom auth domain/redirect handler 설정이 필요할 수 있습니다.

### 시험 시나리오
1. A 기기에서 3개 목록에 저장 → B 기기 같은 계정 로그인 후 반영.
2. B 기기에서 별점 변경/삭제 → A 기기 반영(브라우저 접속 상태).
3. 기존 로컬 평점 JSON 보존한 채 최초 로그인 → 목록 수가 감소하지 않는지 점검.
4. 다른 계정에서 다른 데이터가 표시되는지 확인.
5. 인증 없는 사용자의 Firestore 접근 거부 확인.
6. 모바일 Safari/Chrome에서 로그인, 로그아웃 및 PDF 생성 동작 확인.

### 제한사항
Firebase 콘솔 자격증명 없이 완전 자동 로그인 배포는 불가능합니다. SDK 외부 로딩이 차단된 환경에서는 클라우드 연결이 실패합니다. Firebase 실제 계정과 2대 기기를 이용한 종단 간 테스트는 포함하지 않았습니다.
