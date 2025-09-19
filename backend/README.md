# AI Engines Dashboard - Backend API

High-performance Fastify backend for the AI Engines Platform Dashboard, providing comprehensive monitoring for AgentOps and Sacred Codex management.

## Features

### 🤖 AgentOps Monitoring
- **Real-time Agent Tracking**: Monitor AI agent performance, sessions, and health
- **Performance Analytics**: Latency, token usage, success rates, and error tracking
- **Session Management**: Complete lifecycle tracking from start to completion
- **Health Monitoring**: Automated health checks and alerting

### 📜 Sacred Codex Management
- **Knowledge Repository**: Store and organize mystical knowledge and wisdom
- **Semantic Search**: Vector-based search with AI embeddings
- **Wisdom Levels**: Hierarchical knowledge organization (1-10 scale)
- **Arcane Power Tracking**: Quantify the power and importance of entries

### 📊 Analytics & Insights
- **Real-time Dashboards**: Customizable dashboard builder
- **Performance Metrics**: Comprehensive analytics with historical data
- **Predictive Insights**: AI-powered performance predictions
- **Custom Reports**: Flexible reporting system

### 🔔 Alert System
- **Intelligent Alerts**: Smart notifications for critical events
- **Multi-channel Notifications**: Email, SMS, webhook, and in-app alerts
- **Alert Routing**: Role-based alert distribution
- **Alert Analytics**: Track alert patterns and response times

### 🔌 Real-time Updates
- **WebSocket Support**: Live data streaming to frontend
- **Event Broadcasting**: Real-time event propagation
- **Presence Tracking**: User activity monitoring
- **Live Collaboration**: Real-time multi-user features

## Tech Stack

- **Fastify**: High-performance Node.js framework (50k+ req/s)
- **TypeScript**: Full type safety and modern development
- **Prisma**: Type-safe database ORM with PostgreSQL
- **Redis**: High-performance caching and real-time features
- **WebSockets**: Real-time bidirectional communication
- **JWT**: Secure authentication and authorization
- **Swagger**: Auto-generated API documentation

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Redis 6+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Configure your environment
# Edit .env with database URLs, API keys, etc.

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed sample data (optional)
pnpm db:seed

# Start development server
pnpm dev
```

### Database Setup

```bash
# Create PostgreSQL database
createdb ai_engines_dashboard

# Apply schema
pnpm db:push

# View database in Prisma Studio
pnpm db:studio
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update user profile

### AgentOps Monitoring
- `GET /api/agents` - List organization agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent details
- `PATCH /api/agents/:id` - Update agent configuration
- `POST /api/agents/:id/sessions` - Start agent session
- `GET /api/agents/:id/sessions` - Get agent sessions
- `GET /api/agents/:id/metrics` - Get agent performance metrics

### Sacred Codex
- `GET /api/codex` - Browse codex entries
- `POST /api/codex` - Create new entry
- `GET /api/codex/:id` - Get specific entry
- `PATCH /api/codex/:id` - Update entry
- `DELETE /api/codex/:id` - Delete entry
- `POST /api/codex/search` - Semantic search
- `GET /api/codex/categories` - Get category hierarchy

### Analytics
- `GET /api/analytics/overview` - System overview metrics
- `GET /api/analytics/agents` - Agent performance analytics
- `GET /api/analytics/codex` - Codex usage analytics
- `GET /api/analytics/users` - User activity analytics
- `POST /api/analytics/custom` - Custom analytics queries

### Alerts
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create custom alert
- `PATCH /api/alerts/:id` - Update alert status
- `DELETE /api/alerts/:id` - Delete alert
- `POST /api/alerts/:id/acknowledge` - Acknowledge alert

### Dashboards
- `GET /api/dashboards` - List user dashboards
- `POST /api/dashboards` - Create new dashboard
- `GET /api/dashboards/:id` - Get dashboard configuration
- `PATCH /api/dashboards/:id` - Update dashboard
- `DELETE /api/dashboards/:id` - Delete dashboard

### Health & Monitoring
- `GET /api/health` - System health check
- `GET /api/health/services` - Service health status
- `GET /api/health/metrics` - System performance metrics

## WebSocket Events

### Connection
- `ws://localhost:4000/ws` - Main WebSocket endpoint

### Events
- `agent:status` - Agent status changes
- `agent:metrics` - Real-time agent metrics
- `codex:update` - Codex entry updates
- `alert:new` - New alert notifications
- `dashboard:update` - Dashboard data updates
- `system:health` - System health changes

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create and run migrations
pnpm db:seed          # Seed sample data
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # Run TypeScript checks
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage

