export interface ProjectDetailes {
    family?: string;
    name: string;
    description: string;
    candyMachine: string;
}

export interface IMintProjectsProps {
    element: ProjectDetailes
}

const MintProjects: React.FunctionComponent<IMintProjectsProps> = (props) => {
    return (
        <div style={{ display: "flex", margin: ".5rem", border: "1px solid #1a1b18", background: "#121311", borderRadius: "14px" }}>
            <img style={{ width: "16rem", height: "16rem", margin: "1rem", boxShadow: "0px 0px 18px 1px #222", borderRadius: "16px" }} alt="photo" />
            <div style={{ margin: "0reme .25rem" }}>
                {/* <h1 style={{ textAlign: "center", margin: ".5rem auto" }}>{props.element.family} / {props.element.name}</h1> */}
                <h1 style={{ textAlign: "center", margin: ".5rem auto" }}>{props.element.name}</h1>
                <div style={{ margin: "0rem .5rem" }}>{props.element.description}</div>
                <br />
                <div style={{ display: "flex" }}>
                    <div className="infoButton">
                        <label htmlFor="supplyInfo">Supply</label>
                        <br />
                        <button disabled id="supplyInfo" className="infoBox">3,055</button>
                    </div>
                    <div className="infoButton">
                        <label htmlFor="supplyInfo">Price</label>
                        <br />
                        <button disabled id="supplyInfo" className="infoBox">1 ◎</button>
                    </div>
                    <div className="infoButton">
                        <label htmlFor="supplyInfo">Remaining</label>
                        <br />
                        <button disabled id="supplyInfo" className="infoBox">0</button>
                    </div>
                </div>
            </div>
                <button className="projectDetailes">
                    {"Mint"}
                </button>
        </div>
    );
}

export default MintProjects;