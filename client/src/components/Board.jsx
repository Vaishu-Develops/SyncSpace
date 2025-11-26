import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Calendar, User as UserIcon, Edit2 } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import TaskDetailModal from './Board/TaskDetailModal';

const socket = io('http://localhost:5000');

const Board = ({ projectId, workspaceId: propWorkspaceId }) => {
    const params = useParams();
    // Use prop if available (Project View), otherwise param (Workspace View legacy)
    const workspaceId = propWorkspaceId || params.workspaceId;

    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState({
        todo: { id: 'todo', title: 'To Do', taskIds: [] },
        'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
        pending: { id: 'pending', title: 'Pending', taskIds: [] },
        done: { id: 'done', title: 'Done', taskIds: [] },
    });
    const { user } = useAuth();
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    useEffect(() => {
        if (workspaceId) {
            fetchTasks();
            socket.emit('join-workspace', workspaceId);
        }

        socket.on('task-updated', (updatedTask) => {
            fetchTasks();
        });

        return () => {
            socket.off('task-updated');
        };
    }, [workspaceId, projectId]);

    const fetchTasks = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let url = `http://localhost:5000/api/tasks/${workspaceId}`;
            if (projectId) {
                url += `?projectId=${projectId}`;
            }

            const { data } = await axios.get(url, config);

            setTasks(data);

            // Organize tasks into columns
            const newColumns = {
                todo: { id: 'todo', title: 'To Do', taskIds: [] },
                'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
                pending: { id: 'pending', title: 'Pending', taskIds: [] },
                done: { id: 'done', title: 'Done', taskIds: [] },
            };

            data.forEach(task => {
                if (newColumns[task.status]) {
                    newColumns[task.status].taskIds.push(task._id);
                }
            });

            setColumns(newColumns);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        // Optimistic update
        const newStartTaskIds = Array.from(start.taskIds);
        newStartTaskIds.splice(source.index, 1);
        const newFinishTaskIds = source.droppableId === destination.droppableId
            ? newStartTaskIds
            : Array.from(finish.taskIds);

        if (source.droppableId !== destination.droppableId) {
            newFinishTaskIds.splice(destination.index, 0, draggableId);
        } else {
            newStartTaskIds.splice(destination.index, 0, draggableId);
        }

        const newColumns = {
            ...columns,
            [source.droppableId]: {
                ...start,
                taskIds: newStartTaskIds,
            },
            [destination.droppableId]: {
                ...finish,
                taskIds: newFinishTaskIds,
            },
        };

        setColumns(newColumns);

        // API call
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put(
                `http://localhost:5000/api/tasks/${draggableId}/position`,
                {
                    status: destination.droppableId,
                    position: destination.index,
                },
                config
            );

            socket.emit('task-updated', { workspaceId });
        } catch (error) {
            console.error('Error updating task position:', error);
            fetchTasks(); // Revert on error
        }
    };

    const handleCreateTask = async (status) => {
        const title = prompt('Enter task title:');
        if (!title) return;

        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                title,
                workspaceId,
                status,
                position: columns[status].taskIds.length
            };

            if (projectId) {
                payload.project = projectId;
            }

            const { data } = await axios.post('http://localhost:5000/api/tasks', payload, config);

            setTasks([...tasks, data]);
            const newColumns = { ...columns };
            newColumns[status].taskIds.push(data._id);
            setColumns(newColumns);

            socket.emit('task-updated', { workspaceId });
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const [selectedTask, setSelectedTask] = useState(null);

    const handleTaskClick = (task) => {
        console.log('Task clicked:', task);
        setSelectedTask(task);
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));

        // Update columns if status changed
        if (updatedTask.status !== selectedTask.status) {
            const newColumns = { ...columns };

            // Remove from old column
            newColumns[selectedTask.status].taskIds = newColumns[selectedTask.status].taskIds.filter(id => id !== updatedTask._id);

            // Add to new column
            newColumns[updatedTask.status].taskIds.push(updatedTask._id);

            setColumns(newColumns);
        }

        socket.emit('task-updated', { workspaceId });
    };

    if (!enabled) {
        return null;
    }

    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden h-full bg-slate-900 p-6">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-full snap-x snap-mandatory">
                    {Object.values(columns).map((column) => (
                        <div key={column.id} className="w-80 flex-shrink-0 flex flex-col glass rounded-xl animate-fade-in snap-center">
                            <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">{column.title}</h3>
                                    <span className="badge-primary">
                                        {column.taskIds.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleCreateTask(column.id)}
                                        className="p-1.5 hover:bg-slate-700 rounded text-gray-400 hover:text-primary transition-colors"
                                        title="Add task"
                                        aria-label="Add task"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition-colors"
                                        aria-label="More options"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 p-3 overflow-y-auto min-h-[100px] transition-all ${snapshot.isDraggingOver ? 'bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg' : ''
                                            }`}
                                    >
                                        {column.taskIds.map((taskId, index) => {
                                            const task = tasks.find(t => t._id === taskId);
                                            if (!task) return null;

                                            const priorityColors = {
                                                high: 'bg-danger',
                                                medium: 'bg-warning',
                                                low: 'bg-success',
                                            };

                                            return (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => handleTaskClick(task)}
                                                            className={`relative bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm mb-3 group hover:border-primary/50 transition-all cursor-pointer ${snapshot.isDragging ? 'shadow-glow-primary ring-2 ring-primary rotate-2 scale-105' : ''
                                                                }`}
                                                        >
                                                            {/* Priority Indicator */}
                                                            <div className={`w-1 h-8 absolute left-0 top-4 rounded-r ${priorityColors[task.priority] || priorityColors.low}`}></div>

                                                            <div className="pl-3">
                                                                <div className="flex items-start justify-between">
                                                                    <h4 className="text-sm font-medium text-white mb-2 group-hover:text-primary transition-colors pr-6">
                                                                        {task.title}
                                                                    </h4>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleTaskClick(task);
                                                                        }}
                                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition-all absolute top-3 right-3"
                                                                        title="Edit Task"
                                                                        aria-label="Edit Task"
                                                                    >
                                                                        <Edit2 className="h-3 w-3" />
                                                                    </button>
                                                                </div>

                                                                <div className="flex items-center justify-between mt-3">
                                                                    <div className="flex items-center gap-2">
                                                                        {task.assignee ? (
                                                                            <img
                                                                                src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${task.assignee.name}&background=random`}
                                                                                alt={task.assignee.name}
                                                                                className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-primary transition-colors"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 group-hover:border-primary transition-colors">
                                                                                <UserIcon className="h-3 w-3 text-gray-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {task.dueDate && (
                                                                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-slate-900/50 px-2 py-1 rounded">
                                                                            <Calendar className="h-3 w-3" />
                                                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}

                                        {/* Empty State */}
                                        {column.taskIds.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
                                                <p>No tasks yet</p>
                                                <p className="text-xs mt-1">Drag tasks here or click + to add</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={handleTaskUpdate}
                    workspaceId={workspaceId}
                />
            )}
        </div>
    );
};

export default Board;
