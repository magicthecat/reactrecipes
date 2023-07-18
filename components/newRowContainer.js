export const NewRowContainer = ({ children }) => {
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