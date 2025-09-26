import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../apiconfig';
import './DisplayRecipes.css';
import { useNavigate } from 'react-router-dom';

const DisplayRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [sortOrder]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get(`${apiUrl}/user/getAllUsers`, {
        headers: { Authorization: `${token}` },
      });

      const recipeResponse = await axios.post(
        `${apiUrl}/recipes/getAllRecipes`,
        { sortOrder },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const users = userResponse.data.users;
      const updatedRecipes = recipeResponse.data.map((recipe) => {
        const user = users.find((u) => u._id === recipe.userId);
        return {
          ...recipe,
          userName: user ? `${user.firstName} ${user.lastName}` : '',
          userEmail: user?.email || '',
          userPhone: user?.mobileNumber || '',
        };
      });

      setRecipes(updatedRecipes);
    } catch (error) {
      console.error(error);
      navigate('/error');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="product-list-container">
      <button className="styledbutton" onClick={handleLogout}>Logout</button>
      <h1>Recipe Catalog</h1>

      <div className="filter-section">
        <select value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))}>
          <option value={1}>Sort by Prep Time (ASC)</option>
          <option value={-1}>Sort by Prep Time (DESC)</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Prep Time (mins)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <tr key={index}>
              <td>{recipe.title}</td>
              <td>{recipe.category}</td>
              <td>{recipe.difficulty}</td>
              <td>{recipe.prepTimeInMinutes}</td>
              <td>
                <button onClick={() => { setSelectedRecipe(recipe); setShowPopup(true); }}>
                  View Info
                </button>
              </td>
            </tr>
          ))}
          {recipes.length === 0 && (
            <tr>
              <td colSpan="5" className="norecord">No recipes found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showPopup && selectedRecipe && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => { setShowPopup(false); setSelectedRecipe(null); }}>&times;</span>
            <h2>{selectedRecipe.title} Details</h2>
            <p><strong>Category:</strong> {selectedRecipe.category}</p>
            <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
            <p><strong>Cuisine:</strong> {selectedRecipe.cuisine}</p>
            <p><strong>Prep Time:</strong> {selectedRecipe.prepTimeInMinutes} mins</p>
            <p><strong>Cook Time:</strong> {selectedRecipe.cookTimeInMinutes} mins</p>
            <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
            <p><strong>Ingredients:</strong></p>
            <ul>
              {selectedRecipe.ingredients?.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
            <p><strong>Instructions:</strong></p>
            <ol>
              {selectedRecipe.instructions?.map((instruction, i) => (
                <li key={i}>{instruction}</li>
              ))}
            </ol>
            <p><strong>Tags:</strong> {selectedRecipe.tags?.join(', ') || 'N/A'}</p>
            <p><strong>Notes:</strong> {selectedRecipe.notes || 'N/A'}</p>
            <p><strong>Added By:</strong> {selectedRecipe.userName}</p>
            <p><strong>Email:</strong> {selectedRecipe.userEmail}</p>
            <p><strong>Phone:</strong> {selectedRecipe.userPhone}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayRecipes;