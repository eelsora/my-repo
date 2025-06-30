# 🌤️ React 날씨 앱 (React Weather App)

React, TypeScript, Vite를 사용하여 만든 간단한 날씨 애플리케이션입니다. 사용자는 도시 이름을 검색하여 현재 날씨 정보를 확인할 수 있습니다.

## ✨ 주요 기능

- **도시별 날씨 검색**: 원하는 도시의 현재 날씨를 검색합니다.
- **상세 정보 제공**: 온도, 체감 온도, 습도, 풍속 등 상세한 날씨 정보를 보여줍니다.
- **날씨 아이콘**: 현재 날씨 상태(맑음, 흐림, 비 등)에 맞는 아이콘을 표시합니다.
- **반응형 디자인**: 데스크톱과 모바일 등 다양한 화면 크기에서 최적화된 화면을 제공합니다.

## 🛠️ 기술 스택

- **[React](https://react.dev/)**: UI 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)**: 정적 타입을 지원하는 JavaScript 슈퍼셋
- **[Vite](https://vitejs.dev/)**: 차세대 프론트엔드 개발 및 빌드 도구
- **[OpenWeatherMap API](https://openweathermap.org/api)**: 날씨 데이터 API
- **CSS Modules**: 컴포넌트 스코프의 CSS 스타일링

## 🚀 시작하기

### 사전 준비

- [Node.js](https://nodejs.org/) (v18 이상 권장)
- [pnpm](https://pnpm.io/)

### 설치 및 실행

1.  **저장소 복제(Clone)**

    ```bash
    git clone <your-repository-url>
    cd vite-project/weather-app
    ```

2.  **의존성 설치**

    ```bash
    pnpm install
    ```

3.  **환경 변수 설정**

    프로젝트 루트 디렉터리에 `.env` 파일을 생성하고 아래 내용을 추가하세요.

    OpenWeatherMap에서 무료로 API 키를 발급받을 수 있습니다.

    ```
    VITE_OPENWEATHER_API_KEY=your_api_key_here
    ```

4.  **개발 서버 실행**
    ```bash
    pnpm dev
    ```
    서버가 실행되면 브라우저에서 `http://localhost:5173` (또는 터미널에 표시된 다른 포트)으로 접속하세요.

## 📜 사용 가능한 스크립트

- `pnpm dev`: 개발 서버를 시작합니다.
- `pnpm build`: 프로덕션용으로 앱을 빌드합니다. (`dist` 폴더에 결과물이 생성됩니다.)
- `pnpm lint`: ESLint로 코드 스타일을 검사하고 수정합니다.
- `pnpm preview`: 프로덕션 빌드 결과물을 로컬에서 미리 봅니다.
- `pnpm cy:open`: Cypress 대화형 테스트 러너를 실행합니다.
- `pnpm cy:run`: 헤드리스 모드에서 Cypress E2E 테스트를 실행합니다.

## 🧪 테스팅 (Testing)

이 프로젝트는 End-to-End (E2E) 테스트를 위해 Cypress를 사용합니다. 테스트 코드는 `cypress` 디렉터리에 있습니다.

### Cypress 실행 방법

1.  **Cypress 대화형 모드 실행:**
    테스트 러너 UI를 열어 테스트를 시각적으로 확인하고 디버깅할 수 있습니다.

    ```bash
    pnpm cy:open
    ```

2.  **Cypress 헤드리스 모드 실행:**
    커맨드 라인에서 모든 테스트를 실행합니다. 주로 CI/CD 환경에서 사용됩니다.
    ```bash
    pnpm cy:run
    ```
