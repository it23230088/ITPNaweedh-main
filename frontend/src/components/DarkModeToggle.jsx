// src/components/DarkModeToggle.jsx
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setDarkMode(JSON.parse(savedMode));
            document.body.classList.add(savedMode === 'true' ? 'dark' : 'light');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        const mode = !darkMode ? 'dark' : 'light';
        document.body.classList.remove(darkMode ? 'dark' : 'light');
        document.body.classList.add(mode);
        localStorage.setItem('darkMode', !darkMode);
    };

    return (
        <button onClick={toggleDarkMode} className="text-2xl">
            {darkMode ? <FaSun className='text-yellow-500' /> : <FaMoon />}
        </button>
    );
};

export default DarkModeToggle;
