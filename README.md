# chatt

A full-stack real-time chat application built with React, Express, Socket.io, and MongoDB.

## Deploy on Render

### One-click deploy (Blueprint)

1. Fork or push this repository to your GitHub account.
2. Go to [https://render.com](https://render.com) and sign in.
3. Click **New** → **Blueprint**.
4. Connect your GitHub account and select this repository.
5. Render will detect `render.yaml` and pre-fill the service settings.
6. Fill in the required environment variables (see below) and click **Apply**.

### Manual deploy (Web Service)

1. Go to [https://render.com](https://render.com) and sign in.
2. Click **New** → **Web Service** and connect this repository.
3. Set the following:
   - **Runtime**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add all required environment variables (see below).
5. Click **Create Web Service**.

### Required environment variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/atlas)) |
| `JWT_SECRET` | Secret key for signing JWTs (use a long random string) |
| `CLIENT_URL` | Your Render service URL, e.g. `https://chatt.onrender.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | [Resend](https://resend.com) API key for email |
| `EMAIL_FROM` | Sender email address |
| `EMAIL_FROM_NAME` | Sender display name |
| `ARCJET_KEY` | [Arcjet](https://arcjet.com) API key |

`NODE_ENV`, `PORT`, and `ARCJET_ENV` are set automatically by `render.yaml`.

### Notes

- The backend serves the compiled React frontend in production (`frontend/dist`), so only one Render service is needed.
- Set `CLIENT_URL` to the public URL of your Render web service (available after the first deploy).
- Free-tier Render services spin down after inactivity; use a paid plan for always-on availability.