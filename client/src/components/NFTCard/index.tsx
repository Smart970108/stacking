import { NFTmap } from "../../types/metadata";
import Popup from "reactjs-popup";
import "./index.css";
import NFTDetailedCard from "../NFTDetailes";
import { useState, useEffect } from "react";
export interface INFTCardProps {
  element: NFTmap;
}

const NFTCard: React.FunctionComponent<INFTCardProps> = (props) => {
  // eslint-disable-next-line
  const [staked, setStaked] = useState(props.element.isStaked);
  const [selected, setSelected] = useState(props.element.isSelected);
  const [locked, setLocked] = useState(props.element.locked);

  const selectNFT = async () => {
    if (selected) {
      setSelected(false);
      props.element.isSelected = false;
    } else {
      setSelected(true);
      props.element.isSelected = true;
    }
  };

  return (
    <>
      <div
        className="nftBox"
        onClick={selectNFT}
        style={props.element.isSelected ? { border: "solid #1effa9" } : {}}
      >
        {/* {staked && <div className="staked"><h1>Staked</h1></div>} */}
        <img
          src={props.element.NFT.image}
          alt={props.element.NFT.name}
          loading="lazy"
        />
        {selected && <p className="selected">Selected</p>}
        <p style={{ textAlign: "center" }}>{props.element.NFT.name}</p>
        {/* Trait Type */}
        {props.element.NFT.attributes.map((attribute) => {
          if (attribute.trait_type === "Experience")
            return <p style={{ textAlign: "center" }}>{attribute.value}</p>;
        })}
        <div className="nftBoxText">
          <Popup trigger={<button>Details</button>} modal>
            <NFTDetailedCard element={props.element} setStaked={setStaked} />
          </Popup>
        </div>
      </div>
    </>
  );
};

export default NFTCard;
