# Yaencn HelmChart 仓库管理系统

这是一个基于 Python FastAPI 和 Vue 3 开发的 Helm Chart 仓库管理系统。

## 功能特性
- **Chart 管理**: 支持上传 `.tgz` 包，自动解析元数据并生成 `index.yaml`。
- **前后端分离**: 后端 FastAPI 提供 RESTful API，前端 Vue 3 提供现代化的 UI 界面。
- **权限管理**: 集成 JWT 认证与 RBAC 权限控制（管理员可上传/删除）。
- **Docker 部署**: 支持使用 Docker Compose 一键部署。

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd yaencn-helmchart-web
```

### 2. 启动服务
使用 Docker Compose 启动所有服务：
```bash
docker-compose up -d --build
```

启动后：
- 前端界面: `http://localhost`
- API 文档: `http://localhost/api/v1/docs` (通过 Nginx 转发) 或 `http://localhost:8000/docs` (直接访问后端)

### 3. 开发环境运行

#### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### 前端
```bash
cd frontend
npm install
npm run dev
```

## 本地部署与测试流程

### 1. 环境准备
确保本地已安装：
- Docker 和 Docker Compose
- Helm (用于生成测试用的 .tgz 包)

### 2. 快速部署
在项目根目录下执行：
```bash
docker-compose up -d --build
```

### 3. 功能测试步骤

#### A. 准备测试 Chart 包
如果您本地没有现成的 Chart，可以快速创建一个：
```bash
helm create mytest-chart
helm package mytest-chart
# 这将生成 mytest-chart-0.1.0.tgz
```

#### B. 测试上传 API
由于目前系统集成了权限校验，您可以通过以下方式测试上传（开发模式下可临时关闭 `deps.py` 中的校验）：
```bash
curl -X POST http://localhost/api/v1/charts/upload \
  -F "file=@mytest-chart-0.1.0.tgz"
```
*注意：生产环境下需先调用登录接口获取 JWT Token 并在 Header 中携带。*

#### C. 验证仓库索引
访问以下地址查看自动生成的 `index.yaml`：
```bash
curl http://localhost/charts/index.yaml
```

#### D. 验证前端展示
打开浏览器访问 `http://localhost`，您应该能看到刚才上传的 `mytest-chart` 以卡片形式展示在首页。

#### E. 使用 Helm 客户端测试
将您的本地系统添加为 Helm 仓库：
```bash
helm repo add local-yaencn http://localhost/charts
helm repo update
helm search repo local-yaencn
```

## 技术栈
- **后端**: FastAPI, SQLAlchemy, SQLite, ruamel.yaml
- **前端**: Vue 3, Vite, Element Plus, Tailwind CSS
- **部署**: Docker, Nginx
