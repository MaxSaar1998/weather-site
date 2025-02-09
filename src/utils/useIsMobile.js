import { useState, useEffect } from 'react';

const mobileScreenBreakpoint = 768;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= mobileScreenBreakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= mobileScreenBreakpoint);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;