'use client';
import React, { useEffect, useState } from "react";
import { NFT } from "thirdweb";
import ContractMappingResponse from "../actions/ContractMappingResponse";
import GameplayAnimation from "./GamePlayAnimation";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getNFT } from "thirdweb/extensions/erc1155";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";

type Props = {
  miningContract: any;
  characterContract: any;
  pickaxeContract: any;
};

/**
 * This component shows the:
 * - Currently equipped miner character (right now there is just one (token ID 0))
 * - Currently equipped character's pickaxe
 */
export default function CurrentGear({
  miningContract,
  characterContract,
  pickaxeContract,
}: Props) {
  const address = useActiveAccount()?.address;

  const { data: playerNft } = useReadContract(
    getNFT,
    {
      contract: characterContract,
      tokenId: 0n,
    });
  const [pickaxe, setPickaxe] = useState<NFT>();

  useEffect(() => {
    (async () => {
      if (!address) return;

      const p = (await miningContract.call("playerPickaxe", [
        address,
      ])) as ContractMappingResponse;

      // Now we have the tokenId of the equipped pickaxe, if there is one, fetch the metadata for it
      if (p.isData) {
        const pickaxeMetadata = await pickaxeContract.get(p.value);
        setPickaxe(pickaxeMetadata);
      }
    })();
  }, [address, miningContract, pickaxeContract]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h2 className={`${styles.noGapTop} `}>Equipped Items</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* Currently equipped player */}
        <div style={{ outline: "1px solid grey", borderRadius: 16 }}>
          {playerNft && (
            <ThirdwebNftMedia metadata={playerNft?.metadata} height={"64"} />
          )}
        </div>
        {/* Currently equipped pickaxe */}
        <div
          style={{ outline: "1px solid grey", borderRadius: 16, marginLeft: 8 }}
        >
          {pickaxe && (
            // @ts-ignore
            <ThirdwebNftMedia metadata={pickaxe.metadata} height={"64"} />
          )}
        </div>
      </div>

      {/* Gameplay Animation */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        {/* <Image src="/mine.gif" height={64} width={64} alt="character-mining" /> */}
        <GameplayAnimation pickaxe={pickaxe} />
      </div>
    </div>
  );
}