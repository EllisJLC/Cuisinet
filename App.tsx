
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { LOCATION_GROUPS } from './constants';
import { SearchResult } from './types';
import { fetchGroceryData } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>(LOCATION_GROUPS[0].country);
  const [selectedCity, setSelectedCity] = useState<string>(LOCATION_GROUPS[0].cities[0]);
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

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGroceryData(selectedCity, selectedCountry, shoppingList);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-100 rounded-full">
            Real-time grocery insights
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Find the freshest deals <br />
            <span className="text-emerald-600">in your neighborhood.</span>
          </h1>
          
          <div className="bg-white p-6 rounded-3xl shadow-2xl space-y-6 border border-gray-100 max-w-3xl mx-auto text-left">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Country Selector */}
              <div className="flex-1 relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Country</label>
                <div className="relative group">
                  <select 
                    className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-100 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none appearance-none font-semibold transition-all cursor-pointer"
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                  >
                    {LOCATION_GROUPS.map((group) => (
                      <option key={group.country} value={group.country} className="text-gray-900 bg-white">
                        {group.country}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-emerald-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* City Selector */}
              <div className="flex-1 relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">City</label>
                <div className="relative group">
                  <select 
                    className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-100 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none appearance-none font-semibold transition-all cursor-pointer"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city} className="text-gray-900 bg-white">
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-emerald-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Shopping List (Optional)</label>
              <textarea 
                placeholder="Example: 2kg apples, 1L whole milk, 500g chicken breast..."
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none min-h-[100px] resize-none font-medium placeholder:text-gray-300 transition-all"
                value={shoppingList}
                onChange={(e) => setShoppingList(e.target.value)}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`w-full h-14 rounded-2xl font-bold text-white transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-2 ${
                isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Searching Markets...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <span>Find Best Deals</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 min-h-[400px]">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl mb-8 flex items-start space-x-4 shadow-sm animate-in fade-in duration-300">
            <div className="bg-red-100 p-2 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div><h3 className="font-bold text-lg">Search Failed</h3><p>{error}</p></div>
          </div>
        )}

        {results ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <span className="text-emerald-600">📍</span>
                  {selectedCity}, {selectedCountry}
                </h2>
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold border border-blue-100">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>Live Search Grounding Enabled</span>
                </div>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-emerald-500 pl-6">"{results.summary}"</p>
            </div>

            {/* Shopping List Comparison */}
            {results.shoppingComparison && results.shoppingComparison.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 px-2">
                  <span className="bg-emerald-600 text-white p-2 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></span>
                  Shopping List Comparison
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.shoppingComparison.map((comp, idx) => (
                    <div key={idx} className={`relative flex flex-col bg-white rounded-[32px] overflow-hidden border transition-all ${comp.isLowestPrice ? 'border-emerald-500 ring-4 ring-emerald-50 shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-sm'}`}>
                      {comp.isLowestPrice && (
                        <div className="absolute top-0 left-0 w-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] text-center py-2">
                          Best Total Value
                        </div>
                      )}
                      <div className={`p-8 ${comp.isLowestPrice ? 'pt-10' : ''}`}>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">{comp.storeName}</h4>
                        <div className="space-y-4 mb-8">
                          {comp.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex justify-between items-start gap-2 border-b border-gray-50 pb-3">
                              <div>
                                <div className="text-sm font-bold text-gray-800">{item.itemName}</div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold">{item.notes}</div>
                              </div>
                              <div className="text-sm font-black text-emerald-600 whitespace-nowrap">{item.price}</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-100">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Total</div>
                          <div className="text-4xl font-black text-gray-900">{comp.totalCost}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 px-2">
                  <span className="bg-orange-500 text-white p-2 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></span>
                  Best Value Produce
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.produce.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-emerald-200 transition-all shadow-sm hover:shadow-md group">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700">{item.name}</h4>
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-black">{item.priceEstimate}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`w-2 h-2 rounded-full ${item.seasonality.toLowerCase().includes('in') ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.seasonality}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 px-2">
                  <span className="bg-emerald-900 text-white p-2 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></span>
                  Top Stores
                </h3>
                <div className="space-y-4">
                  {results.stores.map((store, idx) => (
                    <div key={idx} className="bg-emerald-950 text-white p-8 rounded-[32px] shadow-lg relative overflow-hidden group border border-emerald-900">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 -mr-16 -mt-16 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="relative z-10">
                        <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-black uppercase tracking-widest bg-emerald-800 rounded">{store.category}</span>
                        <h4 className="font-bold text-xl mb-2">{store.name}</h4>
                        <p className="text-emerald-200/80 text-sm mb-6 leading-relaxed">{store.highlights}</p>
                        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-black/20 p-3 rounded-2xl border border-white/5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          <span>{store.accessibility}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
                <div className="flex-1">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Verified Live Data Sources</h4>
                  <div className="flex flex-wrap gap-3">
                    {results.sources.map((source, idx) => (
                      <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs text-emerald-700 font-bold bg-white px-5 py-3 rounded-2xl border border-gray-100 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        <span className="truncate max-w-[200px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
                {results.searchEntryPoint && (
                  <div className="flex-shrink-0 max-w-sm">
                    <div className="bg-white p-6 rounded-[32px] border border-blue-50 shadow-2xl shadow-blue-100/50" dangerouslySetInnerHTML={{ __html: results.searchEntryPoint }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          !isLoading && !error && (
            <div className="text-center py-32 flex flex-col items-center">
              <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <svg className="w-16 h-16 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-gray-300 uppercase tracking-widest">Ready to save?</h3>
              <p className="text-gray-400 mt-4 max-w-md mx-auto">Select a location and optionally enter your shopping list to see price comparisons between top stores.</p>
            </div>
          )
        )}
      </section>
    </Layout>
  );
};

export default App;
