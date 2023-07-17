import Head from 'next/head';
import styles from '../styles/Kanban.module.css';
import { useState, useEffect } from 'react';



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
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};





const TaskPill = ({ todo, dragCallback }) => {
  return (
    <div
      key={todo.id}
      className={styles.pill}
      draggable
      onDragStart={(event) => dragCallback(event, todo)}
    >
      <h3>{todo.type}</h3>
      <p>{todo.description}</p>
    </div>
  );
};

const Swimlane = ({ statusArray, handleDragOver, handleDragStart, handleDrop, getItemsCallback, priorityFilter }) => {
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
          handleDropCallback={handleColumnDrop} // Use the new handleColumnDrop function
        >
          {getItemsCallback(status.status, priorityFilter).map((todo) => (
            <TaskPill key={todo.id} todo={todo} dragCallback={handleDragStart} />
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

function useFetchData() {
  const [todos, setTodos] = useState([]);


  useEffect(() => {
    fetch('http://localhost:3001/todos')
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  return [todos, setTodos];
}




export default function Home() {
  const [todos, setTodos] = useFetchData()


  const kanbanProperties = {
    statuses: [
      { status: 'todo', name: 'To Do' },
      { status: 'blocked', name: 'Blocked' },
      { status: 'in-progress', name: 'In Progress' },
      { status: 'done', name: 'Done' }
    ],
    priorities: [
      { priority: 1, name: 'Must Have' },
      { priority: 2, name: 'Should Have' },
      { priority: 3, name: 'Could Have' }
    ]
  }

  const addTask = (newTask) => {
    setTodos([...todos, newTask]);
    // Make a POST request to add the new task item to the database
    fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error adding new task:', error);
      });
  };

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

  const handleDrop = (event, status, priority) => {
    event.preventDefault();
    const droppedTodo = JSON.parse(event.dataTransfer.getData('text/plain'));

    const updatedTodos = todos.map((todo) => {
      if (todo.id === droppedTodo.id) {
        return { ...todo, status, priority: priority };
      }
      return todo;
    });

    setTodos(updatedTodos);

    fetch(`http://localhost:3001/todos/${droppedTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...droppedTodo, status, priority: priority }),
    })
      .then((response) => response.json())

      .catch((error) => {
        console.error('Error updating task status and priority:', error);
      });
  };



  return (
    <div className={styles.container}>
      <Head>
        <title>Kanban Board</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Kanban Board</h1>
        <AddTaskForm addTask={addTask} />

        <div className={styles.kanban}>
          <NewRowContainer>
            <HeadingSwimLane
              statusArray={kanbanProperties.statuses}
            />
          </NewRowContainer>
          {kanbanProperties.priorities.map((priority) => (
            <NewRowContainer>
              <Swimlane
                key={priority.priority}
                statusArray={kanbanProperties.statuses}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                handleDragStart={handleDragStart}
                getItemsCallback={getColumnTodos}
                priorityFilter={priority.priority}
              />
            </NewRowContainer>
          ))}
        </div>

      </main>

    </div>
  );
}