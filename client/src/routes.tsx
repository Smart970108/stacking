import { HashRouter, Route, Routes } from "react-router-dom";

// import Home from './views/Home/index';
// import Launchpad from "./views/Launchpad";
// import MyWallet from './views/MyWallet/index';
import Staking from "./views/Staking";

//import { Providers } from './providers';
function routes() {
  return (
    <HashRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/myWallet" element={<MyWallet />} /> */}
        <Route path="/" element={<Staking />} />
        {/* <Route path="/launchpad" element={<Launchpad />} /> */}
      </Routes>
    </HashRouter>
  );
}
export default routes;