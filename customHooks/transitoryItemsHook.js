import { useState, useEffect } from "react";

export function useTransitoryItemsData(url) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
            });
    }, []);

    const addItem = (newItem) => {
        setItems([...items, newItem]);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        })
            .then((response) => response.json())
            .then((data) => {
                // Update the items state with the newly added item
                setItems([...items, data]);
            })
            .catch((error) => {
                console.error('Error adding new item:', error);
            });
    };

    const updateItemDescription = (itemId, updatedDescription) => {
        const updatedItem = {
            ...items.find((item) => item.id === itemId),
            description: updatedDescription,
        };

        fetch(`${url}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
        })
            .then((response) => response.json())
            .then((updatedItem) => {
                // Update the items state or perform any necessary state management
                const updatedItems = items.map((item) => {
                    if (item.id === itemId) {
                        return updatedItem;
                    }
                    return item;
                });
                setItems(updatedItems);
            })
            .catch((error) => {
                console.error('Error updating item description:', error);
            });
    };

    const handleStatusUpdate = (event, status, priority) => {
        event.preventDefault();
        const droppedItem = JSON.parse(event.dataTransfer.getData('text/plain'));

        const updatedItems = items.map((item) => {
            if (item.id === droppedItem.id) {
                return { ...item, status, priority: priority };
            }
            return item;
        });

        setItems(updatedItems);

        fetch(`${url}/${droppedItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...droppedItem, status, priority: priority }),
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error updating item status and priority:', error);
            });
    };

    return [items, addItem, updateItemDescription, handleStatusUpdate];
}