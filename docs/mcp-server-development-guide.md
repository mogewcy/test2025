# MCP Server 开发教程

本教程将指导您如何开发一个 MCP Server，包含完整的示例代码和详细说明。

## 目录

- [环境准备](#环境准备)
- [项目结构](#项目结构)
- [基础实现](#基础实现)
- [高级功能](#高级功能)
- [部署指南](#部署指南)
- [最佳实践](#最佳实践)

## 环境准备

### 技术栈
- Node.js (v16+)
- TypeScript
- Express
- WebSocket
- MongoDB

### 安装依赖

```bash
mkdir mcp-server
cd mcp-server
npm init -y

# 安装核心依赖
npm install express ws typescript mongoose dotenv @types/node @types/express @types/ws

# 开发依赖
npm install -D ts-node nodemon jest @types/jest
```

### 配置 TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

## 项目结构

```
mcp-server/
├── src/
│   ├── config/
│   │   ├── index.ts
│   │   └── database.ts
│   ├── controllers/
│   │   ├── githubController.ts
│   │   └── wsController.ts
│   ├── models/
│   │   ├── Session.ts
│   │   └── User.ts
│   ├── services/
│   │   ├── githubService.ts
│   │   └── wsService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── validator.ts
│   ├── routes/
│   │   ├── api.ts
│   │   └── ws.ts
│   └── app.ts
├── tests/
│   └── integration/
├── .env
├── package.json
└── README.md
```

## 基础实现

### 1. 配置环境变量

```typescript
// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/mcp',
  githubToken: process.env.GITHUB_TOKEN,
  wsPort: process.env.WS_PORT || 8080
};
```

### 2. 设置数据库连接

```typescript
// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './index';

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
```

### 3. 定义类型

```typescript
// src/types/index.ts
export interface MCPMessage {
  type: 'command' | 'response' | 'error';
  payload: any;
  sessionId: string;
}

export interface MCPSession {
  id: string;
  userId: string;
  createdAt: Date;
  lastActive: Date;
}

export interface MCPCommand {
  name: string;
  parameters: Record<string, any>;
}
```

### 4. 实现 WebSocket 服务

```typescript
// src/services/wsService.ts
import WebSocket from 'ws';
import { MCPMessage, MCPCommand } from '../types';

export class WSService {
  private wss: WebSocket.Server;

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port });
    this.init();
  }

  private init() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected');

      ws.on('message', async (message: string) => {
        try {
          const mcpMessage: MCPMessage = JSON.parse(message);
          await this.handleMessage(ws, mcpMessage);
        } catch (error) {
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

  private async handleMessage(ws: WebSocket, message: MCPMessage) {
    const { type, payload, sessionId } = message;

    switch (type) {
      case 'command':
        await this.executeCommand(ws, payload as MCPCommand, sessionId);
        break;
      default:
        this.sendError(ws, 'Unknown message type');
    }
  }

  private async executeCommand(ws: WebSocket, command: MCPCommand, sessionId: string) {
    try {
      // 实现命令执行逻辑
      const result = await this.processCommand(command);
      
      this.sendResponse(ws, {
        type: 'response',
        payload: result,
        sessionId
      });
    } catch (error) {
      this.sendError(ws, error.message);
    }
  }

  private async processCommand(command: MCPCommand) {
    // 实现具体的命令处理逻辑
    switch (command.name) {
      case 'github_search_repositories':
        return await this.handleGithubSearch(command.parameters);
      // 添加更多命令处理
      default:
        throw new Error(`Unknown command: ${command.name}`);
    }
  }

  private sendResponse(ws: WebSocket, message: MCPMessage) {
    ws.send(JSON.stringify(message));
  }

  private sendError(ws: WebSocket, error: string) {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: error }
    }));
  }
}
```

### 5. GitHub 服务实现

```typescript
// src/services/githubService.ts
import { Octokit } from '@octokit/rest';
import { config } from '../config';

export class GitHubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: config.githubToken
    });
  }

  async searchRepositories(query: string) {
    try {
      const response = await this.octokit.search.repos({
        q: query,
        sort: 'stars',
        order: 'desc'
      });
      return response.data;
    } catch (error) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  async createRepository(name: string, options: any) {
    try {
      const response = await this.octokit.repos.createForAuthenticatedUser({
        name,
        ...options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create repository: ${error.message}`);
    }
  }

  // 添加更多 GitHub API 方法
}
```

### 6. 主应用程序

```typescript
// src/app.ts
import express from 'express';
import { config } from './config';
import { connectDB } from './config/database';
import { WSService } from './services/wsService';

async function bootstrap() {
  // 连接数据库
  await connectDB();

  // 创建 Express 应用
  const app = express();
  app.use(express.json());

  // 设置路由
  app.use('/api', require('./routes/api'));

  // 启动 WebSocket 服务
  const wsService = new WSService(Number(config.wsPort));

  // 启动 HTTP 服务器
  app.listen(config.port, () => {
    console.log(`HTTP server running on port ${config.port}`);
    console.log(`WebSocket server running on port ${config.wsPort}`);
  });
}

bootstrap().catch(console.error);
```

## 高级功能

### 1. 会话管理

```typescript
// src/models/Session.ts
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  id: String,
  userId: String,
  createdAt: Date,
  lastActive: Date,
  data: mongoose.Schema.Types.Mixed
});

