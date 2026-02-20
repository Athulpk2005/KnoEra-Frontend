import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

const getQuizzesForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATH.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Fetch Quizzes" }
    }
};

const getAllQuizzes = async () => {
    try {
        const response = await axiosInstance.get(API_PATH.QUIZZES.GET_ALL_QUIZZES);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Fetch All Quizzes" }
    }
};

const getQuizById = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATH.QUIZZES.GET_QUIZ_BY_ID(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Fetch Quiz" }
    }
};

const submitQuiz = async (quizId, answers) => {
    try {
        const response = await axiosInstance.post(API_PATH.QUIZZES.SUBMIT_QUIZ(quizId), { answers });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Submit Quiz" }
    }
};

const getQuizResults = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATH.QUIZZES.GET_QUIZ_RESULTS(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Fetch Quiz Results" }
    }
};

const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.delete(API_PATH.QUIZZES.DELETE_QUIZ(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Delete Quiz" }
    }
};

const quizService = {
    getQuizzesForDocument,
    getAllQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
};

export default quizService;
