# PREGO

**PREGO** is an antenatal management application designed to support pregnancy tracking, communication, and access to antenatal care services for patients and healthcare providers.

The project combines a **React Native / Expo mobile application** with a **Node.js / Express backend API**, providing the foundation for a broader digital antenatal care platform.

> **Project Status:** PREGO is currently under active development.

---

## About PREGO

PREGO is being developed as a centralized antenatal management platform connecting patients with healthcare services throughout pregnancy.

The application is designed around three primary user roles:

- **Patients**
- **Doctors**
- **Hospital Administrators**

The goal is to provide patients with useful pregnancy-management tools while creating infrastructure for communication and interaction with healthcare providers.

---

## Features

PREGO is being developed to support:

### Patient Experience

- User registration and authentication
- Pregnancy tracking
- Pregnancy-related health information
- Symptom logging
- Weight tracking
- Doctor discovery
- Doctor profiles
- Appointment booking and management
- Patient-doctor communication
- Media and medical-image management
- Profile and account management
- Security settings
- Light and dark themes

### Healthcare Experience

The architecture is also designed to support:

- Doctor accounts
- Patient-doctor relationships
- Appointment management
- Secure communication
- Hospital administration
- Role-based access control
- Hospital-system integration

> Some features listed above are still under development and may change as PREGO evolves.

---

## Architecture

PREGO is organized as a single repository containing two primary applications:

```text
PreGo/
├── backend/          # Node.js / Express backend API
├── frontend/         # React Native / Expo mobile application
├── .gitignore
└── README.md
```

The frontend communicates with the backend through the PREGO API.

---

## Mobile Application

The PREGO mobile application is located in:

```text
frontend/
```

### Frontend Technology

The mobile application uses:

- React Native
- Expo
- TypeScript
- Expo Router
- Zustand
- TanStack Query
- Expo Secure Store

The application separates user-interface code, navigation, application state, API communication, and reusable functionality.

API requests are handled through a dedicated service layer rather than directly from application screens.

Authentication credentials are stored using secure device storage.

For frontend-specific installation and development information, see:

[`frontend/README.md`](./frontend/README.md)

---

## Backend API

The PREGO backend is located in:

```text
backend/
```

### Backend Technology

The API uses:

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Redis
- Zod
- JSON Web Tokens (JWT)

The backend follows a modular architecture designed to separate major application domains and make the system easier to maintain as PREGO grows.

For backend-specific setup and development information, see:

[`backend/README.md`](./backend/README.md)

---

## Getting Started

### Prerequisites

Before running PREGO locally, make sure you have the appropriate development environment installed.

You will need:

- Git
- Node.js
- npm
- MongoDB access
- Docker
- Expo-compatible development environment

For mobile development, you can use a supported physical device, Android emulator, or iOS Simulator depending on your development platform.

---

## Clone the Repository

```bash
git clone https://github.com/SAM-K3YZ/PreGo.git
cd PreGo
```

The frontend and backend have separate dependencies and should be installed independently.

---

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your local environment configuration:

```bash
cp .env.example .env
```

Configure the required environment variables.

Start the local Redis service:

```bash
docker compose up -d
```

Start the backend development server:

```bash
npm run dev
```

Run TypeScript checking with:

```bash
npm run typecheck
```

or:

```bash
npx tsc --noEmit
```

Create a production build with:

```bash
npm run build
```

Refer to [`backend/README.md`](./backend/README.md) for additional backend setup information.

---

## Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the local environment configuration:

```bash
cp .env.example .env
```

Configure the frontend `API_URL` so that it points to your running PREGO backend.

Start Expo:

```bash
npx expo start
```

Run TypeScript checking with:

```bash
npm run typecheck
```

or:

```bash
npx tsc --noEmit
```

Refer to [`frontend/README.md`](./frontend/README.md) for additional frontend setup information.

---

## Environment Configuration

PREGO uses environment variables for configuration that may differ between development and production environments.

Each project should use its `.env.example` file as the reference for required environment variables.

Local `.env` files should never be committed.

Examples of sensitive configuration include:

- Database connection strings
- Authentication secrets
- API credentials
- Service credentials
- Production configuration

Never store production secrets directly in source code.

---

## Security

Security is an important part of PREGO because the platform is intended to handle healthcare-related user information.

The project is designed around practices including:

- Authentication
- Authorization
- Role-based access control
- Secure credential storage
- Request validation
- Protected patient resources
- Secure environment configuration
- Auditing of sensitive operations

Sensitive credentials and production secrets must remain outside the repository.

---

## Project Structure

At a high level:

```text
PreGo/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   └── ...
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── app/
│   ├── services/
│   ├── constants/
│   ├── hooks/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

The exact structure may evolve as development continues.

---

## Application Preview

Screenshots and application previews will be added as the PREGO interface continues to develop.

A future screenshot structure can be maintained under:

```text
docs/
└── screenshots/
    ├── home.png
    ├── pregnancy-log.png
    ├── doctors.png
    └── profile.png
```

Example:

```html
<p align="center">
  <img src="./docs/screenshots/home.png" width="220" alt="PREGO Home Screen" />
  <img src="./docs/screenshots/pregnancy-log.png" width="220" alt="PREGO Pregnancy Log" />
  <img src="./docs/screenshots/doctors.png" width="220" alt="PREGO Doctors Screen" />
</p>
```

---

## Development Status

PREGO is under active development.

The application's APIs, architecture, user interfaces, and functionality may change as development progresses.

This repository represents the ongoing development version of PREGO rather than a finished production release.

---

## Repository Navigation

### Mobile Application

[`frontend/`](./frontend)

React Native / Expo application used by PREGO mobile users.

### Backend API

[`backend/`](./backend)

Node.js / Express API powering PREGO services.

---

## Contributing

PREGO is currently being actively developed.

Contribution guidelines may be added as the project matures.

---

## Commit Convention

PREGO uses **Conventional Commits** to keep Git history structured and readable.

Examples:

```text
feat(frontend): add pregnancy log screen
feat(backend): add appointment endpoints
fix(auth): resolve token refresh issue
refactor(frontend): reorganize patient navigation
docs: update project documentation
test(backend): add authentication tests
chore(deps): update project dependencies
```

Common commit types include:

| Type | Purpose |
| --- | --- |
| `feat` | New functionality |
| `fix` | Bug fixes |
| `refactor` | Code restructuring |
| `docs` | Documentation |
| `test` | Tests |
| `style` | Formatting or styling changes |
| `perf` | Performance improvements |
| `build` | Build-system changes |
| `ci` | CI/CD changes |
| `chore` | Maintenance |

---

## Roadmap

PREGO will continue to evolve as development progresses.

Planned areas of development include expanding pregnancy-management functionality, healthcare-provider interactions, communication, appointment management, media handling, and hospital-facing capabilities.

Detailed internal development planning is maintained separately from the public repository documentation.

---

## Disclaimer

PREGO is currently a software project under development.

It should not be considered a replacement for professional medical advice, diagnosis, treatment, or emergency medical services.

---

## License

License information will be added as the project progresses.

---

## Author

**Sam**

GitHub: [SAM-K3YZ](https://github.com/SAM-K3YZ)