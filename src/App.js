import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.js';
import Footer from './components/Footer';
import NavBar from './components/NavBar.js';
import Test from './pages/Test.js';
import Results from './pages/Results.js';
import Admin from './pages/Admin.js';
import Login from './pages/Login.js';
import { AuthProvider } from './config/AuthContext';
import PrivateRoute from './config/PrivateRoute';
import BackgroundChanger from './components/backgroundChanger';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <BackgroundChanger />

        <div className="wrapper">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/test" element={<Test />} />
            <Route path="/resultados" element={<Results />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
