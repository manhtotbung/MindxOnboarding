# MindX Engineer Onboarding - Week 1

Full-stack Node.js API and React application deployed to Azure Kubernetes Service (AKS).

## Architecture

- **Backend API:** Node.js/TypeScript Express server
- **Container Registry:** Azure Container Registry
- **Deployment:** Azure Web App + Azure Kubernetes Service (AKS)

## Project Structure

```
Week01/
├── backend/                 # Node.js API
│   ├── src/
│   │   └── index.ts        # Express server entry point
│   ├── Dockerfile          # Multi-stage Docker build
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+
- Docker Desktop
- Azure CLI (`az`)
- Git

## Local Development

### 1. Run API Locally

```bash
cd backend
npm install
npm run dev
```

API will be available at `http://localhost:3000`

### 2. Build Docker Image

```bash
cd backend
docker build -t backend:latest .
docker run -p 3000:3000 backend:latest
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

## API Endpoints

### Azure Web App (Step 1)
- **URL:** https://mindx-backend-08manh.azurewebsites.net
- **Health:** https://mindx-backend-08manh.azurewebsites.net/health

### AKS + Ingress (Step 3)
- **URL:** http://20.44.193.144
- **Health:** http://20.44.193.144/health
- **Root:** http://20.44.193.144/

**Note:** Both deployments are running simultaneously.

---

## Available Endpoints

- **Health Check:** `GET /health` → `{"status":"ok"}`
- **Hello World:** `GET /` → `{"message":"Hello from Azure!"}`

## References

- [Azure Documentation](https://docs.microsoft.com/azure)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)

