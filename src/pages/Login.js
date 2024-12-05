import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase"; 
import { useAuth } from '../config/AuthContext'; 
import { useNavigate } from "react-router-dom"; 
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import "./login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth(); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Inicio de sesión exitoso:", userCredential.user);

      const lastLoginDoc = await getDoc(doc(db, 'Revision', 'fechaUltimoLogin'));
      let previousDate = null;

      if (lastLoginDoc.exists()) {
        const lastLoginData = lastLoginDoc.data();
        previousDate = lastLoginData.fechaNueva ? new Date(lastLoginData.fechaNueva.seconds * 1000) : null;
      }

      const now = new Date();
      await setDoc(doc(db, 'Revision', 'fechaUltimoLogin'), {
        fechaAnterior: previousDate ? previousDate : null,
        fechaNueva: now
      });

      login(); 

      navigate('/admin'); 
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.code === "auth/user-not-found") {
        setErrorMessage("Usuario no encontrado");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Contraseña incorrecta");
      } else {
        setErrorMessage("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Login;