import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
    const {isAuthenticated, loading} = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }
 
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        )
    }
    return isAuthenticated ? (
        <div className="flex h-screen bg-neutral-50 text-neutral-900">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6"><Outlet /></main>
            </div>
        </div>
    ) : (
        <Navigate to="/login" />
    )
}

export default ProtectedRoute