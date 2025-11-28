import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, Users } from 'lucide-react';
import axios from 'axios';
import FuturisticHeader from '../components/FuturisticHeader';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month', 'week', 'day'
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch all user's tasks
            const { data } = await axios.get('http://localhost:5000/api/tasks/my-tasks', config);
            setTasks(data.filter(task => task.dueDate)); // Only tasks with due dates
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        // Next month days
        const remainingDays = 42 - days.length; // 6 weeks * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return days;
    };

    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const navigateDay = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const formatMonthYear = () => {
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-danger';
            case 'medium': return 'bg-warning';
            case 'low': return 'bg-success';
            default: return 'bg-gray-500';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'done': return 'text-success';
            case 'in-progress': return 'text-primary';
            case 'pending': return 'text-warning';
            default: return 'text-gray-400';
        }
    };

    const renderMonthView = () => {
        const days = getDaysInMonth(currentDate);
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                {/* Week day headers */}
                <div className="grid grid-cols-7 border-b border-slate-700">
                    {weekDays.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-semibold text-gray-400 border-r border-slate-700 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const dayTasks = getTasksForDate(day.date);
                        const isTodayDate = isToday(day.date);

                        return (
                            <div
                                key={index}
                                className={`min-h-[120px] p-2 border-r border-b border-slate-700 last:border-r-0 ${day.isCurrentMonth ? 'bg-slate-800' : 'bg-slate-900/50'
                                    } ${isTodayDate ? 'bg-primary/10 border-primary' : ''} hover:bg-slate-700/30 transition-colors cursor-pointer`}
                                onClick={() => setSelectedDate(day.date)}
                            >
                                <div className={`text-sm font-medium mb-2 ${day.isCurrentMonth ? 'text-white' : 'text-gray-600'
                                    } ${isTodayDate ? 'text-primary font-bold' : ''}`}>
                                    {day.date.getDate()}
                                </div>
                                <div className="space-y-1">
                                    {dayTasks.slice(0, 3).map(task => (
                                        <div
                                            key={task._id}
                                            className={`text-xs p-1 rounded truncate ${getPriorityColor(task.priority)} bg-opacity-20 border-l-2 ${getPriorityColor(task.priority)}`}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                    {dayTasks.length > 3 && (
                                        <div className="text-xs text-gray-500 pl-1">
                                            +{dayTasks.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }

        return (
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="grid grid-cols-7 gap-px bg-slate-700">
                    {weekDays.map((day, index) => {
                        const dayTasks = getTasksForDate(day);
                        const isTodayDate = isToday(day);

                        return (
                            <div key={index} className="bg-slate-800 min-h-[400px]">
                                <div className={`p-3 border-b border-slate-700 ${isTodayDate ? 'bg-primary/20' : ''}`}>
                                    <div className="text-xs text-gray-400">
                                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className={`text-lg font-semibold ${isTodayDate ? 'text-primary' : 'text-white'}`}>
                                        {day.getDate()}
                                    </div>
                                </div>
                                <div className="p-2 space-y-2">
                                    {dayTasks.map(task => (
                                        <div
                                            key={task._id}
                                            className={`p-2 rounded text-xs border-l-2 ${getPriorityColor(task.priority)} bg-slate-700/50`}
                                        >
                                            <div className="font-medium text-white mb-1 line-clamp-2">{task.title}</div>
                                            <div className={`text-xs ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const dayTasks = getTasksForDate(currentDate);

        return (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                    {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>

                {dayTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No tasks scheduled for this day</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {dayTasks.map(task => (
                            <div
                                key={task._id}
                                className="card border-l-4 hover-glow-primary"
                                style={{ borderLeftColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981' }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                                    <span className={`badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                {task.description && (
                                    <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span className={getStatusColor(task.status)}>{task.status}</span>
                                    </div>
                                    {task.assignee && (
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span>{task.assignee.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (

        <div className="flex flex-col h-full bg-slate-900 text-white">
            {/* Futuristic Header */}
            <FuturisticHeader title="Calendar" />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    if (view === 'month') navigateMonth(-1);
                                    else if (view === 'week') navigateWeek(-1);
                                    else navigateDay(-1);
                                }}
                                className="p-2 hover:bg-slate-700 rounded transition-colors"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-sm font-medium"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => {
                                    if (view === 'month') navigateMonth(1);
                                    else if (view === 'week') navigateWeek(1);
                                    else navigateDay(1);
                                }}
                                className="p-2 hover:bg-slate-700 rounded transition-colors"
                                aria-label="Next"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            <h2 className="text-xl font-semibold text-white ml-4">
                                {formatMonthYear()}
                            </h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex bg-slate-800 rounded-lg p-1">
                                <button
                                    onClick={() => setView('month')}
                                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${view === 'month' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Month
                                </button>
                                <button
                                    onClick={() => setView('week')}
                                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${view === 'week' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setView('day')}
                                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${view === 'day' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Day
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar View */}
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {view === 'month' && renderMonthView()}
                            {view === 'week' && renderWeekView()}
                            {view === 'day' && renderDayView()}
                        </>
                    )}

                    {/* Task Summary */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Total Tasks</p>
                                    <p className="text-2xl font-bold text-white">{tasks.length}</p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <CalendarIcon className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Overdue</p>
                                    <p className="text-2xl font-bold text-danger">
                                        {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-danger/20 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-danger" />
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Completed</p>
                                    <p className="text-2xl font-bold text-success">
                                        {tasks.filter(t => t.status === 'done').length}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-success" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CalendarPage;
