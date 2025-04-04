# Contributing Guide

Thanks for your interest in contributing to the DWG to IMDF Converter Web App!

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/uwa-wayfinding/web.git wayfinding-web
cd wayfinding-web
```

### 2. Install dependencies

We use `pnpm` as the package manager, get one at [pnpm official site](https://pnpm.io/installation):

```bash
pnpm install
```

### 3. Setup environment variables

Create a `.env.local` file and configure Cloudflare R2 credentials:

```env
R2_ACCESS_KEY=your-access-key
R2_SECRET_KEY=your-secret-key
R2_ENDPOINT=https://<account>.r2.cloudflarestorage.com
R2_BUCKET_NAME=your-bucket
```

### 4. Run the project locally

```bash
pnpm dev
```

Your app should now be running on [http://localhost:3000](http://localhost:3000)

## ✅ Contribution Rules

- One feature per branch
- Use conventional commits:  
  e.g., `feat: add file upload`, `fix: resolve R2 auth bug`

## 📦 Deployment

Deployment is currently handled via **Cloudflare Pages / Functions**. 
