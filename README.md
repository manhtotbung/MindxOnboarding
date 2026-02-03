# MindX Engineer Onboarding Project

A comprehensive Full-stack application designed to demonstrate Cloud Native engineering practices. This project evolves weekly, adding production-grade features such as Kubernetes orchestration, OIDC Authentication, and advanced Monitoring.

**Current Status:** `Week 1 Complete` | `Week 2 Ready`

## Project Roadmap

This project is built in iterative stages (Weeks):

- [x] **Week 1: Foundations**
  - Architecture Design & Containerization
  - Deployment to Azure Kubernetes Service (AKS)
  - Ingress Controller & Automated HTTPS (cert-manager)
  - OIDC Authentication with MindX IDP
- [ ] **Week 2: Observability & Monitoring**
  - Frontend Analytics (Google Analytics 4)
  - Backend Telemetry (Azure Application Insights)
  - Logging & Alerts
- [ ] **Week 3: CI/CD & Automation**
  - (Upcoming...)

---

## Features

- **Modern UI:** React 18 + Vite with Glassmorphism aesthetic.
- **Robust API:** Node.js/TypeScript Express server with Modular Architecture.
- **Secure Auth:** Integrated OpenID Connect with automatic token validation (JWKS).
- **Infrastructure:** Fully automated deployment on Azure Cloud using Kubernetes.

---

## Architecture

- **Frontend:** React + TypeScript (Vite)
- **Backend API:** Node.js/TypeScript Express
- **Container Registry:** Azure Container Registry (ACR)
- **Orchestration:** Azure Kubernetes Service (AKS)
- **Ingress:** NGINX Ingress Controller
- **SSL:** cert-manager + Let's Encrypt (HTTP-01 Challenge)

## Documentation

For detailed instructions on setup, deployment, and a deep dive into the **Authentication Flow**, please refer to:
- [Setup & Authentication Guide](docs/setup_and_auth_guide.md)
- [Week 2: Observability & Metrics Guide](docs/week02_metrics.md)

---
## Quick Start (Local Development)

### 1. Backend
```bash
cd backend
npm install
npm run dev
# API: http://localhost:3000/api
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---

## Production Deployment (Azure)

### 1. Build & Push
```bash
az acr login --name 08manhacr

# Backend
docker build -t 08manhacr.azurecr.io/backend:v12 ./backend
docker push 08manhacr.azurecr.io/backend:v12

# Frontend
docker build -t 08manhacr.azurecr.io/frontend:v11 ./frontend
docker push 08manhacr.azurecr.io/frontend:v11
```

### 2. Kubernetes Apply
```bash
kubectl apply -f k8s/
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend
```

---

