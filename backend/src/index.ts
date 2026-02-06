import crypto from 'crypto';
// Polyfill crypto for App Insights
(global as any).crypto = crypto;

import * as appInsights from 'applicationinsights';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize Azure Application Insights (Must be before other modules)
dotenv.config();

if (process.env.APPINSIGHTS_CONNECTION_STRING) {
    appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING)
        .setAutoCollectConsole(true, true) // Enable console logging to Azure
        .setAutoCollectRequests(true)
        .setAutoCollectExceptions(true)
        .start();
    console.log("Azure Application Insights started");
} else {
    console.warn("No APPINSIGHTS_CONNECTION_STRING found");
}

import authRoutes from './routes/auth.route';
import apiRoutes from './routes/api.route';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
