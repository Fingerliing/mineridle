import { defineChain, getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { balanceOf } from "thirdweb/extensions/erc1155";

export async function hasAccess(address: string): Promise<boolean> {
  const quantityRequired = 1n;
  const tokenId = 0n;

  const chain = defineChain(sepolia);

  const contract = getContract({
    client: client,
    chain: chain,
    address: "0x001622147ac400EA7dA2a49e309400334098de1F",
  });
  
  const ownedBalance = await balanceOf({
    contract: contract,
    owner: address,
    tokenId: tokenId,
  });

  return ownedBalance >= quantityRequired;
}
