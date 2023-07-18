import KanbanBoard from "./kanban"
import BasicCardGrid from "../components/BasicCardGrid"


export default function Home() {

    const endpoint = "workItems"

    return (

        <>
            <BasicCardGrid endpoint="projects" title="Projects" />
            <KanbanBoard endpoint={endpoint} />
        </>

    )
}