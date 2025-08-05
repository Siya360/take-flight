# Agentic Flight Management System – Product Requirements Document

## 1. Overview
Convert the existing monolithic Go-based flight booking application into an agentic, microservices-oriented platform. The system exposes traditional REST/gRPC APIs while allowing AI agents to orchestrate complex workflows (flight discovery, booking, support) across services.

## 2. Goals
- **Microservice Architecture:** Decompose into independently deployable services (Auth, Users, Flights, Bookings, Admin).
- **Agentic AI Layer:** Introduce Python-based orchestrator using LangChain/LangGraph.
- **Polyglot Persistence:** Choose databases per service (Postgres/Supabase, Redis, others).
- **Event-Driven Backbone:** Use Kafka/NATS for domain events and sagas.
- **Frontend Modernization:** Next.js + Tailwind + Bun runtime with Yarn package management.
- **DevOps:** Kubernetes/K3s, GitOps with Argo CD, Blue-Green deployments.
- **Observability & Security:** OpenTelemetry, Prometheus, Grafana, Vault/SOPS.

## 3. Architecture
### 3.1 Services
| Service    | Language | Responsibilities                    | Data Store           |
|------------|----------|-------------------------------------|----------------------|
| Auth       | Go       | JWT issuance, user authentication   | Postgres + Redis     |
| Users      | Go       | User profiles, preferences          | Postgres             |
| Flights    | Go       | Flight schedules, seat inventory    | Postgres             |
| Bookings   | Go       | Reservations, pricing, seat locking | Postgres + Redis     |
| Admin      | Go       | Reporting, management tools         | Postgres             |
| Agents     | Python   | AI orchestration & workflows        | Postgres (pgvector)  |

### 3.2 Agent Layer
- FastAPI service hosting LangChain/LangGraph agents.
- Agents interact with microservices via REST/gRPC and publish/consume events.
- Conversation memory stored in vector DB (pgvector or Qdrant).

### 3.3 Frontend
- Next.js (React-based) with Tailwind CSS.
- Yarn Berry for package management, Bun runtime for speed.
- Optionally integrate LangChain.js for client-side agent features.

### 3.4 Infrastructure
- Containerized with Docker, deploy on Kubernetes or K3s.
- Service mesh: Linkerd (lightweight) or Istio (feature-rich).
- API Gateway: Kong/Envoy for routing, auth, rate limiting.
- GitOps: Argo CD + Kustomize; CI via GitHub Actions/GitLab CI.
- Blue-Green deployments; trunk-based development.

## 4. Development Practices
- **TDD/DDD/OOP/Event-Driven Design**
- **Code Quality:** linters, unit tests, integration tests
- **Security:** Secrets in Vault/SOPS, HTTPS everywhere, RBAC in clusters
- **Observability:** Metrics, tracing, logging, alerting

## 5. Milestones
1. **M1:** Service decomposition & basic Kubernetes deployment
2. **M2:** Event bus + saga implementation
3. **M3:** Agentic orchestrator service
4. **M4:** Frontend with AI-assisted UX
5. **M5:** Observability, security, and production hardening

## 6. Non-Goals
- Vendor lock-in with a specific cloud provider
- Maintaining monolithic code after decomposition
- Closed-source or proprietary dependencies where open-source alternatives exist
