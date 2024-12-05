import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from '../config/firebase'; 
import { useNavigate } from 'react-router-dom';

function Home() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    edad: '',
    ciudad: '',
    telefono: '',
    fecha: new Date()
  });
  const [showCustomCity, setShowCustomCity] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "edad") {
      if (value === '' || (Number(value) > 0 && !isNaN(value))) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      }
    } else if (name === "telefono") {
      const rawValue = value.replace(/\D/g, '');
      if (rawValue.length <= 10) {
        const formattedValue = rawValue
          .replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
          .trim();
        setFormData((prevData) => ({
          ...prevData,
          [name]: formattedValue
        }));
      }
    } else if (name === "ciudad") {
      setFormData((prevData) => ({
        ...prevData,
        ciudad: value
      }));
      setShowCustomCity(value === "Otro");
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true); 
    setErrorMessage('');
    
    try {
      const dataToSave = {
        ...formData,
        ciudad: showCustomCity ? formData.ciudadPersonalizada : formData.ciudad
      };
      await addDoc(collection(db, 'formData'), dataToSave);
      console.log('Datos enviados exitosamente');
      setSuccessMessage('¡Datos enviados exitosamente!');
      navigate('/test', { state: { correo: formData.correo, nombre: formData.nombre } });
      setFormData({
        nombre: '',
        correo: '',
        edad: '',
        ciudad: '',
        telefono: '',
        ciudadPersonalizada: ''
      });
    } catch (error) {
      console.error('Error al enviar los datos: ', error);
      setErrorMessage('Error al enviar los datos. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="f-container">
      <form className="for" onSubmit={handleSubmit}>
        <h2 className='formutitu'>Formulario:</h2>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <label htmlFor="correo">Correo:</label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />

        <div className="input-group">
          <div>
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              maxLength="12"
              required
            />
          </div>

          <div>
            <label htmlFor="edad">Edad:</label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label htmlFor="ciudad">Ciudad:</label>
        <select
          id="ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          required
          className='seleccion'
        >
          <option value="">Seleccione una ciudad</option>
          <option value="San Luis Rio Colorado">San Luis Rio Colorado</option>
          <option value="Golfo de Santa Clara">Golfo de Santa Clara</option>
          <option value="Estacion Coahuila">Estacion Coahuila</option>
          <option value="Luis B. Sanchez">Luis B. Sanchez</option>
          <option value="Otro">Otro</option>
        </select>

        {showCustomCity && (
          <input
            type="text"
            id="ciudadPersonalizada"
            name="ciudadPersonalizada"
            placeholder="Escriba su ciudad"
            value={formData.ciudadPersonalizada}
            onChange={handleChange}
            required
            style={{ marginTop: "0rem" }}
          />
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default Home;
