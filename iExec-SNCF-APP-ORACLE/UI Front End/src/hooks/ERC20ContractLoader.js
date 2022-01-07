import { useExternalContractLoader} from ".";

const ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (boolean)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

export default function useERC20ContractLoader(provider, address) {
  return useExternalContractLoader(provider, address, ABI)
}