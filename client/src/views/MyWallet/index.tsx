import Header from "../../components/Header";
import InnerPage from "../../components/InnerPage";
import Navbar from "../../components/Navbar";
import Page from "../../components/Page";
import Wallet from "../../components/Wallet";
import WalletFetchNft from "../../components/WalletFetchNft";
interface IMyWalletProps {
    
}
 
const MyWallet: React.FunctionComponent<IMyWalletProps> = () => {
    return ( 
        <Page>
            <Navbar currentIndex={1}/>
            <Header title={"My Wallet"}/>
            <Wallet />
            <InnerPage>
                <WalletFetchNft />
            </InnerPage>
        </Page>
    );
}
 
export default MyWallet;