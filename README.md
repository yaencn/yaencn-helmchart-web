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
- 前端界面: `http://localhost` (frontend 服务在容器中通过 80 端口提供静态文件)
- 后端 API: `http://localhost:8000`（直接访问后端）
- API 文档: `http://localhost/api/v1/docs` 或 `http://localhost:8000/docs`

### 3. 开发环境运行

> 以下为在本地机器上单独启动后端与前端进行开发调试的推荐步骤（非 Docker）。

#### 后端（本地 Python 虚拟环境）
```bash
# 进入后端目录
cd backend

# 1) 创建并激活虚拟环境（macOS / Linux）
python3 -m venv .venv
source .venv/bin/activate

# 2) 安装依赖
pip install -r requirements.txt

# 3) 启动开发服务器（带自动重载）
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 检查后端是否运行（可在另一个终端执行）
curl http://localhost:8000/
```

默认后端地址： http://localhost:8000 ，API 文档： http://localhost:8000/docs

要停止后端：在运行 uvicorn 的终端按 `Ctrl+C`，或使用
```bash
pkill -f "uvicorn app.main" || true
```

#### 前端（Vite 开发服务器）
```bash
# 进入前端目录
cd frontend

# 1) 安装依赖（首次）
npm install

# 2) 启动开发服务器，允许局域网访问
npm run dev -- --host 0.0.0.0

# 默认前端地址（本机）
# http://localhost:5173/
```

要停止前端开发服务器：在运行 Vite 的终端按 `Ctrl+C`，或使用
```bash
pkill -f "vite" || true
```

如果希望用 Docker 一键运行（推荐用于接近生产的部署），仍可使用：
```bash
docker-compose up -d --build
```

可配置项（可通过环境变量或在 `docker-compose.yml` 中设置）：
- `SECRET_KEY`：后端 JWT 秘钥，默认为 `your-secret-key-here`（生产环境请自定义）。
- `VITE_BACKEND_URL`：前端构建时用到的后端地址（默认 `http://localhost:8000`）。
- `VITE_CHARTS_BASE`：charts 静态路径（默认 `/charts`）。

- `SQLALCHEMY_DATABASE_URL`：后端数据库连接 URL，默认指向容器内的 SQLite 文件 `sqlite:////app/sql_app.db`。建议在生产环境使用绝对路径并在 `docker-compose.yml` 中挂载宿主持久化文件，例如：
  ```bash
  SQLALCHEMY_DATABASE_URL=sqlite:////data/yaencn/sql_app.db docker-compose up -d --build
  ```

- 初始管理员（仅在首次容器启动且数据库不存在时自动创建）：用户名 `admin`，默认密码 `admin123`。生产环境强烈建议在启动后立即更改或通过环境变量/脚本自定义管理员账号。

- 初始管理员（可通过环境变量配置）：
  - `INITIAL_ADMIN_USER`：默认 `admin`
  - `INITIAL_ADMIN_PASS`：默认 `admin123`
  示例（生产替换默认密码）：
  ```bash
  INITIAL_ADMIN_USER=admin INITIAL_ADMIN_PASS='S3cureP@ss' docker-compose up -d --build
  ```

示例：在 Linux/macOS 上使用自定义后端地址并构建：
```bash
VITE_BACKEND_URL=https://api.example.com SECRET_KEY=mysecret docker-compose up -d --build
```

#### 一键脚本（本地开发）

项目提供方便的一键脚本，位于 `scripts/`：

- `scripts/start-local.sh`：创建后端虚拟环境（如果不存在）、安装依赖并后台启动后端与前端，日志与 pid 写入 `logs/`。
- `scripts/stop-local.sh`：停止由 `start-local.sh` 启动的进程并清理 pid 文件。

示例：
```bash
# 在仓库根目录运行（会在 logs/ 生成日志与 pid 文件）
bash scripts/start-local.sh

# 停止
bash scripts/stop-local.sh

# 查看日志
ls -la logs
tail -n 200 logs/backend.log
tail -n 200 logs/frontend.log
```

注意：如果需要让脚本可直接执行，请运行：
```bash
chmod +x scripts/*.sh
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

## 初始化管理员账号

项目提供了一个便捷脚本 `backend/create_admin.py`，用于在本地 SQLite 数据库中创建或更新管理员账户（将 `is_superuser` 设为 true）。脚本使用 bcrypt 哈希密码，依赖 `passlib`，建议在后端虚拟环境中运行。

用法示例：
```bash
# 进入后端目录（确保使用与后端相同的工作目录）
cd backend
# 在交互式提示下输入密码
python create_admin.py --username admin

# 或者在命令行中一次性提供密码（注意安全性）
python create_admin.py --username admin --password "YourStrongPassword"
```

脚本将创建 `sql_app.db`（如果不存在）并插入或更新 `users` 表中的记录。

在使用 Docker 部署时，也可以在宿主机运行脚本，或在容器内运行：
```bash
# 在容器内运行（容器运行时）
docker-compose exec backend python create_admin.py --username admin
```


## 技术栈
- **后端**: FastAPI, SQLAlchemy, SQLite, ruamel.yaml
- **前端**: Vue 3, Vite, Element Plus, Tailwind CSS
- **部署**: Docker, Nginx
