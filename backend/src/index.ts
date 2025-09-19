/**
 * AI Engines Dashboard - Backend API
 * High-performance Fastify server for AgentOps monitoring and Sacred Codex management
 */

import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';

import { authRoutes } from './routes/auth.js';
import { agentRoutes } from './routes/agents.js';
import { codexRoutes } from './routes/codex.js';
import { analyticsRoutes } from './routes/analytics.js';
import { alertRoutes } from './routes/alerts.js';
import { dashboardRoutes } from './routes/dashboards.js';
import { healthRoutes } from './routes/health.js';

import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { setupWebSocket } from './websocket/index.js';
import { HealthMonitor } from './services/HealthMonitor.js';
import { MetricsCollector } from './services/MetricsCollector.js';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    } : undefined,
  },
});

// Global error handler
fastify.setErrorHandler(errorHandler);

// Register plugins
await fastify.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key',
});

await fastify.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX || '1000'),
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
  redis,
});

await fastify.register(websocket);

// Swagger documentation
await fastify.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'AI Engines Dashboard API',
      description: 'Backend API for AgentOps monitoring and Sacred Codex management',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Agents', description: 'AgentOps monitoring and management' },
      { name: 'Sacred Codex', description: 'Knowledge management and wisdom tracking' },
      { name: 'Analytics', description: 'Performance analytics and insights' },
      { name: 'Alerts', description: 'System alerts and notifications' },
      { name: 'Dashboards', description: 'Custom dashboard management' },
      { name: 'Health', description: 'System health and monitoring' },
    ],
  },
});

await fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

// Add dependencies to fastify instance
fastify.decorate('prisma', prisma);
fastify.decorate('redis', redis);

// Initialize monitoring services
const healthMonitor = new HealthMonitor(prisma, redis);
const metricsCollector = new MetricsCollector(prisma, redis);

fastify.decorate('healthMonitor', healthMonitor);
fastify.decorate('metricsCollector', metricsCollector);

// Setup WebSocket handlers
await setupWebSocket(fastify);

// Root endpoint
fastify.get('/', async () => {
  return {
    name: 'AI Engines Dashboard API',
    version: '1.0.0',
    description: 'Backend API for AgentOps monitoring and Sacred Codex management',
    docs: '/docs',
    websocket: '/ws',
    status: 'operational',
  };
});

// API routes
fastify.register(healthRoutes, { prefix: '/api/health' });
fastify.register(authRoutes, { prefix: '/api/auth' });

// Protected routes
fastify.register(async function (fastify) {
  await fastify.register(authMiddleware);
  
  fastify.register(agentRoutes, { prefix: '/api/agents' });
  fastify.register(codexRoutes, { prefix: '/api/codex' });
  fastify.register(analyticsRoutes, { prefix: '/api/analytics' });
  fastify.register(alertRoutes, { prefix: '/api/alerts' });
  fastify.register(dashboardRoutes, { prefix: '/api/dashboards' });
});

// Start background services
await healthMonitor.start();
await metricsCollector.start();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);
  
  try {
    await healthMonitor.stop();
    await metricsCollector.stop();
    await redis.disconnect();
    await prisma.$disconnect();
    await fastify.close();
    process.exit(0);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '4000');
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`🚀 AI Engines Dashboard API started on http://${host}:${port}`);
    fastify.log.info(`📚 API Documentation available at http://${host}:${port}/docs`);
    fastify.log.info(`🔌 WebSocket endpoint available at ws://${host}:${port}/ws`);
    fastify.log.info(`🤖 AgentOps monitoring: ACTIVE`);
    fastify.log.info(`📜 Sacred Codex management: ACTIVE`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();