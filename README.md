# MindX Engineer Onboarding - Week 1

Full-stack application with React frontend and Node.js API backend deployed to Azure Kubernetes Service (AKS), featuring OpenID Authentication and Automated HTTPS.

## Quick Start (Production)

- **Official URL:** [https://20.197.84.14.nip.io](https://20.197.84.14.nip.io)
- **Status:** 100% Functional (Step 1-6)
- **Infrastructure:** AKS + Dynamic IP + Ingress + cert-manager (Let's Encrypt)

---

## Features Implemented

- **Modern UI:** React 18 + Vite with Glassmorphism aesthetic and centered login flow.
- **Robust API:** Node.js/TypeScript Express server with "Double Binding" auth routes.
- **Authentication:** Integrated with **MindX OpenID Connect** IDP (`id-dev.mindx.edu.vn`).
- **Security:** Automated HTTPS using **cert-manager** and **Let's Encrypt**.
- **DevOps:** Containerized with Docker, pushed to ACR, orchestrated with AKS.
- **Routing:** Path-based routing via NGINX Ingress Controller (`/` for Web, `/api` for API).

---

## Architecture

- **Frontend:** React + TypeScript (Vite)
- **Backend API:** Node.js/TypeScript Express
- **Container Registry:** Azure Container Registry (ACR)
- **Orchestration:** Azure Kubernetes Service (AKS)
- **Ingress:** NGINX Ingress Controller
- **SSL:** cert-manager + Let's Encrypt (HTTP-01 Challenge)

---

## Project Structure

```text
Week01/
├── backend/                 # Node.js API Service
│   ├── src/
│   │   ├── index.ts        # Double-bind Auth Routes (/auth & /api/auth)
│   │   └── middleware/     # JWT Validation
│   ├── Dockerfile
│   └── .env                # Local Env
├── frontend/                # React Web App
│   ├── src/
│   │   ├── auth/           # AuthProvider & Context
│   │   ├── api/            # Client configuration
│   │   └── App.tsx         # Responsive Dashboard
│   ├── .env.development    # Points to localhost API
│   ├── .env.production     # Points to production HTTPS API
│   └── Dockerfile
├── k8s/                     # Kubernetes Manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── app-ingress.yaml    # HTTPS + TLS + Path Routing
│   └── cluster-issuer.yaml # Let's Encrypt Config
├── chitiettask.md           # [BEST READ] Detailed troubleshooting log
└── README.md
```

---

## Local Development

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
API: `http://localhost:3000/api`
Auth: `http://localhost:3000/auth/login`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App: `http://localhost:5173`

---

## Production Deployment (Step 6)

### Build & Push
```bash
az acr login --name 08manhacr

# Backend
docker build -t 08manhacr.azurecr.io/backend:v11 ./backend
docker push 08manhacr.azurecr.io/backend:v11

# Frontend
docker build -t 08manhacr.azurecr.io/frontend:v11 ./frontend
docker push 08manhacr.azurecr.io/frontend:v11
```

### Apply Kubernetes Config
```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/app-ingress.yaml

# Restart to pick up changes
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend
```

---


