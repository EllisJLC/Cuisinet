
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { LOCATION_GROUPS, FOOD_GROUPS, DIETARY_RESTRICTIONS, CUISINES } from './constants';
import { SearchResult } from './types';
import { fetchGroceryData } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>(LOCATION_GROUPS[0].country);
  const [selectedCity, setSelectedCity] = useState<string>(LOCATION_GROUPS[0].cities[0]);
  const [selectedFoodGroups, setSelectedFoodGroups] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableCities = useMemo(() => {
    const group = LOCATION_GROUPS.find(g => g.country === selectedCountry);
    return group ? group.cities : [];
  }, [selectedCountry]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const group = LOCATION_GROUPS.find(g => g.country === country);
    if (group && group.cities.length > 0) {
      setSelectedCity(group.cities[0]);
    }
  };

  const toggleFilter = (item: string, state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGroceryData(
        selectedCity, 
        selectedCountry, 
        shoppingList, 
        selectedFoodGroups,
        selectedDietary,
        selectedCuisines
      );
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Search Section */}
      <section className="bg-white border-b border-slate-100 py-12 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 transform origin-top-right hidden lg:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Real-time Pricing Engine</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
                Find the <span className="text-emerald-600">Best Deals</span> In Your City.
              </h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed font-medium">
                Our AI analyzes local market trends and supermarket inventories to find you the best produce and lowest prices.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Country</label>
                  <select 
                    className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none appearance-none font-bold transition-all cursor-pointer"
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                  >
                    {LOCATION_GROUPS.map((group) => (
                      <option key={group.country} value={group.country}>{group.country}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">City</label>
                  <select 
                    className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none appearance-none font-bold transition-all cursor-pointer"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Multi-Select Filters */}
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Food Groups</label>
                  <div className="flex flex-wrap gap-2">
                    {FOOD_GROUPS.map((group) => (
                      <button
                        key={group}
                        onClick={() => toggleFilter(group, selectedFoodGroups, setSelectedFoodGroups)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedFoodGroups.includes(group) 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Dietary Needs</label>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_RESTRICTIONS.map((res) => (
                      <button
                        key={res}
                        onClick={() => toggleFilter(res, selectedDietary, setSelectedDietary)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedDietary.includes(res) 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:bg-blue-50'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Staple Cuisines</label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINES.map((cuisine) => (
                      <button
                        key={cuisine}
                        onClick={() => toggleFilter(cuisine, selectedCuisines, setSelectedCuisines)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedCuisines.includes(cuisine) 
                            ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200 hover:bg-orange-50'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Shopping List (Optional)</label>
                <textarea 
                  placeholder="e.g. 2kg Apples, 1L Milk, Fresh Bread..."
                  className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none min-h-[120px] resize-none font-medium placeholder:text-slate-300 transition-all"
                  value={shoppingList}
                  onChange={(e) => setShoppingList(e.target.value)}
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={isLoading}
                className={`w-full h-16 rounded-2xl font-black text-white text-lg tracking-wide transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3 ${
                  isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black shadow-xl shadow-slate-200'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Analyzing Markets...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <span>Check Best Prices</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 lg:py-20 min-h-[500px]">
        {error && (
          <div className="max-w-3xl mx-auto bg-red-50 border-2 border-red-100 p-8 rounded-[32px] mb-12 flex items-start space-x-5 animate-in fade-in zoom-in duration-300">
            <div className="bg-red-500 p-3 rounded-2xl shadow-lg shadow-red-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl mb-1">We hit a snag</h3>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {results ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header / Summary */}
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 flex flex-col justify-center">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h2 className="text-4xl font-black text-slate-900">
                  <span className="text-emerald-600">#</span> {selectedCity} Insights
                </h2>
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>Gemini Search Grounding</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-full"></div>
                <p className="text-2xl text-slate-600 font-medium leading-relaxed pl-4">
                  "{results.summary}"
                </p>
              </div>
            </div>

            {/* Shopping Comparison Cards */}
            {results.shoppingComparison && results.shoppingComparison.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="h-px flex-grow bg-slate-200"></div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Store Comparison</h3>
                  <div className="h-px flex-grow bg-slate-200"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.shoppingComparison.map((comp, idx) => (
                    <div key={idx} className={`relative flex flex-col bg-white rounded-[40px] overflow-hidden border-2 transition-all duration-500 hover:-translate-y-2 ${comp.isLowestPrice ? 'border-emerald-500 shadow-2xl shadow-emerald-100 scale-105 z-10' : 'border-slate-100 shadow-sm'}`}>
                      {comp.isLowestPrice && (
                        <div className="absolute top-0 left-0 w-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.3em] text-center py-2.5">
                          🏆 Best Value for your list
                        </div>
                      )}
                      <div className={`p-10 flex flex-col h-full ${comp.isLowestPrice ? 'pt-14' : ''}`}>
                        <div className="flex justify-between items-start mb-8">
                          <h4 className="text-2xl font-black text-slate-900">{comp.storeName}</h4>
                        </div>
                        
                        <div className="space-y-5 mb-10 flex-grow">
                          {comp.items.map((item, iIdx) => (
                            <div key={iIdx} className="group">
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="text-sm font-bold text-slate-800">{item.itemName}</span>
                                <span className="text-sm font-black text-emerald-600">{item.price}</span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.notes || 'In stock'}</p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-6 border-t-2 border-dashed border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Estimated Basket Total</p>
                          <div className="text-5xl font-black text-slate-900 tracking-tight">{comp.totalCost}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Produce & Stores Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Seasonal Produce */}
              <div className="lg:col-span-8 space-y-8">
                <h3 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
                  <span className="p-2 bg-orange-500 rounded-xl text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </span>
                  <span>Featured Deals</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {results.produce.map((item, idx) => (
                    <div key={idx} className="group bg-white p-8 rounded-[32px] border border-slate-100 hover:border-emerald-200 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-slate-900 text-xl group-hover:text-emerald-600 transition-colors">{item.name}</h4>
                        <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black tracking-wider">{item.priceEstimate}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.seasonality.toLowerCase().includes('in') ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.seasonality}</span>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Store Directory */}
              <div className="lg:col-span-4 space-y-8">
                <h3 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
                  <span className="p-2 bg-emerald-950 rounded-xl text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </span>
                  <span>Top Retailers</span>
                </h3>
                <div className="space-y-5">
                  {results.stores.map((store, idx) => (
                    <div key={idx} className="bg-slate-900 text-white p-8 rounded-[32px] relative overflow-hidden group border border-slate-800 hover:bg-black transition-colors">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 -mr-20 -mt-20 rounded-full transition-transform duration-700 group-hover:scale-150"></div>
                      <div className="relative z-10">
                        <span className="inline-block px-2.5 py-1 mb-3 text-[10px] font-black uppercase tracking-widest bg-slate-800 rounded-lg border border-slate-700">{store.category}</span>
                        <h4 className="font-black text-xl mb-3">{store.name}</h4>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{store.highlights}</p>
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          <span>{store.accessibility}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grounding & Sources */}
            <div className="pt-12 border-t border-slate-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Verified Data Sources</h4>
                  <div className="flex flex-wrap gap-3">
                    {results.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-3 px-5 py-3.5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all group"
                      >
                        <svg className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        <span className="text-xs font-black text-slate-600 truncate max-w-[180px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
                {results.searchEntryPoint && (
                  <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50" 
                       dangerouslySetInnerHTML={{ __html: results.searchEntryPoint }} />
                )}
              </div>
            </div>
          </div>
        ) : (
          !isLoading && !error && (
            <div className="text-center py-20 lg:py-40 flex flex-col items-center">
              <div className="w-32 h-32 bg-slate-100 rounded-[40px] flex items-center justify-center mb-10 text-slate-300 animate-pulse">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Ready to shop smart?</h3>
              <p className="text-slate-500 mt-4 max-w-sm mx-auto font-medium">
                Enter your location and list above to see real-time price comparisons and seasonal deals.
              </p>
            </div>
          )
        )}
      </section>
    </Layout>
  );
};

export default App;
