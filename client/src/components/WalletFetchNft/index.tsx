import "./index.css";
import { useState } from "react";
import ValknutLogo from "../Wallet/IguanasCore.gif";
import 'reactjs-popup/dist/index.css';
import NFTCard from "../NFTCard";
import useFetchAllNfts from "../../hooks/useFetchAllNfts";
import { useWallet } from '@solana/wallet-adapter-react';

export interface IWalletFetchNftProps { }

const WalletFetchNft: React.FunctionComponent<IWalletFetchNftProps> = (props) => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const nft = useFetchAllNfts(wallet,setLoading);
    return (<div style={{ height: "100%", }}>
        {loading ? (
            <div className="inPageFlex">
                <img className="loading" src={ValknutLogo} alt="Valknut Logo" loading="lazy" />
            </div>
        ) : (
            <>
                <div className="inputDiv">
                    <input id="filter" name="filter" type={"text"} placeholder="Search Your Iguanas" value={filter} onChange={event => setFilter(event.target.value)}></input>
                </div>
                <div className="inPageContainer">
                    {nft && nft.filter(f => f.NFT.name.toLowerCase().includes(filter.toLowerCase()) || filter.toLowerCase() === '').map((element, index) => {
                        return (<NFTCard element={element} key={index} />);
                    })}
                </div>
            </>
        )}
    </div>
    );
}

export default WalletFetchNft;