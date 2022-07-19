import Header from "../../components/Header";
import InnerPage from "../../components/InnerPage";
import Navbar from "../../components/Navbar";
import Page from "../../components/Page";
import Projects from "../../components/Projects";
import Wallet from "../../components/Wallet";
interface ILaunchpadProps {
    
}
 
const Launchpad: React.FunctionComponent<ILaunchpadProps> = () => {
    return ( 
        <Page>
            <Navbar currentIndex={3}/>
            <Header title={"Launchpad"}/>
            <Wallet />
            <InnerPage>
                <Projects />
            </InnerPage>
        </Page>
    );
}
 
export default Launchpad;