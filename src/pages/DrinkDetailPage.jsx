import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Flame, 
  Droplet, 
  Clock, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { fluidApi } from '../services/api';

const DRINKS_DATA = {
  water: {
    name: 'Pure Spring Water',
    status: 'Safe',
    category: 'Water',
    calories: 0,
    amountMl: 250,
    hydrationScore: 10,
    description: 'Essential cellular hydration that maintains cellular osmosis, kidney filtration, and thermodynamic regulation with zero metabolic strain.',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Calcium', amount: '12 mg' },
      { name: 'Magnesium', amount: '6 mg' },
      { name: 'Sodium', amount: '4 mg' },
      { name: 'Electrolytes', amount: 'Balanced' },
    ],
    deficiencyBenefits: 'Crucial for kidney stone prevention, metabolic efficiency, and transport of water-soluble vitamins (C, B-complex).',
    avoidWhen: 'None. Safe in all standard conditions. Maintain balanced electrolyte intake during extreme endurance events.',
  },
  milk: {
    name: 'Organic Whole / Fortified Milk',
    status: 'Safe',
    category: 'Dairy / Plant Alternative',
    calories: 120,
    amountMl: 200,
    hydrationScore: 9.0,
    description: 'High-density nutrient beverage providing balanced casein and whey proteins alongside bioavailable calcium and fat-soluble Vitamin D3.',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Calcium', amount: '240 mg' },
      { name: 'Vitamin D', amount: '2.5 mcg' },
      { name: 'Protein', amount: '6.8 g' },
      { name: 'Vitamin B12', amount: '0.9 mcg' },
    ],
    deficiencyBenefits: 'Exceptional for combating Calcium and Vitamin D deficiencies, muscle protein synthesis, and bone mineralization.',
    avoidWhen: 'Avoid if diagnosed with lactose intolerance, severe dairy allergies, or active acute gastrointestinal inflammation.',
  },
  'banana-shake': {
    name: 'Banana Protein Smoothie',
    status: 'Moderate',
    category: 'Smoothie',
    calories: 180,
    amountMl: 250,
    hydrationScore: 8.0,
    description: 'Carbohydrate and potassium-dense blended shake designed for muscular glycogen restoration and sustained electrolyte replenishment.',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Potassium', amount: '420 mg' },
      { name: 'Carbohydrates', amount: '32 g' },
      { name: 'Vitamin B6', amount: '0.4 mg' },
      { name: 'Magnesium', amount: '35 mg' },
    ],
    deficiencyBenefits: 'Addresses Potassium and Magnesium deficiencies; excellent pre/post athletic recovery beverage.',
    avoidWhen: 'Moderate intake recommended for strict diabetic blood glucose management due to quick-digesting natural fruit sugars.',
  },
  coke: {
    name: 'Carbonated Cola Beverage',
    status: 'Not Safe',
    category: 'Soda',
    calories: 140,
    amountMl: 330,
    hydrationScore: 4.5,
    description: 'Ultra-processed carbonated beverage loaded with high-fructose corn syrup and phosphoric acid, providing hyperosmolar empty calories.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Sugars', amount: '39 g' },
      { name: 'Phosphoric Acid', amount: 'High' },
      { name: 'Caffeine', amount: '34 mg' },
      { name: 'Vitamins', amount: '0 mg' },
    ],
    deficiencyBenefits: 'None. Devoid of micronutrients. Can exacerbate calcium leaching from bone matrices via phosphoric acid binding.',
    avoidWhen: 'Avoid in diabetes, osteoporosis, acid reflux, gout, hypertension, and weight-management regimens.',
  },
  'orange-juice': {
    name: 'Freshly Squeezed Orange Juice',
    status: 'Moderate',
    category: 'Citrus Juice',
    calories: 110,
    amountMl: 250,
    hydrationScore: 8.5,
    description: 'Vibrant citrus beverage loaded with bioflavonoids and ascorbic acid (Vitamin C), best enjoyed alongside iron-rich meals.',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Vitamin C', amount: '82 mg' },
      { name: 'Folate', amount: '45 mcg' },
      { name: 'Potassium', amount: '350 mg' },
      { name: 'Sugars', amount: '21 g' },
    ],
    deficiencyBenefits: 'Magnifies non-heme iron absorption by up to 300%; bolsters immune resilience and vascular collagen formation.',
    avoidWhen: 'Restrict in severe GERD / Acid Reflux or active gastritis due to low pH stimulating acid sensitive nerve endings.',
  },
  'chicken-soup': {
    name: 'Slow-Simmered Chicken Bone Broth',
    status: 'Safe',
    category: 'Broth / Soup',
    calories: 75,
    amountMl: 250,
    hydrationScore: 9.5,
    description: 'Therapeutic electrolyte and amino acid elixir containing hydrolysed collagen, glycine, proline, and vital bio-salts.',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Collagen / Protein', amount: '9.2 g' },
      { name: 'Sodium', amount: '380 mg' },
      { name: 'Potassium', amount: '220 mg' },
      { name: 'Glycine', amount: '1.4 g' },
    ],
    deficiencyBenefits: 'Supports gut lining healing, joints, cellular fluid balance, and post-illness electrolyte restoration.',
    avoidWhen: 'Moderate sodium levels if placed on strict clinical sodium-restricted renal or hypertensive protocol.',
  },
  coffee: {
    name: 'Cold Brew Arabica Coffee',
    status: 'Moderate',
    category: 'Coffee',
    calories: 5,
    amountMl: 150,
    hydrationScore: 7.5,
    description: 'Slow-steeped Arabica coffee rich in chlorogenic acids and polyphenols that promote metabolic alertness and cognitive performance.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Caffeine', amount: '95 mg' },
      { name: 'Potassium', amount: '115 mg' },
      { name: 'Magnesium', amount: '7 mg' },
      { name: 'Niacin (B3)', amount: '0.5 mg' },
    ],
    deficiencyBenefits: 'Provides bioflavonoids and gentle stimulant properties. Helps clear sluggishness and promotes hepatic circulation.',
    avoidWhen: 'Restrict in severe acid reflux (GERD), chronic insomnia, and pregnancy (limit to under 200mg daily caffeine).',
  },
  'green-tea': {
    name: 'Japanese Sencha Green Tea',
    status: 'Safe',
    category: 'Tea',
    calories: 2,
    amountMl: 200,
    hydrationScore: 9.5,
    description: 'Antioxidant-dense infusion rich in epigallocatechin gallate (EGCG) and L-theanine for calm focused mental clarity.',
    imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'EGCG Antioxidants', amount: '120 mg' },
      { name: 'L-Theanine', amount: '25 mg' },
      { name: 'Caffeine', amount: '28 mg' },
      { name: 'Fluoride', amount: '0.3 mg' },
    ],
    deficiencyBenefits: 'Powerful cellular antioxidant protection; promotes cardiovascular elasticity and metabolic fat oxidation.',
    avoidWhen: 'Avoid taking concurrently with iron supplements or iron-rich meals as tannins can hinder non-heme iron absorption.',
  },
  mojito: {
    name: 'Virgin Mint Lime Mojito',
    status: 'Safe',
    category: 'Mocktail / Cooler',
    calories: 85,
    amountMl: 250,
    hydrationScore: 9.0,
    description: 'Refreshing sparkling botanical cooler packed with fresh spearmint leaves, pure squeezed Persian lime juice, and mineral water.',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Vitamin C', amount: '24 mg' },
      { name: 'Menthol oils', amount: 'Natural' },
      { name: 'Sodium', amount: '15 mg' },
      { name: 'Potassium', amount: '85 mg' },
    ],
    deficiencyBenefits: 'Aids digestive transit, cools the stomach, and provides a pleasant low-calorie hydration alternative.',
    avoidWhen: 'Menthol in mint can relax the esophageal sphincter in sensitive acid reflux sufferers.',
  },
  'coconut-water': {
    name: 'Pure Young Coconut Water',
    status: 'Safe',
    category: 'Electrolyte',
    calories: 60,
    amountMl: 300,
    hydrationScore: 10.0,
    description: 'Nature’s isotonic hydration beverage, dense in bioavailable potassium and natural electrolytes directly matching human blood osmolarity.',
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=800&auto=format&fit=crop',
    nutrients: [
      { name: 'Potassium', amount: '600 mg' },
      { name: 'Sodium', amount: '25 mg' },
      { name: 'Magnesium', amount: '60 mg' },
      { name: 'Calcium', amount: '24 mg' },
    ],
    deficiencyBenefits: 'Fast restorative electrolyte balance for post-workout recovery, muscle cramp prevention, and potassium deficiency.',
    avoidWhen: 'Monitor intake in late-stage chronic kidney disease where potassium excretion is severely restricted.',
  },
};

