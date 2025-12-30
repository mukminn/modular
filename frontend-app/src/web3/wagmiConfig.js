import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected, walletConnect } from "@wagmi/connectors";

// Catatan: WalletConnect connector biasanya butuh projectId.
// Untuk menjaga MVP tetap simpel tanpa secret, default hanya injected (MetaMask).
// Kamu bisa tambah WalletConnect nanti dengan @walletconnect/ethereum-provider + projectId.

const wcProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
const connectors = wcProjectId
  ? [walletConnect({ projectId: wcProjectId, showQrModal: true }), injected()]
  : [injected()];

export const wagmiConfig = createConfig({
  chains: [base],
  connectors,
  transports: {
    [base.id]: http()
  }
});
