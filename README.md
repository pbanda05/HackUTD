# Toyota Dream Trip - Full Stack Application

A full-stack React frontend and Node.js/Express backend application for the Toyota Dream Trip experience.

## Project Structure

```
HackUTD/
├── backend/          # Express.js backend API
│   ├── server.js    # Main server file
│   └── package.json # Backend dependencies
├── src/             # React frontend
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── services/    # API service layer
│   └── ...
└── package.json     # Frontend dependencies
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup

### 1. Install Dependencies

Install dependencies for both frontend and backend:

```bash
npm run install:all
```

Or install them separately:

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (optional, defaults are provided):

```env
VITE_API_URL=http://localhost:3001/api
```

The backend uses port 3001 by default. You can change it by creating a `.env` file in the `backend/` directory:

```env
PORT=3001
```

### 3. Run the Application

#### Option 1: Run Both Frontend and Backend Together

```bash
npm run dev:all
```

This requires `concurrently` package (already added to devDependencies).

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# or
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173 (Vite default port)
- **Backend API**: http://localhost:3001/api

## API Endpoints

### Health Check
```
GET /api/health
```

### Model Recommendation
```
POST /api/recommend-model
Body: { "preferences": { ... } }
```

### Upsell/Downsell Recommendations
```
POST /api/recommendations
Body: { "journeyData": { ... } }
```

## Development

### Frontend
- Built with React + Vite
- Uses TypeScript for type safety
- Framer Motion for animations
- Three.js for 3D car visualization

### Backend
- Express.js REST API
- CORS enabled for frontend communication
- Ready for LLM integration (OpenAI, Anthropic, etc.)

## Building for Production

```bash
# Build frontend
npm run build:frontend

# The built files will be in the `dist/` directory
```

## Notes

- The backend currently uses simple heuristics for recommendations. You can integrate with LLM services (OpenAI, Anthropic, Base44, etc.) by updating the `backend/server.js` file.
- The frontend automatically falls back to local heuristics if the API is unavailable.
