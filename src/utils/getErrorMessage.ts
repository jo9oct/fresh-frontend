import axios from "axios";

// Utility function to extract a meaningful error message from an unknown error
function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      // If the error is an Axios error, return the message from the response data if available, otherwise fallback
      return error.response?.data?.message || error.message || "Network error";
    }
    if (error instanceof Error) 
      return error.message; // If it's a standard JS Error, return its message
    return "Unknown error occurred"; // Fallback for unexpected error types
}
  
export default getErrorMessage;
