// import { useEffect } from "react";
// import Header from "../../components/Header";
import InnerPage from "../../components/InnerPage";
// import Navbar from "../../components/Navbar";
import Page from "../../components/Page";

interface IStakingProps {
    
}
 
const Staking: React.FunctionComponent<IStakingProps> = () => {
    return ( 
        <Page>
            {/* <Navbar currentIndex={0}/> */}
            {/* <Header title={"Staking"}/> */}
            <InnerPage>
                {/* <WalletFetchNft /> */}
            </InnerPage>
        </Page>
    );
}
 
export default Staking;