import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Check } from 'lucide-react';

// Utility function to format dates consistently
const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const formatDisplayDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatMonthKey = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

function App() {
  const [userName, setUserName] = useState('Prajwal');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [journalText, setJournalText] = useState('');
  const [monthlyReflection, setMonthlyReflection] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Load data when selectedDate changes
  useEffect(() => {
    loadDataForDate(selectedDate);
  }, [selectedDate]);

  // Load tasks, journal, and monthly reflection for a specific date
  const loadDataForDate = (date) => {
    const dateKey = formatDate(date);
    const monthKey = formatMonthKey(date);

    // Load tasks for this specific date (or empty array if none exist)
    const savedTasks = localStorage.getItem(`tasks_${dateKey}`);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);

    // Load journal entry for this specific date
    const savedJournal = localStorage.getItem(`journal_${dateKey}`);
    setJournalText(savedJournal || '');

    // Load monthly reflection for this month
    const savedMonthlyReflection = localStorage.getItem(`monthly_${monthKey}`);
    setMonthlyReflection(savedMonthlyReflection || '');
  };

  // Save tasks to localStorage for current date
  const saveTasks = (updatedTasks) => {
    const dateKey = formatDate(selectedDate);
    localStorage.setItem(`tasks_${dateKey}`, JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  // Save journal to localStorage for current date
  const saveJournal = (text) => {
    const dateKey = formatDate(selectedDate);
    localStorage.setItem(`journal_${dateKey}`, text);
    setJournalText(text);
  };

  // Save monthly reflection
  const saveMonthlyReflection = (text) => {
    const monthKey = formatMonthKey(selectedDate);
    localStorage.setItem(`monthly_${monthKey}`, text);
    setMonthlyReflection(text);
  };

  // Add new task
  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTaskText.trim(),
        completed: false
      };
      saveTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  // Toggle task completion
  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  // Delete task
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  // Check if a date has data
  const hasDataForDate = (date) => {
    const dateKey = formatDate(date);
    const hasTasks = localStorage.getItem(`tasks_${dateKey}`) !== null;
    const hasJournal = localStorage.getItem(`journal_${dateKey}`) !== null;
    return { hasTasks, hasJournal };
  };

  // Calendar component
  const MonthCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const monthName = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const monthKey = formatMonthKey(calendarMonth);
    const currentMonthReflection = localStorage.getItem(`monthly_${monthKey}`) || '';

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-amber-900">{monthName}</h2>
            <button onClick={() => setShowCalendar(false)} className="text-amber-700 hover:text-amber-900">
              <X size={24} />
            </button>
          </div>

          <div className="flex justify-between mb-6">
            <button
              onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
              className="px-4 py-2 bg-amber-200 hover:bg-amber-300 rounded-xl text-amber-900 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
              className="px-4 py-2 bg-amber-200 hover:bg-amber-300 rounded-xl text-amber-900 transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-amber-700 py-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }
              const date = new Date(year, month, day);
              const dateKey = formatDate(date);
              const isSelected = dateKey === formatDate(selectedDate);
              const isToday = dateKey === formatDate(new Date());
              const { hasTasks, hasJournal } = hasDataForDate(date);

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(date);
                    setShowCalendar(false);
                  }}
                  className={`
                    aspect-square rounded-xl p-2 transition-all relative
                    ${isSelected ? 'bg-amber-500 text-white shadow-lg scale-105' : ''}
                    ${isToday && !isSelected ? 'bg-amber-200 text-amber-900' : ''}
                    ${!isSelected && !isToday ? 'bg-white hover:bg-amber-100 text-amber-900' : ''}
                  `}
                >
                  <span className="text-sm font-medium">{day}</span>
                  <div className="flex gap-1 justify-center mt-1">
                    {hasTasks && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />}
                    {hasJournal && <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          {currentMonthReflection && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl">
              <p className="text-xs font-medium text-amber-700 mb-2">Monthly Theme</p>
              <p className="text-sm text-amber-900 italic">{currentMonthReflection}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-light text-amber-900 mb-2">
            Hey {userName} — let's design a beautiful day ✨
          </h1>
          <p className="text-amber-700 text-lg">Your thoughts, habits, and growth — one day at a time.</p>
        </div>

        {/* Date selector and calendar button */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md">
            <p className="text-amber-900 font-medium">{formatDisplayDate(selectedDate)}</p>
          </div>
          <button
            onClick={() => setShowCalendar(true)}
            className="bg-amber-400 hover:bg-amber-500 text-white p-3 rounded-2xl shadow-md transition-all hover:scale-105"
          >
            <Calendar size={24} />
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Panel - Tasks & Habits */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 transition-all hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-amber-900 mb-4">Daily Tasks & Habits</h2>
            
            {tasks.length > 0 && (
              <div className="mb-4 text-sm text-amber-700">
                {completedTasks} of {tasks.length} tasks completed
              </div>
            )}

            {/* Task input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white/50"
              />
              <button
                onClick={addTask}
                className="bg-amber-400 hover:bg-amber-500 text-white p-3 rounded-xl transition-all hover:scale-105"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Task list */}
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-amber-600">
                  <p className="mb-2">No tasks yet for this day</p>
                  <p className="text-sm">Add your first task above to get started</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div
                    key={task.id}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl transition-all
                      ${task.completed ? 'bg-green-50' : 'bg-amber-50'}
                    `}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`
                        w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                        ${task.completed ? 'bg-green-400 border-green-400' : 'border-amber-300 hover:border-amber-400'}
                      `}
                    >
                      {task.completed && <Check size={16} className="text-white" />}
                    </button>
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-amber-900'}`}>
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Journal */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 transition-all hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-amber-900 mb-4">Daily Reflection</h2>
            
            <textarea
              value={journalText}
              onChange={(e) => saveJournal(e.target.value)}
              placeholder={`What did I experience today?\n\nWhat made me feel proud?\n\nWhere did I struggle?\n\nWhat am I grateful for?\n\nWhat is one lesson I want to carry forward?`}
              className="w-full h-96 p-4 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-white/50 resize-none font-serif text-amber-900 placeholder:text-amber-400/60"
            />
          </div>
        </div>

        {/* Monthly Reflection */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">
            Monthly Reflection — Theme of the Month
          </h2>
          <input
            type="text"
            value={monthlyReflection}
            onChange={(e) => saveMonthlyReflection(e.target.value)}
            placeholder="What's the theme or focus for this month?"
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50"
          />
        </div>
      </div>

      {showCalendar && <MonthCalendar />}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;