import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const balance = { solBalance: 0, valknutBalance: 0 };
const connection = new anchor.web3.Connection(process.env.REACT_APP_SOLANA_RPC_HOST!);

const useGetBalance = (wallet?: AnchorWallet) => {
    const [balances, setBalances] = useState(balance);
    useEffect(() => {
        (async () => {
            if (wallet) {
                const balance = await connection.getBalance(wallet.publicKey);
                
                let rewardTokenAddr : any = process.env.REACT_APP_REWARD_TOKEN_MINT_ADDRESS
                const valknutTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: new PublicKey(rewardTokenAddr) });
                // const valknutGoldTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: new PublicKey("HHXMCAQGw4SNfwJ3FqTJdFgt2M8GqggFk9cRm4jLYPDB") });
                try {
                    const valknutBalanceArray = await connection.getTokenAccountBalance(valknutTokenAccount.value[0].pubkey);
                    // const valknutGoldBalanceArray = await connection.getTokenAccountBalance(valknutGoldTokenAccount.value[0].pubkey);
                    setBalances({ 
                        solBalance: balance / LAMPORTS_PER_SOL, 
                        valknutBalance: parseFloat(valknutBalanceArray.value.amount) / 1000000000
                        // valknutGoldBalance: valknutGoldBalanceArray.value.amount 
                    });
                } catch {
                    setBalances({ solBalance: balance / LAMPORTS_PER_SOL, valknutBalance: 0 });
                }
            }
        })();
    }, [wallet]);
    return balances;
};

export default useGetBalance;