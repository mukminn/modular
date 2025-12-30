import { useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";

const ACTION = {
  0: "Mint",
  1: "Burn",
  2: "Transfer",
  3: "Faucet"
};

const activityEvent = parseAbiItem(
  "event Activity(address indexed user,address indexed actor,address indexed target,uint8 action,uint256 amount,address token,bytes32 ref)"
);

export function useActivityLogs({ hubAddress, enabled }) {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const canFetch = Boolean(enabled && hubAddress && publicClient);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!canFetch) return;
      if (!address) return;

      setIsLoading(true);
      setError(null);

      try {
        const raw = await publicClient.getLogs({
          address: hubAddress,
          event: activityEvent,
          args: { user: address },
          fromBlock: 0n,
          toBlock: "latest"
        });

        const mapped = raw
          .slice(-50)
          .reverse()
          .map((l, idx) => {
            const actionNum = Number(l.args?.action ?? 0);
            const amount = l.args?.amount != null ? String(l.args.amount) : "0";
            return {
              id: `${l.transactionHash}-${String(l.logIndex)}`,
              txHash: l.transactionHash,
              target: l.args?.target,
              action: ACTION[actionNum] || String(actionNum),
              amount
            };
          });

        if (!alive) return;
        setLogs(mapped);
      } catch (e) {
        if (!alive) return;
        setError(e);
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [canFetch, address, hubAddress, publicClient]);

  return useMemo(
    () => ({ logs, isLoading, error }),
    [logs, isLoading, error]
  );
}
