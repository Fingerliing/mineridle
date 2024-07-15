import { cookies } from "next/headers";
import { thirdwebAuth } from "../utils/thirdwebAuth";
import { hasAccess } from "../actions/conditions";
import MinerIdleContent from "./MinerIdleContent";
import Link from "next/link";
import { ThirdwebProvider } from "thirdweb/react";

export default async function MinerIdlePage() {
    const jwt = cookies().get('jwt');

    if(!jwt?.value) {
        return <MustLogin />
    }

    const authResult = await thirdwebAuth.verifyJWT({
        jwt: jwt.value,
    });

    if(!authResult.valid) {
        return <MustLogin />
    }

    const address = authResult.parsedJWT.sub;

    if(!address) {
        throw new Error("No address found");
    }

    const _hasAccess = await hasAccess(address);

    if(!_hasAccess) {
        return <NotAllowed />
    }

    return (
        <ThirdwebProvider >
            <MinerIdleContent />
        </ThirdwebProvider>
    )
};

const MustLogin = () => {
    return (
        <div>
            <p>You are not logged in.</p>
            <Link href="/">
                <button className="mt-4 bg-zinc-100 text-black px-4 py-2 rounded-md">Go to login</button>
            </Link>
        </div>
    )
};

const NotAllowed = () => {
    return (
        <div className="flex flex-col min-h-[80vh] items-center justify_center p-4 text-center">
            <p>You do not own the acces NFT</p>
            <Link href="/">
                <button className="mt-4 bg-zinc-100 text-black px-4 py-2 rounded-md">Go to Login</button>
            </Link>
            <Link href="/claim-nft">
                <button className="mt-4 bg-zinc-100 text-black px-4 py-2 rounded-md">Claim NFT</button>
            </Link>
        </div>
    )
}