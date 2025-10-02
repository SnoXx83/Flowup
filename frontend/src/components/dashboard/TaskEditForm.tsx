"use client";

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Task, Bloc } from '../types/kaban';


type TaskWithBlocs = Task & { blocs: Bloc[] };

interface TaskEditFormProps {
    task: TaskWithBlocs
    onUpdate: (updatedTask: Task) => void;
    onClose: () => void;
}

const columnStatuses = ['À faire', 'En cours', 'À recetter', 'Mise en production', 'Terminé'];

export default function TaskEditForm({ task, onUpdate, onClose }: TaskEditFormProps) {
    const [title, setTitle] = useState(task.title);
    const [blocks, setBlocks] = useState<Bloc[]>(task.blocs || [{ type: 'text', content: '' }]);
    const [status, setStatus] = useState(task.status);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        setTitle(task.title || '');
        setStatus(task.status || columnStatuses[0]);
        setBlocks((task.blocs || []).map(b => ({
            ...b,
            content: b.content ?? '',
        })));
    }, [task]);

    const handleBlockChange = (index: number, content: string) => {
        const newBlocks = [...blocks];
        newBlocks[index].content = content;
        setBlocks(newBlocks);
    };

    const addTextBlock = () => {
        setBlocks([...blocks, { type: 'text', content: '' }]);
    };

    const addTitleBlock = () => {
        setBlocks([...blocks, { type: 'title', content: '' }]);
    };

    const removeBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log(title);
            const response = await api.patch(`/tasks/${task.id}`, {
                title,
                blocs: blocks,
                status
            });

            onUpdate(response.data);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update task.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent outline-none border-none placeholder-gray-400 dark:placeholder-gray-600"
                    placeholder="Titre de la tâche"
                    required
                />
            </h1>
            <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200">Statut</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                    {columnStatuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {blocks.map((block, index) => (
                <div key={block.id || index} className="relative group">
                    <div className="absolute top-0 right-full mr-2 hidden group-hover:block">
                        <button
                            type="button"
                            onClick={() => removeBlock(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                        >
                            &times;
                        </button>
                    </div>

                    {block.type === 'text' && (
                        <textarea
                            value={block.content}
                            onChange={(e) => handleBlockChange(index, e.target.value)}
                            rows={1}
                            className="w-full resize-none bg-transparent outline-none border-none text-base text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 overflow-hidden"
                            placeholder="Écrivez quelque chose..."
                            style={{ minHeight: '1.5rem' }}
                            onInput={(e) => {
                                e.currentTarget.style.height = 'auto';
                                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                            }}
                        />
                    )}
                    {block.type === 'title' && (
                        <textarea
                            value={block.content}
                            onChange={(e) => handleBlockChange(index, e.target.value)}
                            rows={1}
                            className="w-full resize-none bg-transparent outline-none border-none text-3xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 overflow-hidden"
                            placeholder="Titre de section"
                            style={{ minHeight: '2.5rem' }}
                            onInput={(e) => {
                                e.currentTarget.style.height = 'auto';
                                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                            }}
                        />
                    )}
                </div>
            ))}

            <div className="flex space-x-2 mt-4">
                <button
                    type="button"
                    onClick={addTextBlock}
                    className="py-1 px-3 border rounded-md text-sm text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    + Texte
                </button>
                <button
                    type="button"
                    onClick={addTitleBlock}
                    className="py-1 px-3 border rounded-md text-sm text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    + Titre
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="fixed bottom-0 right-0 p-8 bg-white dark:bg-gray-700 shadow-2xl w-full max-w-lg z-20">
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </form>
    );
}