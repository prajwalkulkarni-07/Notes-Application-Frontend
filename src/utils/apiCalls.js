import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://notes-application-backend-mgpv.onrender.com/api/notes";

export const getNotesAPICall = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.notes;
  } catch (error) {
    toast.error("Failed to fetch notes");
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const addNoteAPICall = async (title, content, color) => {
  try {
    const response = await axios.post(`${BASE_URL}/addNote`, {
      title,
      content,
      color,
    });
    toast.success("Note added successfully");
    return response.data.note;
  } catch (error) {
    toast.error("Failed to add note");
    console.error("Error adding note:", error);
    throw error;
  }
};

export const editNoteAPICall = async (id, title, content, color) => {
  try {
    const response = await axios.post(`${BASE_URL}/editNote/${id}`, {
      title,
      content,
      color,
    });
    toast.success("Note updated successfully");
    return response.data.note;
  } catch (error) {
    toast.error("Failed to update note");
    console.error("Error editing note:", error);
    throw error;
  }
};

export const deleteNoteAPICall = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/deleteNote/${id}`);
    toast.success("Note deleted successfully");
  } catch (error) {
    toast.error("Failed to delete note");
    console.error("Error deleting note:", error);
    throw error;
  }
};

export const pinNoteAPICall = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/pinNote/${id}`);
    return response.data.note;
  } catch (error) {
    console.error("Error pinning note:", error);
    throw error;
  }
};