import "./index.css";

import { Grid, Button, Typography, List } from "@material-ui/core";
import Wallet from "../../components/Wallet";
// import WalletFetchNft from "../../components/WalletFetchNft";
import NFTCard from "../NFTCard";
import { useEffect, useState } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor"
import { MagicSpinner } from "react-spinners-kit"

import {
  // useAnchorWallet,
  // useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import useFetchAllNfts from "../../hooks/useFetchAllNfts";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  toast,
  // ToastContainer,
  Zoom,
} from "react-toastify";
import {
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";

import { createTransferInstruction } from "../../utills/createTransferInstructions";

import { getOrCreateAssociatedTokenAccount } from "../../utills/getOrCreateAssociatedTokenAccount";
import { NFTmap } from "../../types/metadata";

import axios from "axios";

export interface IInnerPageProps { }

const InnerPage: React.FunctionComponent<IInnerPageProps> = (props) => {
  const wallet = useWallet();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [filter, setFilter] = useState("");

  // const [nft, setNft] = useState(useFetchAllNfts(wallet, setLoading))
  const [nft, setNFT] = useState<NFTmap[]>([]);

  const [receivableToken, setReceivableToken] = useState(0);
  const [isDisabled, setDisabled] = useState(false);
  const { publicKey, signTransaction } = useWallet();
  // const { connection } = useConnection();
  const connection = new anchor.web3.Connection(process.env.REACT_APP_SOLANA_RPC_HOST!)

  const tmpNfts = useFetchAllNfts(wallet, setLoading);

  useEffect(() => {
    if (wallet) {
      loadTokens();
    }
    // eslint-disable-next-line
  }, [wallet]);

  useEffect(() => {
    setNFT(tmpNfts);
  }, [tmpNfts]);

  const loadTokens = async () => {
    setReceivableToken(0);
    try {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError();

      const result = await axios.post("/staked_tokens", {
        walletAddress: publicKey.toString(),
      })

      if (result.data) {
        setReceivableToken(result.data.tokenCnt);
      } else {
        setReceivableToken(0);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const receiveTokens = async () => {
    setDisabled(true);
    if (!process.env.REACT_APP_LOCKED_WALLET) return;
    const toastId = toast(`Waiting transaction`, {
      type: "info",
      theme: "dark",
      position: "bottom-left",
      transition: Zoom,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    try {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError();

      const tokenAcc = await connection.getTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(process.env.REACT_APP_REWARD_TOKEN_MINT_ADDRESS!),
      });
      if (tokenAcc.value.length === 0) {
        // const toTokenAccount = getOrCreateAssociatedTokenAccount(
        //     connection,
        //     publicKey,
        //     new PublicKey(process.env.REACT_APP_REWARD_TOKEN_MINT_ADDRESS!),
        //     publicKey,
        //     signTransaction
        // )
        toast.dark("Create token account sent!", {
          type: "success",
          position: "bottom-left",
          autoClose: 3250,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      // eslint-disable-next-line
      const result = await axios
        .post(`/reward_token`, {
          walletAddress: publicKey.toString(),
        })
        .then(function (response) {
          console.log(response.data);
          if (response.data.success) {
            toast.update(toastId, {
              render: `Succesfully received ${response.data.success} $CORE!`,
              type: "success",
              position: "bottom-left",
              autoClose: 3250,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setReceivableToken(0);
          } else {
            toast.update(toastId, {
              render: response.data.msg,
              type: "error",
            });
          }
        })
        .catch(function (error) {
          toast.update(toastId, {
            render: `Something went wrong!`,
            type: "error",
          });
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  const stake = async () => {
    setLoading(true)
    for (let i = 0; i < nft.length; i++) {
      const elem = nft[i];

      if (!elem.isStaked && elem.isSelected) {
        const lockedWallet: any = process.env.REACT_APP_LOCKED_WALLET;

        if (!lockedWallet) return;
        const toastId = toast(
          `Please do not refresh.\nWaiting stake transaction of ${elem.NFT.name}`,
          {
            type: "info",
            theme: "dark",
            position: "bottom-left",
            transition: Zoom,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        if (!publicKey || !signTransaction)
          throw new WalletNotConnectedError();

        let signature = null
        try {
          const toPublicKey = new PublicKey(lockedWallet);
          const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            publicKey,
            new PublicKey(elem.mint),
            publicKey,
            signTransaction
          );
          const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            publicKey,
            new PublicKey(elem.mint),
            toPublicKey,
            signTransaction
          );
          // setCurrentState("Stake")
          const transaction = new Transaction().add(
            createTransferInstruction(
              fromTokenAccount.address, // source
              toTokenAccount.address, // dest
              publicKey,
              1,
              [],
              TOKEN_PROGRAM_ID
            )
          );

          const blockHash = await connection.getRecentBlockhash();
          transaction.feePayer = publicKey;
          transaction.recentBlockhash = blockHash.blockhash;

          const signedTransaction = await signTransaction(transaction);
          signature = await connection.sendRawTransaction(signedTransaction.serialize());

          await connection.confirmTransaction(signature);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error);
          toast.update(toastId, {
            render: `Something went wrong!`,
            type: "error",
          });
        }

        console.log(signature)
        if (signature) { // check the signature
          try {
            const res = await axios.get(`https://public-api.solscan.io/transaction/${signature}`, {
              method: "GET",
              headers: {
                'Content-Type': 'application/json'
              }
            })

            console.log(res)
            if (res.status === 200) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const experience = elem.NFT.attributes.find(
                (elem) => elem.trait_type === "Experience"
              )?.value;

              await axios.post(`/stake_nft`, {
                walletAddress: publicKey.toString(),
                mintAddress: elem.mint,
                transactionAddress: signature,
                experience: experience,
              });

              toast.update(toastId, {
                render: `${elem.NFT.name} staked!`,
                type: "success",
              });
              elem.isStaked = true;
              elem.isSelected = false;
              elem.locked = true;
              // setCurrentState("Unstake")
              // props.setStaked(true)
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
    }

    setNFT(JSON.parse(JSON.stringify(nft)));
    setLoading(false)
  };

  const unStake = async () => {
    for (let i = 0; i < nft.length; i++) {
      const elem = nft[i];

      if (elem.isStaked && elem.isSelected) {
        if (!process.env.REACT_APP_LOCKED_WALLET) return;
        const toastId = toast(
          `Waiting unstake transaction of ${elem.NFT.name} `,
          {
            type: "info",
            theme: "dark",
            position: "bottom-left",
            transition: Zoom,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        try {
          if (!publicKey || !signTransaction)
            throw new WalletNotConnectedError();
          const result: any = await axios.post(`/unstake_nft`, {
            walletAddress: publicKey.toString(),
            mintAddress: elem.mint,
          });
          if (result.data.success) {
            elem.isSelected = false;
            elem.isStaked = false;
            // setCurrentState("Stake")
            toast.update(toastId, {
              render: `${elem.NFT.name} Unstaked!`,
              type: "success",
            });
            // props.setStaked(false)
          } else {
            toast.update(toastId, {
              render: result.data.msg,
              type: "error",
            });
          }
        } catch (error: any) {
          toast.update(toastId, {
            render: `Something went wrong!`,
            type: "error",
          });
          console.log(error);
        }
      }
    }

    setNFT(JSON.parse(JSON.stringify(nft)));
  };

  return (
    <section className="innerPage">
      {
        loading && <div className="loading-container">
          <MagicSpinner size={170} color="#00ff89" />
        </div>
      }
      {/* {props.children} */}
      <p
        className="text-center"
        style={{ padding: "0.5rem", fontSize: "10rem" }}
      ></p>
      <Typography
        className="text-center"
        variant="overline"
        display="block"
        gutterBottom
        style={{ fontSize: "22px" }}
      >
        Stake Cyborg Iguanas and earn $CORE
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          <div style={{ padding: "15px 60px" }}>
            <p
              className="text-center unstaked-staked-header"
              style={{ color: "#38d7ab" }}
            >
              UNSTAKED
            </p>
            <Typography variant="overline" display="block" gutterBottom>
              Genesis Iguanas
            </Typography>
          </div>
          <div className="inPageContainer">
            <List
              style={{
                height: 515,
                overflow: "auto",
                paddingLeft: "30px",
                overflowX: "hidden",
              }}
            >
              <Grid container spacing={1}>
                {nft && nft.length > 0
                  ? nft
                    .filter(
                      (f) =>
                        (f.NFT.name
                          .toLowerCase()
                          .includes(filter.toLowerCase()) ||
                          filter.toLowerCase() === "") &&
                        !f.isStaked
                    )
                    .map((element, index) => {
                      return (
                        <Grid item md={6} sm={6} xs={12}>
                          <NFTCard element={element} key={index} />
                        </Grid>
                      );
                    })
                  : ""}
              </Grid>
            </List>
          </div>
          <div className="text-center  button-padding">
            <Button className="cosmic" variant="outlined" onClick={stake}>
              Enter Cosmic Space
            </Button>
          </div>
          <Typography
            className="text-center"
            variant="caption"
            display="block"
            gutterBottom
          >
            Select the NFTs you want to stake
          </Typography>
          <Typography
            className="text-center"
            variant="caption"
            display="block"
            gutterBottom
          >
            While staking don't refresh until you see your Iguana under staked
          </Typography>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Wallet />
        </Grid>
        <Grid item sm={4} xs={12}>
          <div style={{ padding: "15px 60px" }}>
            <p
              className="text-center unstaked-staked-header"
              style={{ color: "#38d7ab" }}
            >
              STAKED
            </p>
            <Typography variant="overline" display="block" gutterBottom>
              Looking for $CORE
            </Typography>
          </div>
          <div className="inPageContainer">
            <List style={{ height: 515, overflow: "auto" }}>
              <Grid container>
                {nft && nft.length > 0
                  ? nft
                    .filter(
                      (f) =>
                        (f.NFT.name
                          .toLowerCase()
                          .includes(filter.toLowerCase()) ||
                          filter.toLowerCase() === "") &&
                        f.isStaked
                    )
                    .map((element, index) => {
                      return (
                        <Grid item sm={6} md={6} xs={6}>
                          <NFTCard element={element} key={index} />
                        </Grid>
                      );
                    })
                  : ""}
              </Grid>
            </List>
          </div>
          <div
            className="text-center button-padding"
            style={{ marginBottom: "15px" }}
          >
            <Button className="cosmic " variant="outlined" onClick={unStake}>
              Unstake
            </Button>
          </div>

          <div className="text-center" style={{ marginBottom: "15px" }}>
            {receivableToken !== 0 ? (
              <Button
                className="cosmic"
                variant="outlined"
                disabled={isDisabled}
                style={{ background: "none", border: "none" }}
                onClick={receiveTokens}
              >
                {" "}
                Claim $Core{" "}
              </Button>
            ) : (
              ""
            )}
          </div>
        </Grid>
      </Grid>
    </section>
  );
};

export default InnerPage;
