export interface Project {
    id: number;
    title: string;
    description: string;
}

export interface Bloc {
    id?: number;
    type: 'title' | 'text';
    content: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    projectId: number; 
    project: Project; 
    blocs: Bloc[]; 
    createdAt: string;
}

export interface TaskWithBlocs extends Task {}; 

export interface KanbanColumn {
    title: string;
    tasks: Task[];
}

export interface KanbanState {
    columns: { [key: string]: KanbanColumn };
}

export interface KanbanBoardProps {
    initialTasks: Task[];
    projectId: number;
}
