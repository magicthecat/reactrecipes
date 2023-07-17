import Head from 'next/head';
import styles from '../styles/Kanban.module.css';
import { useState } from 'react';
import { useTransitoryItemsData } from '../customHooks/transitoryItemsHook';
import { ConvertToXLSX } from '../utils/convertToXls';

const DownloadDataButton = ({ data, filename }) => {
  const handleClick = () => {
    ConvertToXLSX({ data, filename });
  };

  return (
    <div className={styles.download}>
      <button onClick={handleClick}>
        Download Data
      </button>
    </div>
  );
};

const AddTaskForm = ({ addTask }) => {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = () => {
    // Fetch the existing tasks to determine the next available ID
    fetch('http://localhost:3001/todos')
      .then((response) => response.json())
      .then((data) => {
        // Find the maximum ID from the existing tasks
        const maxId = Math.max(...data.map((task) => task.id));

        const newId = maxId + 1;

        // Create a new task object with the next ID
        const newTaskItem = {
          id: newId,
          type: 'Task ' + newId,
          description: newTask,
          status: 'todo',
          priority: 3,
        };

        // Call the addTask function from the parent component to add the new task
        addTask(newTaskItem);

        // Clear the new task input
        setNewTask('');
      })
      .catch((error) => {
        console.error('Error fetching existing tasks:', error);
      });
  };



  return (
    <div className={styles.addTask} >
      <textarea
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter task description"
        required
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

const TaskPill = ({ todo, dragCallback, updateTaskDescription }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState(todo.description);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    setUpdatedDescription(event.target.value);
  };

  const handleBlur = () => {
    // Call the updateTaskDescription callback to update the description in the database or perform any necessary API call
    updateTaskDescription(todo.id, updatedDescription);

    setIsEditing(false);
  };

  return (
    <div onDoubleClick={handleDoubleClick} key={todo.id} className={styles.pill} draggable onDragStart={(event) => dragCallback(event, todo)}>
      <h3>{todo.type}</h3>

      {isEditing ? (
        <textarea
          type="text"
          value={updatedDescription}
          onChange={handleInputChange}
          onBlur={handleBlur}
          autoFocus
        />


      ) : (
        <div>
          <p>{todo.description}</p>
        </div>
      )}
    </div>
  );
};

const Swimlane = ({ statusArray, handleDragOver, handleDragStart, handleDrop, getItemsCallback, priorityFilter, updateTaskDescription }) => {
  const handleColumnDrop = (event, status) => {
    handleDrop(event, status, priorityFilter);
  };

  return (
    <>
      {statusArray.map((status) => (
        <KanbanColumn
          key={status.status}
          status={status.status}
          handleDragOverCallback={handleDragOver}
          handleDropCallback={handleColumnDrop}

        >
          {getItemsCallback(status.status, priorityFilter).map((todo) => (
            <TaskPill key={todo.id} todo={todo} dragCallback={handleDragStart} updateTaskDescription={updateTaskDescription} />
          ))}
        </KanbanColumn>
      ))}
    </>
  );
};

const KanbanColumn = ({
  children,
  columnTitle,
  status,
  handleDragOverCallback,
  handleDropCallback,
}) => {
  return (
    <div
      className={styles.column}
      onDragOver={handleDragOverCallback}
      onDrop={(event) => handleDropCallback(event, status)}
    >
      <h2>{columnTitle}</h2>
      <div className={styles.cards}>
        {children}
      </div>
    </div>
  );
};

const HeadingColumn = ({
  columnTitle,

}) => {
  return (
    <div
      className={styles.headingColumn}

    >
      <h2>{columnTitle}</h2>

    </div>
  );
};

const PriorityColumn = ({
  columnTitle,

}) => {

  let conditionalStyles = styles.priorityColumn

  if (columnTitle === "") {
    conditionalStyles = styles.blankCell
  }



  return (
    <div
      className={conditionalStyles}

    >
      <h2>{columnTitle}</h2>

    </div>
  );
};


const HeadingSwimLane = (statusArray) => {

  return (
    <>
      {statusArray.statusArray.map((status) => (
        <HeadingColumn
          key={status.status}
          columnTitle={status.name}
        >

        </HeadingColumn>
      ))}
    </>
  );
};

const NewRowContainer = ({ children }) => {
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
  };

  const childStyle = {
    flexBasis: '100%',
    marginBottom: '1rem',
  };

  return (
    <div style={containerStyle}>

      {children}
    </div>
  );
};


export default function Home() {
  const [todos, addTask, updateTaskDescription, handleStatusUpdate] = useTransitoryItemsData('http://localhost:3001/todos')


  const kanbanProperties = {
    statuses: [
      { status: 'blocked', name: 'Blocked' },
      { status: 'todo', name: 'To Do' },
      { status: 'in-progress', name: 'In Progress' },
      { status: 'approvals', name: 'In Approvals' },
      { status: 'done', name: 'Done' }
    ],
    priorities: [
      { priority: 1, name: 'Must Have' },
      { priority: 2, name: 'Should Have' },
      { priority: 3, name: 'Could Have' },
      { priority: 4, name: "Won't Have" }
    ]
  }


  const getColumnTodos = (status, priority) => {
    const columnTodos = todos.filter((todo) => todo.status === status && todo.priority === priority);
    return columnTodos;
  };

  const handleDragStart = (event, todo) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(todo));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>MOSCOW Kanban Board</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Kanban Board</h1>
        <DownloadDataButton data={todos} filename="myData" />

        <AddTaskForm addTask={addTask} />

        <div className={styles.kanban}>
          <NewRowContainer>
            <PriorityColumn columnTitle="" />
            <HeadingSwimLane
              statusArray={kanbanProperties.statuses}
            />
          </NewRowContainer>
          {kanbanProperties.priorities.map((priority) => (
            <NewRowContainer>
              <PriorityColumn columnTitle={priority.name} />
              <Swimlane
                key={priority.priority}
                statusArray={kanbanProperties.statuses}
                handleDragOver={handleDragOver}
                handleDrop={handleStatusUpdate}
                handleDragStart={handleDragStart}
                getItemsCallback={getColumnTodos}
                priorityFilter={priority.priority}
                updateTaskDescription={updateTaskDescription}
              />
            </NewRowContainer>
          ))}
        </div>

      </main>

    </div>
  );
}