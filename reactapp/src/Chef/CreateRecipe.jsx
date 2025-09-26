
// ===== Components/CreateRecipe.jsx =====
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRecipe.css';
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState({
    title: '',
    category: '',
    difficulty: '',
    prepTimeInMinutes: 0,
    cookTimeInMinutes: 0,
    servings: 0,
    cuisine: '',
    ingredients: [],
    instructions: [],
    tags: [],
    notes: ''
  });
  const [categories] = useState(['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages', 'Other']);
  const [difficulties] = useState(['Easy', 'Medium', 'Hard']);
  const [cuisines] = useState(['Indian', 'Italian', 'Chinese', 'Mexican', 'American', 'Thai', 'French', 'Mediterranean', 'Other']);
  const [ingredientInput, setIngredientInput] = useState('');
  const [instructionInput, setInstructionInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('editId') || '';
    if (id) {
      setEditId(id);
      fetchRecipe(id);
    }
  }, []);

  async function fetchRecipe(id) {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/recipes/getRecipeById/${id}`, {
        headers: { Authorization: `${token}` }
      });
      const data = res.data;
      setRecipeData(data);
      setIngredientInput((data.ingredients || []).join(', '));
      setInstructionInput((data.instructions || []).join(', '));
      setTagInput((data.tags || []).join(', '));
    } catch {
      navigate('/error');
    }
  }

  function parseIngredients() {
    const arr = ingredientInput.split(',').map(r => r.trim()).filter(Boolean);
    setRecipeData(prev => ({ ...prev, ingredients: arr }));
    validateForm({ ...recipeData, ingredients: arr });
  }

  function parseInstructions() {
    const arr = instructionInput.split(',').map(r => r.trim()).filter(Boolean);
    setRecipeData(prev => ({ ...prev, instructions: arr }));
    validateForm({ ...recipeData, instructions: arr });
  }

  function parseTags() {
    const arr = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    setRecipeData(prev => ({ ...prev, tags: arr }));
  }

  function validateForm(data = recipeData) {
    const v = {};
    if (!data.title) v.title = 'Title is required';
    if (!data.category) v.category = 'Category is required';
    if (!data.difficulty) v.difficulty = 'Difficulty is required';
    if (!data.prepTimeInMinutes || data.prepTimeInMinutes < 1) v.prepTimeInMinutes = 'Prep time must be at least 1 minute';
    if (!data.cookTimeInMinutes || data.cookTimeInMinutes < 1) v.cookTimeInMinutes = 'Cook time must be at least 1 minute';
    if (!data.servings || data.servings < 1) v.servings = 'Servings must be at least 1';
    if (!data.ingredients || !data.ingredients.length) {
      v.ingredients = 'At least one ingredient is required';
    }
    if (!data.instructions || !data.instructions.length) {
      v.instructions = 'At least one instruction is required';
    }
    setErrors(v);
    return Object.keys(v).length === 0;
  }

  async function handleSubmit() {
    parseIngredients();
    parseInstructions();
    parseTags();

    const payload = {
      ...recipeData,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      tags: recipeData.tags
    };

    if (!validateForm(payload)) return;

    try {
      const token = localStorage.getItem('token');
      if (editId) {
        await axios.put(`${apiUrl}/recipes/updateRecipe/${editId}`, payload, {
          headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
        });
      } else {
        const userId = JSON.parse(localStorage.getItem('userData') || '{}').userId;
        await axios.post(`${apiUrl}/recipes/addRecipe`, { ...payload, userId }, {
          headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
        });
      }
      navigate('/manage-recipes');
    } catch {
      navigate('/error');
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setRecipeData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="create-recipe-container">
      <button className="back-button" onClick={() => navigate('/manage-recipes')}>Back</button>
      <h2>{editId ? 'Update Recipe' : 'Add Recipe'}</h2>

      <div className="form-group">
        <label>Title:</label>
        <input name="title" value={recipeData.title} onChange={handleChange} />
        <span className="error-message">{errors.title}</span>
      </div>

      <div className="form-group">
        <label>Category:</label>
        <select name="category" value={recipeData.category} onChange={handleChange}>
          <option value="">Select</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="error-message">{errors.category}</span>
      </div>

      <div className="form-group">
        <label>Difficulty:</label>
        <select name="difficulty" value={recipeData.difficulty} onChange={handleChange}>
          <option value="">Select</option>
          {difficulties.map(d => <option key={d}>{d}</option>)}
        </select>
        <span className="error-message">{errors.difficulty}</span>
      </div>

      <div className="form-group">
        <label>Prep Time (minutes):</label>
        <input type="number" name="prepTimeInMinutes" value={recipeData.prepTimeInMinutes} onChange={handleChange} />
        <span className="error-message">{errors.prepTimeInMinutes}</span>
      </div>

      <div className="form-group">
        <label>Cook Time (minutes):</label>
        <input type="number" name="cookTimeInMinutes" value={recipeData.cookTimeInMinutes} onChange={handleChange} />
        <span className="error-message">{errors.cookTimeInMinutes}</span>
      </div>

      <div className="form-group">
        <label>Servings:</label>
        <input type="number" name="servings" value={recipeData.servings} onChange={handleChange} />
        <span className="error-message">{errors.servings}</span>
      </div>

      <div className="form-group">
        <label>Cuisine:</label>
        <select name="cuisine" value={recipeData.cuisine} onChange={handleChange}>
          <option value="">Select</option>
          {cuisines.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Ingredients (comma-separated):</label>
        <input
          type="text"
          value={ingredientInput}
          onChange={e => setIngredientInput(e.target.value)}
          onBlur={parseIngredients}
        />
        <span className="error-message">{errors.ingredients}</span>
      </div>

      <div className="form-group">
        <label>Instructions (comma-separated):</label>
        <input
          type="text"
          value={instructionInput}
          onChange={e => setInstructionInput(e.target.value)}
          onBlur={parseInstructions}
        />
        <span className="error-message">{errors.instructions}</span>
      </div>

      <div className="form-group">
        <label>Tags (comma-separated):</label>
        <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onBlur={parseTags} />
      </div>

      <div className="form-group">
        <label>Notes:</label>
        <textarea name="notes" value={recipeData.notes} onChange={handleChange} />
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        {editId ? 'Update Recipe' : 'Add Recipe'}
      </button>
    </div>
  );
};

export default CreateRecipe;