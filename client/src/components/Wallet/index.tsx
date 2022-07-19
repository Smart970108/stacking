import "./index.css";
import {
    useAnchorWallet, useConnection, useWallet,
} from "@solana/wallet-adapter-react";
import pp from "./RedPlanet33.png";
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import "./index.css";
import cyborgImg from "./IguanasCore.gif";
import solanaImg from "./solana.webp";
import useGetBalance from "../../hooks/useGetBalance";
import { 
    // toast, 
    ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import axios from "axios";
import { useEffect, useState } from "react";
// import { getOrCreateAssociatedTokenAccount } from "../../utills/getOrCreateAssociatedTokenAccount";
// import { PublicKey } from "@solana/web3.js";

// import { Typography } from "@material-ui/core"

require('@solana/wallet-adapter-react-ui/styles.css');
export interface IWalletProps { }

const Wallet: React.FunctionComponent<IWalletProps> = (props) => {
    const wallet = useAnchorWallet();
    const balances = useGetBalance(wallet);
    // eslint-disable-next-line
    const { connection } = useConnection();
    const [receivableToken, setReceivableToken] = useState(0);
    // eslint-disable-next-line
    const [isDisabled, setDisabled] = useState(false);
    const { publicKey, signTransaction } = useWallet();
    const shortenAddress = (address: string, chars = 4): string => {
        return `${address.slice(0, chars)}...${address.slice(-chars)}`;
    };

    useEffect(() => {
        if (wallet) loadTokens()
        // eslint-disable-next-line
    }, [wallet]);

    const loadTokens = async () => {
        setReceivableToken(0)
        try {
            if (!publicKey || !signTransaction) throw new WalletNotConnectedError()
            await axios.post("/staked_tokens", {
                walletAddress: publicKey.toString()
            }).then(function (response) {
                if (response.data.tokenCnt === undefined)
                    setReceivableToken(0)
                else
                    setReceivableToken(response.data.tokenCnt)
            }).catch(
                function (error) {
                    console.log(error)
                    setReceivableToken(0)
                }
            )
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <section className="Wallet">
            {!wallet && <div className="blurBackground"><WalletMultiButton style={{
                backgroundColor: "#30353b", margin: "auto", height: "4rem", minWidth: "15rem", boxShadow: "0px 0px 75px 5px #FFFFFF", display: "block"
            }} /></div>}
            <div className={`Walletdiv${wallet ? " logged" : " unlogged"}`}>
                <div className="WalletProfile">
                    <h2> My Profile </h2>
                    <div className="profilePhotograph"> <img src={pp} alt="Profile Photograph" /> </div>
                    <h2> {wallet && (shortenAddress(wallet.publicKey?.toBase58() || ""))}{ } </h2>
                </div>
                <div className="WalletBalance">
                    <div className="balanceBox">
                        <img src={solanaImg} alt="Solana" />
                        <div className="balanceBoxText">SOL</div>
                        <div className="balanceBoxBalance"> {balances.solBalance} </div>
                    </div>
                    <div className="balanceBox">
                        <img src={cyborgImg} alt="cyborg" />
                        <div className="balanceBoxText">CORE</div>
                        <div className="balanceBoxBalance"> {balances.valknutBalance} </div>
                    </div>
                    <div className="balanceBox">
                        <img src={cyborgImg} alt="cyborg" />
                        <div className="balanceBoxText">Stake Rewards</div>
                        <div className="balanceBoxBalance"> {receivableToken} </div>
                    </div>
                </div>
                {/* <div className="WalletStakeRewards">
                    {wallet && receivableToken !== 0 ? (
                        <button disabled={isDisabled} className="claimStakeRewards" style={{ background: "none", border: "none" }} onClick={receiveTokens}> Claim your receivable CORE </button>
                    ) : (
                        <button disabled className="claimStakeRewards" style={{ background: "none", border: "none" }} > Claim your receivable CORE </button>
                    )}
                </div> */}
                <div className="settings">
                    {wallet && <WalletDisconnectButton style={{
                        backgroundColor: "#30353b",
                        margin: "auto",
                        height: "4rem",
                        minWidth: "15rem",
                        display: "block"
                    }} />}
                </div>
            </div>
            <ToastContainer
                transition={Zoom}
                position="bottom-left"
                autoClose={3250}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </section>
    );
}

export default Wallet;