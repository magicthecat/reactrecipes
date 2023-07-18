import styles from './itemCard.module.css';

export const BasicCard = ({ item }) => {

    const propertyNames = Object.keys(item);

    return (

        <div key={item.id} className={styles.card}>
            {propertyNames.map((propertyName) => (
                <p key={propertyName}>
                    <b>{propertyName}</b>: {item[propertyName]}
                </p>
            ))}
        </div>

    )

}