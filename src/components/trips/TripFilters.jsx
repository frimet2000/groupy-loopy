import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const TripFilters = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ניהול ה-State המקומי של הטופס
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');

  // רשימת מדינות (אפשר להוסיף כאן עוד או למשוך מה-DB)
  const countries = [
    { value: 'Israel', label: 'ישראל 🇮🇱' },
    { value: 'USA', label: 'ארה"ב 🇺🇸' },
    { value: 'Greece', label: 'יוון 🇬🇷' },
    { value: 'Italy', label: 'איטליה 🇮🇹' },
    { value: 'France', label: 'צרפת 🇫🇷' }
  ];

  // לוגיקת "ישראל תחילה" בטעינה ראשונה
  useEffect(() => {
    const currentCountry = searchParams.get('country');
    if (!currentCountry) {
      const isIsraeli = navigator.language.includes('he') || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Jerusalem';
      if (isIsraeli) {
        setCountry('Israel');
        executeSearch('Israel', query);
      }
    }
  }, []);

  const executeSearch = (selectedCountry, selectedQuery) => {
    // עדכון ה-URL (חשוב ל-SEO ולגוגל)
    const newParams = {};
    if (selectedQuery) newParams.q = selectedQuery;
    if (selectedCountry) newParams.country = selectedCountry;
    
    setSearchParams(newParams);

    // הפעלת החיפוש האמיתי (שמגיע מה-Props)
    if (onSearch) {
      onSearch({ q: selectedQuery, country: selectedCountry });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // מניעת ריענון דף
    executeSearch(country, query);
  };

  return (
    <form className="trip-filters-form" onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      
      {/* 1. תיבת חיפוש טקסט */}
      <input 
        type="text" 
        placeholder="חפש טיול..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="filter-input"
      />

      {/* 2. רשימת מדינות (Dropdown) */}
      <select 
        value={country} 
        onChange={(e) => setCountry(e.target.value)}
        className="filter-select"
      >
        <option value="">כל המדינות</option>
        {countries.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      {/* 3. כפתור חיפוש (Submit) */}
      <button type="submit" className="search-button">
        חפש 🔍
      </button>

    </form>
  );
};

export default TripFilters;