import React from "react";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Page from "../../components/Page";
import Wallet from "../../components/Wallet";
export interface IHomeProps {
}
 
const Home: React.FunctionComponent<IHomeProps> = (props) => {
    return ( 
        <Page>
            <Navbar currentIndex={0}/>
            <Header title={"Cyborg Iguana Lounge"}/>
            <Wallet />
        </Page>
    );
}
 
export default Home;