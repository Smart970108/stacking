import "./index.css";
export interface IHeaderProps {
    title:String,
}
 
const Header: React.FunctionComponent<IHeaderProps>= (props) => {
    return(
        <header className="Header">
            <h1>{props.title}</h1>
        </header>
    );
}

export default Header;