export const Session = mongoose.model('Session', sessionSchema);
```

### 2. 用户认证

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### 3. 命令队列

```typescript
// src/services/queueService.ts
import Queue from 'bull';

export class CommandQueue {
  private queue: Queue.Queue;

  constructor() {
    this.queue = new Queue('mcp-commands', {
      redis: {
        port: 6379,
        host: 'localhost'
      }
    });

    this.queue.process(async (job) => {
      return await this.processCommand(job.data);
    });
  }

  async addCommand(command: MCPCommand) {
    return await this.queue.add(command);
  }

  private async processCommand(command: MCPCommand) {
    // 实现命令处理逻辑
  }
}
```

## 部署指南

### Docker 部署

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000 8080

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3'
services:
  mcp-server:
    build: .
    ports:
      - "3000:3000"
      - "8080:8080"
    environment:
      - MONGO_URI=mongodb://mongo:27017/mcp
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis
    ports:
      - "6379:6379"

volumes:
  mongodb_data:
```

## 最佳实践

### 1. 错误处理

```typescript
// src/utils/errorHandler.ts
export class MCPError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

export function handleError(error: any) {
  if (error instanceof MCPError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    status: 500
  };
}
```

### 2. 日志记录

```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 3. 监控

```typescript
// src/utils/monitoring.ts
import prometheus from 'prom-client';

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics();

export const wsConnectionsGauge = new prometheus.Gauge({
  name: 'ws_connections_total',
  help: 'Total number of WebSocket connections'
});

export const commandCounter = new prometheus.Counter({
  name: 'mcp_commands_total',
  help: 'Total number of MCP commands executed',
  labelNames: ['command_name', 'status']
});
```

## 示例用法

```typescript
// 客户端示例代码
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  // 发送命令
  ws.send(JSON.stringify({
    type: 'command',
    payload: {
      name: 'github_search_repositories',
      parameters: {
        query: 'language:javascript stars:>1000'
      }
    },
    sessionId: 'unique-session-id'
  }));
};

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log('Received:', response);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};
```

## 测试

```typescript
// tests/integration/github.test.ts
import { GitHubService } from '../../src/services/githubService';

describe('GitHub Service', () => {
  let githubService: GitHubService;

  beforeAll(() => {
    githubService = new GitHubService();
  });

  it('should search repositories', async () => {
    const result = await githubService.searchRepositories('language:typescript');
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });
});
```

## 安全考虑

1. 使用环境变量存储敏感信息
2. 实施速率限制
3. 验证所有输入
4. 使用 HTTPS/WSS
5. 定期更新依赖

## 性能优化

1. 使用连接池
2. 实现缓存策略
3. 压缩响应
4. 批处理操作
5. 使用数据库索引

## 故障排除

常见问题及解决方案：

1. 连接问题
   - 检查网络配置
   - 验证端口是否开放
   - 确认服务器状态

2. 认证错误
   - 验证 token 是否有效
   - 检查权限设置
   - 确认用户状态

3. 性能问题
   - 检查服务器负载
   - 监控内存使用
   - 优化数据库查询

## 参考资源

- [Node.js 文档](https://nodejs.org/docs)
- [WebSocket 规范](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [MongoDB 文档](https://docs.mongodb.com)