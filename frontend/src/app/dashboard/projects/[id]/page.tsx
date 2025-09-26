"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import { Project } from '@/components/types/project';
import { Task } from '@/components/types/kaban';


export default function ProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchProjectData = async () => {
                try {
                    const projectResponse = await api.get(`/projects/${id}`);
                    setProject(projectResponse.data);

                    const tasksResponse = await api.get(`/tasks/project/${id}`);
                    setTasks(tasksResponse.data ?? []);
                } catch (error) {
                    console.error("Failed to fetch project data:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProjectData();
        }
    }, [id]);

    if (isLoading) {
        return <div className="text-center mt-10">Chargement du projet...</div>;
    }

    if (!project) {
        return <div className="text-center mt-10 text-red-500">Projet non trouvé.</div>;
    }

    return (
        <div className="p-10 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200" >
            <div className='dark:bg-gray-800 border border-gray-700 rounded-lg p-5 mb-10'>
                <h1 className="text-5xl font-bold mb-5">{project.name}</h1>
                <h2 className='text-xl mb-2'>Description : </h2>
                <p className="text-gray-400 mb-8">{project.description}</p>
            </div>
            <div className=' border border-gray-700 flex items-center justify-between bg-gray-800 rounded-lg p-2 mb-2'>
                <h2 className='text-xl font-bold p-2'>Tasks</h2>
                <button className='bg-gray-700 p-2 rounded-lg cursor-pointer'>Ajouter une tâche</button>
            </div>
            <KanbanBoard initialTasks={tasks} projectId={Number(id)} />
        </div>
    );
}