# Cursor MCP 使用指南

## 什么是 MCP？

MCP (Mission Control Protocol) 是一个强大的工具，它可以让你在 Cursor 编辑器中直接与 GitHub 进行交互，实现代码管理和版本控制的自动化。

## 主要功能

### 1. GitHub 仓库管理
- 创建新仓库
- 查看仓库列表
- 搜索仓库
- 管理仓库内容

### 2. 文件操作
- 创建/更新文件
- 读取文件内容
- 删除文件
- 批量推送文件

### 3. Issue 管理
- 创建 Issue
- 更新 Issue
- 添加评论
- 查看 Issue 列表

### 4. Pull Request 管理
- 创建 Pull Request
- 查看 PR 状态
- 合并 PR
- 审查代码

## 使用方法

1. **初始化设置**
   - 确保你已经安装了最新版本的 Cursor 编辑器
   - 登录你的 GitHub 账号
   - 配置 GitHub Token（如果需要）

2. **基本命令**
   ```bash
   # 查看仓库列表
   mcp_github_search_repositories

   # 创建新仓库
   mcp_github_create_repository

   # 创建或更新文件
   mcp_github_create_or_update_file

   # 创建 Pull Request
   mcp_github_create_pull_request
   ```

3. **最佳实践**
   - 使用有意义的提交信息
   - 遵循项目的分支策略
   - 及时同步代码变更
   - 做好代码审查

## 注意事项

1. 权限管理
   - 确保你有足够的权限执行相应操作
   - 谨慎处理敏感信息

2. 安全建议
   - 不要在公开仓库中存储敏感信息
   - 定期更新访问令牌
   - 及时清理不需要的权限

## 常见问题

1. Q: 如何处理认证失败？
   A: 检查 Token 是否有效，必要时重新生成

2. Q: 如何解决冲突？
   A: 先同步远程代码，解决冲突后再提交

3. Q: 操作超时怎么办？
   A: 检查网络连接，必要时重试操作

## 更多资源

- [Cursor 官方文档](https://cursor.sh/)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [MCP 项目主页](https://github.com/mogewcy/test2025)

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个指南！

## 许可证

MIT License