# Docker
pnpm docker:build     # Build Docker image
pnpm docker:run       # Run in Docker container
```

### Project Structure

```
src/
├── routes/           # API route handlers
│   ├── auth.ts      # Authentication
│   ├── agents.ts    # AgentOps monitoring
│   ├── codex.ts     # Sacred Codex management
│   ├── analytics.ts # Analytics and insights
│   ├── alerts.ts    # Alert management
│   ├── dashboards.ts # Dashboard builder
│   └── health.ts    # Health monitoring
├── services/         # Business logic services
│   ├── HealthMonitor.ts # System health monitoring
│   ├── MetricsCollector.ts # Metrics aggregation
│   ├── AlertManager.ts # Alert processing
│   └── CodexService.ts # Codex operations
├── websocket/        # WebSocket handlers
│   ├── index.ts     # WebSocket setup
│   ├── agents.ts    # Agent events
│   ├── codex.ts     # Codex events
│   └── alerts.ts    # Alert events
├── middleware/       # Custom middleware
│   ├── auth.ts      # JWT authentication
│   ├── rateLimit.ts # Rate limiting
│   └── errorHandler.ts # Error handling
├── schemas/          # Zod validation schemas
├── types/           # TypeScript definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/ai_engines_dashboard"
REDIS_URL="redis://localhost:6379"

# Security
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# External APIs
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
AGENTOPS_API_URL="https://api.agentops.ai"
AGENTOPS_API_KEY="your-agentops-api-key"
SACRED_CODEX_API_URL="https://api.sacredcodex.ai"
SACRED_CODEX_API_KEY="your-sacred-codex-api-key"

# Rate Limiting
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=60000

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# Monitoring
HEALTH_CHECK_INTERVAL=30000
METRICS_RETENTION_DAYS=30
LOG_LEVEL=info
```

## Performance Features

### High-Performance Architecture
- **Fastify Framework**: 50k+ requests/second capability
- **Redis Caching**: Ultra-fast data access and session storage
- **Connection Pooling**: Optimized database connections
- **Response Compression**: Gzip/Brotli compression
- **Query Optimization**: Efficient database queries with proper indexing

### Real-time Features
- **WebSocket Clustering**: Scale WebSocket connections across instances
- **Event Broadcasting**: Efficient real-time event distribution
- **Presence System**: Track online users and active sessions
- **Live Data Streaming**: Real-time metrics and updates

### Scalability
- **Horizontal Scaling**: Stateless design for multi-instance deployment
- **Load Balancing**: Redis-based session sharing
- **Microservice Ready**: Modular architecture for service extraction
- **Container Support**: Docker and Kubernetes ready

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Granular permission system
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Redis-based distributed rate limiting
- **SQL Injection Protection**: Prisma ORM prevents injections
- **CORS Configuration**: Secure cross-origin requests
- **Security Headers**: Comprehensive security middleware

## Monitoring & Observability

### Health Monitoring
- **Service Health**: Monitor all critical services
- **Database Health**: Connection and query performance
- **Redis Health**: Cache performance and connectivity
- **External API Health**: Monitor third-party service availability

### Metrics Collection
- **Performance Metrics**: Response times, throughput, error rates
- **Business Metrics**: Agent usage, codex activity, user engagement
- **System Metrics**: CPU, memory, disk usage
- **Custom Metrics**: Configurable business intelligence

### Alerting
- **Smart Alerts**: AI-powered alert correlation and filtering
- **Multi-channel**: Email, SMS, Slack, webhook notifications
- **Escalation**: Automatic alert escalation policies
- **Analytics**: Alert pattern analysis and optimization

## Deployment

### Docker Deployment

```bash
# Build production image
docker build -t ai-engines-dashboard-backend .

# Run with docker-compose
docker-compose up -d
```

### Production Deployment

```bash
# Install production dependencies
pnpm install --prod

# Build application
pnpm build

# Start production server
pnpm start
```

### Environment-specific Configuration

```bash
# Production
NODE_ENV=production
LOG_LEVEL=warn
RATE_LIMIT_MAX=5000

# Staging
NODE_ENV=staging
LOG_LEVEL=info
RATE_LIMIT_MAX=1000

# Development
NODE_ENV=development
LOG_LEVEL=debug
RATE_LIMIT_MAX=100
```

## API Documentation

Interactive API documentation is available at `/docs` when running the server. The documentation includes:

- Complete endpoint reference
- Request/response schemas
- Authentication examples
- WebSocket event documentation
- Error code reference

## Testing

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test agents

# Run with coverage
pnpm test:coverage

# Watch mode for development
pnpm test:watch

# Integration tests
pnpm test:integration

# Load testing
pnpm test:load
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Run quality checks: `pnpm lint && pnpm typecheck && pnpm test`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT License - see LICENSE file for details.

---

## Support

- 📚 Documentation: `/docs` endpoint
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Email: support@ai-engines.com

**Built with ❤️ for the AI Engines Platform**