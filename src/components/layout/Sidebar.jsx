import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, User, LogOut, BrainCircuit, BookOpen, X, Trophy, MessageSquare } from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const handleLogout = () => {
        setIsLogoutModalOpen(true)
    }

    const handleConfirmLogout = () => {
        logout();
        navigate('/login');
    }

    const navLinks = [
        {
            to: '/dashboard',
            icon: LayoutDashboard,
            text: 'Dashboard'
        },
        {
            to: '/documents',
            icon: FileText,
            text: 'Documents'
        },
        {
            to: '/flashcards',
            icon: BookOpen,
            text: 'Flashcards'
        },
        {
            to: '/quizzes',
            icon: Trophy,
            text: 'Quizzes'
        },
        {
            to: '/ask',
            icon: MessageSquare,
            text: 'Ask AI'
        },
        {
            to: '/profile',
            icon: User,
            text: 'Profile'
        },
    ]

    return <>
        <div className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar} aria-hidden="true"></div>
        <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-50 to-teal-50 backdrop-blur-lg border-r border-emerald-200/60 z-50 md:relative md:w-64 md:shrink-0 md:flex md:flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            {/*Logo and close button for mobile*/}
            <div className="flex items-center justify-between h-16 border-b border-emerald-200/60">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/25 ml-2">
                        <BrainCircuit className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">KnoEra</h1>
                </div>
                <button onClick={toggleSidebar} className="md:hidden p-2 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors">
                    <X size={20} />
                </button>
            </div>
            {/* Navigation*/}
            <nav className='flex-1 px-4 py-6 space-y-2'>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={toggleSidebar}
                        className={({ isActive }) => `
                    group flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300
                    ${isActive
                                ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-white/20'
                                : 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 hover:translate-x-1'
                            }
                `}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon
                                    size={18}
                                    strokeWidth={2.5}
                                    className={`transition-colors duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}
                                />
                                {link.text}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/*Logout section*/}
            <div className="p-4 border-t border-emerald-200/60">
                <button
                    onClick={handleLogout}
                    className="w-full group flex items-center gap-3 px-4 py-3 text-sm font-semibold text-emerald-600 rounded-2xl hover:bg-emerald-100 hover:text-emerald-800 transition-all duration-200"
                >
                    <LogOut
                        size={18}
                        strokeWidth={2.5}
                        className="transition-transform duration-200 group-hover:scale-110"
                    />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
        <Modal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            title="Log Out"
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <LogOut className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="font-bold">Ready to leave?</h4>
                        <p className="text-sm opacity-90">You can log back in anytime.</p>
                    </div>
                </div>

                <p className="text-slate-600 leading-relaxed font-medium">
                    Logging out will end your current session. Make sure your work is saved.
                </p>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="secondary"
                        onClick={() => setIsLogoutModalOpen(false)}
                    >
                        Stay Logged In
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 border-none"
                        onClick={handleConfirmLogout}
                    >
                        Log Out
                    </Button>
                </div>
            </div>
        </Modal>
    </>
}

export default Sidebar