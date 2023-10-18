const pool = require("./../../config/database");

module.exports = {
    create: (data, callback) => {
        const {
            firstname,
            lastname,
            username,
            password,
            email,
            date_of_birth,
            is_admin,
            phone_number
        } = data;

        // Check for duplicate users by email
        const checkDuplicateQuery = `
            SELECT * FROM Registration
            WHERE email = ? OR phone_number = ?`;

        const checkDuplicateValues = [email, phone_number];

        pool.query(checkDuplicateQuery, checkDuplicateValues, (error, duplicateResults) => {
            if (error) {
                return callback(error);
            }

            if (duplicateResults.length > 0) {
                // A user with the same email or phone number already exists
                return callback("User with the same email or phone number already exists");
            } else {
                // No duplicate user found, proceed with registration

                const registrationQuery = `
                    INSERT INTO Registration (
                        firstname,
                        lastname,
                        username,
                        password,
                        email,
                        date_of_birth,
                        is_admin,
                        phone_number,
                        registration_date  -- Include registration_date column
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;  // Set registration_date to the current timestamp

                const registrationValues = [
                    firstname,
                    lastname,
                    username,
                    password,
                    email,
                    date_of_birth,
                    is_admin,
                    phone_number
                ];

                pool.query(registrationQuery, registrationValues, (error, registrationResults, fields) => {
                    if (error) {
                        return callback(error);
                    }

                    // Check if is_admin is true
                    if (is_admin) {
                        const adminQuery = `
                            INSERT INTO Admin (
                                registration_id,
                                username,
                                password,
                                email,
                                firstname,
                                lastname,
                                registration_date,
                                phone_number,
                                is_super_admin
                            ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`;

                        const adminValues = [
                            registrationResults.insertId,
                            username,
                            password,
                            email,
                            firstname,
                            lastname,
                            phone_number,
                            true
                        ];

                        // Insert into the Admin table
                        pool.query(adminQuery, adminValues, (adminError, adminResults, adminFields) => {
                            if (adminError) {
                                return callback(adminError);
                            }

                            // Retrieve the admin_id for the newly inserted admin
                            const adminId = adminResults.insertId;

                            // Update the registration entry with the admin_id
                            const updateRegistrationQuery = `
                                UPDATE Registration SET admin_id = ? WHERE registration_id = ?`;

                            const updateRegistrationValues = [adminId, registrationResults.insertId];

                            pool.query(updateRegistrationQuery, updateRegistrationValues, (updateError) => {
                                if (updateError) {
                                    return callback(updateError);
                                }
                                return callback(null, registrationResults);
                            });
                        });
                    } else {
                        return callback(null, registrationResults);
                    }
                });
            }
        });
    },


    updateUser: (userId, updatedData, callback) => {
        const {
            firstname,
            lastname,
            username,
            password,
            email,
            date_of_birth,
            is_admin,
            phone_number
        } = updatedData;

        const updateUserQuery = `
            UPDATE Registration
            SET firstname = ?,
                lastname = ?,
                username = ?,
                password = ?,
                email = ?,
                date_of_birth = ?,
                is_admin = ?,
                phone_number = ?
            WHERE registration_id = ?`;

        const updateUserValues = [
            firstname,
            lastname,
            username,
            password,
            email,
            date_of_birth,
            is_admin,
            phone_number,
            userId
        ];

        pool.query(updateUserQuery, updateUserValues, (error, updateResults, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, updateResults);
        });

    },
    deleteUser: (userId, callback) => {
        const deleteUserQuery = `
            DELETE FROM Registration
            WHERE registration_id = ?`;

        pool.query(deleteUserQuery, [userId], (error, deleteResults, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, deleteResults);
        });
    },

    getUsers: (callback) => {
        const getUsersQuery = `
        SELECT registration_id,firstname,lastname,email,phone_number FROM Registration`;
        pool.query(getUsersQuery, [], (error, usersResults, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, usersResults);
        });
    },
    getUserByUserId: (userId, callback) => {
        const getUserQuery = `
            SELECT registration_id, firstname, lastname, email, phone_number 
            FROM Registration 
            WHERE Registration = ?`;

        pool.query(getUserQuery, [userId], (error, userResults, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, userResults[0]);
        });
    },
    getUserByEmail: (email, callback) => {
        const getUserQuery = `
            SELECT *
            FROM Registration 
            WHERE email = ?`;

        pool.query(getUserQuery, [email], (error, userResults, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, userResults[0]);
        });
    },

};
