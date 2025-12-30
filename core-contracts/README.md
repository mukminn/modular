# core-contracts

Kontrak MVP OpenChain Hub.

## Contracts

- `OpenChainHub`: event `Activity` + role check helper
- `OpenChainToken`: ERC-20 (mint admin, burn user) + emit `Activity`
- `OpenChainFaucet`: faucet token dengan cooldown

## Local

```bash
npm install
npm run compile
npm test
```

## Deploy

1) Copy `.env.example` -> `.env`
2) Isi RPC + PRIVATE_KEY

```bash
npm run deploy:sepolia
# atau
npm run deploy:amoy
```
