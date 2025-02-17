import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import HorizontalLine from './horizontalLine';

import {FaCog} from 'react-icons/fa';

import { LiaToggleOnSolid } from "react-icons/lia";
import { LiaToggleOffSolid } from "react-icons/lia";

import { IconButton } from '@mui/material';



const Navbar = ({isMetric, setIsMetric}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  }

    // Close the modal on escape press
    const handleEscape = (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
    };

  useEffect(() => {
 

    // Add event listener
    window.addEventListener('keydown', handleEscape);
  }, []);


  return (
    <nav className="bg-[var(--primary-color)] h-12 w-full fixed top-0 left-0 z-10">
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
                        className="fixed inset-0 flex justify-center items-center z-20 px-4"
                        onClick={toggleMenu}
                    >
                        <div className="bg-white pt-2 rounded-lg shadow-lg max-w-sm w-full z-21"
                            onClick={(e) => {e.stopPropagation()}}
                            >
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
                            <div
                                className='flex flex-row items-center justify-between pl-4 pr-2'
                            >
                                <p>Metric <span className='text-gray-400'>(vs Imperial)</span></p>
                                {isMetric &&

                                    <IconButton
                                        onClick={() => {setIsMetric(!isMetric)}}
                                    >
                                        <LiaToggleOnSolid size={32}/>
                                    </IconButton>
                                }
                                {!isMetric &&
                                    <IconButton
                                        onClick={() => {setIsMetric(!isMetric)}}
                                    >
                                        <LiaToggleOffSolid size={32}/>
                                    </IconButton>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    </nav>
  );
};
Navbar.propTypes = {
  isMetric: PropTypes.bool.isRequired,
  setIsMetric: PropTypes.func.isRequired,
};

export default Navbar;
