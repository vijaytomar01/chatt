# Deploy Chatify

Your app uses **Socket.io** (real-time chat and calls). Use a platform that supports **long-lived WebSocket connections**. Recommended: **Railway** or **Render**.

---

## Option 1: Deploy on Railway (recommended)

Railway supports Node, WebSockets, and has a free tier.

### 1. Push code to GitHub

```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

### 2. Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in (e.g. with GitHub).
2. **New Project** → **Deploy from GitHub repo** → select your `chatify` repo.
3. Railway will detect the app. Configure the service:
   - **Root Directory:** leave as repo root (or set to `.`).
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Watch Paths:** leave default.

### 3. Set environment variables

In the Railway service → **Variables**, add:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Must be `production` | `production` |
| `PORT` | Railway sets this automatically; keep it if present | (optional) |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/chatify` |
| `JWT_SECRET` | Secret for JWT signing (long random string) | e.g. 32+ random chars |
| `CLIENT_URL` | Your app's public URL | `https://your-app.up.railway.app` |
| `RESEND_API_KEY` | Resend API key (emails) | From resend.com |
| `EMAIL_FROM` | Sender email for Resend | `onboarding@resend.dev` |
| `EMAIL_FROM_NAME` | Sender name | `Chatify` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary dashboard |
| `ARCJET_KEY` | Arcjet key (rate limiting) | From arcjet.dev (optional) |
| `ARCJET_ENV` | Arcjet environment | `production` |

After the first deploy, set **CLIENT_URL** to the URL Railway gives you (e.g. `https://chatify-production-xxxx.up.railway.app`), then redeploy once.

### 4. Deploy

Railway builds and runs your app. Open the generated URL. Socket.io and the API will work on the same domain.

---

## Option 2: Deploy on Render

Render also supports Node and WebSockets (free tier with spin-down).

### 1. Push code to GitHub

Same as above — ensure your repo is pushed.

### 2. Create a Web Service

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. **New** → **Web Service** → connect your `chatify` repo.
3. Configure:
   - **Name:** e.g. `chatify`
   - **Environment:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid for always-on)

### 3. Environment variables

In **Environment** add the same variables as in the Railway table above. Set **CLIENT_URL** to your Render URL, e.g. `https://chatify-xxxx.onrender.com`.

### 4. Deploy

Click **Create Web Service**. After deploy, open the service URL. Real-time features will work.

---

## Build and start commands (summary)

- **Build:** `npm run build`  
  (installs backend + frontend deps, builds frontend to `frontend/dist`)
- **Start:** `npm start`  
  (runs backend; in production it serves the frontend and API on one port)

---

## Vercel note

Your repo has a `vercel.json` config. **Vercel serverless functions do not support Socket.io** (no long-lived WebSockets). Deploying the current app to Vercel would give you a working REST API and frontend, but **real-time chat and calls would not work**. For full functionality, use Railway or Render (or another platform that runs a persistent Node server).

---

## Checklist before deploy

- [ ] Code pushed to GitHub (or connected repo).
- [ ] MongoDB Atlas cluster created and `MONGO_URI` set.
- [ ] All env vars set on the platform (especially `NODE_ENV=production` and `CLIENT_URL`).
- [ ] After first deploy, set `CLIENT_URL` to the real app URL and redeploy once.
