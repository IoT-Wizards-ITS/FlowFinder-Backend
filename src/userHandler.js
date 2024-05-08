const admin = require('firebase-admin');

const registerUserHandler = async (request, h) => {
    try {
        const { email, password } = request.payload;

        // Logic for user registration with Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        const response = h.response({
            status: 'success',
            message: 'User successfully registered',
            data: {
                userId: userRecord.uid,
            },
        });
        response.code(201);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: 'User registration failed',
            error: error.message,
        });
        response.code(500);
        return response;
    }
};

const loginUserHandler = async (request, h) => {
    try {
        const { email, password } = request.payload;

        // Logic for user login with Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);

        // Verify password and create authentication token
        // If successful, return authentication token to user
        // If failed, return error response

        const response = h.response({
            status: 'success',
            message: 'User successfully logged in',
            data: {
                userId: userRecord.uid,
                // Include authentication token here if needed
            },
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: 'User login failed',
            error: error.message,
        });
        response.code(401);
        return response;
    }
};

module.exports = { 
    registerUserHandler, 
    loginUserHandler 
};
