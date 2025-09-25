export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  project: {
    id: number;
    name: string;
    description: string;
  };
}

export interface KanbanColumn {
  title: string;
  tasks: Task[];
}

export interface KanbanState {
  columns: {
    [key: string]: KanbanColumn;
  };
}