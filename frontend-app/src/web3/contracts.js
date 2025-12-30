const CORE_ADDRESS = "0x409b9Ce3d0281b79dF95D5003088d354DCD98Ece";

export const openChainAddresses = {
  // TODO: isi setelah deploy (lihat core-contracts/scripts/deploy.js output)
  // Single deploy: OpenChainHubToken (Hub+Token+Faucet)
  core: CORE_ADDRESS,
  hub: CORE_ADDRESS,
  token: CORE_ADDRESS,
  faucet: CORE_ADDRESS
};

const coreAbi = [
  {
    type: "event",
    name: "Activity",
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: true, name: "actor", type: "address" },
      { indexed: true, name: "target", type: "address" },
      { indexed: false, name: "action", type: "uint8" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "token", type: "address" },
      { indexed: false, name: "ref", type: "bytes32" }
    ]
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }]
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }]
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }]
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" }
    ],
    outputs: [{ type: "bool" }]
  },
  {
    type: "function",
    name: "burn",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "drip",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  {
    type: "function",
    name: "setFaucetParams",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dripAmount_", type: "uint256" },
      { name: "cooldownSeconds_", type: "uint256" }
    ],
    outputs: []
  }
];

export const openChainAbis = {
  hub: coreAbi,
  token: coreAbi,
  faucet: coreAbi
};
