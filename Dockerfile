# --- Stage 1: Build the React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Serve Frontend and Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies (libzbar0 is required for pyzbar QR code scanning)
RUN apt-get update && apt-get install -y \
    libzbar0 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app
COPY backend/app/ ./app/
COPY backend/dataset/ ./dataset/
COPY backend/models/ ./models/

# Copy built frontend from Stage 1
COPY --from=frontend-builder /frontend/dist/ ./static/dist/

# Set environment variables
ENV PORT=8000
EXPOSE 8000

# Run Uvicorn server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
