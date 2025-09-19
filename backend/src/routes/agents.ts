/**
 * AgentOps monitoring and management routes
 */

import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { z } from 'zod';

const agentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.string().min(1),
  config: z.record(z.any()).default({}),
  capabilities: z.array(z.string()).default([]),
});

const updateAgentSchema = agentSchema.partial();

const sessionSchema = z.object({
  sessionType: z.string(),
  metadata: z.record(z.any()).default({}),
});

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
    username: string;
    organizationId?: string;
  };
}

export const agentRoutes: FastifyPluginAsync = async (fastify) => {
  
  // Get all agents for organization
  fastify.get('/', {
    schema: {
      description: 'Get all agents for organization',
      tags: ['Agents'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['IDLE', 'BUSY', 'ERROR', 'OFFLINE'] },
          type: { type: 'string' },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            agents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string' },
                  status: { type: 'string' },
                  totalSessions: { type: 'number' },
                  totalRequests: { type: 'number' },
                  avgResponseTime: { type: 'number' },
                  successRate: { type: 'number' },
                  lastActive: { type: 'string', format: 'date-time' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            total: { type: 'number' },
            page: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  }, async (request: AuthenticatedRequest) => {
    const { status, type, page = 1, limit = 20 } = request.query as any;
    
    if (!request.user.organizationId) {
      throw fastify.httpErrors.forbidden('Organization membership required');
    }

    const where = {
      organizationId: request.user.organizationId,
      ...(status && { status }),
      ...(type && { type }),
    };

    const [agents, total] = await Promise.all([
      fastify.prisma.agent.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          status: true,
          totalSessions: true,
          totalRequests: true,
          avgResponseTime: true,
          successRate: true,
          lastActive: true,
          createdAt: true,
        },
      }),
      fastify.prisma.agent.count({ where }),
    ]);

    return {
      agents,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  });

  // Get specific agent details
  fastify.get('/:id', {
    schema: {
      description: 'Get specific agent details',
      tags: ['Agents'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  }, async (request: AuthenticatedRequest) => {
    const { id } = request.params as { id: string };
    
    if (!request.user.organizationId) {
      throw fastify.httpErrors.forbidden('Organization membership required');
    }

    const agent = await fastify.prisma.agent.findFirst({
      where: {
        id,
        organizationId: request.user.organizationId,
      },
      include: {
        sessions: {
          orderBy: { startedAt: 'desc' },
          take: 10,
          select: {
            id: true,
            sessionType: true,
            status: true,
            requestCount: true,
            totalTokens: true,
            avgLatency: true,
            errorCount: true,
            startedAt: true,
            endedAt: true,
          },
        },
        metrics: {
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!agent) {
      throw fastify.httpErrors.notFound('Agent not found');
    }

    return { agent };
  });

  // Create new agent
  fastify.post('/', {
    schema: {
      description: 'Create new agent',
      tags: ['Agents'],
      security: [{ bearerAuth: [] }],
      body: agentSchema,
    },
  }, async (request: AuthenticatedRequest) => {
    const data = request.body as z.infer<typeof agentSchema>;
    
    if (!request.user.organizationId) {
      throw fastify.httpErrors.forbidden('Organization membership required');
    }

    const agent = await fastify.prisma.agent.create({
      data: {
        ...data,
        organizationId: request.user.organizationId,
      },
    });

    // Create initial health metric
    await fastify.prisma.agentMetric.create({
      data: {
        agentId: agent.id,
        metricType: 'health',
        value: 100,
        unit: 'percentage',
        tags: { source: 'system', event: 'agent_created' },
      },
    });

    return { agent };
  });

  // Update agent
  fastify.patch('/:id', {
    schema: {
      description: 'Update agent configuration',
      tags: ['Agents'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: updateAgentSchema,
    },
  }, async (request: AuthenticatedRequest) => {
    const { id } = request.params as { id: string };
    const data = request.body as z.infer<typeof updateAgentSchema>;
    
    if (!request.user.organizationId) {
      throw fastify.httpErrors.forbidden('Organization membership required');
    }

    // Verify ownership
    const existingAgent = await fastify.prisma.agent.findFirst({
      where: { id, organizationId: request.user.organizationId },
    });

    if (!existingAgent) {
      throw fastify.httpErrors.notFound('Agent not found or access denied');
    }

    const agent = await fastify.prisma.agent.update({
      where: { id },
      data,
    });

    return { agent };
  });

  // Start agent session
  fastify.post('/:id/sessions', {
    schema: {
      description: 'Start new agent session',
      tags: ['Agents'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: sessionSchema,
    },
  }, async (request: AuthenticatedRequest) => {
    const { id } = request.params as { id: string };
    const data = request.body as z.infer<typeof sessionSchema>;
    
    if (!request.user.organizationId) {
      throw fastify.httpErrors.forbidden('Organization membership required');
    }

    // Verify agent exists and user has access
    const agent = await fastify.prisma.agent.findFirst({
      where: { id, organizationId: request.user.organizationId },
    });

    if (!agent) {
      throw fastify.httpErrors.notFound('Agent not found or access denied');
    }

    const session = await fastify.prisma.agentSession.create({
      data: {
        ...data,
        agentId: id,
        userId: request.user.id,
      },
    });

    // Update agent status and last active
    await fastify.prisma.agent.update({
      where: { id },
      data: {
        status: 'BUSY',
        lastActive: new Date(),
        totalSessions: { increment: 1 },
      },
    });

    return { session };
  });

  // Get agent sessions
  fastify.get('/:id/sessions', {
    schema: {
      description: 'Get agent sessions',
      tags: ['Agents'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['ACTIVE', 'COMPLETED', 'FAILED', 'TIMEOUT'] },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
        },
      },
    },
  }, async (request: AuthenticatedRequest) => {
    const { id } = request.params as { id: string };
    const { status, page = 1, limit = 20 } = request.query as any;
    
    if (!request.user.organizationId) {
      throw fastify.httpErrors.forbidden('Organization membership required');
    }

    // Verify agent access
    const agent = await fastify.prisma.agent.findFirst({
      where: { id, organizationId: request.user.organizationId },
    });

    if (!agent) {
      throw fastify.httpErrors.notFound('Agent not found or access denied');
    }

    const where = {
      agentId: id,
      ...(status && { status }),
    };

    const [sessions, total] = await Promise.all([
      fastify.prisma.agentSession.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      }),
      fastify.prisma.agentSession.count({ where }),
    ]);

    return {
      sessions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  });

  // Get agent metrics
  fastify.get('/:id/metrics', {
    schema: {
      description: 'Get agent performance metrics',
      tags: ['Agents'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      querystring: {
        type: 'object',
        properties: {
          metricType: { type: 'string' },
          timeRange: { type: 'string', enum: ['1h', '24h', '7d', '30d'], default: '24h' },
          interval: { type: 'string', enum: ['1m', '5m', '1h', '1d'], default: '5m' },
        },
      },
    },
  }, async (request: AuthenticatedRequest) => {
    const { id } = request.params as { id: string };
    const { metricType, timeRange = '24h', interval = '5m' } = request.query as any;
    
    if (!request.user.organizationId) {
      throw fastify.httpErrors.forbidden('Organization membership required');
    }

    // Verify agent access
    const agent = await fastify.prisma.agent.findFirst({
      where: { id, organizationId: request.user.organizationId },
    });

    if (!agent) {
      throw fastify.httpErrors.notFound('Agent not found or access denied');
    }

    // Calculate time range
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const since = new Date(Date.now() - timeRangeMs[timeRange as keyof typeof timeRangeMs]);

    const where = {
      agentId: id,
      timestamp: { gte: since },
      ...(metricType && { metricType }),
    };

    const metrics = await fastify.prisma.agentMetric.findMany({
      where,
      orderBy: { timestamp: 'asc' },
    });

    // Group metrics by interval for charting
    const groupedMetrics = fastify.metricsCollector.groupMetricsByInterval(metrics, interval);

    return {
      metrics: groupedMetrics,
      timeRange,
      interval,
      total: metrics.length,
    };
  });
};