//useState: permite guardar información en el componente
import React, { useState } from 'react';

//useNavigate: permite redirigir a otra página.
import { useNavigate } from 'react-router-dom';

import users from '../../data/users.json'
import './Home.css';

const Home = () => {

  //Este hook nos permite cambiar de ruta.
  const navigate = useNavigate();

  //Guardo lo que el usuario escribe en los inputs.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Esta función se ejecuta cuando el formulario se envía.
  const handleLogin = (e: React.FormEvent) => {

    e.preventDefault();

    //Buscar el usuario
    const userFound = users.find(
      (user) => user.email === email && user.password === password
    );

    //Si el usauario no existe
    if (!userFound){
      alert('Datos incorrectos');
      return;
    }

    //Guardo en localstore
    localStorage.setItem('rol', userFound.rol);

    //Se redirije segun el rol
    if (userFound.rol === 'laboratorista') navigate('/laboratorista');
    if (userFound.rol === 'director') navigate('/director');

  };

  return (

    <div className="login-container">

        <form className="login-card login-form" onSubmit={handleLogin}>

          <h1>Laboratorio Vial</h1>

          <label htmlFor="mail">E-mail institucional</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password">Contraseña</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)}/>

          <button className="login-btn" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    
  );
};

export default Home;