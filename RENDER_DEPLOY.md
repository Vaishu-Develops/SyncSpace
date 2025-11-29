# SyncSpace - Render Deployment Guide

## Single Service Deployment Setup

This project is configured to deploy both frontend and backend as a single service on Render.

### 🚀 Quick Deployment Steps:

1. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Choose "SyncSpace" repository

2. **Configure the service:**
   ```
   Name: syncspace-app
   Environment: Node
   Region: Oregon (US West)
   Branch: master
   Root Directory: (leave blank)
   Build Command: ./build.sh
   Start Command: cd server && npm start
   ```

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   PORT=5000
   ```

4. **Advanced Settings:**
   - Auto-Deploy: Yes
   - Health Check Path: `/api/health`

### 🔧 Environment Variables Setup:

#### Required Variables:
- **MONGO_URI**: MongoDB connection string (get from MongoDB Atlas)
- **JWT_SECRET**: Strong secret key for JWT tokens (generate random string)
- **NODE_ENV**: Set to `production`

#### Optional Variables:
- **RENDER_EXTERNAL_URL**: Auto-set by Render (your app URL)

### 📁 Project Structure for Deployment:

```
SyncSpace/
├── server/           # Backend (Express + Socket.IO)
├── client/           # Frontend (React + Vite)
├── build.sh          # Build script for Render
├── package.json      # Root package.json with deploy scripts
└── render.yaml       # Render configuration
```

### 🏗️ How the Build Process Works:

1. **Build Script (`build.sh`) runs:**
   - Installs server dependencies
   - Installs client dependencies
   - Builds React app to static files
   
2. **Server serves everything:**
   - API routes: `/api/*`
   - Static files: React app
   - Socket.IO: Real-time features
   - Health check: `/api/health`

### 🌐 URL Structure in Production:

- **App Root**: `https://your-app.onrender.com/`
- **API**: `https://your-app.onrender.com/api/*`
- **Health Check**: `https://your-app.onrender.com/api/health`
- **Socket.IO**: `wss://your-app.onrender.com/socket.io`

### 🔄 Local Development vs Production:

| Feature | Development | Production |
|---------|-------------|------------|
| Frontend | `localhost:5173` | Served from backend |
| Backend | `localhost:5000` | Same domain |
| Database | Local/Cloud MongoDB | Cloud MongoDB |
| Socket.IO | `localhost:5000` | Same domain |

### 🛠️ Local Development Commands:

```bash
# Install all dependencies
npm run install-all

# Run development (both client & server)
npm run dev

# Build for production
npm run build

# Preview production build
cd client && npm run preview
```

### 📝 Deployment Checklist:

- [ ] MongoDB Atlas database created
- [ ] Environment variables configured
- [ ] GitHub repository connected
- [ ] Build command set: `./build.sh`
- [ ] Start command set: `cd server && npm start`
- [ ] Health check enabled: `/api/health`
- [ ] Auto-deploy enabled

### 🚨 Troubleshooting:

1. **Build fails**: Check build logs for dependency issues
2. **App won't start**: Verify environment variables
3. **Database connection fails**: Check MongoDB URI
4. **Socket.IO issues**: Ensure WebSocket support is enabled
5. **Static files not loading**: Check server static file serving

### 📊 Monitoring:

- **Health Check**: Monitor at `/api/health`
- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory, and Response time in dashboard

### 🔐 Security Notes:

- All API calls use JWT authentication
- CORS configured for production domain
- Environment variables stored securely
- MongoDB connection encrypted

### 💡 Performance Tips:

- Static assets cached by CDN
- React app code-split by chunks
- MongoDB queries optimized
- Socket.IO connection pooling enabled

Your SyncSpace app will be accessible at: `https://your-app-name.onrender.com`