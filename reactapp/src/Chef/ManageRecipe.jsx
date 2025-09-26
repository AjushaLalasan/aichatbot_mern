import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../apiconfig';
import './ManageRecipe.css';

const ManageRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Other'];

  useEffect(() => {
    localStorage.setItem('editId', '');
    fetchRecipes();
  }, [categoryFilter]);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await axios.post(
        `${apiUrl}/recipes/getRecipesByUserId`,
        { userId: userData.userId, category: categoryFilter },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        setRecipes(response.data);
      }
    } catch (err) {
      navigate('/error');
    }
  };

  const handleDeleteClick = (id) => {
    setRecipeToDelete(id);
    setShowDeletePopup(true);
  };

  const deleteRecipe = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${apiUrl}/recipes/deleteRecipe/${recipeToDelete}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        fetchRecipes();
      }
      setShowDeletePopup(false);
    } catch (err) {
      navigate('/error');
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  const logout = () => {
    navigate('/login');
  };

  const navigateToAddRecipe = () => {
    navigate('/createrecipe');
  };

  const editRecipe = (id) => {
    localStorage.setItem('editId', id);
    navigate('/createrecipe');
  };

  return (
    <div className={`products-list ${showDeletePopup ? 'popup-open' : ''}`}>
      <div className={`blur-wrapper ${showDeletePopup ? 'blur-active' : ''}`}>
      <div className="button-group">
          <button className="styledbuttons" onClick={logout}>Logout</button>
          <button className="styledbuttons" onClick={navigateToAddRecipe}>Add Recipe</button>
        </div>

        <h1>Manage Recipes</h1>

        <div className="filters">
          <select
            className="filter-dropdown"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Prep Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td>{recipe.title}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.difficulty}</td>
                  <td>{recipe.prepTimeInMinutes} mins</td>
                  <td>
                    <button className="edit-button" onClick={() => editRecipe(recipe._id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteClick(recipe._id)}>Delete</button>
                    <button className="view-button" onClick={() => setSelectedRecipe(recipe)}>Show More</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="norecord">No recipes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete this recipe?</p>
          <button onClick={deleteRecipe}>Yes, Delete</button>
          <button onClick={cancelDelete}>Cancel</button>
        </div>
      )}

      {selectedRecipe && (
        <div className="delete-popup">
          <h3>{selectedRecipe.title} Details</h3>
          <p><strong>Category:</strong> {selectedRecipe.category}</p>
          <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
          <p><strong>Prep Time:</strong> {selectedRecipe.prepTimeInMinutes} mins</p>
          <p><strong>Cook Time:</strong> {selectedRecipe.cookTimeInMinutes} mins</p>
          <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
          <p><strong>Cuisine:</strong> {selectedRecipe.cuisine}</p>
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
          <p><strong>Tags:</strong> {selectedRecipe.tags?.join(', ')}</p>
          <p><strong>Notes:</strong> {selectedRecipe.notes || 'N/A'}</p>
          <button onClick={() => setSelectedRecipe(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ManageRecipe;