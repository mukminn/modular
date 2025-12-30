# Architecture (Ringkas)

## Tujuan

- Clean, minimal, no overengineering
- Cepat jadi (MVP)
- Mudah dipahami pemula
- Mudah dipecah jadi modul/plugins

## Komponen

## 1) core-contracts (EVM)

- `OpenChainHubToken` (single deploy: ERC-20 + roles + faucet + activity log)

**Sumber kebenaran:** state on-chain + events.

## 2) frontend-app (Next.js)

- Wallet connect (MetaMask + WalletConnect)
- Dashboard address
- Token actions (mint/burn untuk admin, transfer/burn untuk user)
- History: baca event `Activity` dari kontrak
- Faucet UI: request drip

## 3) backend-api (serverless ringan)

MVP tidak wajib untuk berjalan.

Peran opsional:
- Endpoint health
- Placeholder endpoint untuk indexing/analytics di masa depan

## Data Flow

- User connect wallet di UI
- UI panggil kontrak via RPC (Base Mainnet)
- Kontrak emit event `Activity`
- UI query event dari RPC untuk menampilkan history

## Invariants

- Hanya admin yang boleh `mint`
- Faucet punya cooldown per address
- Semua aksi penting emit `Activity`
