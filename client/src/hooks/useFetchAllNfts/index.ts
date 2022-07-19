import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { NFT, NFTmap } from "../../types/metadata";
import * as anchor from "@project-serum/anchor";
import axios from "axios";
import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
const useFetchAllNfts = (wallet: WalletContextState, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [nft, setNFT] = useState<NFTmap[]>([]);
    const connection = new anchor.web3.Connection(process.env.REACT_APP_SOLANA_RPC_HOST!);
    const stakedNFTsmintAddresses: string[] = []

    const fetchNFTs = async () => {
        if (wallet.connected) {
            try {
                const nftData =
                    await getParsedNftAccountsByOwner({
                        publicAddress: wallet.publicKey?.toString(),
                        connection: connection
                    });
                nftData.forEach(async (element, index) => {
                    const { data } = await axios.get<NFT>(element.data.uri);

                    if (element.updateAuthority == process.env.REACT_APP_NFT_UPDATE_AUTHORITY) {
                        setNFT((nft) => [...nft, {
                            NFT: data,
                            mint: element.mint,
                            isStaked: false,
                            isSelected: false,
                            locked: false,
                        }])
                    }
                });

                await axios.post("/staked_nfts", {
                    walletAddress: wallet.publicKey?.toString()
                }).then(function (response) {
                    response.data.map(async (element: any) => {
                        stakedNFTsmintAddresses.push(element)
                    })
                })
                stakedNFTsmintAddresses.forEach(async (element) => {
                    let mintPubkey = new PublicKey(element[0]);
                    let tokenmetaPubkey = await Metadata.getPDA(mintPubkey);
                    const tokenmeta = await Metadata.load(connection, tokenmetaPubkey)
                    const { data } = await axios.get<NFT>(tokenmeta.data.data.uri);
                    setNFT((nft) => [...nft, {
                        NFT: data,
                        mint: element[0],
                        isStaked: true,
                        isSelected: false,
                        locked: element[1],
                    }])
                })

                setLoading(false);
            } catch (error) {
            }
        } else {
            setNFT([]);
        }
    };

    useEffect(() => {
        fetchNFTs();
        // eslint-disable-next-line
    }, [wallet.publicKey, wallet.connected]);

    return nft;
};

export default useFetchAllNfts;