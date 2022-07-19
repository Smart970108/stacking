import "./index.css";
import MintProjects from "../MintProjects";
export interface IProjectsProps {}

const Projects: React.FunctionComponent<IProjectsProps> = (props) => {
  const projects = [
    {
      family: "",
      name: "",
      description: "",
      candyMachine: "",
    },
  ];
  return (
    <div>
      {projects.map((element, index) => {
        return <MintProjects key={index} element={element} />;
      })}
    </div>
  );
};

export default Projects;
