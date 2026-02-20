import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

const getFlashcards = async () => {
    try {
        const response = await axiosInstance.get(API_PATH.FLASHCARD.GET_FLASHCARDS);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Fetch flashcards" }
    }
};


const getFlashcardsForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATH.FLASHCARD.GET_FLASHCARDS_FOR_DOCUMENT(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Fetch flashcards for document" }
    }
};

const getFlashcardSetById = async (id) => {
    try {
        const response = await axiosInstance.get(API_PATH.FLASHCARD.GET_FLASHCARD_SET_BY_ID(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Fetch flashcard set" }
    }
};

const reviewFlashcards = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATH.FLASHCARD.REVIEW_FLASHCARDS(cardId), { cardIndex });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Review flashcards" }
    }
};

const toggleStar = async (cardId) => {
    try {
        const response = await axiosInstance.put(API_PATH.FLASHCARD.TOGGLE_STAR(cardId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Star Flashcard" }
    }
};


const deleteFlashcard = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATH.FLASHCARD.DELETE_FLASHCARD(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Delete Flashcard" }
    }
};

const flashcardService = {
    getFlashcards,
    getFlashcardsForDocument,
    getFlashcardSetById,
    reviewFlashcards,
    toggleStar,
    deleteFlashcard
};

export default flashcardService;
