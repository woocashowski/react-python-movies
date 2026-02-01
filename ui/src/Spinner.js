export default function Spinner() {
    const style = {
        display: 'inline-block',
        width: '40px',
        height: '40px',
        border: '4px solid rgba(0,0,0,0.1)',
        borderRadius: '50%',
        borderTopColor: '#3498db',
        animation: 'spin 1s ease-in-out infinite'
    };
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={style}></div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>;
}
