const { create, getUsers, getUserByUserId, updateUser, deleteUser, getUserByEmail } = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require("jsonwebtoken")
module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        create(body, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection Error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: result
            });
        });
    },

    updateUser: (req, res) => {
        const userId = req.params.id; // Assuming you pass the user ID as a route parameter
        const updatedData = req.body;

        updateUser(userId, updatedData, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error or user not found"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "User updated successfully"
            });
        });
    },

    deleteUser: (req, res) => {
        const userId = req.params.id; // Assuming you pass the user ID as a route parameter

        deleteUser(userId, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error or user not found"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "User deleted successfully"
            });
        });
    },

    getUsers: (req, res) => {
        getUsers((err, users) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: users
            });
        });
    },

    getUserById: (req, res) => {
        const userId = req.params.id; // Assuming you pass the user ID as a route parameter

        getUserByUserId(userId, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error or user not found"
                });
            }
            return res.status(200).json({
                success: 1,
                data: user
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        getUserByEmail(body.email, (err, results) => {
            if (err) {
                console.log(err)
            } if (!results) {
                return res.json({
                    success: 0,
                    data: "invalid email or password"
                })
            }
            const result = compareSync(body.password, results.password)
            if (result) {
                results.password = undefined;
                const jsonToken = sign({
                    result: results
                }, "qwe1234", {
                    expiresIn: "1h"
                })
                return res.json({
                    success: 1,
                    message: "login succesfully",
                    token: jsonToken
                })
            } else {
                res.json({
                    success: 0,
                    message: "invalid email or passward",
                })
            }
        })
    }
};
