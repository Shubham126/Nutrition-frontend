import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DrinkCard from '../components/ui/DrinkCard';

export default function LandingPage() {
  // Initial 6 drinks data
  const showcaseDrinks = [
    {
      id: 'water',
      name: 'Water',
      status: 'Safe',
      imageUrl: '', // Insert image path here later
    },
    {
      id: 'milk',
      name: 'Milk',
      status: 'Safe',
      imageUrl: '',
    },
    {
      id: 'banana-shake',
      name: 'Banana Shake',
      status: 'Moderate',
      imageUrl: '',
    },
    {
      id: 'coke',
      name: 'Coke',
      status: 'Not Safe',
      imageUrl: '',
    },
    {
      id: 'orange-juice',
      name: 'Orange Juice',
      status: 'Moderate',
      imageUrl: '',
    },
    {
      id: 'chicken-soup',
      name: 'Chicken Soup',
      status: 'Safe',
      imageUrl: '',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-forest text-lime">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-olive/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-carbon border border-gold/40 text-gold text-xs font-semibold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-lime" />
            <span>Next-Generation Intelligent Nutrition & Health Engine</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Precision Fluid & Dietary Tracking Powered by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-lime">
              Advanced AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-lime/80 max-w-2xl mx-auto font-light leading-relaxed">
            Seamlessly monitor your daily fluid intake, analyze nutrient profiles, track customized
            food charts, and bridge wellness with intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold text-carbon font-bold text-base hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(197,160,89,0.4)] flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#drinks-showcase"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-carbon border border-olive text-lime font-semibold text-base hover:border-gold transition-all flex items-center justify-center"
            >
              Browse Catalog
            </a>
          </div>
        </div>
      </section>

      {/* Drinks Showcase Section */}
      <section id="drinks-showcase" className="py-20 px-6 bg-forest border-t border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold text-white">Popular Beverages & Broths</h2>
            <p className="text-lime/70 max-w-xl mx-auto text-sm">
              Discover common daily fluids with at-a-glance health suitability ratings and deep nutritional insights.
            </p>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseDrinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                id={drink.id}
                name={drink.name}
                status={drink.status}
                imageUrl={drink.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview Grid */}
      <section id="features" className="py-20 px-6 bg-carbon/60 border-t border-b border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold text-white">Engineered For Complete Wellness</h2>
            <p className="text-lime/70 max-w-xl mx-auto text-sm">
              Everything you need to maintain peak health, analyze nutritional gaps, and manage daily diet structures.
            </p>
            <div className="w-24 h-0.5 bg-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-forest border border-olive/60 hover:border-gold/50 transition-all space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-carbon border border-gold/30 flex items-center justify-center text-gold">
                <Activity className="w-6 h-6 text-lime" />
              </div>
              <h3 className="text-xl font-semibold text-white">Advanced Fluid Tracking</h3>
              <p className="text-lime/70 text-sm leading-relaxed">
                Log water, milk, coffee, tea, and custom beverages with precise timestamps, calculating exact calorie and vitamin distributions automatically.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-forest border border-olive/60 hover:border-gold/50 transition-all space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-carbon border border-gold/30 flex items-center justify-center text-gold">
                <Sparkles className="w-6 h-6 text-lime" />
              </div>
              <h3 className="text-xl font-semibold text-white">AI Drink & Food Analyzer</h3>
              <p className="text-lime/70 text-sm leading-relaxed">
                Instant postcard-style searches with detailed breakdowns into categories like smoothies, juices, and soft drinks to evaluate health impacts.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-forest border border-olive/60 hover:border-gold/50 transition-all space-y-4 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-carbon border border-gold/30 flex items-center justify-center text-gold">
                <ShieldCheck className="w-6 h-6 text-lime" />
              </div>
              <h3 className="text-xl font-semibold text-white">Deficiency & Diet Charts</h3>
              <p className="text-lime/70 text-sm leading-relaxed">
                Identify vitamin deficiencies and get targeted beverage and dietary recommendations based on your personal weight and profile parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}