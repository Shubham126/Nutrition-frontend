import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon,
  Sparkles,
  Filter,
  ArrowLeft,
  Activity,
  User,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([
    {
      id: 1,
      drinkName: 'Electrolyte Dragonfruit Cooler',
      calories: 95,
      photoUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop',
      description: 'Dynamic recovery blend packed with magnesium, pink Himalayan salt, and fresh dragonfruit purée.',
      status: 'pending',
      requestedBy: 'sarah_fit',
      date: 'Nov 6, 2026',
    },
    {
      id: 2,
      drinkName: 'Cold Brew Protein Macchiato',
      calories: 140,
      photoUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
      description: 'Slow-steeped Arabica coffee blended with unsweetened almond milk and 15g organic pea protein peptide.',
      status: 'approved',
      requestedBy: 'alex99',
      date: 'Nov 5, 2026',
    },
    {
      id: 3,
      drinkName: 'Golden Turmeric Coconut Elixir',
      calories: 110,
      photoUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600&auto=format&fit=crop',
      description: 'Anti-inflammatory broth with cold-pressed turmeric roots, coconut water, black pepper, and dash of ginger.',
      status: 'pending',
      requestedBy: 'nutri_user',
      date: 'Nov 4, 2026',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Request Form State
  const [newRequest, setNewRequest] = useState({
    drinkName: '',
    calories: '',
    photoUrl: '',
    description: '',
  });

  const handleInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!newRequest.drinkName || !newRequest.calories) return;

    const requestObj = {
      id: Date.now(),
      drinkName: newRequest.drinkName,
      calories: Number(newRequest.calories),
      photoUrl: newRequest.photoUrl || '',
      description: newRequest.description,
      status: 'pending',
      requestedBy: 'You',
      date: 'Just now',
    };

    setRequests([requestObj, ...requests]);
    setNewRequest({ drinkName: '', calories: '', photoUrl: '', description: '' });
    setIsModalOpen(false);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.drinkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/40 text-amber-300">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020E05] text-zinc-100 font-sans selection:bg-[#A7AD58] selection:text-[#020E05]">
      
      {/* Integrated Header */}
      <header className="sticky top-0 z-40 bg-[#0A0D0A]/90 backdrop-blur-md border-b border-[#3D3F11]/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 text-[#C5A059] font-bold text-xl tracking-wide">
            <Activity className="w-6 h-6 text-[#A7AD58]" />
            <span>NutriTrack AI</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-xs text-[#A7AD58] hover:text-[#C5A059] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 rounded-lg transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#3D3F11]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A7AD58]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Nutrition & Intake Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Drink Requests Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Browse submitted drinks, evaluate calorie metrics, or request new custom drinks for catalog analysis.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#E6CA65] text-[#020E05] font-bold text-sm transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>New Drink Request</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by drink name or contents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#C5A059] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Filter className="w-4 h-4 text-[#A7AD58]" />
            <span className="text-xs text-zinc-400">Filter status:</span>
            {['all', 'pending', 'approved'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-xs capitalize px-3 py-1.5 rounded-lg border transition-all ${
                  statusFilter === status
                    ? 'bg-[#3D3F11] border-[#C5A059] text-white font-semibold'
                    : 'bg-black/40 border-[#3D3F11] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="group bg-black/60 rounded-2xl border border-[#3D3F11] hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg shadow-black/50"
            >
              {/* Photo Container */}
              <div className="w-full h-48 relative bg-[#020E05] border-b border-[#3D3F11] overflow-hidden flex items-center justify-center">
                {req.photoUrl ? (
                  <img
                    src={req.photoUrl}
                    alt={req.drinkName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-500">
                    <ImageIcon className="w-8 h-8 opacity-40 text-[#A7AD58]" />
                    <span className="text-xs">No image provided</span>
                  </div>
                )}

                {/* Calorie Pill Overlay */}
                <div className="absolute bottom-3 left-3 bg-[#020E05]/90 border border-[#C5A059]/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    {req.calories} kcal
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {getStatusBadge(req.status)}
                </div>
              </div>

              {/* Information Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors">
                    {req.drinkName}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                {/* Card Footer Info */}
                <div className="pt-3 border-t border-[#3D3F11]/60 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Req by: <strong className="text-zinc-300">@{req.requestedBy}</strong></span>
                  <span>{req.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="py-20 text-center space-y-2 border border-dashed border-[#3D3F11] rounded-2xl bg-black/20 mt-4">
            <p className="text-zinc-400 text-sm">No drink requests found matching your filter criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="text-xs text-[#A7AD58] underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>

      {/* Modal: New Drink Request Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#020E05] border border-[#C5A059]/50 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#3D3F11]">
              <div>
                <h2 className="text-xl font-bold text-white">Submit New Drink Request</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Provide drink details for analysis and inclusion</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Drink Name *</label>
                <input
                  type="text"
                  name="drinkName"
                  required
                  placeholder="e.g., Cold Pressed Green Celery Tonic"
                  value={newRequest.drinkName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#C5A059] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Calories (kcal) *</label>
                <input
                  type="number"
                  name="calories"
                  required
                  placeholder="e.g., 85"
                  value={newRequest.calories}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#C5A059] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  name="photoUrl"
                  placeholder="https://example.com/drink.jpg (optional)"
                  value={newRequest.photoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#C5A059] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Describe ingredients, preparation, taste, and observed nutritional benefits..."
                  value={newRequest.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#C5A059] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-zinc-400 hover:text-white rounded-xl border border-[#3D3F11]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="bg-[#0A0D0A] border-t border-[#3D3F11]/40 py-6 text-center text-xs text-zinc-500">
        &copy; 2026 NutriTrack AI. All rights reserved.
      </footer>
    </div>
  );
}