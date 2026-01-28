# MindX Engineer Onboarding - Week 1

Full-stack application with React frontend and Node.js API backend deployed to Azure Kubernetes Service (AKS).

## Architecture

- **Frontend:** React + TypeScript (Vite) served with nginx
- **Backend API:** Node.js/TypeScript Express server
- **Container Registry:** Azure Container Registry (ACR)
- **Orchestration:** Azure Kubernetes Service (AKS)
- **Ingress:** NGINX Ingress Controller for path-based routing
- **Deployment:** Azure Web App (backend only) + AKS (full-stack)

## Project Structure

```
Week01/
├── backend/                 # Node.js API
│   ├── src/
│   │   └── index.ts        # Express server entry point
│   ├── Dockerfile          # Multi-stage Docker build
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React Web App
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts   # API client for backend
│   │   ├── App.tsx         # Main React component
│   │   └── main.tsx        # Entry point
│   ├── Dockerfile          # Multi-stage build (Node.js + nginx)
│   ├── nginx.conf          # SPA routing configuration
│   ├── package.json
│   └── tsconfig.json
├── k8s/                     # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-ingress.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+
- Docker Desktop
- Azure CLI (`az`)
- kubectl
- Helm
- Git

## Local Development

### 1. Run API Locally

```bash
cd backend
npm install
npm run dev
```

API will be available at `http://localhost:3000`

**Endpoints:**
- `GET /api/health` → `{"status":"ok"}`
- `GET /api/` → `"Hello from Backend API!"`

### 2. Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

**Note:** Update `frontend/.env` to point to your backend:
```
VITE_API_URL=http://localhost:3000
```

### 3. Build Docker Images

**Backend:**
```bash
docker build -t backend:latest ./backend
docker run -p 3000:3000 backend:latest
```

**Frontend:**
```bash
docker build -t frontend:latest ./frontend
docker run -p 80:80 frontend:latest
```

## Azure Deployment

### Configure Azure CLI

```bash
az login
az account set --subscription "MindX Develop Azure Subscription"
```

### Push to Azure Container Registry

```bash
# Login to ACR
az acr login --name <your-acr-name>

# Build and tag
docker build -t <your-acr-name>.azurecr.io/backend:latest ./backend

# Push
docker push <your-acr-name>.azurecr.io/backend:latest
```

### Deploy to Azure Web App

```bash
# Create App Service Plan (B1 - Basic)
az appservice plan create \
  --name <your-app-service-plan> \
  --resource-group <your-resource-group> \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group <your-resource-group> \
  --plan <your-app-service-plan> \
  --name <your-webapp-name> \
  --deployment-container-image-name <your-acr-name>.azurecr.io/backend:latest
```

---

## Deploy to Azure Kubernetes Service (AKS)

### Prerequisites
- Completed ACR setup above
- kubectl installed
- AKS cluster created

### Step 1: Get AKS Credentials

```bash
az aks get-credentials --resource-group <your-resource-group> --name <your-aks-cluster>
```

### Step 2: Create ACR Secret

```bash
# Get ACR password
az acr credential show --name <your-acr-name> --query "passwords[0].value" -o tsv

# Create Kubernetes secret
kubectl create secret docker-registry acr-secret \
  --docker-server=<your-acr-name>.azurecr.io \
  --docker-username=<your-acr-name> \
  --docker-password=<password-from-above>
```

### Step 3: Deploy to AKS

```bash
# Deploy application
kubectl apply -f k8s/backend-deployment.yaml

# Deploy service
kubectl apply -f k8s/backend-service.yaml
```

### Step 4: Verify Deployment

```bash
# Check pods
kubectl get pods

# Check service
kubectl get svc backend

# Test API (port-forward)
kubectl port-forward svc/backend 8080:80
curl http://localhost:8080/health
```

---

## Step 3: Ingress Controller Setup (External Access)

### Prerequisites
- Completed Step 2 (AKS deployment)
- Helm installed locally
- kubectl configured for AKS cluster

### 3.1 Install NGINX Ingress Controller

```bash
# Add Helm repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX Ingress Controller
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

# Verify installation
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

**Expected result:** LoadBalancer Service with EXTERNAL-IP (Public IP)

### 3.2 Create & Apply Ingress Resource

```bash
# Apply Ingress configuration
kubectl apply -f k8s/backend-ingress.yaml

# Verify Ingress
kubectl get ingress
```

### 3.3 Get Public IP

```bash
kubectl get svc -n ingress-nginx
```

Look for `EXTERNAL-IP` of `nginx-ingress-ingress-nginx-controller` service.

### 3.4 Test External Access

```bash
# Test health endpoint
curl http://<EXTERNAL-IP>/health

# Expected response:
# {"status":"ok"}
```

---

## Step 4: React Web App Deployment

### Prerequisites
- Completed Steps 1-3
- Frontend and backend images in ACR
- AKS cluster with Ingress Controller

### 4.1 Deploy Frontend to AKS

```bash
# Apply frontend deployment
kubectl apply -f k8s/frontend-deployment.yaml

# Apply frontend service
kubectl apply -f k8s/frontend-service.yaml

# Verify
kubectl get pods -l app=frontend
```

### 4.2 Update Ingress for Full-Stack Routing

The Ingress is configured for path-based routing:
- `/api/*` → Backend Service
- `/` → Frontend Service

```bash
# Apply updated Ingress
kubectl apply -f k8s/backend-ingress.yaml

# Verify
kubectl describe ingress backend-ingress
```

---

## Application URLs

### Azure Web App (Backend Only - Step 1)
- **URL:** https://mindx-backend-08manh.azurewebsites.net
- **Health:** https://mindx-backend-08manh.azurewebsites.net/health

### AKS Full-Stack (Steps 2-4) ✅ **CURRENT**
**Public IP:** `20.44.193.144`

**Frontend (React App):**
- **URL:** http://20.44.193.144/

**Backend API:**
- **Health:** http://20.44.193.144/api/health → `{"status":"ok"}`
- **Root:** http://20.44.193.144/api/ → `"Hello from Backend API!"`

**Routing:**
- All requests to `/api/*` are routed to the backend service
- All other requests (including `/`) are routed to the frontend service

---

## Available Endpoints

### Backend API
- **Health Check:** `GET /api/health` → `{"status":"ok"}`
- **Hello World:** `GET /api/` → `"Hello from Backend API!"`

### Frontend
- **Web App:** `GET /` → React application
- **Architecture Info:** Displays backend health and system architecture


## Technologies Used

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Axios (HTTP client)
- nginx (production server)

**Backend:**
- Node.js 18 + TypeScript
- Express.js
- CORS enabled

**Infrastructure:**
- Azure Kubernetes Service (AKS)
- Azure Container Registry (ACR)
- NGINX Ingress Controller
- Docker multi-stage builds

## References

- [Azure Documentation](https://docs.microsoft.com/azure)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**Week 1 Progress:** 4/6 steps completed (67%)

**Next Steps:**
- Step 5: Authentication (OpenID or Custom)
- Step 6: HTTPS & SSL with custom domain
