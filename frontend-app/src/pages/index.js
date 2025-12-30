import Head from "next/head";
import { useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract
} from "wagmi";
import { formatUnits, isAddress, parseUnits } from "viem";

import { openChainAbis, openChainAddresses } from "@/web3/contracts";
import { useActivityLogs } from "@/web3/useActivityLogs";

function shortAddr(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-700">{title}</div>
      {children}
    </div>
  );
}

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, status: connectStatus, error: connectError } =
    useConnect();
  const { disconnect } = useDisconnect();

  const tokenAddress = openChainAddresses.token;
  const faucetAddress = openChainAddresses.faucet;
  const hubAddress = openChainAddresses.hub;

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1");
  const [burnAmount, setBurnAmount] = useState("1");

  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress,
    abi: openChainAbis.token,
    functionName: "symbol"
  });

  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress,
    abi: openChainAbis.token,
    functionName: "decimals"
  });

  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: openChainAbis.token,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  });

  const decimals = Number(tokenDecimals ?? 18);
  const balanceDisplay = useMemo(() => {
    if (balance == null) return "-";
    try {
      return formatUnits(balance, decimals);
    } catch {
      return String(balance);
    }
  }, [balance, decimals]);

  const { logs, isLoading: logsLoading, error: logsError } = useActivityLogs({
    hubAddress,
    enabled: Boolean(address)
  });

  async function onTransfer() {
    if (!isConnected || !address) return;
    if (!isAddress(to)) {
      alert("Alamat tujuan tidak valid");
      return;
    }

    const value = parseUnits(amount || "0", decimals);
    await writeContractAsync({
      address: tokenAddress,
      abi: openChainAbis.token,
      functionName: "transfer",
      args: [to, value]
    });
  }

  async function onBurn() {
    if (!isConnected || !address) return;
    const value = parseUnits(burnAmount || "0", decimals);
    await writeContractAsync({
      address: tokenAddress,
      abi: openChainAbis.token,
      functionName: "burn",
      args: [value]
    });
  }

  async function onFaucet() {
    if (!isConnected || !address) return;
    await writeContractAsync({
      address: faucetAddress,
      abi: openChainAbis.faucet,
      functionName: "drip",
      args: []
    });
  }

  return (
    <>
      <Head>
        <title>OpenChain Hub</title>
        <meta name="description" content="OpenChain Hub MVP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <div>
              <div className="text-lg font-bold text-slate-900">OpenChain Hub</div>
              <div className="text-xs text-slate-500">
                Minimal on-chain modular Web3 starter
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                    {shortAddr(address)}
                    {chain?.name ? ` · ${chain.name}` : ""}
                  </div>
                  <button
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {connectors.map((c) => (
                    <button
                      key={c.uid}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                      disabled={connectStatus === "pending"}
                      onClick={() => connect({ connector: c })}
                    >
                      Connect {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-5xl gap-4 px-4 py-6 md:grid-cols-2">
          <Card title="Wallet Dashboard">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Address</span>
                <span className="font-mono text-slate-900">
                  {address ? shortAddr(address) : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Token</span>
                <span className="text-slate-900">
                  {tokenSymbol ? String(tokenSymbol) : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Balance</span>
                <span className="font-semibold text-slate-900">
                  {balanceDisplay}
                </span>
              </div>
            </div>

            {connectError ? (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {connectError.message}
              </div>
            ) : null}
          </Card>

          <Card title="Faucet">
            <div className="text-sm text-slate-600">
              Untuk testing: klik drip untuk mint token (ada cooldown).
            </div>
            <button
              className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              disabled={!isConnected || isWriting}
              onClick={onFaucet}
            >
              Request Faucet
            </button>
            <div className="mt-2 text-xs text-slate-500">
              Faucet contract: <span className="font-mono">{shortAddr(faucetAddress)}</span>
            </div>
          </Card>

          <Card title="Transfer Token">
            <div className="space-y-2">
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="to (0x...)"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                disabled={!isConnected || isWriting}
                onClick={onTransfer}
              >
                Send
              </button>
            </div>
          </Card>

          <Card title="Burn Token">
            <div className="space-y-2">
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="amount"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
              />
              <button
                className="w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                disabled={!isConnected || isWriting}
                onClick={onBurn}
              >
                Burn
              </button>
            </div>
          </Card>

          <div className="md:col-span-2">
            <Card title="On-chain Activity Log">
              <div className="text-xs text-slate-500">
                Data diambil dari event <span className="font-mono">Activity</span> (OpenChainHub).
              </div>

              {logsLoading ? (
                <div className="mt-3 text-sm text-slate-600">Loading...</div>
              ) : logsError ? (
                <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                  {String(logsError.message || logsError)}
                </div>
              ) : logs.length === 0 ? (
                <div className="mt-3 text-sm text-slate-600">Belum ada activity.</div>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs text-slate-500">
                        <th className="py-2 pr-2">Action</th>
                        <th className="py-2 pr-2">Amount</th>
                        <th className="py-2 pr-2">Target</th>
                        <th className="py-2 pr-2">Tx</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((l) => (
                        <tr key={l.id} className="border-b border-slate-100">
                          <td className="py-2 pr-2">{l.action}</td>
                          <td className="py-2 pr-2">{l.amount}</td>
                          <td className="py-2 pr-2 font-mono">{shortAddr(l.target)}</td>
                          <td className="py-2 pr-2 font-mono">{shortAddr(l.txHash)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-2 text-xs text-slate-500">
                Hub contract: <span className="font-mono">{shortAddr(hubAddress)}</span>
              </div>
            </Card>
          </div>
        </main>

        <footer className="mx-auto max-w-5xl px-4 pb-10 text-xs text-slate-400">
          Contracts addresses sementara ada di <span className="font-mono">src/web3/contracts.js</span>
        </footer>
      </div>
    </>
  );
}
