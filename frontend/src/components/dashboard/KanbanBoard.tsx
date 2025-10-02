"use client";

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import TaskForm from './TaskForm';
import TaskEditForm from './TaskEditForm';
import api from '@/services/api';
import { Task, Bloc, KanbanBoardProps, TaskWithBlocs, KanbanState, KanbanColumn } from '../types/kaban';


const columnStatuses = ['À faire', 'En cours', 'À recetter', 'Mise en production', 'Terminé'];

export default function KanbanBoard({ initialTasks, projectId }: KanbanBoardProps) {

  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('À faire');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithBlocs | null>(null);
  const [loadingTaskDetails, setLoadingTaskDetails] = useState(false);

  // --- Fonctions d'Organisation ---
  const organizeTasks = (tasks: Task[]): KanbanState => {
    const columns: { [key: string]: KanbanColumn } = {};

    columnStatuses.forEach(status => {
      columns[status] = { title: status, tasks: [] };
    });

    tasks.forEach(task => {
      if (columns[task.status]) {
        columns[task.status].tasks.push(task);
      }
    });

    return { columns };
  };

  const [kanbanState, setKanbanState] = useState<KanbanState>(() => organizeTasks(initialTasks));

  useEffect(() => {
    setKanbanState(organizeTasks(initialTasks));
  }, [initialTasks]);


  const handleOpenCreationModal = (status: string) => {
    setCurrentStatus(status);
    setIsCreationModalOpen(true);
  };

  const handleCloseCreationModal = () => setIsCreationModalOpen(false);

  const handleOpenEditModal = async (task: Task) => {
    setLoadingTaskDetails(true);
    setSelectedTask(null);

    try {
      const taskId = typeof task.id === 'string' ? parseInt(task.id) : task.id;

      const response = await api.get<TaskWithBlocs>(`/tasks/${taskId}`);

      setSelectedTask(response.data);
      setIsEditModalOpen(true);

    } catch (error) {
      console.error("Échec du chargement des blocs de la tâche:", error);
    } finally {
      setLoadingTaskDetails(false);
    }
  };


  const handleCloseEditModal = () => {
    setSelectedTask(null);
    setIsEditModalOpen(false);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setKanbanState(prevState => {
      const newColumns = { ...prevState.columns };

      let oldStatus = updatedTask.status;

      for (const status of columnStatuses) {
        const taskIndex = newColumns[status].tasks.findIndex(t => t.id === updatedTask.id);
        if (taskIndex > -1) {
          oldStatus = status;
          if (oldStatus !== updatedTask.status) {
            newColumns[oldStatus].tasks.splice(taskIndex, 1);
          }
          break;
        }
      }

      const targetColumn = newColumns[updatedTask.status];
      const existingIndex = targetColumn.tasks.findIndex(t => t.id === updatedTask.id);

      if (existingIndex > -1) {
        targetColumn.tasks[existingIndex] = updatedTask;
      } else {
        targetColumn.tasks.push(updatedTask);
      }

      return { columns: newColumns };
    });
    handleCloseEditModal();
  };

  const handleTaskDeletion = async (taskId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setKanbanState(prevState => {
        const newColumns = { ...prevState.columns };
        for (const status in newColumns) {
          const tasks = newColumns[status].tasks;
          const index = tasks.findIndex(task => task.id === taskId);
          if (index > -1) {
            tasks.splice(index, 1);
            break;
          }
        }
        return { columns: newColumns };
      });
    } catch (error) {
      console.error("Échec de la suppression de la tâche:", error);
    }
  };


  const handleTaskCreation = (newTask: Task) => {
    setKanbanState(prevState => {
      const newState = { ...prevState };
      newState.columns[newTask.status].tasks.push(newTask);
      return newState;
    });
    setIsCreationModalOpen(false);
  };





  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = kanbanState.columns[source.droppableId];
    const end = kanbanState.columns[destination.droppableId];
    const draggableTask = start.tasks.find(task => task.id.toString() === draggableId);

    if (!draggableTask) return;

    const newKanbanState = JSON.parse(JSON.stringify(kanbanState));

    newKanbanState.columns[source.droppableId].tasks.splice(source.index, 1);

    if (start !== end) {
      draggableTask.status = destination.droppableId;
      api.patch(`/tasks/${draggableTask.id}`, { status: destination.droppableId })
        .catch(err => console.error("Échec de la mise à jour du statut:", err));
    }

    newKanbanState.columns[destination.droppableId].tasks.splice(destination.index, 0, draggableTask);

    setKanbanState(newKanbanState);
  };


  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto p-4">
          {columnStatuses.map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-shrink-0 w-80 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{status}</h2>
                    <button
                      onClick={() => handleOpenCreationModal(status)}
                      className="text-gray-500 hover:text-blue-500 transition duration-150"
                      title="Créer une nouvelle tâche"
                    >
                      <FaPlus key={status} />
                    </button>
                  </div>

                  {kanbanState.columns?.[status]?.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={(e) => {
                            const clickedElement = e.target as HTMLElement;
                            if (clickedElement.closest('button')) {
                              e.stopPropagation();
                              return;
                            }
                            handleOpenEditModal(task);
                          }}
                          className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-xl shadow-black/30 mb-3 cursor-pointer text-gray-900 dark:text-gray-50 transition-transform hover:scale-[1.02] group relative"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium break-words whitespace-normal mr-4">{task.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                            <div className="absolute top-2 right-2 hidden group-hover:block z-10">
                              <button
                                onClick={() => handleTaskDeletion(task.id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none p-1"
                                title="Supprimer la tâche"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <Modal isOpen={isCreationModalOpen} onClose={handleCloseCreationModal} title={`Créer une tâche dans "${currentStatus}"`}>
        <TaskForm
          onSuccess={handleTaskCreation}
          onClose={handleCloseCreationModal}
          projectId={projectId}
          initialStatus={currentStatus}
        />
      </Modal>

      {selectedTask && (
        <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title={selectedTask ? `Éditer: ${selectedTask.title}` : 'Chargement...'}>
          {loadingTaskDetails && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chargement des détails de la tâche...
            </div>
          )}
          {selectedTask && !loadingTaskDetails && (
            <TaskEditForm
              task={selectedTask}
              onUpdate={handleTaskUpdate}
              onClose={handleCloseEditModal}
            />
          )}
        </Modal>
      )}
    </>
  );
}