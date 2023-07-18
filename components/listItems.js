import { useTransitoryItemsData } from "../customHooks/transitoryItemsHook";
import styles from './list.module.css';

export default function ListItems({ endpoint, title }) {
    const [items] = useTransitoryItemsData(`http://localhost:3001/${endpoint}`);

    if (items.length === 0) {
        return <div>Loading...</div>;
    }

    const propertyNames = Object.keys(items[0]);

    return (
        <div>
            <h2>{title}</h2>
            {items.map((item) => (
                <div key={item.id} className={styles.card}>
                    {propertyNames.map((propertyName) => (
                        <p key={propertyName}>
                            <b>{propertyName}</b>: {item[propertyName]}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
}