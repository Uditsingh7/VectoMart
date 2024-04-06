import express from 'express'; // importing the express lib
import { router as adminRouter } from './routes/adminRoutes';
import { router as userRouter } from './routes/userRoutes';
import { router as authRouter } from './routes/authRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { verifyToken } from './utils/jwtAuth';
import sequelize from './database/sequelize';
import { requiredRole } from './middleware/checkUserRole';

// Create a new express application
const app = express();

// Middleware setup

// app.use is to mount the specified middleware funcitons at a specified path. 
// It is used to setup  things like request parsing, logging and security features (Middleware for the express application)


// Cors is  used to handle Cross Origin Resource Sharing (CORS) which allows web applications to make cross origin
// It is a security feature implemented by web browsers to control which web domains can access the resources
// on a domain. Its important to enable cors to allow our frontend to communicate with our backend
app.use(cors()); // Enable CORS

// A body parser is used to parse the incoming request bodies in a middleware before our handlers, 
// making it easier to work with POST request data
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies


// Route to handle login


// We use express.Routers to create modular, mondatable route handlers.
// This allows us to seperate our routes into different files and keep our codebase organised.
// Use the auth router
app.use('/apiauth', authRouter);
// Use the admin router
app.use('/api/admin', verifyToken, requiredRole('Admin'), adminRouter);

// User router
app.use('/api/user', verifyToken, requiredRole('User'), userRouter);



sequelize
    // To first authenticate the configuration provided 
    .authenticate()
    // Then call back to confirm the connection
    .then(() => {
        console.log('Connection to the database has been established successfully');

        // We use app.listen to start the server and make it listen on a specified port  (defaults to 3000)
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