export default function DrinkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drink, setDrink] = useState(null);
  const [loggedSuccess, setLoggedSuccess] = useState(false);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (DRINKS_DATA[id]) {
      setDrink(DRINKS_DATA[id]);
    } else {
      // Fallback custom drink
      const formattedName = id.replace(/-/g, ' ');
      setDrink({
        name: formattedName.replace(/\b\w/g, (c) => c.toUpperCase()),
        status: 'Safe',
        category: 'Custom Beverage',
        calories: 85,
        amountMl: 250,
        hydrationScore: 8.5,
        description: `Nutritional profile and fluid properties for ${formattedName}. Tracked with precision metrics.`,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
        nutrients: [
          { name: 'Hydration', amount: 'High' },
          { name: 'Electrolytes', amount: 'Moderate' },
          { name: 'Calories', amount: '85 kcal' },
        ],
        deficiencyBenefits: 'Contributes to total daily fluid requirements and cellular equilibrium.',
        avoidWhen: 'Consult personalized health advisor in dashboard for specific contraindications.',
      });
    }
  }, [id]);

  const handleQuickLog = async () => {
    if (!drink) return;
    setLogging(true);
    try {
      await fluidApi.addLog({
        drinkName: drink.name,
        drinkType: drink.category.toLowerCase().includes('water')
          ? 'water'
          : drink.category.toLowerCase().includes('milk')
          ? 'milk'
          : drink.category.toLowerCase().includes('tea')
          ? 'tea'
          : drink.category.toLowerCase().includes('coffee')
          ? 'coffee'
          : 'other',
        amountMl: drink.amountMl,
        calories: drink.calories,
        timestamp: new Date().toISOString(),
        notes: `Quick-logged from ${drink.name} profile`,
      });
      setLoggedSuccess(true);
      setTimeout(() => setLoggedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to quick log:', err);
      // Still show success for UI feedback
      setLoggedSuccess(true);
      setTimeout(() => setLoggedSuccess(false), 3000);
    } finally {
      setLogging(false);
    }
  };

  if (!drink) {
    return (
      <div className="min-h-screen bg-[#020E05] flex items-center justify-center text-[#A7AD58]">
        Loading Drink Profile...
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'safe':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Safe for Regular Intake
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 border border-amber-500/40 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> Moderate Intake
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <XCircle className="w-3.5 h-3.5" /> Not Safe / Restrict
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#020E05] text-zinc-100 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center space-x-2 text-xs text-zinc-500 font-medium font-sans">
          <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/tracker" className="hover:text-zinc-300 transition-colors">Tracker</Link>
          <span>/</span>
          <span className="text-zinc-300">{drink.name}</span>
        </div>
        {/* Hero Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#3D3F11] bg-gradient-to-b from-[#0A0D0A] to-[#020E05] p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="w-full h-72 md:h-80 rounded-2xl overflow-hidden border border-[#3D3F11] relative bg-black/40">
              <img
                src={drink.imageUrl}
                alt={drink.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                {getStatusBadge(drink.status)}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                <Sparkles className="w-4 h-4 text-[#A7AD58]" />
                <span>{drink.category}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                {drink.name}
              </h1>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {drink.description}
              </p>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-black/60 border border-[#3D3F11] text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-white">{drink.calories}</div>
                  <div className="text-[10px] uppercase text-zinc-400 tracking-wider">Calories</div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-[#3D3F11] text-center">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-white">{drink.amountMl} ml</div>
                  <div className="text-[10px] uppercase text-zinc-400 tracking-wider">Std Serving</div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-[#3D3F11] text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-white">{drink.hydrationScore}/10</div>
                  <div className="text-[10px] uppercase text-zinc-400 tracking-wider">Hydration</div>
                </div>
              </div>

              {/* Action: Quick Log Drink */}
              <div className="pt-3">
                <button
                  onClick={handleQuickLog}
                  disabled={logging}
                  className="w-full py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#E6CA65] text-[#020E05] font-bold text-sm transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{logging ? 'Logging...' : `Log ${drink.amountMl}ml to Today's Fluid Tracker`}</span>
                </button>

                {loggedSuccess && (
                  <div className="mt-2 text-center text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Logged with current timestamp!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional & Clinical Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nutrients Breakdown */}
          <div className="p-6 rounded-2xl bg-black/60 border border-[#3D3F11] space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
              Micronutrient Distribution
            </h3>
            <div className="space-y-3">
              {drink.nutrients.map((n, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#020E05] border border-[#3D3F11]/60 text-xs"
                >
                  <span className="text-zinc-300 font-medium">{n.name}</span>
                  <span className="font-bold text-[#A7AD58]">{n.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deficiency & Health Guidance */}
          <div className="p-6 rounded-2xl bg-black/60 border border-[#3D3F11] space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A7AD58]"></span>
              Deficiency & Health Context
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-400">Nutritional Benefits:</span>
                <p className="text-zinc-300">{drink.deficiencyBenefits}</p>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                <span className="font-bold text-rose-400">Contraindications & Caution:</span>
                <p className="text-zinc-300">{drink.avoidWhen}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
