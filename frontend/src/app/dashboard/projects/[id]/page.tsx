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
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">{project.name}</h1>
            <p className="text-gray-600 mb-8">{project.description}</p>
            <KanbanBoard initialTasks={tasks} projectId={Number(id)} />
        </div>
    );
}