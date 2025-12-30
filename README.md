# OpenChain Hub

OpenChain Hub adalah project crypto on-chain modular (EVM) yang fokus pada kesederhanaan, kecepatan development, dan kemudahan kontribusi komunitas.

## Monorepo Structure

- `core-contracts/` Solidity + Hardhat (MVP contracts)
- `frontend-app/` Next.js + Tailwind (UI + wallet connect)
- `backend-api/` Node.js serverless ringan (optional indexing helpers)
- `docs/` Dokumentasi ringkas (arsitektur, flow, roadmap)
- `plugins/` Fitur opsional dalam modul kecil

## Quick Start (Local)

### 1) Contracts

```bash
cd core-contracts
npm install
npm run compile
```

### 2) Frontend

```bash
cd frontend-app
npm install
npm run dev
```

## Network

Default: Base Mainnet.

Lihat `docs/` untuk arsitektur, flow user, dan roadmap 30 hari.
