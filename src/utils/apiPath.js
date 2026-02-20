export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_PATH = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/auth/profile",
        CHANGE_PASSWORD: "/api/auth/change-password",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password/:token",
    },
    DOCUMENT: {
        UPLOAD: "/api/documents/upload",
        GET_DOCUMENTS: "/api/documents",
        GET_DOCUMENTS_BY_ID: (id) => `/api/documents/${id}`,
        UPDATE_DOCUMENT: (id) => `/api/documents/${id}`,
        DELETE_DOCUMENT: (id) => `/api/documents/${id}`,
    },
    AI: {
        GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
        GENERATE_QUIZ: "/api/ai/generate-quiz",
        GENERATE_SUMMARY: "/api/ai/generate-summary",
        CHAT: "/api/ai/chat",
        EXPLAIN_CONCEPT: "/api/ai/explain-concept",
        GET_CHAT_HISTORY: (documentId) => `/api/ai/chat-history/${documentId}`,
        GET_INSIGHTS: "/api/ai/insights",
        GET_RECOMMENDATIONS: "/api/ai/recommendations",
        GENERATE_LEARNING_PATH: "/api/ai/learning-path",
    },
    QUIZZES: {
        GET_ALL_QUIZZES: "/api/quizzes",
        GET_QUIZZES_FOR_DOC: (documentId) => `/api/quizzes/${documentId}`,
        GET_QUIZ_BY_ID: (id) => `/api/quizzes/quiz/${id}`,
        SUBMIT_QUIZ: (id) => `/api/quizzes/${id}/submit`,
        GET_QUIZ_RESULTS: (id) => `/api/quizzes/${id}/results`,
        DELETE_QUIZ: (id) => `/api/quizzes/${id}`,

    },

    FLASHCARD: {
        GET_FLASHCARDS: "/api/flashcards",
        GET_FLASHCARDS_FOR_DOCUMENT: (documentId) => `/api/flashcards/${documentId}`,
        GET_FLASHCARD_SET_BY_ID: (id) => `/api/flashcards/set/${id}`,
        REVIEW_FLASHCARDS: (cardId) => `/api/flashcards/${cardId}/review`,
        TOGGLE_STAR: (cardId) => `/api/flashcards/${cardId}/star`,
        DELETE_FLASHCARD: (id) => `/api/flashcards/${id}`,
    },
    PROGRESS: {
        GET_DASHBOARD: "/api/progress/dashboard",
        CLEAR_ACTIVITY: "/api/progress/activity",
    },
    CONTENT: {
        CREATE_TAG: "/api/content/tags",
        GET_TAGS: "/api/content/tags",
        CREATE_COLLECTION: "/api/content/collections",
        GET_COLLECTIONS: "/api/content/collections",
        ADD_TO_COLLECTION: (id) => `/api/content/collections/${id}/items`,
    },
}