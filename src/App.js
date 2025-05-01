import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
    const [remainingTime, setRemainingTime] = useState('');
    const [lapTime, setLapTime] = useState('');
    const [fuelLeft, setFuelLeft] = useState('');
    const [fuelNeeded, setFuelNeeded] = useState(null);
    const [exactFuelNeeded, setExactFuelNeeded] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [darkMode, setDarkMode] = useState(true); // Dark mode is default
    const [language, setLanguage] = useState('de'); // Default language: German
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const languageDropdownRef = useRef(null);

    // Language options
    const languageOptions = {
        de: {
            name: 'Deutsch',
            flag: '🇩🇪'
        },
        en: {
            name: 'English',
            flag: '🇬🇧'
        }
    };

    // Translations
    const translations = {
        de: {
            title: 'Fuel Calculator',
            subtitle: 'Berechne den benötigten Kraftstoff für dein Rennen',
            infoTooltip: 'Alle Ergebnisse werden in Runden angegeben.',
            remainingTimeLabel: 'Verbleibende Zeit (MM:SS):',
            lapTimeLabel: 'Rundenzeit (MM:SS):',
            fuelLeftLabel: 'Verbleibender Sprit (Runden):',
            emptyFieldsError: 'Bitte füllen Sie alle Felder aus',
            timeFormatError: 'Zeitformat muss MM:SS sein (z.B. 20:00)',
            lapTimeZeroError: 'Rundenzeit kann nicht 0 sein',
            calculateButton: 'Berechnen',
            resetButton: 'Zurücksetzen',
            fuelNeededLabel: 'Benötigter Sprit:',
            withSafetyLabel: 'Mit Sicherheitsrunde:',
            enoughFuelMessage: 'Du hast genug Kraftstoff!',
            safetyLapMessage: 'Der empfohlene Wert enthält eine zusätzliche Sicherheitsrunde.',
            rounds: 'Runden'
        },
        en: {
            title: 'Fuel Calculator',
            subtitle: 'Calculate the fuel needed for your race',
            infoTooltip: 'All results are shown in laps.',
            remainingTimeLabel: 'Remaining Time (MM:SS):',
            lapTimeLabel: 'Lap Time (MM:SS):',
            fuelLeftLabel: 'Remaining Fuel (Laps):',
            emptyFieldsError: 'Please fill in all fields',
            timeFormatError: 'Time format must be MM:SS (e.g. 20:00)',
            lapTimeZeroError: 'Lap time cannot be zero',
            calculateButton: 'Calculate',
            resetButton: 'Reset',
            fuelNeededLabel: 'Fuel Needed:',
            withSafetyLabel: 'With Safety Lap:',
            enoughFuelMessage: 'You have enough fuel!',
            safetyLapMessage: 'The recommended value includes an additional safety lap.',
            rounds: 'Laps'
        }
    };

    // Get current texts based on selected language
    const t = translations[language];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setLanguageDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Apply dark mode class to body when component mounts or mode changes
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';

        // Cleanup function to restore scrolling if component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [darkMode]);

    const validateTimeFormat = (timeStr) => {
        // Check if format is MM:SS
        const regex = /^\d{1,2}:\d{2}$/;
        return regex.test(timeStr);
    };

    const convertToSeconds = (timeStr) => {
        if (!validateTimeFormat(timeStr)) return 0;
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes * 60 + seconds;
    };

    const calculateFuel = () => {
        setErrorMessage('');

        // Validate inputs
        if (!remainingTime || !lapTime || fuelLeft === '') {
            setErrorMessage(t.emptyFieldsError);
            return;
        }

        if (!validateTimeFormat(remainingTime) || !validateTimeFormat(lapTime)) {
            setErrorMessage(t.timeFormatError);
            return;
        }

        const remainingTimeInSec = convertToSeconds(remainingTime);
        const lapTimeInSec = convertToSeconds(lapTime);

        if (lapTimeInSec === 0) {
            setErrorMessage(t.lapTimeZeroError);
            return;
        }

        const remainingLaps = remainingTimeInSec / lapTimeInSec;
        const exactNeeded = Math.max(0, remainingLaps - parseFloat(fuelLeft));
        const requiredFuel = Math.ceil(exactNeeded) + 1; // +1 for safety round

        // Format to 2 decimal places
        setExactFuelNeeded(exactNeeded.toFixed(2));
        setFuelNeeded(requiredFuel);
    };

    const resetForm = () => {
        setRemainingTime('');
        setLapTime('');
        setFuelLeft('');
        setFuelNeeded(null);
        setExactFuelNeeded(null);
        setErrorMessage('');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleLanguageDropdown = () => {
        setLanguageDropdownOpen(!languageDropdownOpen);
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        setLanguageDropdownOpen(false);
    };

    return (
        <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="app-controls">
                <div className="language-dropdown-container" ref={languageDropdownRef}>
                    <button
                        onClick={toggleLanguageDropdown}
                        className="language-dropdown-button"
                    >
                        {languageOptions[language].flag} {languageOptions[language].name} ▼
                    </button>

                    {languageDropdownOpen && (
                        <div className="language-dropdown-menu">
                            {Object.keys(languageOptions).map(lang => (
                                lang !== language && (
                                    <button
                                        key={lang}
                                        className="language-option"
                                        onClick={() => changeLanguage(lang)}
                                    >
                                        {languageOptions[lang].flag} {languageOptions[lang].name}
                                    </button>
                                )
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={toggleDarkMode} className="theme-toggle-button">
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>

            <div className="calculator-container">
                <h1>{t.title}</h1>
                <div className="subtitle-container">
                    <p className="subtitle">{t.subtitle}</p>
                    <div className="tooltip-container">
                        <span className="info-icon">ℹ️</span>
                        <div className="tooltip">
                            {t.infoTooltip}
                        </div>
                    </div>
                </div>

                <div className="input-field">
                    <label>{t.remainingTimeLabel}</label>
                    <input
                        type="text"
                        value={remainingTime}
                        onChange={(e) => setRemainingTime(e.target.value)}
                        placeholder="20:00"
                    />
                </div>

                <div className="input-field">
                    <label>{t.lapTimeLabel}</label>
                    <input
                        type="text"
                        value={lapTime}
                        onChange={(e) => setLapTime(e.target.value)}
                        placeholder="2:00"
                    />
                </div>

                <div className="input-field">
                    <label>{t.fuelLeftLabel}</label>
                    <input
                        type="number"
                        value={fuelLeft}
                        onChange={(e) => setFuelLeft(e.target.value)}
                        placeholder="10.0"
                    />
                </div>

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                <div className="button-group">
                    <button className="calculate-button" onClick={calculateFuel}>
                        {t.calculateButton}
                    </button>
                    <button className="reset-button" onClick={resetForm}>
                        {t.resetButton}
                    </button>
                </div>

                {exactFuelNeeded !== null && (
                    <div className="result-container">
                        <div className="result-row">
                            <h3>{t.fuelNeededLabel}</h3>
                            <p className="value">
                                {exactFuelNeeded} <span className="rounded-value">({Math.ceil(parseFloat(exactFuelNeeded))})</span> {t.rounds}
                            </p>
                        </div>

                        <div className="result-row safe-row">
                            <h3>{t.withSafetyLabel}</h3>
                            <p className="value">{fuelNeeded} {t.rounds}</p>
                        </div>

                        <p className="result-note">
                            {exactFuelNeeded <= 0 ?
                                t.enoughFuelMessage :
                                t.safetyLapMessage}
                        </p>
                    </div>
                )}
            </div>

            <div className="footer">
                Fuel Calculator v1.0 | {new Date().getFullYear()}
            </div>
        </div>
    );
}

export default App;
