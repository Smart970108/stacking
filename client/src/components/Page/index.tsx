import "./index.css";
import axios from "axios"
import { useEffect, useState } from "react";
export interface IPageProps {
}
 
const Page: React.FunctionComponent<IPageProps>= (props) => {
    // eslint-disable-next-line
    const [totalStakeCount,setTotalStakeCount]=useState(0);
    useEffect(()=>{
        const getTotalStakeCount = async () =>{
            // eslint-disable-next-line
            const count=await axios.post("/staked_nfts_count").then(function (response) {
                setTotalStakeCount(response.data.count)
            }).catch(
                function (error) {
                    setTotalStakeCount(0)
                }
              )
        }
        getTotalStakeCount()
    },[])
    return(
        <>
        <div className="banner0">Total Staked Iguanas : {totalStakeCount} / 2222</div>
        <div className="banner">ENTER COSMIC SPACE</div>
        <main className="Page">
            {props.children}
        </main>
        </>
    );
}

export default Page;