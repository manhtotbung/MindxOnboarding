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

## API Endpoints

- **Health Check:** `GET /health`
- **Hello World:** `GET /`

### Live URLs

- **Azure Web App:** https://mindx-backend-08manh.azurewebsites.net

## References

- [Azure Documentation](https://docs.microsoft.com/azure)
