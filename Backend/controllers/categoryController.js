const db = require("../config/db");

// Read the categories
exports.getCategories = (req, res) => {
    const sql = "SELECT * FROM category ORDER BY category_id";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching categories",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

// Create a new category
exports.createCategory = (req, res) => {
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const sql =
        "INSERT INTO category (category_name) VALUES (?)";

    db.query(sql, [category_name], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error creating category",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Category created successfully",
            category_id: result.insertId
        });
    });
};

// Update a category
exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const sql =
        "UPDATE category SET category_name = ? WHERE category_id = ?";

    db.query(sql, [category_name, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error updating category",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category updated successfully"
        });
    });
};

// Delete a category
exports.deleteCategory = (req, res) => {
    const { id } = req.params;

    const sql =
        "DELETE FROM category WHERE category_id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error deleting category",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully"
        });
    });
};