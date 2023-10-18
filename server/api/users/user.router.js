const express = require("express");
const router = express.Router();

const {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    login
} = require("./user.controller");
const { checkToken } = require("./../../auth/token_validation")
// Create a new user
router.post("/signup", createUser);
//login
router.post("/login", login)

// Update a user by ID
router.put("/:id", checkToken, updateUser);

// Delete a user by ID
router.delete("/:id", checkToken, deleteUser);

// Get all users
router.get("/", checkToken, getUsers);

// Get a user by ID
router.get("/:id", checkToken, getUserById);


module.exports = router;
