// File: /providers/language-providers.js
"use client";
import React, { createContext, useContext, useState } from 'react';

// Create the language context
const LanguageContext = createContext({
  language: 'english',
  setLanguage: () => {},
});

// Create a provider component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('english');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Create a custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}