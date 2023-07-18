import { useState } from "react";
import styles from './itemCard.module.css';


export const ItemCard = ({ item, dragCallback, updateItemDescription }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDescription, setUpdatedDescription] = useState(item.description);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (event) => {
        setUpdatedDescription(event.target.value);
    };

    const handleBlur = () => {
        // Call the updateItemDescription callback to update the description in the database or perform any necessary API call
        updateItemDescription(item.id, updatedDescription);

        setIsEditing(false);
    };

    return (
        <div onDoubleClick={handleDoubleClick} key={item.id} className={styles.card} draggable onDragStart={(event) => dragCallback(event, item)}>
            <h3>{item.name}</h3>

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
                    <p>{item.description}</p>
                </div>
            )}
        </div>
    );
};