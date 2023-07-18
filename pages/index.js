import KanbanBoard from "./kanban"
import ListItems from "../components/listItems"


export default function Home() {

    const endpoint = "workItems"

    return (

        <>
            <ListItems endpoint="projects" title="Projects" />
            <KanbanBoard endpoint={endpoint} />
        </>

    )
}