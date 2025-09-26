"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';
import ProjectForm from '@/components/dashboard/ProjectForm';

interface Project {
  id: number;
  name: string;
  description: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
}

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const fetchData = async () => {
    try {
      setDataLoading(true);
      const projectsResponse = await api.get('/projects');
      setProjects(projectsResponse.data);
      const tasksResponse = await api.get('/tasks');
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProjectCreation = () => {
    fetchData();
  };


  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const projectsResponse = await api.get('/projects');
          setProjects(projectsResponse.data);

          const tasksResponse = await api.get('/tasks');
          setTasks(tasksResponse.data);

        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setDataLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        Loading projects and tasks...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 mx-auto p-25 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Your Projects</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Add New Project
        </button>
      </div>

      {projects.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <li key={project.id} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="mt-2 text-gray-400">{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mb-12">You don't have any projects yet.</p>
      )}

      <h1 className="text-4xl font-bold mb-6">Your Tasks</h1>

      {tasks.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="mt-2 text-gray-600">{task.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">You don't have any tasks yet.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create New Project">
        <ProjectForm onSuccess={handleProjectCreation} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}
