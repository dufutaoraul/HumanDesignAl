# Swiss Ephemeris 计算服务

这是一个独立的 Swiss Ephemeris 服务，为人类图计算提供精确的 True Node 计算。

## 部署到 Railway

1. 访问 https://railway.app
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择此仓库的 `swisseph-service` 目录
4. Railway 会自动检测 `package.json` 并部署
5. 部署完成后，复制服务的公开 URL（例如：`https://your-service.railway.app`）
6. 在 Vercel 项目中设置环境变量：
   - `SWISSEPH_SERVICE_URL` = `https://your-service.railway.app`

## 本地测试

```bash
cd swisseph-service
npm install
npm start
```

服务将运行在 `http://localhost:3100`

## API

### POST /calculate-node

计算指定时间的 True Node

请求体：
```json
{
  "date": "1983-10-15T03:40:00.000Z"
}
```

响应：
```json
{
  "success": true,
  "longitude": 77.123,
  "latitude": 0.0,
  "distance": 0.002569
}
```

### GET /health

健康检查

响应：
```json
{
  "status": "ok",
  "swissephReady": true,
  "error": null
}
```
