# MindX Engineer Onboarding Project

A comprehensive Full-stack application designed to demonstrate Cloud Native engineering practices. This project evolves weekly, adding production-grade features such as Kubernetes orchestration, OIDC Authentication, and advanced Monitoring.

## Features

- **Modern UI:** React 18 + Vite with Glassmorphism aesthetic.
- **Robust API:** Node.js/TypeScript Express server with Modular Architecture.
- **Secure Auth:** Integrated OpenID Connect with automatic token validation (JWKS).
- **Observability:** Complete monitoring stack with Azure App Insights (Backend) and Google Analytics 4 (Frontend).
- **Infrastructure:** Fully automated deployment on Azure Cloud using Kubernetes.

---

## Architecture

- **Frontend:** React + TypeScript (Vite)
- **Backend API:** Node.js/TypeScript Express
- **Container Registry:** Azure Container Registry (ACR)
- **Orchestration:** Azure Kubernetes Service (AKS)
- **Ingress:** NGINX Ingress Controller
- **SSL:** cert-manager + Let's Encrypt (HTTP-01 Challenge)
- **Monitoring:** Azure Application Insights + Google Analytics 4

## Documentation

For detailed instructions on setup, deployment, authentication flows, and observability configuration, please refer to the following milestone guides:
- [Week 1: Setup & Authentication Guide](docs/setup_and_auth_guide.md)
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

# Backend (Latest Stable)
docker build -t 08manhacr.azurecr.io/backend:v14 ./backend
docker push 08manhacr.azurecr.io/backend:v14

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

