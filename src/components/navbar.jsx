import { useState } from 'react';

import HorizontalLine from './horizontalLine';

import {FaCog} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[var(--primary-color)] h-12 w-full">
        <div className='max-w-2xl w-full h-full items-center flex flex-row justify-between mx-auto px-4'>
            {/* Title Section */}
            <div className="text-white text-2xl font-bold">
                MinWeather
            </div>

            {/* Settings Menu */}
            <div className="relative">
                <button
                onClick={toggleMenu}
                className="text-white p-2 rounded focus:outline-none -mr-2"
                >

                    <FaCog style={{ color: 'white', fontSize:'20px'}} />

                </button>

                {/* Overlay when popup is open */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-10"
                    />
                )}

                {/* Popup content */}
                {isOpen && (
                    <div
                        className="fixed inset-0 flex justify-center items-center z-20"
                    >
                        <div className="bg-white py-2 rounded-lg shadow-lg max-w-sm w-full z-21">
                            <div className='flex flex-row justify-between items-center px-4 mb-2'>
                                <h2 className="text-xl">Settings</h2>
                                {/* TODO: insert close icon here*/}
                                <button
                                    onClick={toggleMenu}
                                >
                                    X
                                </button>
                            </div>
                            <HorizontalLine/>
                            <p>This is your popup content.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

    </nav>
  );
};

export default Navbar;