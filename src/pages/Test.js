import React, { useState, useEffect } from 'react';
import "./Test.css";
import { data } from '../assets/questions';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

function Test() {
  const db = getFirestore();
  const location = useLocation();
  const correo = location.state?.correo;
  const nombre = location.state?.nombre;
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();


  useEffect(() => {
    if (!correo || !nombre) {
      navigate('/'); 
    }
  }, [correo, nombre, navigate]);

  const handleAnswer = (id, carrera, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { carrera, answer },
    }));
  };

  const actualizarResultadoEnFirestore = async (correo, carreras) => {
    try {
      const q = query(collection(db, 'formData'), where('correo', '==', correo));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { resultado: carreras });
        console.log('Resultado actualizado correctamente');
      } else {
        console.error('No se encontró ningún documento con ese correo');
      }
    } catch (error) {
      console.error('Error al actualizar el resultado:', error);
    }
  };

  const calcularResultados = () => {
    
    const counts = data.reduce((acc, question) => {
      const response = answers[question.id];
      if (response && response.answer === 'me-interesa') {
        acc[response.carrera] = (acc[response.carrera] || 0) + 1;
      }
      return acc;
    }, {});

    const carrerasOrdenadas = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    // Calcular porcentaje de cada carrera
    const totalVotos = carrerasOrdenadas.reduce((acc, [, votos]) => acc + votos, 0);
    const resultadosConPorcentaje = carrerasOrdenadas.slice(0, 2).map(([carrera, votos]) => ({
      carrera,
      porcentaje: ((votos / totalVotos) * 100).toFixed(2), // 2 decimales
    }));

    const carrerasParaFirestore = carrerasOrdenadas.slice(0, 2).map(([carrera]) => carrera);

    return { resultadosConPorcentaje, carrerasParaFirestore };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si todas las preguntas están respondidas
    const allAnswered = data.every((question) => answers[question.id]?.answer);
    if (!allAnswered) {
      setError("Por favor, responde todas las preguntas antes de enviar.");
      return;
    }

    setError(""); 
    setIsSubmitting(true); 

    const { resultadosConPorcentaje, carrerasParaFirestore } = calcularResultados();

    // Actualizar resultado en Firestore
    if (correo) {
      await actualizarResultadoEnFirestore(correo, carrerasParaFirestore);
    } else {
      console.error('Correo no proporcionado');
    }

    navigate('/resultados', {
      state: {
        resultados: resultadosConPorcentaje,
        correo: correo,
        nombre: nombre,
      },
    });

    setIsSubmitting(false); 
  };

  return (
    <div className="test-container">
      <h1 className="titulo">¡Hola {nombre}!</h1>
      <form onSubmit={handleSubmit} className="cuestionario">
        <h2 className='subtitulo'>Responde con honestidad si te interesa:</h2>
        {data.map((question) => (
          <div key={question.id} className="pregunta">
            <p>{question.text}</p>
            <label>
              <input
                type="radio"
                name={`question-${question.id}`}
                value="me-interesa"
                onChange={() => handleAnswer(question.id, question.carrera, 'me-interesa')}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name={`question-${question.id}`}
                value="no-me-interesa"
                onChange={() => handleAnswer(question.id, question.carrera, 'no-me-interesa')}
              />
              No
            </label>
          </div>
        ))}
        {error && <p className="error-message">{error}</p>} {/* Mostrar errores */}
        <button className="boton" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default Test;
