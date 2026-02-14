
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { LOCATION_GROUPS } from './constants';
import { SearchResult } from './types';
import { fetchGroceryData } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>(LOCATION_GROUPS[0].country);
  const [selectedCity, setSelectedCity] = useState<string>(LOCATION_GROUPS[0].cities[0]);
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
      const data = await fetchGroceryData(selectedCity, selectedCountry);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-100 rounded-full">
            Real-time grocery insights
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Find the freshest deals <br />
            <span className="text-emerald-600">in your neighborhood.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop overpaying for groceries. GrocyWise analyzes local pricing and suggests the best supermarkets for your weekly shop.
          </p>

          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center max-w-3xl mx-auto border border-gray-100">
            <div className="w-full md:flex-1 relative group">
              <label className="absolute -top-7 left-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">Country</label>
              <select 
                className="w-full h-14 pl-12 pr-10 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-700 font-medium appearance-none"
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                {LOCATION_GROUPS.map((group) => (
                  <option key={group.country} value={group.country}>
                    {group.country}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="w-full md:flex-1 relative group">
              <label className="absolute -top-7 left-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">City</label>
              <select 
                className="w-full h-14 pl-12 pr-10 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-gray-700 font-medium appearance-none"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`w-full md:w-auto h-14 px-8 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 ${
                isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="whitespace-nowrap">Show Deals</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 min-h-[400px]">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-8 flex items-start space-x-4 shadow-sm animate-in fade-in duration-300">
            <div className="bg-red-100 p-2 rounded-lg">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Search Failed</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {results ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <span className="text-emerald-600">📍</span>
                    <span>Market Overview: {selectedCity}, {selectedCountry}</span>
                  </h2>
                  <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span>Double-checked with Google Search</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg italic">"{results.summary}"</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span>Best Value Produce</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.produce.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors shadow-sm group">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">{item.name}</h4>
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">{item.priceEstimate}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`w-2 h-2 rounded-full ${item.seasonality.toLowerCase().includes('in') ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.seasonality}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-snug">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Top Stores</span>
                </h3>
                <div className="space-y-4">
                  {results.stores.map((store, idx) => (
                    <div key={idx} className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 -mr-16 -mt-16 rounded-full opacity-20 group-hover:scale-110 transition-transform"></div>
                      <div className="relative z-10">
                        <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-700 rounded">{store.category}</span>
                        <h4 className="font-bold text-xl mb-1">{store.name}</h4>
                        <p className="text-emerald-200 text-sm mb-4">{store.highlights}</p>
                        <div className="flex items-center space-x-2 text-xs font-medium bg-white/10 p-2 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>{store.accessibility}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Verified Sources</h4>
                  <div className="flex flex-wrap gap-3">
                    {results.sources.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-xs text-emerald-700 hover:text-emerald-900 font-bold bg-white px-3 py-2 rounded-xl transition-all border border-gray-100 hover:border-emerald-200 hover:shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="truncate max-w-[150px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
                
                {results.searchEntryPoint && (
                  <div className="flex-shrink-0">
                    <div 
                      className="google-search-entry-point bg-white p-4 rounded-2xl border border-blue-50 shadow-sm"
                      dangerouslySetInnerHTML={{ __html: results.searchEntryPoint }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          !isLoading && !error && (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.512a2 2 0 011.553-1.944L9 2l5 2 5-2 4.447 2.224A2 2 0 0121 5.512v9.976a2 2 0 01-1.553 1.944L15 20l-3-2-3 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-400">Ready to save?</h3>
              <p className="text-gray-400 mt-2 text-balance">Choose your location above to discover affordable seasonal produce and top supermarket picks.</p>
            </div>
          )
        )}
      </section>
    </Layout>
  );
};

export default App;
