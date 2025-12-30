# Contoh Flow User

## 1) Connect Wallet

- User buka `frontend-app`
- Klik Connect
- Pilih MetaMask / WalletConnect
- UI menampilkan address + network

## 2) Dapat Token Test (Faucet)

- User klik tombol Faucet
- UI call `OpenChainFaucet.drip()`
- Token masuk ke wallet user

## 3) Transfer Token

- User isi `to` + `amount`
- UI call `OpenChainToken.transfer(to, amount)`
- Kontrak emit event `Transfer` (ERC20) + event `Activity` (dari Hub jika digunakan)

## 4) Lihat History

- UI fetch event `Activity` untuk address user
- UI render list (type, amount, txHash, timestamp)
