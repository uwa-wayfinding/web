# DWG to IMDF Converter Web App

This is a minimal MVP web application that allows users to upload `.dwg` files and download them later. The long-term goal is to convert `.dwg` into Apple Indoor Mapping Data Format (IMDF) and integrate with indoor map services.

## 🌟 MVP Features

- Upload `.dwg` files via a web UI
- Store uploaded files in **Cloudflare R2**
- Provide an API to download uploaded files
- Frontend powered by **Next.js**, deployed on **Cloudflare**

## 📦 Tech Stack

- **Frontend**: Next.js
- **Storage**: Cloudflare R2 (S3-compatible)
- **Deployment**: Cloudflare
- **Backend**: Next.js API routes (for now)
- **Future**: Python or Forge-based DWG to IMDF converter

## 🛣️ Roadmap

| Feature                 | Status     |
|------------------------|------------|
| Upload `.dwg` file     | ⏳ Planned (MVP) |
| Store file in R2       | ⏳ Planned (MVP) |
| Download API           | ⏳ Planned (MVP) |
| DWG → IMDF Conversion  | ⏳ Planned |
| IMDF Preview UI        | ⏳ Planned |
| Auth & User Profiles   | ⏳ Planned |
