import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Results.css";
import { info } from '../assets/areasinfo';

const Results = () => {
  const location = useLocation();
  const resultados = location.state?.resultados || [];
  const correo = location.state?.correo;
  const nombre = location.state?.nombre;
  const navigate = useNavigate();

  useEffect(() => {
    if (!correo || !nombre) {
      navigate('/');
    }
  }, [correo, nombre, navigate]);

  return (
    <div className="RBox">
      <h1 className='tituloRes'>¡Hola {nombre}!, estos son tus resultados:</h1>
      <div className="resultados">
        {resultados.map((resultado, index) => {
          const carreraInfo = info.find(item => item.carrera === resultado.carrera);
          return (
            <div key={index} className="resultscontainer">
              <div className="descripcion">
                <h3 className="carreras">Licenciatura en  <b style={{color: "#f5a425"}}>{resultado.carrera}</b></h3>
              <h2 className='perfili'>Perfil de ingreso</h2>
                <p className="descpcarrera">
                  {carreraInfo?.descp || "Descripción no disponible."}
                </p>
                  <p className="porcentaje">
                  Con el <b style={{color: "#f5a425"}}>{resultado.porcentaje}%</b> de las respuestas positivas.
                </p>
              </div>
              <div className="imagen">
                <img
                  src={carreraInfo?.imagenUrl || "https://via.placeholder.com/150"}
                  alt={resultado.carrera}
                />
              </div>
            </div>
          );
        })}
        <p className="descripcionRes">
          Para más información sobre las carreras y sus perfiles de egreso, puedes consultar nuestra página de
          <b> <a href='https://www.cessuniversidad.com/menulic.html' className='leermas' >Oferta Educativa.</a> </b>,
          también encontrarás la maya curricular y el plan de estudios de cada licenciatura.
        </p>
      </div>
    </div>
  );
};

export default Results;
