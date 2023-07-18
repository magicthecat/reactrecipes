import { useTransitoryItemsData } from "../customHooks/transitoryItemsHook";
import { BasicCard } from "./basicCard";
import styles from './itemCard.module.css';

export default function BasicCardGrid({ endpoint, title }) {
    const [items] = useTransitoryItemsData(`http://localhost:3001/${endpoint}`);

    if (items.length === 0) {
        return <div>Loading...</div>;
    }

    const propertyNames = Object.keys(items[0]);

    return (
        <div>
            <h2>{title}</h2>
            <div className={styles.cardGrid}>
                {items.map((item) => (
                    <BasicCard item={item} />
                ))}
            </div>
        </div>
    );
}