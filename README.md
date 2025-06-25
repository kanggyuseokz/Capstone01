# 🛡 실시간 웹 공격 탐지 및 관리 시스템

> 실시간으로 유입되는 사용자 데이터에서 **XSS**, **SQL Injection** 등 주요 웹 공격을 탐지하고, 관리자가 이를 모니터링 및 대응할 수 있는 **통합 보안 관제 대시보드** 프로젝트입니다.

---

## ✨ 주요 기능

- **실시간 공격 탐지**  
  사용자의 입력 값에서 아래 4가지 웹 공격 패턴을 탐지합니다:  
  - Cross-Site Scripting (**XSS**)  
  - SQL Injection  
  - Path Traversal  
  - Command Injection  

- **공격 로그 기록**  
  탐지된 공격 시도는 다음 정보를 포함해 데이터베이스에 기록됩니다:  
  - 타임스탬프  
  - 공격자 IP  
  - 사용자 정보  
  - 원본 입력 값 및 정제된 값  

- **자동 IP 차단**  
  설정된 임계치를 초과하는 공격 시도를 한 IP는 자동으로 차단되며, 관리자는 차단 목록을 확인하고 해제할 수 있습니다.  

- **이메일 알림**  
  새로운 공격이 탐지되면 **지정된 관리자에게 이메일로 실시간 알림**을 보냅니다.  

- **관리자 대시보드** (React 기반)  
  - 전체 공격 로그 및 사용자별 로그 조회/검색  
  - 관리자 계정 승인 및 관리  
  - 차단된 IP 확인 및 해제  
  - 관리자 프로필 정보 수정  

---

## 🛠️ 기술 스택

| 구분       | 기술 스택                                                                 |
|------------|---------------------------------------------------------------------------|
| Backend    | Python, Flask, SQLAlchemy, Flask-Mail, Waitress, PyMySQL, Werkzeug        |
| Frontend   | React, React Router, React Context API, Bootstrap, Bootstrap Icons        |
| Database   | MySQL                                                                     |

---

## 📂 프로젝트 구조
```bash
/project-root
├── /backend/
│ ├── /app/
│ │ ├── /api/ # API 엔드포인트 (블루프린트)
│ │ ├── /core/ # 핵심 비즈니스 로직 (공격 탐지 등)
│ │ ├── /models/ # 데이터베이스 모델
│ │ ├── init.py # Flask 앱 팩토리
│ │ └── config.py # 설정 관리
│ ├── .env # 환경 변수 파일
│ ├── run.py # 서버 실행 스크립트
│ └── requirements.txt # Python 의존성
│
└── /frontend/
├── /src/
│ ├── /api/ # 중앙 API 호출 함수
│ ├── /components/ # 재사용 UI 컴포넌트 (모달, 탭 등)
│ ├── /contexts/ # 전역 상태 관리 (AuthContext)
│ ├── /pages/ # 페이지 단위 컴포넌트 (로그인, 대시보드)
│ ├── App.js # 라우팅 및 전역 레이아웃
│ └── index.js # React 앱 진입점
└── package.json

yaml
복사
편집
```
---
## 🚀 설치 및 실행 방법

### ✅ 사전 준비

- Python 3.x  
- Node.js & npm  
- MySQL Server  

---

### 1️⃣ 백엔드 서버 설정 및 실행

```bash
# 백엔드 디렉토리 이동
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 라이브러리 설치
pip install -r requirements.txt

# .env 파일 설정
# .env.example 파일을 참고하여 .env 생성 후 DB, 이메일 정보 수정

# 서버 실행
python run.py
```
실행 주소: http://localhost:5001
---
### 2️⃣ 프론트엔드 서버 설정 및 실행
```bash
# 프론트엔드 디렉토리 이동
cd frontend

# 라이브러리 설치
npm install

# 개발 서버 실행
npm start
```
실행 주소: http://localhost:3000
---
## ⚙️ 환경 변수 설정 (`backend/.env`)

| 변수명                      | 설명                             | 예시                         |
|-----------------------------|----------------------------------|------------------------------|
| `SECRET_KEY`                | Flask 세션 암호화 키             | `your-super-secret-key`      |
| `API_KEY`                   | API 호출 인증 키 (선택 사항)     | `your-api-key`               |
| `DB_USER`                   | MySQL 사용자명                   | `root`                       |
| `DB_PASSWORD`               | MySQL 비밀번호                   | `your_password`              |
| `DB_HOST`                   | 데이터베이스 주소                | `localhost`                  |
| `DB_NAME`                   | 데이터베이스 이름                | `security_dashboard`         |
| `MAIL_SERVER`               | SMTP 서버 주소                   | `smtp.gmail.com`             |
| `MAIL_PORT`                 | SMTP 포트                        | `587`                        |
| `MAIL_USE_TLS`              | TLS 사용 여부                    | `True`                       |
| `MAIL_USERNAME`             | 이메일 계정                      | `your_email@gmail.com`       |
| `MAIL_PASSWORD`             | 앱 비밀번호                      | `your_app_password`          |
| `MAIL_DEFAULT_SENDER`       | 기본 발신 이메일                 | `your_email@gmail.com`       |
| `ALERT_RECIPIENT`           | 공격 알림 수신 이메일            | `admin_email@example.com`    |
| `BLOCK_THRESHOLD`           | IP 차단 임계치                   | `5`                          |
| `BLOCK_TIME_WINDOW_MINUTES` | 공격 카운팅 시간창 (분)          | `5`                          |
| `BLOCK_DURATION_HOURS`      | 차단 지속 시간 (시간)            | `24`                         |
