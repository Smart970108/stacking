import ReactDOM from "react-dom";
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
  getCoin98Wallet,
  getLedgerWallet,
  getMathWallet,
  getSafePalWallet,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "./index.css";
import Routes from "./routes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
require("@solana/wallet-adapter-react-ui/styles.css");

const network = WalletAdapterNetwork.Mainnet;
// const network = WalletAdapterNetwork.Devnet;

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getLedgerWallet(),
      getSolletWallet({ network }),
      getSlopeWallet(),
      getSolflareWallet(),
      getCoin98Wallet(),
      getMathWallet(),
      getSafePalWallet(),
      getSolletExtensionWallet({ network }),
    ],
    []
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>
            <Routes />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </DndProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("__next"));
