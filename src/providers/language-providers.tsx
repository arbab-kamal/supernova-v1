// First, let's create a language context to share the state between components
// src/contexts/LanguageContext.js
"use client";
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Then modify your ArticleNavbar component to use the context:
// Update to the handleLanguageChange function in ArticleNavbar
const handleLanguageChange = (selectedLanguage) => {
  setLanguage(selectedLanguage.toLowerCase());
  console.log(`Language changed to: ${selectedLanguage}`);
};