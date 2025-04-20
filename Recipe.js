import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from './firebase';
import { FaTrash, FaEdit, FaSearch, FaPlus } from 'react-icons/fa';
import './App.css';

function App() {
  // State management
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    steps: '',
    prepTime: '',
    difficulty: 'easy'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch recipes from Firestore
  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipes(recipesData);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
        steps: formData.steps.split('\n').filter(s => s.trim()),
        prepTime: parseInt(formData.prepTime) || 0
      };

      if (editingId) {
        // Update existing recipe
        await updateDoc(doc(db, 'recipes', editingId), recipeData);
      } else {
        // Add new recipe
        await addDoc(collection(db, 'recipes'), recipeData);
      }

      // Reset form and fetch updated list
      setFormData({ name: '', ingredients: '', steps: '', prepTime: '', difficulty: 'easy' });
      setEditingId(null);
      await fetchRecipes();
    } catch (error) {
      console.error("Error saving recipe: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set form for editing
  const handleEdit = (recipe) => {
    setFormData({
      name: recipe.name,
      ingredients: recipe.ingredients.join('\n'),
      steps: recipe.steps.join('\n'),
      prepTime: recipe.prepTime.toString(),
      difficulty: recipe.difficulty || 'easy'
    });
    setEditingId(recipe.id);
    window.scrollTo(0, 0);
  };

  // Delete a recipe
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, 'recipes', id));
        await fetchRecipes();
      } catch (error) {
        console.error("Error deleting recipe: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter recipes by search term
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app">
      <header>
        <h1>My Recipe Box</h1>
      </header>

      <main>
        {/* Recipe Form */}
        <section className="recipe-form">
          <h2>{editingId ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Recipe Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ingredients (one per line)</label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label>Steps (one per line)</label>
              <textarea
                name="steps"
                value={formData.steps}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prep Time (minutes)</label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (editingId ? 'Update Recipe' : 'Add Recipe')}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setFormData({ name: '', ingredients: '', steps: '', prepTime: '', difficulty: 'easy' });
                    setEditingId(null);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Recipe List */}
        <section className="recipe-list">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading && recipes.length === 0 ? (
            <p className="loading">Loading recipes...</p>
          ) : filteredRecipes.length === 0 ? (
            <p className="no-recipes">No recipes found. {searchTerm ? 'Try a different search.' : 'Add your first recipe!'}</p>
          ) : (
            <div className="recipes-grid">
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-header">
                    <h3>{recipe.name}</h3>
                    <div className="recipe-meta">
                      <span className={`difficulty ${recipe.difficulty}`}>
                        {recipe.difficulty}
                      </span>
                      <span className="prep-time">
                        {recipe.prepTime} mins
                      </span>
                    </div>
                  </div>

                  <div className="recipe-content">
                    <h4>Ingredients</h4>
                    <ul>
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>

                    <h4>Steps</h4>
                    <ol>
                      {recipe.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="recipe-actions">
                    <button 
                      onClick={() => handleEdit(recipe)}
                      className="btn btn-edit"
                      disabled={isLoading}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(recipe.id)}
                      className="btn btn-delete"
                      disabled={isLoading}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
