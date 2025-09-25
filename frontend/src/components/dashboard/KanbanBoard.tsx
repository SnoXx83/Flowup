"use client";

import api from '@/services/api';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder, DropResult } from '@hello-pangea/dnd';
import Modal from '@/components/common/Modal';
import TaskForm from '@/components/dashboard/TaskForm';
import { KanbanColumn, KanbanState, Task } from '../types/kaban';

const columnStatuses = ['À faire', 'En cours', 'À recetter', 'Mise en production', 'Terminé'];

interface KanbanBoardProps {
  initialTasks: Task[];
  projectId: number;
}

export default function KanbanBoard({ initialTasks, projectId }: KanbanBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [kanbanState, setKanbanState] = useState<KanbanState>(() => {
    const columns: { [key: string]: KanbanColumn } = {};
    columnStatuses.forEach(status => {
      columns[status] = {
        title: status,
        tasks: [],
      };
    });

    // Filtre les tâches par ID de projet avant de les organiser
    const filteredTasks = initialTasks.filter(task => task.project?.id === projectId);

    (filteredTasks ?? []).forEach(task => {
      if (columns[task.status]) {
        columns[task.status].tasks.push(task);
      }
    });

    return { columns };
  });

  // Met a jour l'etat quand la prop initialTasks ou projectId change
  useEffect(() => {
    const columns: { [key: string]: KanbanColumn } = {};
    columnStatuses.forEach(status => {
      columns[status] = {
        title: status,
        tasks: [],
      };
    });

    const filteredTasks = initialTasks.filter(task => task.project?.id === projectId);

    (filteredTasks ?? []).forEach(task => {
      if (columns[task.status]) {
        columns[task.status].tasks.push(task);
      }
    });

    setKanbanState({ columns });
  }, [initialTasks, projectId]);



  const handleTaskCreation = (newTask: Task) => {
    setKanbanState(prevState => {
      const startColumn = prevState.columns[newTask.status] || prevState.columns[columnStatuses[0]];
      const newTasks = [newTask, ...startColumn.tasks];
      return {
        columns: {
          ...prevState.columns,
          [startColumn.title]: {
            ...startColumn,
            tasks: newTasks,
          },
        },
      };
    });
  };


  const onDragEnd: OnDragEndResponder = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const start = kanbanState.columns[source.droppableId];
    const finish = kanbanState.columns[destination.droppableId];
    const originalState = { ...kanbanState };
    const startTasks = Array.from(start.tasks);
    const finishTasks = Array.from(finish.tasks);

    const [movedTask] = startTasks.splice(source.index, 1);
    if (!movedTask) {
      return;
    }

    finishTasks.splice(destination.index, 0, movedTask);

    setKanbanState(prevState => ({
      columns: {
        ...prevState.columns,
        [start.title]: { ...start, tasks: startTasks },
        [finish.title]: { ...finish, tasks: finishTasks },
      },
    }));

    if (movedTask) {
      try {
        await api.patch(`/tasks/${movedTask.id}`, { status: destination.droppableId });
      } catch (error) {
        console.error("Failed to update task status:", error);
        setKanbanState(originalState);
      }
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto">
          {columnStatuses.map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex-shrink-0 w-72 h-full min-h-[500px]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{status}</h2>
                    {status === 'À faire' && (
                      <button onClick={handleOpenModal} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {kanbanState.columns?.[status]?.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md mb-3 cursor-grab text-gray-900 dark:text-gray-50 transition-transform hover:scale-105"
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
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
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Créer une nouvelle tâche">
        <TaskForm
          onSuccess={handleTaskCreation}
          onClose={handleCloseModal}
          projectId={projectId}
        />
      </Modal>
    </>
  );
}