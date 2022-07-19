import "./index.css";
import { Link } from 'react-router-dom';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export interface INavbarElementsProps {
    currentIndex: number,
}
 
const NavbarElements: React.FunctionComponent<INavbarElementsProps>= (props) => {
    return(
        <ul className="NavbarUL">
            {/* <Link to={"/"}><li className={`NavbarElement${props.currentIndex === 0 ? " active" : ""}`} >Home</li></Link>
            <Link to={"/myWallet"}><li className={`NavbarElement${props.currentIndex === 1 ? " active" : ""}`} >My Wallet</li></Link> */}
            <Link to={"/staking"}><li className={`NavbarElement${props.currentIndex === 0 ? " active" : ""}`} >Staking</li></Link>
            <Link to={"/"}><li className={`NavbarElement${props.currentIndex === 1 ? " active" : ""}`} >Missions</li></Link>
            <Link to={"/"}><li className={`NavbarElement${props.currentIndex === 2 ? " active" : ""}`} >Armory</li></Link>
            {/* <Link to={"/launchpad"}><li className="NavbarElement">Launchpad</li></Link>
            <Link to={"/"}><li className="NavbarElement">Events</li></Link>
            <Link to={"/"}><li className="NavbarElement">Market</li></Link>
            <Link to={"/"}><li className="NavbarElement">Cyborg Gold</li></Link>
            <Link to={"/"}><li className="NavbarElement">FAQ</li></Link> */}
            {/* <WalletMultiButton style={{fontSize:"1rem",backgroundColor:"#30353b",minWidth:"13.5rem",justifyContent:"flex-start"}}className="NavbarElement displayresponsive"/> */}
        </ul>
    );
}

export default NavbarElements;