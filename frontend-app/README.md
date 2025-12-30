# frontend-app

Next.js + Tailwind UI untuk OpenChain Hub.

## Fitur (MVP)

- Wallet connect (default: MetaMask injected)
- Dashboard address + token balance
- Transfer token
- Burn token
- Faucet request
- On-chain activity log (event `Activity`)

## Setup

```bash
npm install
npm run dev
```

## Konfigurasi

Edit `src/web3/contracts.js` dan isi alamat contract hasil deploy.

## Catatan soal WalletConnect

WalletConnect butuh `projectId`. Untuk menjaga MVP simpel, default hanya MetaMask. Kamu bisa tambah connector WalletConnect setelah punya projectId.

## Catatan soal TypeScript

Di project ini kita pakai JavaScript. Jika Next mencoba mengaktifkan TypeScript karena ada `tsconfig.json` lama, kamu bisa menghapus `tsconfig.json` secara manual.
