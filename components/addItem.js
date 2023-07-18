import { useState } from "react";
import styles from './addItem.module.css';

export const AddItem = ({ addItemCallback, endpoint, itemType }) => {
    const [newItem, setNewItem] = useState('');
    const handleSubmit = () => {
        // Fetch the existing tasks to determine the next available ID
        fetch(`http://localhost:3001/${endpoint}`)
            .then((response) => response.json())
            .then((data) => {
                // Find the maximum ID from the existing tasks
                const maxId = Math.max(...data.map((item) => item.id));

                const newId = maxId + 1;

                // Create a new task object with the next ID
                const newItemObject = {
                    id: newId,
                    name: `${itemType.type} ` + newId,
                    description: newItem,
                    status: 'todo',
                    priority: 3,
                };

                // Call the addItem function from the parent component to add the new task
                addItemCallback(newItemObject);

                // Clear the new task input
                setNewItem('');
            })
            .catch((error) => {
                console.error('Error fetching existing tasks:', error);
            });
    };



    return (
        <div className={styles.addItem} >
            <textarea
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={`Enter ${itemType.type} description`}
                required
            />
            <button onClick={handleSubmit}>Add</button>
        </div>
    );
};