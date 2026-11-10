import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Clock, 
  Trash2, 
  Sparkles, 
  Heart, 
  Droplet, 
  Flame,
  Check,
  X
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { fluidApi, trackedDrinkApi, aiApi, drinkApi } from '../services/api';

const DEFAULT_DRINKS_PRESETS = [
  {
    name: 'Pure Water',
    category: 'water',
    defaultAmountMl: 250,
    calories: 0,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Organic Milk',
    category: 'milk',
    defaultAmountMl: 200,
    calories: 120,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Black Coffee',
    category: 'coffee',
    defaultAmountMl: 150,
    calories: 5,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Green Tea',
    category: 'tea',
    defaultAmountMl: 200,
    calories: 2,
    imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Coconut Water',
    category: 'electrolyte',
    defaultAmountMl: 300,
    calories: 60,
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Electrolytes',
    category: 'electrolyte',
    defaultAmountMl: 350,
    calories: 15,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Protein Shake',
    category: 'protein',
    defaultAmountMl: 300,
    calories: 180,
    imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Herbal Tea',
    category: 'tea',
    defaultAmountMl: 250,
    calories: 2,
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Orange Juice',
    category: 'juice',
    defaultAmountMl: 250,
    calories: 110,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Banana Shake',
    category: 'smoothie',
    defaultAmountMl: 300,
    calories: 180,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Mojito',
    category: 'mocktail',
    defaultAmountMl: 250,
    calories: 85,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
  },
];

const QUICK_DROPDOWN_CHOICES = [
  'Pure Water',
  'Organic Milk',
  'Orange Juice',
  'Banana Shake',
  'Mojito',
  'Black Coffee',
  'Green Tea',
  'Coconut Water'
];

