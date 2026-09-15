Pioupiounades - QA Automation & Test Engineering Framework

An enterprise-grade End-to-End (E2E), API, and WebSocket test automation framework built in TypeScript and Playwright for the Pioupiounades platform (a micro-community citizen engagement web app developed within the 42 curriculum).

This repository houses an independent quality assurance suite focused on contract validation, business-critical state machines, real-time message brokering, and automated failure triaging.
🎯 Scope & Objectives

The primary objective is to guarantee system stability and security boundaries without relying on manual regression testing. Key areas covered:

    Security & Data Integrity: Ensure API endpoints strictly enforce RBAC and sensitive data (e.g., password_hash) is never exposed in client payloads.

    State Machine Validation: Automate workflow tests across citizen initiatives (Actions) from pending through approved, completed, or cancelled states.

    Real-Time Concurrency: Validate Socket.IO gateway connections, rooms, live notifications, and bidirectional chat streams between authenticated peers.

    CI/CD Integration & AI Triage: Execute automated suites on GitHub Actions with automated error triage to differentiate environment failures from product regressions.

🏗 System Architecture Under Test

    Frontend: React SPA (TypeScript)

    Backend: NestJS (Node.js, TypeScript)

    Database & ORM: PostgreSQL + Prisma ORM

    Real-time Gateway: Socket.IO / WebSockets

    Infrastructure: Docker Compose multi-container architecture

               +--------------------------------------+
               |    Playwright QA Automation Suite    |
               +--------------------------------------+
                     | (REST API)        | (WebSockets)
                     v                   v
              +-------------+     +------------------+
              | NestJS API  |     | Socket.IO Engine |
              +-------------+     +------------------+
                     |                   |
                     +---------+---------+
                               |
                               v
                       [PostgreSQL / DB]

📁 Repository Structure

├── fixtures/            # Synthetic test data and model factories
├── tests/
│   ├── api/             # REST API contract, auth, and state machine tests
│   ├── e2e/             # Browser-based critical user journeys (React SPA)
│   └── websocket/       # Real-time connection and event concurrency tests
├── utils/               # Reusable API clients, token helpers, and DB cleaners
├── playwright.config.ts # Core test configuration & reporting settings
└── package.json

🚀 Getting Started
Prerequisites

    Node.js >= 20.x
    Target application running locally (http://localhost:3000)

Installation

git clone https://github.com/your_user/pioupiounades-qa-automation.git
cd pioupiounades-qa-automation
npm install
Running Tests

Run all tests:
npx playwright test

Run API contract tests only:
npx playwright test tests/api/

Run tests in headed browser mode:
npx playwright test --headed

View the interactive HTML test report:
npx playwright show-report
📋 Automation Roadmap

    [x] Test framework scaffolding & Playwright setup
    [x] Security & registration contract validation (/users)
    [ ] Actions lifecycle & quota management state machine tests
    [ ] Bidirectional Socket.IO messaging & event validation
    [ ] GitHub Actions CI/CD integration
    [ ] LLM-assisted failure triage integration
