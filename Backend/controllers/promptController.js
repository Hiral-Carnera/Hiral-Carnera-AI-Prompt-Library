const PromptModel = require("../models/promptModel");

exports.getPrompts = (req, res) => {

    PromptModel.getAllPrompts((err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error fetching prompts",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};

exports.createPrompt = (req, res) => {

    const {
        title,
        prompt_text,
        ai_score,
        favorite,
        category_id
    } = req.body;

    if (!title || !prompt_text) {
        return res.status(400).json({ message: "Title and prompt text are required"});
    }

    if (ai_score < 1 || ai_score > 10) {
        return res.status(400).json({ message: "AI score must be between 1 and 10" });
    }

    PromptModel.createPrompt(
        {
            title,
            prompt_text,
            ai_score,
            favorite,
            category_id
        },
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Error creating prompt",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Prompt created successfully",
                prompt_id: result.insertId
            });
        }
    );
};

exports.getPromptById = (req, res) => {

    const { id } = req.params;

    PromptModel.getPromptById(id, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error fetching prompt",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Prompt not found"
            });
        }

        res.status(200).json(results[0]);
    });
};

//Updating a promt 
exports.updatePrompt = (req, res) => {

    const { id } = req.params;

    PromptModel.updatePrompt(id, req.body, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Error updating prompt",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Prompt not found"
            });
        }

        res.status(200).json({
            message: "Prompt updated successfully"
        });
    });
};

exports.deletePrompt = (req, res) => {

    const { id } = req.params;

    PromptModel.deletePrompt(id, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Error deleting prompt",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Prompt not found"
            });
        }

        res.status(200).json({
            message: "Prompt deleted successfully"
        });
    });
};

exports.searchPrompts = (req, res) => {

    const { q } = req.query;

    if (!q) {
        return res.status(400).json({
            message: "Search query is required"
        });
    }

    PromptModel.searchPrompts(q, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Error searching prompts",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
};