import React, { useEffect, useState } from "react";
import axios from "axios";

function AddPromptModal({
  isOpen,
  onClose,
  fetchPrompts,
  editingPrompt
}) {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    prompt_text: "",
    category_id: "",
    ai_score: "",
    favorite: false,
  });

  useEffect(() => {

  if (isOpen) {
    fetchCategories();

    if (editingPrompt) {

      setFormData({
        title: editingPrompt.title,
        prompt_text: editingPrompt.prompt_text,
        category_id: editingPrompt.category_id,
        ai_score: editingPrompt.ai_score,
        favorite: Boolean(editingPrompt.favorite)
      });

    } else {

      setFormData({
        title: "",
        prompt_text: "",
        category_id: "",
        ai_score: "",
        favorite: false
      });

    }
  }

}, [isOpen, editingPrompt]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/categories"
      );

      setCategories(response.data);

    } catch (error) {
      console.error(
        "Error fetching categories:",
        error
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    if (editingPrompt) {

      await axios.put(
        `http://localhost:5000/api/prompts/${editingPrompt.prompt_id}`,
        formData
      );

    } else {

      await axios.post(
        "http://localhost:5000/api/prompts",
        formData
      );

    }

    fetchPrompts();

    onClose();

  } catch (error) {

    console.error(error);

    alert(
      editingPrompt
        ? "Failed to update prompt."
        : "Failed to add prompt."
    );
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>
  {editingPrompt
    ? "Edit Prompt"
    : "Add New Prompt"}
</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="prompt_text"
            placeholder="Prompt Text"
            rows="5"
            value={formData.prompt_text}
            onChange={handleChange}
            required
          />

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category.category_id}
                value={category.category_id}
              >
                {category.category_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="ai_score"
            min="1"
            max="10"
            placeholder="AI Score"
            value={formData.ai_score}
            onChange={handleChange}
            required
          />

          <label className="checkbox-row">

            <input
              type="checkbox"
              name="favorite"
              checked={formData.favorite}
              onChange={handleChange}
            />

            Favorite

          </label>

          <div className="modal-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              {editingPrompt
  ? "Update Prompt"
  : "Save Prompt"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddPromptModal;