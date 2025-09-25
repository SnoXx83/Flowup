"use client";

import { useState } from 'react';
import api from '@/services/api';

interface Bloc {
    type: 'text' | 'title';
    content: string;
}

interface TaskFormProps {
    onSuccess: (newTask: any) => void;
    onClose: () => void;
    projectId: number;
}

export default function TaskForm({ onSuccess, onClose, projectId }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState<Bloc[]>([{ type: 'text', content: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post(`/tasks/${projectId}`, { title, blocs: blocks });
            onSuccess(response.data);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create task.');
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

            {blocks.map((block, index) => (
                <div key={index} className="relative group">
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
                    className="py-1 px-3 border rounded-md text-sm text-gray-500 hover:bg-gray-100"
                >
                    + Texte
                </button>
                <button
                    type="button"
                    onClick={addTitleBlock}
                    className="py-1 px-3 border rounded-md text-sm text-gray-500 hover:bg-gray-100"
                >
                    + Titre
                </button>
            </div>

            <div className="fixed bottom-0 right-0 p-8">
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Création...' : 'Créer la tâche'}
                    </button>
                </div>
            </div>
        </form>
    );
}