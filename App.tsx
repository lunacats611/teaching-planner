import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  GraduationCap, 
  LayoutDashboard, 
  Plus, 
  Settings, 
  Trash2,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Info,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { SYLLABUS_DATA, FLATTENED_TOPICS } from './constants';
import { Classroom, Topic, SyllabusLevel, ClassLevel } from './types';
import { calculateSchedule } from './services/scheduler';

// --- Components ---

const ProgressBar = ({ value, max, colorClass = "bg-blue-600" }: { value: number, max: number, colorClass?: string }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const TopicDetailsModal = ({ topic, onClose }: { topic: Topic, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            topic.level === SyllabusLevel.AS ? 'bg-blue-100 text-blue-800' : 
            topic.level === SyllabusLevel.IGCSE ? 'bg-green-100 text-green-800' : 
            topic.level === SyllabusLevel.CUSTOM ? 'bg-orange-100 text-orange-800' :
            'bg-purple-100 text-purple-800'
          }`}>
             {topic.level}
          </span>
          <h3 className="text-xl font-bold text-gray-900 mt-2">{topic.id !== topic.title ? topic.id : ''} {topic.title}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="prose prose-sm max-w-none text-gray-600">
         <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Learning Objectives & Content</h4>
         <p>{topic.description || "No detailed description available."}</p>
         
         <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
            <span className="text-gray-500">Estimated Time:</span>
            <span className="font-semibold text-gray-900">{topic.estimatedHours} Hours</span>
         </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium text-sm transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
);

const AddCustomSessionModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (title: string, hours: number, desc: string) => void }) => {
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState(2);
  const [desc, setDesc] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Add Practice/Revision Session</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Mock Exam, Past Paper Review"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (Hours)</label>
            <input 
              type="number" 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
             <textarea 
               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
               rows={3}
               value={desc}
               onChange={e => setDesc(e.target.value)}
             />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">Cancel</button>
          <button 
            onClick={() => {
              if (title && hours > 0) {
                onAdd(title, hours, desc);
                onClose();
              }
            }} 
            disabled={!title}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

const App: React.FC = () => {
  // --- State ---
  const [classes, setClasses] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem('cambridge_planner_classes');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeClassId, setActiveClassId] = useState<string | null>(classes.length > 0 ? classes[0].id : null);
  const [view, setView] = useState<'dashboard' | 'syllabus' | 'schedule' | 'settings' | 'create'>('dashboard');
  
  // UI State
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [viewingTopic, setViewingTopic] = useState<Topic | null>(null);
  const [editingHoursId, setEditingHoursId] = useState<string | null>(null);
  const [isAddingSession, setIsAddingSession] = useState(false);

  // Temporary state for new class form
  const [newClassForm, setNewClassForm] = useState({
    name: '',
    level: 'AS' as ClassLevel,
    startDate: new Date().toISOString().split('T')[0],
    examDate: '',
    weeklyHours: 4
  });

  // Initialize view based on classes existence
  useEffect(() => {
    if (classes.length === 0) {
      setView('create');
    } else if (view === 'create' && classes.length > 0 && !activeClassId) {
       // Just created first class
    }
  }, [classes.length]);

  // --- Helpers ---
  
  const activeClass = useMemo(() => 
    classes.find(c => c.id === activeClassId) || null
  , [classes, activeClassId]);

  // Combine standard topics with class-specific custom topics
  const allClassTopics = useMemo(() => {
    if (!activeClass) return FLATTENED_TOPICS;
    return [...FLATTENED_TOPICS, ...(activeClass.customTopics || [])];
  }, [activeClass]);

  const saveClasses = (updatedClasses: Classroom[]) => {
    setClasses(updatedClasses);
    localStorage.setItem('cambridge_planner_classes', JSON.stringify(updatedClasses));
  };

  const handleCreateClass = () => {
    if (!newClassForm.name || !newClassForm.examDate) return;
    
    // Filter topics based on selected level
    const relevantTopics = FLATTENED_TOPICS.filter(t => {
      if (newClassForm.level === 'AS') return t.level === SyllabusLevel.AS;
      if (newClassForm.level === 'A2') return t.level === SyllabusLevel.A;
      if (newClassForm.level === 'IGCSE') return t.level === SyllabusLevel.IGCSE;
      return t.level === SyllabusLevel.AS || t.level === SyllabusLevel.A; // Full
    });

    const initialOrder = relevantTopics.map(t => t.id);

    const newClass: Classroom = {
      id: crypto.randomUUID(),
      name: newClassForm.name,
      level: newClassForm.level,
      startDate: newClassForm.startDate,
      examDate: newClassForm.examDate,
      weeklyHours: newClassForm.weeklyHours,
      completedTopicIds: [],
      topicOrder: initialOrder,
      topicHoursOverrides: {},
      customTopics: []
    };

    const updated = [...classes, newClass];
    saveClasses(updated);
    setActiveClassId(newClass.id);
    setView('dashboard');
    // Reset form
    setNewClassForm({
      name: '',
      level: 'AS',
      startDate: new Date().toISOString().split('T')[0],
      examDate: '',
      weeklyHours: 4
    });
  };

  const addCustomSession = (title: string, hours: number, desc: string) => {
    if (!activeClass) return;
    
    const newTopic: Topic = {
      id: `CUST-${Date.now()}`,
      sectionId: 999, // Special section for custom
      title: title,
      level: SyllabusLevel.CUSTOM,
      estimatedHours: hours,
      description: desc || "User defined practice/revision session."
    };

    const updatedCustomTopics = [...(activeClass.customTopics || []), newTopic];
    
    // Insert at the beginning of uncompleted items in topicOrder for immediate scheduling
    // First, find the first uncompleted index
    const completedSet = new Set(activeClass.completedTopicIds);
    let insertIndex = activeClass.topicOrder.findIndex(id => !completedSet.has(id));
    if (insertIndex === -1) insertIndex = activeClass.topicOrder.length; // If all done, add to end

    const newOrder = [...activeClass.topicOrder];
    newOrder.splice(insertIndex, 0, newTopic.id);

    const updatedClass = {
      ...activeClass,
      customTopics: updatedCustomTopics,
      topicOrder: newOrder
    };

    saveClasses(classes.map(c => c.id === activeClass.id ? updatedClass : c));
  };

  const deleteCustomSession = (topicId: string) => {
     if (!activeClass) return;
     if (!confirm("Remove this custom session?")) return;

     const updatedCustomTopics = activeClass.customTopics.filter(t => t.id !== topicId);
     const updatedOrder = activeClass.topicOrder.filter(id => id !== topicId);
     const updatedCompleted = activeClass.completedTopicIds.filter(id => id !== topicId);
     
     const updatedClass = {
        ...activeClass,
        customTopics: updatedCustomTopics,
        topicOrder: updatedOrder,
        completedTopicIds: updatedCompleted
     };
     saveClasses(classes.map(c => c.id === activeClass.id ? updatedClass : c));
  };

  const toggleTopicCompletion = (topicId: string) => {
    if (!activeClass) return;
    const isCompleted = activeClass.completedTopicIds.includes(topicId);
    const newCompleted = isCompleted 
      ? activeClass.completedTopicIds.filter(id => id !== topicId)
      : [...activeClass.completedTopicIds, topicId];
    
    const updatedClass = { ...activeClass, completedTopicIds: newCompleted };
    const updatedClasses = classes.map(c => c.id === activeClass.id ? updatedClass : c);
    saveClasses(updatedClasses);
  };

  const updateTopicHours = (topicId: string, hours: number) => {
    if (!activeClass || isNaN(hours) || hours <= 0) {
      setEditingHoursId(null);
      return;
    }
    
    const updatedOverrides = { ...activeClass.topicHoursOverrides, [topicId]: hours };
    const updatedClass = { ...activeClass, topicHoursOverrides: updatedOverrides };
    const updatedClasses = classes.map(c => c.id === activeClass.id ? updatedClass : c);
    saveClasses(updatedClasses);
    setEditingHoursId(null);
  };

  const toggleSectionExpand = (id: number) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const moveTopicOrder = (topicId: string, direction: 'up' | 'down') => {
    if (!activeClass) return;
    const currentOrder = [...activeClass.topicOrder];
    const index = currentOrder.indexOf(topicId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      [currentOrder[index], currentOrder[index - 1]] = [currentOrder[index - 1], currentOrder[index]];
    } else if (direction === 'down' && index < currentOrder.length - 1) {
      [currentOrder[index], currentOrder[index + 1]] = [currentOrder[index + 1], currentOrder[index]];
    }

    const updatedClass = { ...activeClass, topicOrder: currentOrder };
    saveClasses(classes.map(c => c.id === activeClass.id ? updatedClass : c));
  };

  // --- Derived Data for Charts/Stats ---

  const stats = useMemo(() => {
    if (!activeClass) return null;
    
    // Determine scope based on class level
    let scopeTopics = FLATTENED_TOPICS;
    if (activeClass.level === 'AS') scopeTopics = FLATTENED_TOPICS.filter(t => t.level === SyllabusLevel.AS);
    if (activeClass.level === 'A2') scopeTopics = FLATTENED_TOPICS.filter(t => t.level === SyllabusLevel.A);
    if (activeClass.level === 'IGCSE') scopeTopics = FLATTENED_TOPICS.filter(t => t.level === SyllabusLevel.IGCSE);
    
    // Include custom topics in the stats
    const allRelevantTopics = [...scopeTopics, ...(activeClass.customTopics || [])];

    const totalTopics = allRelevantTopics.length;
    const completedTopics = activeClass.completedTopicIds.filter(id => allRelevantTopics.find(t => t.id === id)).length;
    
    const asTopics = scopeTopics.filter(t => t.level === SyllabusLevel.AS);
    const aTopics = scopeTopics.filter(t => t.level === SyllabusLevel.A);
    const igcseTopics = scopeTopics.filter(t => t.level === SyllabusLevel.IGCSE);
    
    const asCompleted = asTopics.filter(t => activeClass.completedTopicIds.includes(t.id)).length;
    const aCompleted = aTopics.filter(t => activeClass.completedTopicIds.includes(t.id)).length;
    const igcseCompleted = igcseTopics.filter(t => activeClass.completedTopicIds.includes(t.id)).length;

    // Calculate total hours considering overrides
    const calculateHours = (topics: Topic[]) => topics.reduce((acc, t) => {
      const override = activeClass.topicHoursOverrides?.[t.id];
      return acc + (override !== undefined ? override : t.estimatedHours);
    }, 0);

    const totalHours = calculateHours(allRelevantTopics);
    const completedHours = calculateHours(allRelevantTopics.filter(t => activeClass.completedTopicIds.includes(t.id)));

    return {
      totalProgress: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
      asProgress: asTopics.length > 0 ? (asCompleted / asTopics.length) * 100 : 0,
      aProgress: aTopics.length > 0 ? (aCompleted / aTopics.length) * 100 : 0,
      igcseProgress: igcseTopics.length > 0 ? (igcseCompleted / igcseTopics.length) * 100 : 0,
      remainingHours: totalHours - completedHours,
      hasAS: asTopics.length > 0,
      hasA2: aTopics.length > 0,
      hasIGCSE: igcseTopics.length > 0
    };
  }, [activeClass, allClassTopics]);

  const schedule = useMemo(() => {
    if (!activeClass) return [];
    
    // Get uncompleted topics ordered by the user's preference
    const uncompletedIds = activeClass.topicOrder.filter(id => !activeClass.completedTopicIds.includes(id));
    
    // Create topic objects with updated hours based on overrides
    const orderedUncompletedTopics = uncompletedIds
      .map(id => {
        const originalTopic = allClassTopics.find(t => t.id === id);
        if (!originalTopic) return null;
        const override = activeClass.topicHoursOverrides?.[id];
        return override !== undefined ? { ...originalTopic, estimatedHours: override } : originalTopic;
      })
      .filter((t): t is Topic => !!t);

    return calculateSchedule(
      activeClass.startDate > new Date().toISOString() ? activeClass.startDate : new Date().toISOString(), // Use today if start date passed to dynamically reallocate
      activeClass.examDate,
      activeClass.weeklyHours,
      orderedUncompletedTopics
    );
  }, [activeClass, allClassTopics]);

  // --- Render Views ---

  // Create Class View (Shared)
  const renderCreateClass = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            {classes.length === 0 ? "Welcome to Cambridge Planner" : "Create New Class"}
          </h1>
          <p className="text-gray-600 mt-2">Set up your teaching plan for syllabus 9618 or 0478.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Class Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Year 10 IGCSE"
              value={newClassForm.name}
              onChange={e => setNewClassForm({...newClassForm, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Class Level</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={newClassForm.level}
              onChange={e => setNewClassForm({...newClassForm, level: e.target.value as ClassLevel})}
            >
              <option value="IGCSE">Cambridge IGCSE (0478)</option>
              <option value="AS">AS Level (9618 Year 1)</option>
              <option value="A2">A Level (9618 Year 2)</option>
              <option value="Full">Full A Level (9618 AS + A2)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">This determines which syllabus topics are added to the schedule.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input 
                type="date" 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newClassForm.startDate}
                onChange={e => setNewClassForm({...newClassForm, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam Date</label>
              <input 
                type="date" 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newClassForm.examDate}
                onChange={e => setNewClassForm({...newClassForm, examDate: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weekly Hours</label>
            <input 
              type="number" 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={newClassForm.weeklyHours}
              onChange={e => setNewClassForm({...newClassForm, weeklyHours: parseInt(e.target.value)})}
            />
          </div>
          
          <div className="flex space-x-3 mt-4">
             {classes.length > 0 && (
               <button 
                  onClick={() => setView('dashboard')}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
               >
                 Cancel
               </button>
             )}
             <button 
              onClick={handleCreateClass}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === 'create') {
    return renderCreateClass();
  }

  // Fallback if no classes but somehow view isn't create (should be handled by useEffect, but safe guard)
  if (classes.length === 0) {
    return renderCreateClass();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {viewingTopic && <TopicDetailsModal topic={viewingTopic} onClose={() => setViewingTopic(null)} />}
      {isAddingSession && <AddCustomSessionModal onClose={() => setIsAddingSession(false)} onAdd={addCustomSession} />}
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-900">CS Planner</span>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 px-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                My Classes
              </label>
              <button 
                onClick={() => setView('create')} 
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                title="Create New Class"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-1">
              {classes.map(c => (
                <button 
                  key={c.id}
                  onClick={() => { setActiveClassId(c.id); setView('dashboard'); }}
                  className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg flex items-center justify-between group transition-all ${
                    activeClassId === c.id 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {activeClassId === c.id && <ChevronRight className="h-4 w-4 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
               Menu
            </label>
            <nav className="space-y-1">
              <button 
                onClick={() => setView('dashboard')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <LayoutDashboard className={`mr-3 h-5 w-5 ${view === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`} />
                Dashboard
              </button>
              <button 
                onClick={() => setView('syllabus')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'syllabus' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <BookOpen className={`mr-3 h-5 w-5 ${view === 'syllabus' ? 'text-blue-600' : 'text-gray-400'}`} />
                Syllabus Tracker
              </button>
              <button 
                onClick={() => setView('schedule')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'schedule' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Calendar className={`mr-3 h-5 w-5 ${view === 'schedule' ? 'text-blue-600' : 'text-gray-400'}`} />
                Smart Schedule
              </button>
              <button 
                onClick={() => setView('settings')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings className={`mr-3 h-5 w-5 ${view === 'settings' ? 'text-blue-600' : 'text-gray-400'}`} />
                Class Settings
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
        
        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && stats && activeClass && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  activeClass.level === 'IGCSE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {activeClass.level === 'Full' ? 'AS & A Level' : activeClass.level === 'AS' ? 'AS Level Only' : activeClass.level === 'IGCSE' ? 'Cambridge IGCSE' : 'A Level (A2) Only'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progress Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Progress</h3>
                <div className="h-48 flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: stats.totalProgress },
                            { name: 'Remaining', value: 100 - stats.totalProgress }
                          ]}
                          cx="50%"
                          cy="45%"
                          innerRadius="60%"
                          outerRadius="80%"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell key="cell-0" fill={activeClass.level === 'IGCSE' ? '#10b981' : '#2563eb'} />
                          <Cell key="cell-1" fill="#e5e7eb" />
                        </Pie>
                        <RechartsTooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <span className="text-3xl font-bold text-gray-900">{Math.round(stats.totalProgress)}%</span>
                  <span className="text-gray-500 ml-2">Complete</span>
                </div>
              </div>

              {/* Levels Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center space-y-6">
                {stats.hasAS && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">AS Level Coverage</span>
                      <span className="text-sm font-bold text-blue-600">{Math.round(stats.asProgress)}%</span>
                    </div>
                    <ProgressBar value={stats.asProgress} max={100} colorClass="bg-blue-600" />
                  </div>
                )}
                {stats.hasA2 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">A Level Coverage</span>
                      <span className="text-sm font-bold text-purple-600">{Math.round(stats.aProgress)}%</span>
                    </div>
                    <ProgressBar value={stats.aProgress} max={100} colorClass="bg-purple-600" />
                  </div>
                )}
                {stats.hasIGCSE && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">IGCSE Coverage</span>
                      <span className="text-sm font-bold text-green-600">{Math.round(stats.igcseProgress)}%</span>
                    </div>
                    <ProgressBar value={stats.igcseProgress} max={100} colorClass="bg-green-600" />
                  </div>
                )}
                {!stats.hasAS && !stats.hasA2 && !stats.hasIGCSE && (
                   <p className="text-center text-gray-500">No specific levels configured.</p>
                )}
              </div>

              {/* Time Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Time Management</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Remaining Content</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.remainingHours} hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Exam Date</p>
                      <p className="text-lg font-bold text-gray-900">{new Date(activeClass.examDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                    At {activeClass.weeklyHours} hours/week, you need approximately {Math.ceil(stats.remainingHours / activeClass.weeklyHours)} weeks to finish.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Upcoming Schedule</h3>
                <button onClick={() => setView('schedule')} className="text-sm text-blue-600 font-medium hover:text-blue-800">View All</button>
              </div>
              <div className="space-y-4">
                {schedule.slice(0, 3).map((week, idx) => (
                  <div key={idx} className="flex border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <div className="mr-4 min-w-[100px]">
                      <span className="text-xs font-bold text-gray-500 uppercase">Week of</span>
                      <p className="text-sm font-bold text-gray-900">{new Date(week.weekStart).toLocaleDateString()}</p>
                    </div>
                    <div className="flex-1">
                      {week.topics.map((t, tIdx) => (
                        <div key={`${t.id}-${tIdx}`} className="text-sm text-gray-800 mb-1 flex items-center">
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            t.level === SyllabusLevel.CUSTOM ? 'bg-orange-400' :
                            t.level === SyllabusLevel.IGCSE ? 'bg-green-400' : 
                            'bg-blue-400'
                          }`}></span>
                          {t.id !== t.title ? `${t.id} ` : ''}{t.title}
                        </div>
                      ))}
                      {week.topics.length === 0 && <span className="text-sm text-gray-500 italic">No classes scheduled</span>}
                    </div>
                  </div>
                ))}
                {schedule.length === 0 && <p className="text-gray-500">All topics completed!</p>}
              </div>
            </div>
          </div>
        )}

        {/* SYLLABUS VIEW */}
        {view === 'syllabus' && activeClass && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-900">Syllabus Tracker</h2>
               <div className="flex items-center space-x-3">
                 <button 
                    onClick={() => setIsAddingSession(true)}
                    className="flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
                 >
                   <Plus className="h-4 w-4 mr-1.5" />
                   Add Activity
                 </button>
                 <div className="text-sm text-gray-500">
                    {activeClass.completedTopicIds.length} topics completed
                 </div>
               </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               {/* Custom Topics Section */}
               {activeClass.customTopics && activeClass.customTopics.length > 0 && (
                  <div className="border-b border-gray-200">
                    <button 
                      onClick={() => toggleSectionExpand(999)}
                      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-orange-50/50`}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedSections.includes(999) ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                        <div className="text-left">
                          <span className="text-xs font-bold px-2 py-0.5 rounded mr-2 bg-orange-100 text-orange-800">
                            Custom
                          </span>
                          <span className="font-medium text-gray-900">Additional Sessions / Practice</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                         {activeClass.customTopics.filter(t => activeClass.completedTopicIds.includes(t.id)).length}/{activeClass.customTopics.length}
                      </div>
                    </button>
                    
                    {expandedSections.includes(999) && (
                      <div className="bg-gray-50 px-4 pb-4 pt-1">
                        {activeClass.customTopics.map(topic => {
                          const isDone = activeClass.completedTopicIds.includes(topic.id);
                          return (
                            <div key={topic.id} className="flex items-center justify-between py-2 pl-8 pr-2 border-b border-gray-200 last:border-0 hover:bg-white rounded transition-colors group">
                              <label className="flex items-center space-x-3 cursor-pointer flex-1">
                                <input 
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => toggleTopicCompletion(topic.id)}
                                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition duration-150 ease-in-out" 
                                />
                                <div>
                                  <span className={`text-sm font-medium ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                    {topic.title}
                                  </span>
                                  <div className="text-xs text-gray-500 mt-0.5">{topic.estimatedHours} hours</div>
                                </div>
                              </label>
                              <div className="flex items-center space-x-2">
                                <button onClick={() => deleteCustomSession(topic.id)} className="text-gray-400 hover:text-red-600 p-1">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                <div className="flex items-center space-x-1 border-l border-gray-200 pl-2 ml-1">
                                  <button onClick={(e) => { e.stopPropagation(); moveTopicOrder(topic.id, 'up'); }} className="p-1 text-gray-400 hover:text-blue-600"><ArrowUp className="h-4 w-4" /></button>
                                  <button onClick={(e) => { e.stopPropagation(); moveTopicOrder(topic.id, 'down'); }} className="p-1 text-gray-400 hover:text-blue-600"><ArrowDown className="h-4 w-4" /></button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
               )}

              {SYLLABUS_DATA.filter(section => {
                 if (activeClass.level === 'AS') return section.level === SyllabusLevel.AS;
                 if (activeClass.level === 'A2') return section.level === SyllabusLevel.A;
                 if (activeClass.level === 'IGCSE') return section.level === SyllabusLevel.IGCSE;
                 return section.level === SyllabusLevel.AS || section.level === SyllabusLevel.A;
              }).map((section) => {
                const isExpanded = expandedSections.includes(section.id);
                const sectionTopics = section.topics;
                const completedCount = sectionTopics.filter(t => activeClass.completedTopicIds.includes(t.id)).length;
                const isFullyComplete = completedCount === sectionTopics.length;

                return (
                  <div key={section.id} className="border-b border-gray-200 last:border-0">
                    <button 
                      onClick={() => toggleSectionExpand(section.id)}
                      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${isFullyComplete ? 'bg-green-50' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                        <div className="text-left">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded mr-2 ${section.level === SyllabusLevel.AS ? 'bg-blue-100 text-blue-800' : section.level === SyllabusLevel.IGCSE ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                            {section.level}
                          </span>
                          <span className="font-medium text-gray-900">{section.id}. {section.title}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                         <div className="text-sm text-gray-500">
                           {completedCount}/{sectionTopics.length}
                         </div>
                         {isFullyComplete && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="bg-gray-50 px-4 pb-4 pt-1">
                        {sectionTopics.map(topic => {
                          const isDone = activeClass.completedTopicIds.includes(topic.id);
                          return (
                            <div key={topic.id} className="flex items-center justify-between py-2 pl-8 pr-2 border-b border-gray-200 last:border-0 hover:bg-white rounded transition-colors">
                              <label className="flex items-center space-x-3 cursor-pointer flex-1">
                                <input 
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => toggleTopicCompletion(topic.id)}
                                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition duration-150 ease-in-out" 
                                />
                                <div>
                                  <span className={`text-sm font-medium ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                    {topic.id} {topic.title}
                                  </span>
                                  <div className="text-xs text-gray-500 mt-0.5">Est. {topic.estimatedHours} hours</div>
                                </div>
                              </label>
                              
                              {/* Reorder Buttons */}
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveTopicOrder(topic.id, 'up'); }}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                  title="Prioritize Up"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </button>
                                <button 
                                   onClick={(e) => { e.stopPropagation(); moveTopicOrder(topic.id, 'down'); }}
                                   className="p-1 text-gray-400 hover:text-blue-600"
                                   title="Prioritize Down"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SCHEDULE VIEW */}
        {view === 'schedule' && activeClass && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  Smart Schedule
                  <Sparkles className="h-5 w-5 text-yellow-500 ml-2" />
                </h2>
                <p className="text-gray-500 mt-1">
                  Based on {activeClass.weeklyHours} hours/week. Adjust pace below to regenerate.
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                {schedule.length} Weeks Remaining
              </div>
            </div>

            {/* Schedule Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="p-2 bg-blue-50 rounded-lg">
                       <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Teaching Pace</label>
                      <div className="flex items-center mt-1">
                         <input 
                           type="range" 
                           min="1" 
                           max="20" 
                           value={activeClass.weeklyHours}
                           onChange={(e) => {
                             const updated = classes.map(c => c.id === activeClass.id ? { ...c, weeklyHours: parseInt(e.target.value) } : c);
                             saveClasses(updated);
                           }}
                           className="w-32 mr-3"
                         />
                         <span className="font-bold text-gray-900">{activeClass.weeklyHours}h / week</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-200 hidden md:block"></div>

                  <div className="flex items-center space-x-3 w-full md:w-auto">
                     <button 
                       onClick={() => setIsAddingSession(true)}
                       className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors"
                     >
                       <Plus className="h-4 w-4 mr-2" />
                       Add Session
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid gap-6">
              {schedule.map((week, idx) => {
                const isPast = new Date(week.weekEnd) < new Date();
                const isCurrent = new Date(week.weekStart) <= new Date() && new Date(week.weekEnd) >= new Date();

                return (
                  <div key={idx} className={`relative bg-white rounded-xl p-6 shadow-sm border ${isCurrent ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'} ${isPast ? 'opacity-60' : ''}`}>
                    <div className="absolute top-0 left-0 w-2 h-full bg-gray-200 rounded-l-xl"></div>
                    <div className={`absolute top-0 left-0 w-2 h-full rounded-l-xl ${week.hoursUsed > activeClass.weeklyHours ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 pl-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {new Date(week.weekStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                          {' - '}
                          {new Date(week.weekEnd).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </h3>
                        {isCurrent && <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">Current Week</span>}
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                        <div className={`font-bold ${week.hoursUsed > activeClass.weeklyHours ? 'text-red-600' : 'text-gray-600'}`}>
                          {week.hoursUsed} / {activeClass.weeklyHours} Hours
                        </div>
                      </div>
                    </div>

                    <div className="pl-4 space-y-3">
                       {week.topics.map((t, tIdx) => (
                         <div key={`${t.id}-${tIdx}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-white transition-colors group">
                            <div className="flex items-center flex-1">
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded mr-3 ${
                                t.level === SyllabusLevel.AS ? 'bg-blue-100 text-blue-700' : 
                                t.level === SyllabusLevel.IGCSE ? 'bg-green-100 text-green-700' : 
                                t.level === SyllabusLevel.CUSTOM ? 'bg-orange-100 text-orange-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {t.level === SyllabusLevel.CUSTOM ? 'Custom' : t.id}
                              </span>
                              <span className="text-sm font-medium text-gray-900 mr-2">{t.id !== t.title && t.level !== SyllabusLevel.CUSTOM ? '' : ''}{t.title}</span>
                              <button 
                                onClick={() => setViewingTopic(t)}
                                className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="View Details"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1" title="Click to edit hours">
                                {editingHoursId === t.id ? (
                                  <div className="flex items-center">
                                    <input 
                                      type="number" 
                                      className="w-12 text-xs p-1 border border-blue-500 rounded focus:outline-none"
                                      autoFocus
                                      defaultValue={t.estimatedHours}
                                      onBlur={(e) => updateTopicHours(t.id, parseFloat(e.target.value))}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') updateTopicHours(t.id, parseFloat(e.currentTarget.value));
                                      }}
                                    />
                                    <span className="text-xs text-gray-500 ml-1">h</span>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setEditingHoursId(t.id)}
                                    className="text-xs text-gray-500 whitespace-nowrap hover:text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded border border-transparent hover:border-blue-200 transition-all flex items-center"
                                  >
                                    <Clock className="h-3 w-3 mr-1 opacity-50" />
                                    {t.estimatedHours}h
                                  </button>
                                )}
                              </div>
                              
                              <button 
                                onClick={() => toggleTopicCompletion(t.id)}
                                className="text-gray-400 hover:text-green-600"
                                title="Mark Complete"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              
                              {t.level === SyllabusLevel.CUSTOM && (
                                <button onClick={() => deleteCustomSession(t.id)} className="text-gray-400 hover:text-red-600" title="Delete">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}

                              <div className="flex flex-col space-y-1 border-l border-gray-200 pl-2 ml-2">
                                <button onClick={() => moveTopicOrder(t.id, 'up')} className="hover:text-blue-600 text-gray-400"><ArrowUp className="h-3 w-3"/></button>
                                <button onClick={() => moveTopicOrder(t.id, 'down')} className="hover:text-blue-600 text-gray-400"><ArrowDown className="h-3 w-3"/></button>
                              </div>
                            </div>
                         </div>
                       ))}
                       {week.topics.length === 0 && <p className="text-gray-400 italic text-sm">Free week!</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {view === 'settings' && activeClass && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Class Settings</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Class Name</label>
                  <input 
                    type="text"
                    value={activeClass.name}
                    onChange={(e) => {
                       const updated = classes.map(c => c.id === activeClass.id ? { ...c, name: e.target.value } : c);
                       saveClasses(updated);
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">Class Level</label>
                  <select
                    value={activeClass.level}
                    onChange={(e) => {
                       const updated = classes.map(c => c.id === activeClass.id ? { ...c, level: e.target.value as ClassLevel } : c);
                       saveClasses(updated);
                       // Note: Changing level in settings doesn't automatically refilter existing topics in topicOrder to avoid data loss.
                       // A real app might prompt to re-sync topics.
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="IGCSE">Cambridge IGCSE (0478)</option>
                    <option value="AS">AS Level</option>
                    <option value="A2">A Level (A2)</option>
                    <option value="Full">Full</option>
                  </select>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Exam Date</label>
                    <input 
                      type="date"
                      value={activeClass.examDate}
                      onChange={(e) => {
                        const updated = classes.map(c => c.id === activeClass.id ? { ...c, examDate: e.target.value } : c);
                        saveClasses(updated);
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weekly Hours</label>
                    <input 
                      type="number"
                      value={activeClass.weeklyHours}
                      onChange={(e) => {
                        const updated = classes.map(c => c.id === activeClass.id ? { ...c, weeklyHours: parseInt(e.target.value) || 0 } : c);
                        saveClasses(updated);
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
               </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
               <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
               <p className="text-sm text-red-600 mb-4">Deleting this class will permanently remove all progress data.</p>
               <button 
                 onClick={() => {
                   if(confirm('Are you sure you want to delete this class?')) {
                     const updated = classes.filter(c => c.id !== activeClass.id);
                     saveClasses(updated);
                     if (updated.length > 0) setActiveClassId(updated[0].id);
                   }
                 }}
                 className="flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
               >
                 <Trash2 className="h-4 w-4 mr-2" />
                 Delete Class
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;