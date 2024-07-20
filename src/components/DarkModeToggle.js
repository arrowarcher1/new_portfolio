import React from 'react';
import { useDarkMode } from './DarkModeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkModeToggle = () => {
    const { isDarkMode, setIsDarkMode } = useDarkMode();

    return (
        <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 transition-colors duration-200"
        >
            {isDarkMode ? (
                <FaSun className="text-yellow-400" />
            ) : (
                <FaMoon className="text-gray-700" />
            )}
        </button>
    );
};

export default DarkModeToggle;