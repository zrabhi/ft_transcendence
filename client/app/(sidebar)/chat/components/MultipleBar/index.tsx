function Snackbar({ message, open, onClose, uniqueKey, type }: any) {
    return (
      <div className={`snackbar ${open ? 'show' : ''}${type=== "success" ? "bg-green-500": "bg-red-500"}` }>
        <span>{message}</span>
        <button onClick={() => onClose(uniqueKey)}>Close</button>
      </div>
    );
  }

  export default Snackbar;