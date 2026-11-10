import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Plus, 
  Flame, 
  Droplet, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ArrowRight,
  Zap,
  TrendingUp,
  Activity,
  Trash2,
  X
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { fluidApi, routineApi } from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();

  // Auth Protection: If user not logged in, redirect to /login immediately
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      navigate('/login');
    }
  }, [navigate]);

  // Routine & Streaks State
  const [routine, setRoutine] = useState(null);
  const [streakData, setStreakData] = useState({
    currentStreak: 1,
    bestStreak: 1,
    isCompletedToday: false,
    completedDates: [],
  });

  // Calendar State (StudyLog-style)
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth() + 1); // 1-12
  const [calendarData, setCalendarData] = useState({});
  const [calendarStats, setCalendarStats] = useState({ totalMonthMl: 0, activeDaysCount: 0 });
  const [selectedDateKey, setSelectedDateKey] = useState(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  // Today's summary stats
  const [todayLogs, setTodayLogs] = useState([]);
  const [todayTotalMl, setTodayTotalMl] = useState(0);

  // Quick Log Modal for Dashboard
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [quickDrinkName, setQuickDrinkName] = useState('Pure Water');
  const [quickAmountMl, setQuickAmountMl] = useState(250);

  // Routine Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('09:00 AM');
  const [newTaskAmount, setNewTaskAmount] = useState(250);

  // Fetch Routine & Streaks
  const fetchRoutine = async () => {
    try {
      const res = await routineApi.getRoutine();
      setRoutine(res.data.routine || null);
      if (res.data.streak) {
        setStreakData(res.data.streak);
      }
    } catch (err) {
      console.warn('Failed to fetch routine:', err);
    }
  };

  // Fetch Calendar Data for the current viewed month
  const fetchCalendar = async (year, month) => {
    try {
      const res = await fluidApi.getCalendar(year, month);
      setCalendarData(res.data.daysData || {});
      setCalendarStats({
        totalMonthMl: res.data.totalMonthMl || 0,
        activeDaysCount: res.data.activeDaysCount || 0,
      });
      if (res.data.currentStreak !== undefined) {
        setStreakData((prev) => ({
          ...prev,
          currentStreak: res.data.currentStreak,
          bestStreak: res.data.bestStreak,
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch calendar:', err);
    }
  };

  // Fetch Today's Logs
  const fetchTodayLogs = async () => {
    try {
      const res = await fluidApi.getLogs();
      setTodayLogs(res.data.logs || []);
      setTodayTotalMl(res.data.totalMl || 0);
    } catch (err) {
      console.warn('Failed to fetch today logs:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRoutine();
      fetchCalendar(calendarYear, calendarMonth);
      fetchTodayLogs();
    }
  }, [currentUser, calendarYear, calendarMonth]);

  // Toggle Routine Task Complete
  const handleToggleTask = async (taskId) => {
    try {
      const res = await routineApi.toggleTask(taskId);
      if (res.data.routine) {
        setRoutine(res.data.routine);
        setStreakData((prev) => ({
          ...prev,
          currentStreak: res.data.currentStreak,
          bestStreak: res.data.bestStreak,
        }));
      }
      await fetchCalendar(calendarYear, calendarMonth);
    } catch (err) {
      console.error('Task toggle error:', err);
    }
  };

  // Add Task to Routine
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await routineApi.addTask({
        title: newTaskTitle.trim(),
        targetTime: newTaskTime,
        amountMl: Number(newTaskAmount) || 250,
      });
      if (res.data.routine) setRoutine(res.data.routine);
      setNewTaskTitle('');
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Quick Log Drink on Dashboard
  const handleQuickLog = async (e) => {
    e.preventDefault();
    try {
      await fluidApi.addLog({
        drinkName: quickDrinkName,
        amountMl: Number(quickAmountMl),
        calories: quickDrinkName.toLowerCase().includes('water') ? 0 : 50,
        timestamp: new Date().toISOString(),
      });
      setIsQuickLogModalOpen(false);
      await fetchTodayLogs();
      await fetchCalendar(calendarYear, calendarMonth);
      await fetchRoutine();
    } catch (err) {
      console.error('Quick log error:', err);
    }
  };

  // Calendar Month Navigation
  const handlePrevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarMonth(12);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarMonth(1);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleResetToToday = () => {
    const now = new Date();
    setCalendarYear(now.getFullYear());
    setCalendarMonth(now.getMonth() + 1);
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    setSelectedDateKey(`${y}-${m}-${d}`);
  };

  // Greeting Calculation based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Compute Calendar Matrix
  const monthName = new Date(calendarYear, calendarMonth - 1, 1).toLocaleString('en-US', { month: 'long' });
  const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();
  const firstDayWeekday = new Date(calendarYear, calendarMonth - 1, 1).getDay(); // 0 is Sun
  // Convert so Mon = 0, Sun = 6
  const startOffset = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  const totalTasks = routine?.tasks?.length || 5;
  const completedTasks = routine?.tasks?.filter((t) => t.completed).length || 0;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const dailyGoalMl = routine?.dailyGoalMl || 2500;
  const hydrationPercent = Math.min(100, Math.round((todayTotalMl / dailyGoalMl) * 100));

  // Next routine task for "Pick up where you left off"
  const nextTask = routine?.tasks?.find((t) => !t.completed) || routine?.tasks?.[0];

  // Selected date details
  const selectedDayData = calendarData[selectedDateKey];
  const selectedDayDateObj = new Date(selectedDateKey + 'T00:00:00');
  const formattedSelectedDate = selectedDayDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#020E05] text-zinc-100 font-sans selection:bg-[#10B981] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* ===================================================================
            HEADER GREETING & SUMMARY (StudyLog Style)
            =================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {currentUser?.name || 'Friend'}.
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              You completed <strong className="text-[#10B981]">{completedTasks} routine tasks</strong> and logged <strong className="text-[#10B981]">{todayTotalMl} ml</strong> today.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs text-zinc-400">
            <span className="px-3 py-1.5 rounded-lg bg-[#0A0D0A] border border-[#1F2520] font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <div className="px-3 py-1.5 rounded-lg bg-[#152319] text-[#10B981] border border-[#10B981]/30 font-semibold flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{streakData.currentStreak} Day Streak</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            4 STAT METRIC CARDS (StudyLog Style Row)
            =================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Routine Scheduled */}
          <div className="p-5 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-2">
            <span className="text-3xl font-extrabold text-white block">{totalTasks}</span>
            <div>
              <span className="text-xs font-semibold text-zinc-200 block">Routine Tasks</span>
              <span className="text-[11px] text-zinc-500">drinks in daily schedule</span>
            </div>
          </div>

          {/* Card 2: Completed Tasks */}
          <div className="p-5 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-2">
            <span className="text-3xl font-extrabold text-[#10B981] block">{completedTasks}</span>
            <div>
              <span className="text-xs font-semibold text-zinc-200 block">Completed Today</span>
              <span className="text-[11px] text-zinc-500">{completionPercent}% of routine finished</span>
            </div>
          </div>

          {/* Card 3: Current Streak */}
          <div className="p-5 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-2">
            <span className="text-3xl font-extrabold text-[#10B981] block">{streakData.currentStreak}</span>
            <div>
              <span className="text-xs font-semibold text-zinc-200 block">Day Streak</span>
              <span className="text-[11px] text-zinc-500">best streak: {streakData.bestStreak} days</span>
            </div>
          </div>

          {/* Card 4: Daily Hydration Target */}
          <div className="p-5 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-2">
            <span className="text-3xl font-extrabold text-white block">{hydrationPercent}%</span>
            <div>
              <span className="text-xs font-semibold text-zinc-200 block">Daily Fluid Goal</span>
              <span className="text-[11px] text-zinc-500">{todayTotalMl} of {dailyGoalMl} ml</span>
            </div>
          </div>

        </div>

        {/* ===================================================================
            "PICK UP WHERE YOU LEFT OFF" ACTIVE ROUTINE CARD (StudyLog Style)
            =================================================================== */}
        {nextTask && (
          <div className="p-6 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] block">
                Next Up in Your Routine
              </span>
              <h3 className="text-xl font-bold text-white">
                {nextTask.title}
              </h3>
              <div className="flex items-center space-x-3 text-xs text-zinc-400">
                <span className="px-2 py-0.5 rounded bg-[#131915] text-[#10B981] font-semibold text-[10px] uppercase">
                  {nextTask.drinkType}
                </span>
                <span>Target: {nextTask.targetTime}</span>
                <span>•</span>
                <span>Volume: {nextTask.amountMl} ml</span>
              </div>
              <div className="w-full max-w-md bg-[#151916] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => handleToggleTask(nextTask.id || nextTask._id)}
              className="px-6 py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2 self-start md:self-auto"
            >
              <span>{nextTask.completed ? 'Task Completed' : 'Complete Task'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ===================================================================
            ROUTINE TASKS CHECKLIST (Integrated into Dashboard)
            =================================================================== */}
        <div className="p-6 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2520]">
            <div>
              <h2 className="text-lg font-bold text-white">Daily Fluid Routine</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Check off scheduled drinks to maintain daily cellular hydration and your streak.
              </p>
            </div>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#152319] hover:bg-[#10B981] text-[#10B981] hover:text-black font-semibold text-xs border border-[#10B981]/30 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {routine?.tasks?.map((task) => (
              <div
                key={task.id || task._id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  task.completed
                    ? 'bg-[#0E1510] border-[#10B981]/30 text-zinc-400'
                    : 'bg-[#060907] border-[#1F2520] hover:border-[#10B981]/50 text-white'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <button
                    onClick={() => handleToggleTask(task.id || task._id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-[#10B981] border-[#10B981] text-black'
                        : 'border-zinc-700 hover:border-[#10B981] bg-black/40'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div>
                    <h4 className={`text-sm font-semibold ${task.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] text-zinc-500 mt-0.5">
                      <span>{task.targetTime}</span>
                      <span>•</span>
                      <span>{task.amountMl} ml</span>
                      <span className="capitalize text-[10px] px-1.5 py-0.2 rounded bg-black/60 border border-[#1F2520]">
                        {task.drinkType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-semibold ${task.completed ? 'text-[#10B981]' : 'text-zinc-600'}`}>
                    {task.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            STREAKS & MONTHLY CALENDAR (StudyLog Log Style, Image 4 & 5)
            =================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Streaks & Habit Log</h2>
              <p className="text-xs text-zinc-400">
                Track your active hydration days. Each streak day is shaded in green.
              </p>
            </div>
            
            <Link
              to="/tracker"
              className="text-xs font-semibold text-[#10B981] hover:underline flex items-center space-x-1"
            >
              <span>Open Drink Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT 2 COLS: Interactive Calendar with Shades of Green */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-6">
              
              {/* Calendar Header with Streak Counter at top */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {monthName} {calendarYear}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    <strong className="text-[#10B981]">{streakData.currentStreak} Days Streak</strong> · {calendarStats.activeDaysCount} active days ({calendarStats.totalMonthMl} ml total)
                  </p>
                </div>

                {/* Calendar Navigation Buttons */}
                <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                  <button
                    onClick={handleResetToToday}
                    className="px-3 py-1 rounded-lg bg-[#152319] border border-[#10B981]/30 text-xs font-semibold text-[#10B981] hover:bg-[#10B981] hover:text-black transition-all"
                  >
                    Today
                  </button>
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg bg-[#111612] border border-[#1F2520] text-zinc-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg bg-[#111612] border border-[#1F2520] text-zinc-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Labels Row: MON, TUE, WED, THU, FRI, SAT, SUN */}
              <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>

              {/* Day Tiles Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty offset squares for start of month */}
                {Array.from({ length: startOffset }).map((_, idx) => (
                  <div key={`offset-${idx}`} className="h-12 md:h-14 rounded-xl bg-transparent"></div>
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const dayInfo = calendarData[dateStr];
                  const isSelected = selectedDateKey === dateStr;
                  const isCurrentDay =
                    today.getFullYear() === calendarYear &&
                    today.getMonth() + 1 === calendarMonth &&
                    today.getDate() === dayNum;

                  // Green shade based on level
                  let bgStyle = 'bg-[#151916] text-zinc-400 border-[#1F2520]';
                  if (dayInfo) {
                    if (dayInfo.level === 3) {
                      bgStyle = 'bg-[#00DC82] text-[#020E05] font-bold border-[#00DC82]';
                    } else if (dayInfo.level === 2) {
                      bgStyle = 'bg-[#059669] text-white font-semibold border-[#059669]';
                    } else if (dayInfo.level === 1) {
                      bgStyle = 'bg-[#0B3B24] text-[#34D399] font-medium border-[#10B981]/40';
                    }
                  }

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDateKey(dateStr)}
                      className={`h-12 md:h-14 rounded-xl p-1.5 flex flex-col justify-between items-start transition-all border relative ${bgStyle} ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0A0D0A]' : ''
                      } ${isCurrentDay && !dayInfo ? 'border-[#10B981]/70' : ''}`}
                    >
                      <span className="text-xs font-semibold">{dayNum}</span>
                      {dayInfo && (
                        <span className="text-[10px] leading-none self-end">
                          {dayInfo.totalMl >= 1000
                            ? `${(dayInfo.totalMl / 1000).toFixed(1)}L`
                            : `${dayInfo.totalMl}ml`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Legend (Shades of Green) */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1F2520] text-xs text-zinc-500">
                <div className="flex items-center space-x-2">
                  <span>Less</span>
                  <div className="w-3.5 h-3.5 rounded bg-[#151916] border border-[#1F2520]"></div>
                  <div className="w-3.5 h-3.5 rounded bg-[#0B3B24]"></div>
                  <div className="w-3.5 h-3.5 rounded bg-[#059669]"></div>
                  <div className="w-3.5 h-3.5 rounded bg-[#00DC82]"></div>
                  <span>More</span>
                </div>
                <span>hydration / streak level</span>
              </div>

            </div>

            {/* RIGHT 1 COL: Selected Day Detail Card (StudyLog Style) */}
            <div className="p-6 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="border-b border-[#1F2520] pb-3">
                  <h3 className="text-base font-bold text-white">
                    {formattedSelectedDate}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {selectedDayData
                      ? `${selectedDayData.totalMl} ml logged across ${selectedDayData.count} sessions`
                      : 'No fluid intake recorded for this day'}
                  </p>
                </div>

                {selectedDayData && selectedDayData.drinks?.length > 0 ? (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {selectedDayData.drinks.map((d, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#0E1510] border border-[#1F2520] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-white block">{d.drinkName}</span>
                          <span className="text-[11px] text-zinc-500">{d.time}</span>
                        </div>
                        <span className="font-bold text-[#10B981]">{d.amountMl} ml</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-2 text-zinc-500">
                    <CalendarIcon className="w-8 h-8 mx-auto opacity-40 text-zinc-400" />
                    <p className="text-xs">Nothing logged on this day yet.</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsQuickLogModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold text-xs transition-all shadow-md flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log a Drink</span>
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* MODAL: QUICK LOG DRINK ON DASHBOARD */}
      {isQuickLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A0D0A] border border-[#1F2520] rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2520]">
              <h3 className="text-base font-bold text-white">Log Fluid Intake</h3>
              <button onClick={() => setIsQuickLogModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickLog} className="space-y-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Select Beverage</label>
                <select
                  value={quickDrinkName}
                  onChange={(e) => setQuickDrinkName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#020E05] border border-[#1F2520] rounded-xl text-white outline-none"
                >
                  <option value="Pure Water">Pure Water</option>
                  <option value="Organic Milk">Organic Milk</option>
                  <option value="Orange Juice">Orange Juice</option>
                  <option value="Green Tea">Green Tea</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Coconut Water">Coconut Water</option>
                  <option value="Banana Shake">Banana Shake</option>
                  <option value="Mojito">Mojito</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Amount (ml)</label>
                <input
                  type="number"
                  min={1}
                  value={quickAmountMl}
                  onChange={(e) => setQuickAmountMl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#020E05] border border-[#1F2520] rounded-xl text-white outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickLogModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ROUTINE TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A0D0A] border border-[#1F2520] rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2520]">
              <h3 className="text-base font-bold text-white">Add Routine Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Hydration (Coconut Water)"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#020E05] border border-[#1F2520] rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Target Time</label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#020E05] border border-[#1F2520] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Amount (ml)</label>
                  <input
                    type="number"
                    value={newTaskAmount}
                    onChange={(e) => setNewTaskAmount(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#020E05] border border-[#1F2520] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0A0D0A] border-t border-[#1F2520] py-6 text-center text-xs text-zinc-600 font-sans">
        &copy; 2026 NutriTrack AI. All rights reserved.
      </footer>
    </div>
  );
}
