import "./index.css";
import { useEffect, useState } from "react";
import logo from "./IguanasTwitterBanner.png";
import NavbarElements from "../NavbarElements";

export interface INavbarProps {
    currentIndex: number,
}


const Navbar: React.FunctionComponent<INavbarProps> = (props) => {

    const [isDropDownActive, setIsDropDownActive] = useState(false);
    const [screenSize, getDimension] = useState({
        dynamicWidth: window.innerWidth,
        dynamicHeight: window.innerHeight
    });

    const setDimension = () => {
        getDimension({
            dynamicWidth: window.innerWidth,
            dynamicHeight: window.innerHeight
        })
    }

    useEffect(() => {
        window.addEventListener('resize', setDimension);
        if (screenSize.dynamicWidth > 992) {
            setIsDropDownActive(false);
        }
        return (() => {
            window.removeEventListener('resize', setDimension);
        })
    }, [screenSize])

    return (
        <>
            <section className="Navbar">
                <div className="responsiveNavbar">
                    <div style={{ display: "flex" }}>
                        <div className="NavbarImg">
                            <img src={logo} alt="Cyborg Iguana Logo" />
                        </div>
                        <button className="dropDown" onClick={() => setIsDropDownActive(!isDropDownActive)}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" color="#f8f7f8" height="1.5rem" width="1.5rem" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
                            </svg>
                        </button>
                    </div>
                    {isDropDownActive === true && (
                        <div className="responsiveNavbarElements">
                            <NavbarElements currentIndex={props.currentIndex} />
                        </div>
                    )}
                </div>
                    <div className="NavbarContainer">
                        <NavbarElements currentIndex={props.currentIndex} />
                    </div>
            </section>
        </>
    );
}

export default Navbar;