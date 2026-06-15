import "./App.css";
import React, {
  useEffect,
  useMemo,
  useState
} from "react";
import axios from "axios";
import AddPromptModal from "./components/AddPromptModal";

function App() {  
  const [prompts, setPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  
  useEffect(() => { fetchPrompts(); }, []);
  
  const fetchPrompts = async () => {
  try { 
    const response = await axios.get( "http://localhost:5000/api/prompts" );
    setPrompts(response.data);}     
    catch (error) {
    console.error("Error fetching prompts:", error); }
};

  const categories = [
  "All",
  "Favorites",
  ...new Set(
    prompts.map(
      (prompt) => prompt.category_name
    )
  )
];

  const toggleFavorite = async (prompt) => {

  try {
    await axios.put(
      `http://localhost:5000/api/prompts/${prompt.prompt_id}`,
      {
        title: prompt.title,
        prompt_text: prompt.prompt_text,
        ai_score: prompt.ai_score,
        favorite: Boolean(prompt.favorite) ? 0 : 1,
        category_id: prompt.category_id
      }
    );

    fetchPrompts();

  } catch (error) {

    console.error(
      "Error updating favorite:",
      error
    );

    alert("Failed to update favorite.");
  }
};

  const deletePrompt = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this prompt?"
  );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      `http://localhost:5000/api/prompts/${id}`
    );

    fetchPrompts();

  } catch (error) {

    console.error(
      "Error deleting prompt:",
      error
    );

    alert("Failed to delete prompt.");
  }
};  

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch =
        prompt.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) || prompt.prompt_text.toLowerCase()
          .includes(searchTerm.toLowerCase());

      let matchesCategory = true;

      if (selectedCategory === "Favorites") {
        matchesCategory = Boolean(prompt.favorite);
      } else if (selectedCategory !== "All") {
        matchesCategory =
          prompt.category_name === selectedCategory;}

      return matchesSearch && matchesCategory;
    });
  }, [prompts, searchTerm, selectedCategory]);

  return (
    <div className="app">

      {/* Header */}
      <div className="header">
        <div>
          <h1>Prompt Library</h1>

          <p>
            {prompts.length} prompts across{" "}
            {categories.length - 2} categories
          </p>
        </div>

        <button className="add-btn"
          onClick={() => {
            setEditingPrompt(null);
            setShowAddModal(true);
          }}
        >
          + Add Prompt
        </button>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search prompts..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="search-input"
        />
      </div>

      {/* Category Chips */}
      <div className="chip-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`chip ${
              selectedCategory === category
                ? "active-chip"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category === "Favorites"
              ? "⭐ Favorites"
              : category}
          </button>
        ))}
      </div>

      {/* Prompt List */}
      <div className="prompt-list">

        {filteredPrompts.length === 0 ? (

          <div className="empty-state">
            <h2>No prompts found</h2>

            <p>
              Try changing your filters or
              add your first prompt.
            </p>
          </div>

        ) : (

          filteredPrompts.map((prompt) => (

            <div
              key={prompt.prompt_id}
              className="prompt-card"
            >

              <div className="card-top">

                <div>

                  <h2>{prompt.title}</h2>

                  <div className="badge-container">

                    <span className="category-badge">
                      {prompt.category_name}
                    </span>

                    <span className="score-badge">
                      Score {prompt.ai_score}
                    </span>

                  </div>

                </div>

              </div>

              <p className="prompt-preview">
                {prompt.prompt_text}
              </p>

              <div className="card-actions">

                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(prompt)}
                >
                  {Boolean(prompt.favorite) ? "⭐" : "☆"}
                </button>

                <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingPrompt(prompt);
                      setShowAddModal(true);
                    }}
                  >
                    ✏ Edit
                  </button>

                <button className="delete-btn"
                  onClick={() => deletePrompt(prompt.prompt_id)}>
                  🗑 Delete
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    <AddPromptModal
  isOpen={showAddModal}
  onClose={() => {
    setShowAddModal(false);
    setEditingPrompt(null);
  }}
  fetchPrompts={fetchPrompts}
  editingPrompt={editingPrompt}
/>
    </div>
    
  );
}

export default App;