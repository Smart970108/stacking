import { useEffect, useState } from "react";
import { NFTmap } from "../../types/metadata";
import "./index.css";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  // Transaction,
  PublicKey,
  // LAMPORTS_PER_SOL,
  // SystemProgram
} from "@solana/web3.js";
import React from "react";
import {
  ToastContainer,
  // toast,
  Zoom,
} from "react-toastify";
// import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
// import { getOrCreateAssociatedTokenAccount } from '../../utills/getOrCreateAssociatedTokenAccount'
// import { createTransferInstruction } from '../../utills/createTransferInstructions'
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
export interface INFTDetailedCardProps {
  element: NFTmap;
  setStaked: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
}

const NFTDetailedCard: React.FunctionComponent<INFTDetailedCardProps> = (
  props
) => {
  // eslint-disable-next-line
  const [currentState, setCurrentState] = useState("");
  const [openDetailes, setOpenDetailes] = useState(false);
  const [openAttirbuts, setOpenAttirbuts] = useState(true);
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  function compare(a: any, b: any) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }

  useEffect(() => {
    const hasTokenAcc = async () => {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError();
      if (!props.element.isStaked) {
        const tokenAcc = await connection.getTokenAccountsByOwner(
          new PublicKey(process.env.REACT_APP_LOCKED_WALLET!),
          { mint: new PublicKey(props.element.mint) }
        );
        if (tokenAcc.value.length === 0) {
          setCurrentState("Approve");
        } else {
          const balance = await connection.getTokenAccountBalance(
            tokenAcc.value[0].pubkey
          );
          if (balance.value.amount === "0") {
            setCurrentState("Stake");
          } else if (balance.value.amount === "1") {
            setCurrentState("Unstake");
          }
        }
      } else {
        setCurrentState("Unstake");
      }
    };
    hasTokenAcc();
    // eslint-disable-next-line
    var attributesarray = () => {
      var order = [
        "Experience",
        "Background",
        "Base",
        "Armor",
        "Headgear",
        "Mouth",
        "Eyes",
      ];
    };
  }, []);

  return (
    <div className="DetailedNFT">
      {/* <h1><span>{props.element.NFT.collection.family}</span> / <span><a href={props.element.NFT.external_url}>{props.element.NFT.collection.name}</a></span></h1> */}
      {/* <h1><span><a href={props.element.NFT.external_url}>{props.element.NFT.collection.name}</a></span></h1> */}
      <div className="DetailedNFTContainer">
        <div className="DetailedNFTImgContainer flex">
          <img
            src={props.element.NFT.image}
            width={480}
            loading="lazy"
            alt={props.element.NFT.name}
          />
        </div>
        <div style={{ width: "100%" }}>
          <div>
            <div>
              <h4>{props.element.NFT.name}</h4>
            </div>
          </div>

          <div
            className="DescriptionBox"
            onClick={() => setOpenAttirbuts(!openAttirbuts)}
            style={{ marginTop: "5vh" }}
          >
            Attributes
          </div>
          {openAttirbuts && (
            <div className="DescriptionBoxDetailes flex">
              {props.element.NFT.attributes.map((element, index) => {
                return (
                  <div
                    style={{
                      margin: ".25rem .25rem 0rem .25rem",
                      padding: ".25rem .75rem",
                      borderRadius: "7px",
                    }}
                    key={index}
                  >
                    <h5>{element.trait_type}</h5>
                    <h3>{element.value}</h3>
                  </div>
                );
              })}
            </div>
          )}
          {/* <div className="DescriptionBoxDetailes flex center">
                        {props.element.isStaked ? (<div className="center" onClick={unStake}>Unstake</div>) : (<div className="center" onClick={stake}>{currentState}</div>)}
                    </div> */}
        </div>
      </div>
      <ToastContainer
        transition={Zoom}
        position="bottom-left"
        autoClose={15000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default NFTDetailedCard;
