import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase'; 
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import "./Admin.css"

const Admin = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    nombre: '',
    edadMin: '', 
    edadMax: '', 
    ciudad: '',
    resultado1: '', 
    resultado2: '', 
  });
  const [fechaUltimoLogin, setFechaUltimoLogin] = useState(null);
  const [nuevosRegistros, setNuevosRegistros] = useState(0); 
  const predefinedCities = ['San Luis Rio Colorado', 'Golfo de Santa Clara', 'Estacion Coahuila', 'Luis B. Sanchez'];

  const options = [
    'Administración', 
    'Arquitectura', 
    'Criminología',
    'Derecho', 
    'Licenciatura en Educación'];

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'formData'));
      const dataList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(dataList);
      setFilteredData(dataList);


      const lastLoginDoc = await getDoc(doc(db, 'Revision', 'fechaUltimoLogin'));
      if (lastLoginDoc.exists()) {
        const lastLoginData = lastLoginDoc.data();
        const fechaAnterior = lastLoginData.fechaAnterior ? new Date(lastLoginData.fechaAnterior.seconds * 1000) : null;
        setFechaUltimoLogin(fechaAnterior);
      if (fechaAnterior) {
        const nuevos = dataList.filter(item => item.fecha?.seconds * 1000 > fechaAnterior.getTime()).length;
        setNuevosRegistros(nuevos);
      }
    }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filterData = () => {
    const { nombre, edadMin, edadMax, resultado1, resultado2, ciudad } = filters;
    const minEdad = edadMin ? parseInt(edadMin, 10) : 0;
    const maxEdad = edadMax ? parseInt(edadMax, 10) : Infinity;
    const filtered = data.filter(item => {
      const matchesNombre = nombre ? item.nombre && item.nombre.toLowerCase().includes(nombre.toLowerCase()) : true;
      const matchesEdad = item.edad && item.edad >= minEdad && item.edad <= maxEdad;
      const matchesResultado1 = resultado1 ? item.resultado && item.resultado[0] === resultado1 : true;
      const matchesResultado2 = resultado2 ? item.resultado && item.resultado[1] === resultado2 : true;
      const matchesCiudad = ciudad === 'Otro'
      ? item.ciudad && !predefinedCities.includes(item.ciudad)
      : ciudad
      ? item.ciudad && item.ciudad === ciudad
      : true;
      return matchesNombre && matchesEdad && matchesResultado1 && matchesResultado2 && matchesCiudad;
    });

    setFilteredData(filtered);
  };
  const clearFilters = () => {
    setFilters({
      nombre: '',
      edadMin: '', 
      edadMax: '', 
      ciudad: '',
      resultado1: '', 
      resultado2: '', 
    });
      setFilteredData(data);
  };
  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return (a.fecha?.seconds || 0) - (b.fecha?.seconds || 0);
      } else {
        return (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0);
      }
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filterNewRecords = () => {
    if (fechaUltimoLogin) {
      const newRecords = data.filter(item => item.fecha?.seconds * 1000 > fechaUltimoLogin.getTime());
      setFilteredData(newRecords);
    } else {
      setFilteredData(data); 
    }
  };

  useEffect(() => {
    filterData();
  }, [filters, data]);

  return (
    <div style={{ color: 'white' }} className="table-container">
       <div className="aviso">
        {fechaUltimoLogin && (
          <p>Desde el <b style={{color:"orange"}}>{fechaUltimoLogin.toLocaleDateString('es-ES')}</b> han habido <b style={{color:"orange"}}>{nuevosRegistros}</b> nuevos registros.</p>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          name="nombre"
          value={filters.nombre}
          onChange={handleFilterChange}
          placeholder="Nombre"
          className="text-input"
          style={{ width: "35%",  }}
        />
        <input
          type="number"
          name="edadMin"
          value={filters.edadMin}
          onChange={handleFilterChange}
          placeholder="Edad mínima"
          className="text-input"
          style={{ width: "10%" }}
        />
        <input
          type="number"
          name="edadMax"
          value={filters.edadMax}
          onChange={handleFilterChange}
          placeholder="Edad máxima"
          className="text-input"
          style={{ width: "10%" }}
        />
  <select
    id="ciudad"
    name="ciudad"
    value={filters.ciudad}
    onChange={handleFilterChange}
    className="select-input"
    style={{ width: "26%", minWidth: "100px" }}

  >

    <option value="">Cualquier CIudad</option>
    <option value="San Luis Rio Colorado">San Luis Rio Colorado</option>
    <option value="Golfo de Santa Clara">Golfo de Santa Clara</option>
    <option value="Estacion Coahuila">Estacion Coahuila</option>
    <option value="Luis B. Sanchez">Luis B. Sanchez</option>
    <option value="Otro">Otro</option>
  </select>
        <button className="order-button" onClick={clearFilters}
            style={{ width: "10.2%", minWidth: "100px" }}

        >
   Limpiar
</button>
      
        <select name="resultado1" value={filters.resultado1} onChange={handleFilterChange} className="select-input">
          <option value="">Cualquier Resultado 1</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}

        </select>

        <select name="resultado2" value={filters.resultado2} onChange={handleFilterChange} className="select-input">
          <option value="">Cualquier Resultado 2</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button onClick={handleSort} className="order-button"
          style={{ alignItems: "flex-end", maxWidth: "10%", minWidth: "200px" }}
        >
          Ordenar por fecha {sortOrder === 'asc' ? '↓' : '↑'}
        </button>
        <button onClick={filterNewRecords} className="order-button"
        style={{ alignItems: "flex-end", maxWidth: "17.5%", minWidth: "200px" }}>Nuevos Registros</button>

      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Fecha</th>
            <th>Resultado 1</th>
            <th>Resultado 2</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.edad}</td>
              <td>{item.correo}</td>
              <td>{item.telefono}</td>
              <td>{item.ciudad}</td>
              <td>{item.fecha && item.fecha.seconds ? new Date(item.fecha.seconds * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Fecha no disponible'}</td>
              <td>{item.resultado && item.resultado.length > 0 ? item.resultado[0] : 'N/A'}</td>
              <td>{item.resultado && item.resultado.length > 1 ? item.resultado[1] : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
