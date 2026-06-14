const db = require("../config/db");

// GEtting all prompts
exports.getAllPrompts = (callback) => {

    const sql = `
        SELECT
            p.prompt_id,
            p.title,
            p.prompt_text,
            p.ai_score,
            p.favorite,
            p.created_at,
            p.category_id,
            c.category_name

        FROM prompt p
        LEFT JOIN category c
        ON p.category_id = c.category_id
        ORDER BY p.prompt_id
    `;

    db.query(sql, callback);
};

//To Get Prompt by ID
exports.getPromptById = (id, callback) => {

    const sql = `
        SELECT
            p.prompt_id,
            p.title,
            p.prompt_text,
            p.ai_score,
            p.favorite,
            p.created_at,
            p.category_id,
            c.category_name
        FROM prompt p
        LEFT JOIN category c
        ON p.category_id = c.category_id
        ORDER BY p.prompt_id;
    `;

    db.query(sql, [id], callback);
};

// Adding PROmt
exports.createPrompt = (promptData, callback) => {

    const sql = `
        INSERT INTO prompt
        (
            title,
            prompt_text,
            ai_score,
            favorite,
            category_id
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            promptData.title,
            promptData.prompt_text,
            promptData.ai_score,
            promptData.favorite,
            promptData.category_id
        ],
        callback
    );
};

//Updating a prompt
exports.updatePrompt = (id, promptData, callback) => {

    const sql = `
        UPDATE prompt
        SET title = ?,
            prompt_text = ?,
            ai_score = ?,
            favorite = ?,
            category_id = ?
        WHERE prompt_id = ?
    `;

    db.query(
        sql,
        [
            promptData.title,
            promptData.prompt_text,
            promptData.ai_score,
            promptData.favorite,
            promptData.category_id,
            id
        ],
        callback
    );
};

//Deleting a prompt
exports.deletePrompt = (id, callback) => {

    db.query(
        "DELETE FROM prompt WHERE prompt_id = ?",
        [id],
        callback
    );
};

//Searching
exports.searchPrompts = (searchTerm, callback) => {

    const sql = `
        SELECT
            p.prompt_id,
            p.title,
            p.prompt_text,
            p.ai_score,
            p.favorite,
            p.created_at,
            c.category_name
        FROM prompt p
        LEFT JOIN category c
        ON p.category_id = c.category_id
        WHERE p.title LIKE ?
           OR c.category_name LIKE ?
        ORDER BY p.prompt_id
    `;

    const keyword = `%${searchTerm}%`;

    db.query(sql, [keyword, keyword], callback);
};