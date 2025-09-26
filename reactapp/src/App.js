import React from 'react';
import "./App.css";
import Register from './Components/Register';
import Login from './Components/Login';
import { Navigate } from 'react-router-dom';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from './Components/ErrorPage';
import CreateRecipe from './Chef/CreateRecipe';
import ManageRecipe from './Chef/ManageRecipe';
import DisplayRecipes from './Foodie/DisplayRecipes';

function App() {
  return (
   <div>
    <BrowserRouter>
      <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="createrecipe" element={<CreateRecipe />} />
          <Route path="manage-recipes" element={<ManageRecipe />} />
          <Route path="recipe-catalog" element={<DisplayRecipes />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="error" element={<ErrorPage/>} />

        {/* <Route path="*" element={<Navigate to="/user/login" replace />} /> */}
         </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;