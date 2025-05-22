# UWA Wayfinding Developer Documentation

## Overview

The UWA Wayfinding project is a full-stack web application built with **Next.js** and deployed via **Vercel**. It provides an interactive campus map of the University of Western Australia, allowing users to locate facilities and navigate building floors. The system is designed with modularity, scalability, and clarity in mind.

Live URL: [https://uwa.thisiswhatyouaskedfor.com](https://uwa.thisiswhatyouaskedfor.com)
Repository: [https://github.com/uwa-wayfinding/web](https://github.com/uwa-wayfinding/web)

---

## Project Structure

The project uses the **App Router** introduced in recent Next.js versions, enabling clean and maintainable file-based routing.

```
/app
  /dashboard     # User dashboard
  /map           # Interactive map homepage
  /api           # Serverless API routes
/components      # Reusable UI components
/lib             # Utility functions and hooks
/styles          # CSS styling
/prisma          # Prisma schema and client
```

---

## Key Features

### Interactive Map

* Renders a visual map of UWA campus
* Facility filters: toilets, cafes, parking, etc.
* Floor selector for multi-level buildings
* Built using React components with local state

### Authentication

* Google OAuth via NextAuth.js
* Protected routes for authenticated users

### File Upload & Storage

* Authenticated users can upload `.dwg` floor plans
* Files stored in **Cloudflare R2** using AWS S3-compatible SDK
* Metadata managed by **Prisma ORM**

### Dashboard

* Displays uploaded files and status (e.g., pending conversion)
* Prepares for future IMDF conversion

---

## Tech Stack

* **Frontend**: React (Next.js App Router)
* **Backend**: Next.js serverless API routes
* **Auth**: Google via NextAuth.js
* **Database**: PostgreSQL with Prisma ORM
* **Storage**: Cloudflare R2 (S3-compatible)
* **Deployment**: Vercel

---

## Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/uwa-wayfinding/web.git
cd web
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables (e.g., `.env.local`)

```env
DATABASE_URL=...
NEXTAUTH_SECRET=...
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
```

4. Generate Prisma client

```bash
npx prisma generate
```

5. Run locally

```bash
pnpm dev
```

---

## Future Work

* Implement DWG-to-IMDF conversion
* Role-based access control
* Enhanced file preview and management
* Mobile and accessibility optimizations

---

## Contributing

Pull requests and issue reports are welcome. Please ensure code follows the established structure and is accompanied by clear commit messages.

---

## License

[MIT License](LICENSE)

---

For more details, refer to the README in the repository.

