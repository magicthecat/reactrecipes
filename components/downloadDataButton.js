import styles from './buttons.module.css';


export const DownloadDataButton = ({ handleDownloadClick }) => {

    return (
        <div className={styles.download}>
            <button onClick={handleDownloadClick}>
                Download Data
            </button>
        </div>
    );
};