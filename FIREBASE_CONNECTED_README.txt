Cinefinder Firebase 연결 설정 적용본
projectId: cinefinder-4f479

포함 내용: 실제 Firebase 웹 앱 설정값 적용, config 캐시 갱신, 기존 v10 동기화 기능 유지.

중요: Firestore 규칙은 ZIP의 firestore.rules를 Firebase 콘솔에 게시하세요.
실제 저장 경로: /cinefinder_users/{uid}/lists/{listName}
이전 대화에 제시된 /users/{uid}/... 규칙은 이 버전 코드와 맞지 않습니다.

Google 로그인 공급자 사용 설정, gw0212.github.io 승인된 도메인 등록도 필요합니다.
실제 Firebase 서버에 연결하여 동작 검증을 마친 버전은 아닙니다.
