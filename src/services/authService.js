import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

const login = async (email, password) => {
    try {
        const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, { email, password });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message || "An unknown error occurred";
        throw { message };
    }
};

const register = async (username, email, password) => {
    try {
        const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, { username, email, password });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message || "An unknown error occurred";
        throw { message };
    }
};

const getProfile = async () => {
    try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_PROFILE);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message || "An unknown error occurred";
        throw { message };
    }
};

const updateProfile = async (userData) => {
    try {
        const response = await axiosInstance.put(API_PATH.AUTH.UPDATE_PROFILE, userData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message || "An unknown error occurred";
        throw { message };
    }
};

const changePassword = async (passwordData) => {
    try {
        const response = await axiosInstance.put(API_PATH.AUTH.CHANGE_PASSWORD, passwordData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message || "An unknown error occurred";
        throw { message };
    }
};

const forgotPassword = async (email) => {
    try {
        const response = await axiosInstance.post(API_PATH.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message || "An unknown error occurred";
        throw { message };
    }
};

const resetPassword = async (resetToken, password, confirmPassword) => {
    try {
        const response = await axiosInstance.post(
            API_PATH.AUTH.RESET_PASSWORD.replace(':token', resetToken),
            { password, confirmPassword }
        );
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.response?.data?.message || "An unknown error occurred";
        throw { message };
    }
};

const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
};

export default authService;
