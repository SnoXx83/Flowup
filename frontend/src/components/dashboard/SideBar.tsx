"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const projectsResponse = await api.get('/projects');
                setProjects(projectsResponse.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        router.push('/auth');
    };

    const toggleMenu = (menuName: string) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-white shadow-lg p-6 flex flex-col justify-between transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}
        >
            {/* Toggle Button */}
            <div className="absolute top-4 right-4 cursor-pointer" onClick={toggleSidebar}>
                {isOpen ? 'X' : '='}
            </div>

            {/* Sidebar Header: Profile Info */}
            <div className={`items-center flex flex-col justify-center text-center space-x-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                <img
                    src="https://randomuser.me/api/portraits/women/72.jpg"
                    alt="User Avatar"
                    className="w-20 h-20 flex justify-center rounded-full mb-5"
                />
                <div>
                    <h3 className="text-lg font-semibold">Julie Larquetoux</h3>
                    <p className="text-sm text-gray-500">julielarquetoux@gmail.com</p>
                </div>
            </div>

            {/* Navigation Links with Submenus */}
            <nav className="flex-1 mt-8">
                <ul className="space-y-2">
                    {/* Projects Menu Item */}
                    <li>
                        <button
                            onClick={() => toggleMenu('projects')}
                            className="flex items-center p-3 w-full"
                        >
                            {isOpen && 'Projets'}
                        </button>
                        {openMenu === 'projects' && isOpen && (
                            <ul className="ml-4 mt-2 space-y-1">
                                {isLoading ? (
                                    <li className="text-sm text-gray-500">Loading...</li>
                                ) : projects.length > 0 ? (
                                    projects.map((project: any) => (
                                        <li key={project.id}>
                                            <a href={`/dashboard/projects/${project.id}`} className="block p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                                {project.name}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-gray-500">No projects found.</li>
                                )}
                            </ul>
                        )}
                    </li>

                    {/* Tasks Menu Item */}
                    <li>
                        <button
                            onClick={() => toggleMenu('tasks')}
                            className="flex items-center p-3 w-full"
                        >
                            {isOpen && 'Tâches'}
                        </button>
                        {openMenu === 'tasks' && isOpen && (
                            <ul className="ml-4 mt-2 space-y-1">
                                {isLoading ? (
                                    <li className="text-sm text-gray-500">Loading...</li>
                                ) : tasks.length > 0 ? (
                                    tasks.map((task: any) => (
                                        <li key={task.id}>
                                            <a href={`/dashboard/tasks/${task.id}`} className="block p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                                {task.title}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-gray-500">No tasks found.</li>
                                )}
                            </ul>
                        )}
                    </li>

                    {/* Other static links */}
                    <li>
                        <a href="/dashboard/profile" className="flex items-center p-3">
                            {isOpen && 'Profil'}
                        </a>
                    </li>
                    <li>
                        <a href="/dashboard/settings" className="flex items-center p-3">
                            {isOpen && 'Paramètres'}
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="space-y-4">
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center p-3 text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-700 rounded-lg transition-colors"
                >
                    {isOpen && 'Déconnexion'}
                </button>
            </div>
        </aside>
    );
}