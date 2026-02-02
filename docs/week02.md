# Week 2: Metrics Setup & Monitoring

## Overview
This document details the implementation of **Product Metrics** (Frontend) and **Production Metrics** (Backend) for the MindX Onboarding Project.

---

## 1. Product Metrics (Frontend)
**Tool:** Google Analytics 4 (GA4)

### Purpose
To track user behavior, page views, and interactions within the React application.

### Implementation Details
- **Library:** `react-ga4`
- **Configuration:**
  - Measurement ID is loaded from environment variable: `VITE_GA_MEASUREMENT_ID`
  - Initialization logic is in `src/main.tsx`

### Metrics Tracked
- **Page Views:** Automatically tracked when the app loads.
- **Custom Events:**
  - `Click Login Button` (Category: Auth)
  - `Click Logout Button` (Category: Auth)

### How to Access Dashboard
1. Go to [analytics.google.com](https://analytics.google.com/)
2. Select property: `My React App` (or your project name)
3. Navigate to **Reports** -> **Realtime** to see live data.

---

## 2. Production Metrics (Backend)
**Tool:** Azure Application Insights

### Purpose
To monitor system health, performance, exceptions, and request latency of the Node.js API.

### Implementation Details
- **Library:** `applicationinsights` (Official Microsoft SDK for Node.js)
- **Configuration:**
  - Connection String is loaded from environment variable: `APPINSIGHTS_CONNECTION_STRING`
  - Initialization logic is in `src/index.ts` (must run before other imports)

### Metrics Tracked
- **Request Rate & Response Time:** How fast the API responds.
- **Failures:** 500 errors or unhandled exceptions.
- **Live Metrics:** Real-time visibility into CPU/Memory usage.
- **Process Telemetry:** Node.js process health.

### How to Access Dashboard
1. Go to [portal.azure.com](https://portal.azure.com/)
2. Search and select resource: **`Backend-Metrics`** (Application Insights)
3. Key sections to check:
   - **Live Metrics:** See real-time request flow.
   - **Failures:** Debug errors and exceptions.
   - **Performance:** Analyze slow APIs.

---

## 3. Alerts Configuration
Basic alerts can be configured in Azure Portal to notify admins via email:
- **Condition:** Failure rate greater than 5% in last 5 minutes.
- **Action:** Send email to admin.

---

## 4. Local Verification
To verify metrics locally:
1. Check browser console for `GA Initialized` (Frontend).
2. Check terminal console for `Azure Application Insights started` (Backend).
