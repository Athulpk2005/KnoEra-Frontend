import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

const getDocuments = async () => {
    try {
        const response = await axiosInstance.get(API_PATH.DOCUMENT.GET_DOCUMENTS);
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || {message:"Failed to Fetch documents"}
    }
};

const uploadDocument = async (formData) => {
    try {
        const response = await axiosInstance.post(API_PATH.DOCUMENT.UPLOAD, formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || {message:"Failed to Upload document"}
    }
};

const deleteDocument = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATH.DOCUMENT.DELETE_DOCUMENT(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"Failed to Delete document"}
    }
};

const getDocumentById = async (id) => {
    try {
        const response = await axiosInstance.get(API_PATH.DOCUMENT.GET_DOCUMENTS_BY_ID(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || {message:"Failed to Fetch document details"}
    }
};

const documentService = {
    getDocuments,
    uploadDocument,
    deleteDocument,
    getDocumentById,
};
export default documentService;