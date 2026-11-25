# ⚡ Optical File Transfer 📡✨

> **Air-gapped file & text transfer using animated, fountain-coded QR codes.**  
> Send files between two devices using nothing but a **screen and a camera** — no network, no Bluetooth, no pairing, and no cables. **The payload travels purely as light.** 💡

---

[![Vercel Deployment](https://img.shields.io/badge/Deploy%20with-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpabitralenka07%2FOptical_file_transfer)
[![Built with TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 🌟 Highlights

- 🔒 **100% Air-Gapped & Offline:** Zero network requests between devices. No Wi-Fi, no local network path, no cloud relay.
- 📱 **Zero Install Required:** Works directly in any modern mobile or desktop browser (Safari, Chrome, Firefox, Edge).
- 💧 **Fountain Coding (Luby Transform):** The sender streams an endless sequence of XOR-combined blocks. Dropped frames cost only a tiny bit of time, never correctness. No back-channel needed!
- ⚡ **High Throughput:** Reaches speeds up to **~400+ KB/s** on high-refresh/high-resolution displays using multi-code grid projection.
- 📦 **Preserves Metadata & Integrity:** Full filename, MIME type preservation, optional gzip compression, and end-to-end **SHA-256 verification**.
- 🚀 **WASM-Accelerated Decoder:** Uses a WebAssembly QR decoder running inside multithreaded Web Workers with predictive crop tracking.
- 🌍 **Internationalization (12 Languages):** English, Español, Português, Français, Deutsch, Italiano, Русский, हिन्दी, 简体中文, 日本語, 한국어, and العربية (with native RTL).
- 📱 **Installable PWA:** Add to home screen on iOS and Android for instant offline access.

---

## 🔬 How It Works

```
  ┌──────────────────────────┐               ┌──────────────────────────┐
  │      Sender Device       │               │     Receiver Device      │
  │     (Screen / Display)   │               │     (Camera / Phone)     │
  ├──────────────────────────┤               ├──────────────────────────┤
  │ 1. Choose file / text    │               │ 1. Open camera feed      │
  │ 2. Slice into K blocks   │  💡 Photons   │ 2. Scan QR stream (WASM) │
  │ 3. LT Fountain Encode    │ ────────────► │ 3. Collect ~K·1.15 frames│
  │ 4. Stream animated QRs   │               │ 4. Gaussian solve/peel   │
  │    (Pinned mask, ECC L)  │               │ 5. SHA-256 check & save! │
  └──────────────────────────┘               └──────────────────────────┘
```

1. **Fragmentation:** The file is packaged with its metadata (filename, media type, SHA-256 hash) and sliced into $K$ source blocks.
2. **Fountain Encoding:** Rather than simple cyclic looping (where missing 1 frame forces waiting an entire loop), each frame is a deterministic linear combination of blocks chosen from a **Robust Soliton Distribution**.
3. **Transmission:** Rendered as an animated stream of QR codes on a canvas.
4. **Reception & Decoding:** The receiver's camera captures frames, dispatches them to a WebAssembly worker pool, solves the linear equations via peeling back-substitution, verifies SHA-256 integrity, and offers the file for instant download or playback!

---

## 🚀 Quick Start

### 1️⃣ Run Locally

```bash
# Clone the repository
git clone https://github.com/pabitralenka07/Optical_file_transfer.git
cd Optical_file_transfer

# Install dependencies (Node.js 20+ recommended)
npm install

# Start development server with HTTPS (required for camera access)
npm run dev
```

Open on your devices:
- **Sender (Computer):** `https://localhost:5173/send/`
- **Receiver (Phone):** `https://<your-local-ip>:5173/receive/`

### 2️⃣ Build for Production

```bash
# Run tests
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run serve
```

---

## ☁️ Deploy to Vercel (1-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpabitralenka07%2FOptical_file_transfer)

---

## 👤 Author & Maintainer

Maintained and developed by **Pabitra Lenka**:
- 🌐 **GitHub:** [@pabitralenka07](https://github.com/pabitralenka07)
- 💼 **LinkedIn:** [Pabitra Lenka](https://www.linkedin.com/in/pabitralenka)
- 📦 **Repository:** [https://github.com/pabitralenka07/Optical_file_transfer](https://github.com/pabitralenka07/Optical_file_transfer)

---

## 📜 License & Acknowledgments

- Licensed under **AGPL-3.0-or-later** with portions under Apache-2.0 and MIT.
- Built upon research and foundational work in optical fountain codes, incorporating `zxing-cpp` and WebAssembly.