export default function TrackerPage() {
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

  // Maintained Drinks State
  const [drinks, setDrinks] = useState([]);
  const [loadingDrinks, setLoadingDrinks] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectPreset = (presetName) => {
    const matched = DEFAULT_DRINKS_PRESETS.find((p) => p.name === presetName);
    if (matched) {
      setDrinkForm((prev) => ({
        ...prev,
        name: matched.name,
        category: matched.category,
        defaultAmountMl: matched.defaultAmountMl,
        calories: matched.calories,
        imageUrl: matched.imageUrl,
      }));
    } else {
      setDrinkForm((prev) => ({ ...prev, name: presetName }));
    }
  };

  // Add Drink Modal State
  const [isAddDrinkModalOpen, setIsAddDrinkModalOpen] = useState(false);
  const [drinkForm, setDrinkForm] = useState({
    name: 'Pure Water',
    emoji: '',
    category: 'water',
    defaultAmountMl: 250,
    calories: '',
    imageUrl: '',
  });

  // Inline Log Toast / Feedback
  const [toastMessage, setToastMessage] = useState('');

  // Sub-tools Tabs in Tracker: 'drinks' | 'history' | 'estimator' | 'studio' | 'advisor' | 'requests'
  const [activeSection, setActiveSection] = useState('drinks');

  // Intake Timeline Logs
  const [fluidLogs, setFluidLogs] = useState([]);
  const [todayTotalMl, setTodayTotalMl] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);

  // AI Calorie Estimator State
  const [estimatorName, setEstimatorName] = useState('');
  const [estimatorIngredients, setEstimatorIngredients] = useState('');
  const [estimatorAmount, setEstimatorAmount] = useState(250);
  const [estimatorLoading, setEstimatorLoading] = useState(false);
  const [estimatorResult, setEstimatorResult] = useState(null);

  // AI Drink Studio State
  const [studioPrompt, setStudioPrompt] = useState('');
  const [studioCategory, setStudioCategory] = useState('all');
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioDrink, setStudioDrink] = useState(null);

  // Deficiency & Health Advisor State
  const [selectedConditions, setSelectedConditions] = useState(['Acid Reflux (GERD)']);
  const [selectedDeficiencies, setSelectedDeficiencies] = useState(['Iron Deficiency']);
  const [customCondition, setCustomCondition] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorResult, setAdvisorResult] = useState(null);

  // Community Drink Requests
  const [requests, setRequests] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ drinkName: '', calories: '', photoUrl: '', description: '' });

  // Fetch Maintained Drinks
  const fetchTrackedDrinks = async () => {
    setLoadingDrinks(true);
    try {
      const res = await trackedDrinkApi.getDrinks();
      let fetched = res.data.drinks || [];
      if (fetched.length === 0) {
        // Seed with the default presets
        fetched = DEFAULT_DRINKS_PRESETS.map((p, idx) => ({
          _id: `preset-${idx}`,
          ...p,
          streakDays: 1,
          totalLoggedMl: 0,
        }));
      }
      setDrinks(fetched);
    } catch (err) {
      console.warn('Failed to fetch drinks from API, using defaults:', err);
      setDrinks(
        DEFAULT_DRINKS_PRESETS.map((p, idx) => ({
          _id: `preset-${idx}`,
          ...p,
          streakDays: 1,
          totalLoggedMl: 0,
        }))
      );
    } finally {
      setLoadingDrinks(false);
    }
  };

  // Fetch Fluid Intake Logs
  const fetchFluidLogs = async () => {
    try {
      const res = await fluidApi.getLogs();
      setFluidLogs(res.data.logs || []);
      setTodayTotalMl(res.data.totalMl || 0);
      setTodayCalories(res.data.totalCalories || 0);
    } catch (err) {
      console.warn('Failed to fetch logs:', err);
    }
  };

  // Fetch Community Requests
  const fetchDrinkRequests = async () => {
    try {
      const res = await drinkApi.getRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      console.warn('Failed to fetch requests:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTrackedDrinks();
      fetchFluidLogs();
      fetchDrinkRequests();
    }
  }, [currentUser]);

  // Toast Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Handle Quick Increase Amount directly from Card's plus button (+)
  // 250ml -> 500ml -> 750ml etc.
  const handleIncreaseDrinkAmount = async (drink) => {
    const deltaMl = drink.defaultAmountMl || 250;
    const deltaKcal = drink.calories || 0;

    // 1. Optimistically update local maintained drink state
    setDrinks((prev) =>
      prev.map((d) =>
        d._id === drink._id
          ? {
              ...d,
              totalLoggedMl: (d.totalLoggedMl || 0) + deltaMl,
              streakDays: d.streakDays || 1,
            }
          : d
      )
    );

    // 2. Call backend to log/accumulate this drink for today
    try {
      const res = await fluidApi.addLog({
        drinkName: drink.name,
        drinkType: drink.category || 'water',
        amountMl: deltaMl,
        calories: deltaKcal,
        timestamp: new Date().toISOString(),
      });

      triggerToast(`${drink.name}: added ${deltaMl} ml (now ${res.data.log?.amountMl || deltaMl} ml)`);
      await fetchFluidLogs();
    } catch (err) {
      console.error('Failed to increase drink volume:', err);
    }
  };

  // Increment from Timeline card directly
  const handleIncrementLogCard = async (log) => {
    const deltaMl = 250;
    const deltaKcal = log.calories > 0 && log.amountMl > 0 ? Math.round((log.calories / log.amountMl) * deltaMl) : 0;
    try {
      const res = await fluidApi.incrementLog(log._id, deltaMl, deltaKcal);
      triggerToast(`${log.drinkName} increased to ${res.data.log?.amountMl} ml`);
      await fetchFluidLogs();
    } catch (err) {
      console.error('Increment log error:', err);
    }
  };

  // Handle Adding a Drink to Maintain
  const handleAddDrink = async (e) => {
    e.preventDefault();
    if (!drinkForm.name.trim()) return;

    try {
      const res = await trackedDrinkApi.addDrink({
        name: drinkForm.name.trim(),
        emoji: drinkForm.emoji.trim(),
        category: drinkForm.category,
        imageUrl: drinkForm.imageUrl || undefined,
        defaultAmountMl: Number(drinkForm.defaultAmountMl) || 250,
        calories: Number(drinkForm.calories) || 0,
      });

      if (res.data.drink) {
        setDrinks((prev) => [...prev, res.data.drink]);
      }
      setDrinkForm({
        name: 'Pure Water',
        emoji: '',
        category: 'water',
        defaultAmountMl: 250,
        calories: '',
        imageUrl: '',
      });
      setIsAddDrinkModalOpen(false);
      triggerToast('Drink added to tracker successfully.');
    } catch (err) {
      console.error('Error adding drink:', err);
    }
  };

  // Delete a Maintained Drink
  const handleDeleteDrink = async (id, e) => {
    e.stopPropagation();
    try {
      await trackedDrinkApi.deleteDrink(id);
      setDrinks((prev) => prev.filter((d) => d._id !== id));
      triggerToast('Drink removed from tracker.');
    } catch (err) {
      console.error('Failed to delete drink:', err);
    }
  };

  // Delete a Fluid Log Entry
  const handleDeleteLog = async (id) => {
    try {
      await fluidApi.deleteLog(id);
      await fetchFluidLogs();
      triggerToast('Log entry removed.');
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  };

  // Filtered Drinks List
  const filteredDrinks = drinks.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // AI Calorie Estimation Handler
  const handleEstimateCalories = async () => {
    if (!estimatorName.trim()) return;
    setEstimatorLoading(true);
    try {
      const res = await aiApi.estimateCalories(estimatorName, estimatorIngredients, estimatorAmount);
      setEstimatorResult(res.data);
    } catch (err) {
      console.error('Estimation error:', err);
    } finally {
      setEstimatorLoading(false);
    }
  };

  // AI Drink Studio Handler
  const handleStudioGenerate = async () => {
    if (!studioPrompt.trim()) return;
    setStudioLoading(true);
    try {
      const res = await aiApi.generateDrink(studioPrompt, studioCategory);
      setStudioDrink(res.data.drink);
    } catch (err) {
      console.error('Studio error:', err);
    } finally {
      setStudioLoading(false);
    }
  };

  // Health Advisor Handler
  const handleRunAdvisor = async () => {
    if (selectedConditions.length === 0 && selectedDeficiencies.length === 0) return;
    setAdvisorLoading(true);
    try {
      const res = await aiApi.recommendDrinks(selectedConditions, selectedDeficiencies);
      setAdvisorResult(res.data);
    } catch (err) {
      console.error('Advisor error:', err);
    } finally {
      setAdvisorLoading(false);
    }
  };

  // Community Request Creation
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!newRequest.drinkName || !newRequest.calories) return;
    try {
      const res = await drinkApi.createRequest(newRequest);
      setRequests([res.data.request, ...requests]);
      setNewRequest({ drinkName: '', calories: '', photoUrl: '', description: '' });
      setIsRequestModalOpen(false);
      triggerToast('Request submitted for catalog review.');
    } catch (err) {
      console.error('Request submission error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020E05] text-zinc-100 font-sans selection:bg-[#10B981] selection:text-black">
      <Navbar />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#10B981] text-black font-semibold text-xs shadow-2xl flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        
        {/* Breadcrumb (StudyLog style: Home / Tracker) */}
        <div className="flex items-center space-x-2 text-xs text-zinc-500 font-medium font-sans">
          <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-300">Tracker</span>
        </div>

        {/* Header Section (StudyLog style: Title on left, Action on right) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Drink Tracker</h1>
            <p className="text-xs text-zinc-400 mt-1">
              {drinks.length} drinks maintained · Today's Total: <strong className="text-[#10B981]">{todayTotalMl} ml</strong> ({todayCalories} kcal)
            </p>
          </div>

          <button
            onClick={() => setIsAddDrinkModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Drink</span>
          </button>
        </div>

        {/* Quick Add Presets Bar (Clean, no emojis!) */}
        <div className="p-4 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Quick Beverage Presets (Click + to directly add)
            </span>
            <span className="text-[11px] text-zinc-500">Adds serving directly to today's intake</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DEFAULT_DRINKS_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleIncreaseDrinkAmount(preset)}
                className="px-3 py-1.5 rounded-xl bg-[#111612] border border-[#1F2520] hover:border-[#10B981] text-xs font-semibold text-zinc-300 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{preset.name}</span>
                <span className="text-[10px] text-zinc-500 font-normal">({preset.defaultAmountMl}ml)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-tools Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1F2520]">
          {[
            { id: 'drinks', label: 'Maintained Drink Cards', count: drinks.length },
            { id: 'history', label: 'Intake Timeline (Aggregated)', count: fluidLogs.length },
            { id: 'estimator', label: 'AI Calorie Estimator' },
            { id: 'studio', label: 'AI Drink Studio' },
            { id: 'advisor', label: 'Health Advisor' },
            { id: 'requests', label: 'Drink Requests', count: requests.length },
          ].map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#152319] text-[#10B981] border-[#10B981]/40'
                    : 'bg-[#0A0D0A] text-zinc-400 border-[#1F2520] hover:text-white hover:border-zinc-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-black/60 text-zinc-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            SECTION 1: MAINTAINED DRINKS GRID (StudyLog Resources Style)
            =================================================================== */}
        {activeSection === 'drinks' && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 w-full md:w-auto flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search drinks or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0A0D0A] border border-[#1F2520] focus:border-[#10B981]/60 rounded-xl text-xs text-white placeholder-zinc-500 outline-none transition-all"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2 bg-[#0A0D0A] border border-[#1F2520] focus:border-[#10B981]/60 rounded-xl text-xs text-zinc-300 outline-none capitalize"
                >
                  <option value="all">All types</option>
                  <option value="water">Water</option>
                  <option value="milk">Milk</option>
                  <option value="juice">Juice</option>
                  <option value="smoothie">Smoothie</option>
                  <option value="mocktail">Mocktail / Mojito</option>
                  <option value="tea">Tea</option>
                  <option value="coffee">Coffee</option>
                  <option value="electrolyte">Electrolyte</option>
                  <option value="protein">Protein</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="text-xs text-zinc-500 self-start md:self-auto">
                Showing {filteredDrinks.length} drinks
              </div>
            </div>

            {/* Drink Cards Grid with Inline PLUS icon to directly increase amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDrinks.map((drink) => {
                // Find if this drink has logged amount today
                const todayLog = fluidLogs.find(
                  (l) => l.drinkName.toLowerCase() === drink.name.toLowerCase()
                );
                const currentIntakeMl = todayLog ? todayLog.amountMl : drink.totalLoggedMl || 0;

                return (
                  <div
                    key={drink._id}
                    className="p-5 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] hover:border-[#10B981]/50 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg group relative overflow-hidden"
                  >
                    {/* Top Image Thumbnail (StudyLog Style) */}
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-[#111612] relative border border-[#1F2520]">
                      <img
                        src={drink.imageUrl || 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop'}
                        alt={drink.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#10B981] border border-[#10B981]/30">
                          {drink.category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-zinc-300 border border-zinc-700/40">
                          {drink.streakDays || 1} day streak
                        </span>
                      </div>
                    </div>

                    {/* Drink Name & Portion */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#10B981] transition-colors flex items-center space-x-2">
                        {drink.emoji && <span className="text-xl">{drink.emoji}</span>}
                        <span>{drink.name}</span>
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Serving increment: +{drink.defaultAmountMl} ml · {drink.calories} kcal
                      </p>
                    </div>

                    {/* Current Volume Display (Increases: 250 -> 500 -> 750 ml) */}
                    <div className="space-y-1.5 p-3 rounded-xl bg-[#060907] border border-[#1F2520]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Total Today:</span>
                        <span className="font-extrabold text-[#10B981] text-base">
                          {currentIntakeMl} ml
                        </span>
                      </div>
                      <div className="w-full bg-[#151916] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(10, (currentIntakeMl / 2500) * 100))}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Plus Icon Action in the Card: directly increases volume */}
                    <div className="pt-2 border-t border-[#1F2520] flex items-center justify-between">
                      <button
                        onClick={() => handleIncreaseDrinkAmount(drink)}
                        className="flex-1 py-2 rounded-xl bg-[#152319] hover:bg-[#10B981] text-[#10B981] hover:text-black text-xs font-bold border border-[#10B981]/30 transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Add +{drink.defaultAmountMl} ml</span>
                      </button>

                      <button
                        onClick={(e) => handleDeleteDrink(drink._id, e)}
                        className="ml-2 text-zinc-600 hover:text-rose-400 p-2 transition-colors"
                        title="Remove drink card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {filteredDrinks.length === 0 && (
              <div className="py-16 text-center space-y-2 border border-dashed border-[#1F2520] rounded-2xl bg-[#0A0D0A]/40">
                <p className="text-zinc-400 text-sm">No drinks found matching your criteria.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="text-xs text-[#10B981] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* ===================================================================
            SECTION 2: INTAKE TIMELINE (Aggregates multiple pure waters into 500ml, 750ml)
            =================================================================== */}
        {activeSection === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Today's Intake Summary</h3>
                <p className="text-xs text-zinc-400">Total: {todayTotalMl} ml · {todayCalories} kcal</p>
              </div>
            </div>

            {fluidLogs.length === 0 ? (
              <div className="py-16 text-center space-y-2 border border-dashed border-[#1F2520] rounded-2xl bg-[#0A0D0A]">
                <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 text-sm">No drink logs recorded today.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fluidLogs.map((log) => {
                  const logDate = new Date(log.timestamp);
                  const timeStr = logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateStr = logDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

                  return (
                    <div
                      key={log._id}
                      className="p-5 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#131915] text-[#10B981]">
                            {log.drinkType}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">{log.drinkName}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteLog(log._id)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Accumulated Volume Display */}
                      <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#060907] border border-[#1F2520]">
                        <span className="text-zinc-400">Accumulated:</span>
                        <span className="text-lg font-extrabold text-[#10B981]">
                          {log.amountMl} ml
                        </span>
                      </div>

                      {/* Direct + icon to increase right on the timeline card */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1F2520]">
                        <button
                          onClick={() => handleIncrementLogCard(log)}
                          className="px-3 py-1 rounded-lg bg-[#152319] hover:bg-[#10B981] text-[#10B981] hover:text-black text-xs font-semibold border border-[#10B981]/30 transition-all flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+250 ml</span>
                        </button>

                        <span className="text-zinc-500 text-[11px]">{timeStr}, {dateStr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            SECTION 3: AI CALORIE ESTIMATOR
            =================================================================== */}
        {activeSection === 'estimator' && (
          <div className="p-6 md:p-8 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-6 max-w-2xl">
            <div>
              <h3 className="text-xl font-bold text-white">AI Calorie & Macro Estimator</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Insert any drink name and optional ingredients to estimate calories, macros, and hydration impact.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Drink Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Vanilla Oat Milk Matcha Latte"
                  value={estimatorName}
                  onChange={(e) => setEstimatorName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Ingredients (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 200ml oat milk, 1.5 tsp matcha powder, 1 tsp agave"
                  value={estimatorIngredients}
                  onChange={(e) => setEstimatorIngredients(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Portion Size (ml)</label>
                <input
                  type="number"
                  value={estimatorAmount}
                  onChange={(e) => setEstimatorAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-white outline-none"
                />
              </div>

              <button
                onClick={handleEstimateCalories}
                disabled={estimatorLoading}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition-all shadow-md"
              >
                {estimatorLoading ? 'Estimating Nutritional Profile...' : 'Estimate Calories with AI'}
              </button>
            </div>

            {estimatorResult && (
              <div className="p-5 rounded-xl bg-[#020E05] border border-[#10B981]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">Nutritional Estimate:</span>
                  <span className="text-xl font-bold text-[#10B981]">{estimatorResult.calories} kcal</span>
                </div>
                {estimatorResult.breakdown && (
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-[#0A0D0A]">Carbs: <strong>{estimatorResult.breakdown.carbs}g</strong></div>
                    <div className="p-2 rounded bg-[#0A0D0A]">Protein: <strong>{estimatorResult.breakdown.protein}g</strong></div>
                    <div className="p-2 rounded bg-[#0A0D0A]">Fat: <strong>{estimatorResult.breakdown.fat}g</strong></div>
                    <div className="p-2 rounded bg-[#0A0D0A]">Sugar: <strong>{estimatorResult.breakdown.sugar}g</strong></div>
                  </div>
                )}
                <p className="text-xs text-zinc-400">{estimatorResult.healthNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            SECTION 4: AI DRINK STUDIO
            =================================================================== */}
        {activeSection === 'studio' && (
          <div className="p-6 md:p-8 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">AI Drink Studio</h3>
              <p className="text-xs text-zinc-400 mt-1">Formulate custom beverages, recovery shakes, and wellness tonics.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. Afternoon focus tea without caffeine crash..."
                value={studioPrompt}
                onChange={(e) => setStudioPrompt(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-xs text-white outline-none"
              />
              <button
                onClick={handleStudioGenerate}
                disabled={studioLoading}
                className="px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition-all shadow-md"
              >
                {studioLoading ? 'Formulating...' : 'Generate Recipe'}
              </button>
            </div>

            {studioDrink && (
              <div className="p-6 rounded-2xl bg-[#020E05] border border-[#10B981]/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white">{studioDrink.name}</h4>
                    <p className="text-xs text-[#10B981]">{studioDrink.tagline}</p>
                  </div>
                  <span className="text-sm font-bold text-white">{studioDrink.calories} kcal</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#0A0D0A] space-y-2">
                    <span className="font-bold text-white">Ingredients:</span>
                    <ul className="space-y-1 text-zinc-300">
                      {studioDrink.ingredients?.map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0A0D0A] space-y-2">
                    <span className="font-bold text-white">Instructions:</span>
                    <ol className="space-y-1 text-zinc-300 list-decimal list-inside">
                      {studioDrink.instructions?.map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            SECTION 5: HEALTH DEFICIENCY ADVISOR
            =================================================================== */}
        {activeSection === 'advisor' && (
          <div className="p-6 md:p-8 rounded-2xl bg-[#0A0D0A] border border-[#1F2520] space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Health & Deficiency Advisor</h3>
              <p className="text-xs text-zinc-400 mt-1">Get custom suggestions on drinks to have and drinks to avoid.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-white">Conditions:</span>
                <div className="flex flex-wrap gap-2">
                  {['Acid Reflux (GERD)', 'High Blood Pressure', 'Kidney Stones', 'Diabetes', 'Fatigue', 'Dehydration'].map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setSelectedConditions((prev) =>
                          prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs ${
                        selectedConditions.includes(c)
                          ? 'bg-rose-950/60 border-rose-500/80 text-rose-300 font-semibold'
                          : 'bg-[#020E05] border-[#1F2520] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {selectedConditions.includes(c) ? '✓ ' : '+ '}{c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white">Deficiencies:</span>
                <div className="flex flex-wrap gap-2">
                  {['Iron Deficiency', 'Vitamin D', 'Magnesium', 'Potassium', 'Calcium', 'Vitamin B12'].map((d) => (
                    <button
                      key={d}
                      onClick={() =>
                        setSelectedDeficiencies((prev) =>
                          prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs ${
                        selectedDeficiencies.includes(d)
                          ? 'bg-amber-950/60 border-amber-500/80 text-amber-300 font-semibold'
                          : 'bg-[#020E05] border-[#1F2520] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {selectedDeficiencies.includes(d) ? '✓ ' : '+ '}{d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleRunAdvisor}
              disabled={advisorLoading}
              className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs"
            >
              {advisorLoading ? 'Evaluating...' : 'Analyze Drinks To Have & Avoid'}
            </button>

            {advisorResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1F2520]">
                {/* To Have */}
                <div className="space-y-3">
                  <span className="font-bold text-[#10B981] text-sm">Recommended Drinks To Have</span>
                  {advisorResult.recommendedDrinks?.map((d, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#020E05] border border-emerald-500/30 text-xs space-y-1">
                      <span className="font-bold text-white block">{d.name}</span>
                      <p className="text-zinc-300">{d.whyItHelps}</p>
                    </div>
                  ))}
                </div>

                {/* To Avoid */}
                <div className="space-y-3">
                  <span className="font-bold text-rose-400 text-sm">Drinks You Should Avoid</span>
                  {advisorResult.avoidDrinks?.map((d, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#020E05] border border-rose-500/30 text-xs space-y-1">
                      <span className="font-bold text-white block">{d.name}</span>
                      <p className="text-zinc-300">{d.whyAvoid}</p>
                      <span className="text-amber-300 block">Alternative: {d.healthierAlternative}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            SECTION 6: DRINK REQUESTS (Preserved)
            =================================================================== */}
        {activeSection === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Community Catalog Requests</h3>
                <p className="text-xs text-zinc-400">Request drinks for nutritional profiling.</p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#10B981] text-black font-semibold text-xs"
              >
                + New Request
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {requests.map((r) => (
                <div key={r._id || r.id} className="p-4 rounded-xl bg-[#0A0D0A] border border-[#1F2520] space-y-2 text-xs">
                  <span className="font-bold text-white text-sm block">{r.drinkName}</span>
                  <p className="text-zinc-400 line-clamp-2">{r.description}</p>
                  <div className="pt-2 border-t border-[#1F2520] flex items-center justify-between text-zinc-500">
                    <span>{r.calories} kcal</span>
                    <span className="capitalize text-zinc-300">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* =====================================================================
          MODAL: ADD DRINK (With Simple 4-5 Dropdown Options OR Custom Typing)
          ===================================================================== */}
      {isAddDrinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A0D0A] border border-[#1F2520] rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2520]">
              <h2 className="text-lg font-bold text-white">Add Maintained Drink</h2>
              <button
                onClick={() => setIsAddDrinkModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDrink} className="space-y-4 text-xs">
              
              {/* Drink Selection / Typing Box */}
              <div>
                <label className="block text-zinc-300 font-medium mb-1.5">
                  Select Drink or Type Any Drink Name *
                </label>
                
                {/* 4-5 Quick Option Buttons */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {QUICK_DROPDOWN_CHOICES.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                        drinkForm.name === preset
                          ? 'bg-[#152319] text-[#10B981] border-[#10B981]/50 font-semibold'
                          : 'bg-[#111612] text-zinc-400 border-[#1F2520] hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  required
                  placeholder="Type or select a drink (e.g. Water, Milk, Orange Juice, Mojito...)"
                  value={drinkForm.name}
                  onChange={(e) => setDrinkForm({ ...drinkForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-white outline-none"
                />
              </div>

              {/* Optional Keyboard Emoji */}
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Optional Keyboard Emoji (from your keyboard)
                </label>
                <input
                  type="text"
                  placeholder="Paste or type any emoji from your keyboard (optional)"
                  value={drinkForm.emoji}
                  onChange={(e) => setDrinkForm({ ...drinkForm, emoji: e.target.value })}
                  className="w-full px-4 py-2 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-white outline-none"
                />
              </div>

              {/* Optional Pinterest / Web Image URL */}
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Image URL (Optional Pinterest or web image link)
                </label>
                <input
                  type="url"
                  placeholder="https://... (optional image link)"
                  value={drinkForm.imageUrl || ''}
                  onChange={(e) => setDrinkForm({ ...drinkForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-white outline-none"
                />
              </div>

              {/* Serving Amount & Calories */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Default Amount (ml)</label>
                  <input
                    type="number"
                    min={1}
                    value={drinkForm.defaultAmountMl}
                    onChange={(e) => setDrinkForm({ ...drinkForm, defaultAmountMl: e.target.value })}
                    className="w-full px-4 py-2 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={drinkForm.calories}
                    onChange={(e) => setDrinkForm({ ...drinkForm, calories: e.target.value })}
                    className="w-full px-4 py-2 bg-[#020E05] border border-[#1F2520] focus:border-[#10B981] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDrinkModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold shadow-md transition-all"
                >
                  Save Drink
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT REQUEST */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A0D0A] border border-[#1F2520] rounded-2xl p-6 space-y-4 text-xs">
            <h2 className="text-lg font-bold text-white">Submit Drink Request</h2>
            <form onSubmit={handleCreateRequest} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Drink Name *"
                value={newRequest.drinkName}
                onChange={(e) => setNewRequest({ ...newRequest, drinkName: e.target.value })}
                className="w-full px-3 py-2 bg-[#020E05] border border-[#1F2520] rounded-xl text-white outline-none"
              />
              <input
                type="number"
                required
                placeholder="Calories (kcal) *"
                value={newRequest.calories}
                onChange={(e) => setNewRequest({ ...newRequest, calories: e.target.value })}
                className="w-full px-3 py-2 bg-[#020E05] border border-[#1F2520] rounded-xl text-white outline-none"
              />
              <textarea
                required
                rows={3}
                placeholder="Description *"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#020E05] border border-[#1F2520] rounded-xl text-white outline-none resize-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsRequestModalOpen(false)} className="px-3 py-1.5 text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#10B981] text-black font-bold rounded-xl">Submit</button>
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
