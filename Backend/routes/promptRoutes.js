const express = require("express");

const router = express.Router();

const {
    getPrompts, createPrompt, searchPrompts,  getPromptById, updatePrompt, deletePrompt} = require("../controllers/promptController");

router.get("/", getPrompts);
router.get("/search", searchPrompts);
router.get("/:id", getPromptById);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);
router.post("/", createPrompt);



module.exports = router;

