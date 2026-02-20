import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

const getDashboardData = async () => {
    try {
        const response = await axiosInstance.get(API_PATH.PROGRESS.GET_DASHBOARD);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Fetch Dashboard Data" }
    }
};

const clearActivity = async () => {
    try {
        const response = await axiosInstance.delete(API_PATH.PROGRESS.CLEAR_ACTIVITY);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to Clear Activity" }
    }
};

const progressService = {
    getDashboardData,
    clearActivity
};

export default progressService;