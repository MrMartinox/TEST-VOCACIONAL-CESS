import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BackgroundChanger = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.body.style.background = 'url("https://www.cessuniversidad.com/assets/images/choosing-bg.jpg") no-repeat center center/cover'; 
        break;
      case '/resultados':
        document.body.style.background = 'rgba(22, 34, 57, 0.85)'; 
        break;
        case '/test':
          document.body.style.background = 'url("https://www.cessuniversidad.com/assets/images/choosing-bg.jpg")'; 
          break;
        case '/admin':
          document.body.style.background = 'rgba(22, 34, 57, 0.85)'; 
          break;
      default:
        document.body.style.background = 'url("https://www.cessuniversidad.com/assets/images/choosing-bg.jpg") no-repeat center center/cover'; // Fondo por defecto
    }

    return () => {
      document.body.style.background = ''; 
    };
  }, [location.pathname]);

  return null;
};

export default BackgroundChanger;
