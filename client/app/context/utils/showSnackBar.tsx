export const showSnackbar = (message: string, isSuccess: boolean): void => {
  const snackbar = document.getElementById("snackbar") as HTMLElement | null;
  if (snackbar) {
    snackbar.textContent = message;
    snackbar.style.backgroundColor = isSuccess ? "#4CAF50" : "#F44336";
    snackbar.style.display = "block";

    setTimeout(() => {
      snackbar.style.display = "none";
    }, 3000); // Hide the snackbar after 3 seconds (adjust as needed)
  }
};
