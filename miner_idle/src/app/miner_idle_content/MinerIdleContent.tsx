"use client";

import {
    useActiveAccount,
} from "thirdweb/react" ;
import { LoginButton } from "../components/loginButton";
import { defineChain, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "../client"

import CurrentGear from "../components/CurrentGear";
// import LoadingSection from "../components/LoadingSection";
// import OwnedGear from "../components/OwnedGear";
// import Rewards from "../components/Rewards";
// import Shop from "../components/Shop";
import styles from "../styles/Home.module.css";

export default function MinerIdleContent() {
    const address = useActiveAccount();
    const chain = defineChain( sepolia );
    const miningContract = getContract({
        client: client,
        chain: defineChain( sepolia ),
        address: "0xf7e010E55C1fD5043456F027fC62424d5D818738"
    });
    const characterContract = getContract({
        client: client,
        chain: defineChain( sepolia ),
        address: "0x001622147ac400EA7dA2a49e309400334098de1F"
    });
    const pickaxeContract = getContract({
        client: client,
        chain: defineChain( sepolia ),
        address: "0xeC0BD3B4eAe80272c51Ef102454B79d20B6ef502"
    });
    const tokenContract = getContract({
        client: client,
        chain: defineChain( sepolia ),
        address: "0xA7e6fcEe4A170078e28225F3b4bf56B9aeb634e7"
    });

    if (!address) {
        return (
          <div className={styles.container}>
            <LoginButton />
          </div>
        );
      }
    
    return (
        <div className={styles.container}>
            {miningContract &&
            characterContract &&
            tokenContract &&
            pickaxeContract ? (
                <div className={styles.mainSection}>
                    <CurrentGear 
                        miningContract={miningContract}
                        characterContract={characterContract}
                        pickaxeContract={pickaxeContract}
                    />
                    {/* <Rewards
                        miningContract={miningContract}
                        tokenContract={tokenContract}
                    /> */}
                    <h1>Rewards</h1>
                </div>
            ) : (
                // <LoadingSection />
                <h1>Loading</h1>
            )}

            <hr className={`${styles.divider} ${styles.bigSpacerTop}`} />

            {pickaxeContract && miningContract ? (
                <>
                    <h2 className={`${styles.noGapTop} ${styles.noGapBottom}`}>
                        Your owned pickaxes
                    </h2>
                    <div className={styles.shop}>
                        {/* <OwnedGear 
                            pickaxeContract={pickaxeContract}
                            miningContract={miningContract}
                        /> */}
                        <h1>OwnedGear</h1>
                    </div>
                </>
            ) : (
                // <LoadingSection />
                <h1>Loading</h1>
            )}

            <hr className={`${styles.divider} ${styles.bigSpacerTop}`} />

            {pickaxeContract && tokenContract ? (
                <>
                    <h2 className={`${styles.noGapTop} ${styles.noGapBottom}`}></h2>
                    <div className={styles.shop}>
                        {/* <Shop pickaxeContract={pickaxeContract} /> */}
                        <h1>Shop</h1>
                    </div>
                </>
            ) : (
                <h1>Loading</h1>
                // <LoadingSection />
            )}
        </div>
    )
}