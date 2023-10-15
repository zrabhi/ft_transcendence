function Snackbar({ message, type }: any) {
  return (
    <div className={`snackbar ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      <span>{message}</span>
    </div>
  );
}
  export default Snackbar;