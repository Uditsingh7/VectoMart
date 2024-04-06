// The Router from express is used to create modular, mountable route handlers. 
// By using Router, we can define routes in separate modules and then use these routes in our main application. 
// It helps in organizing the codebase and makes it more maintainable and scalable.


import { Router } from 'express';
import {
    addGroceryItem, viewGroceryItems, updateGroceryItem, manageInventory,
    deleteGroceryItem, getAllUsers
} from '../controllers/adminController';

const router = Router();

// Route for adding a new grocery item
router.post('/grocery-items', addGroceryItem);
// Route for adding a viewing grocery items
router.get('/grocery-items', viewGroceryItems);

// PUT: Used to update or replace an entire resource or entity.
// Route for updating an existing grocery item
router.put('/grocery-items/:itemId', updateGroceryItem);

// Route for managing inventory (adding or subtracting quantity) of an item
router.post('/grocery-items/manage-inventory', manageInventory);

// Route to delete a specific grocery item by its id
router.delete('/grocery-items/:itemId', deleteGroceryItem);

// Route to get all the users list
router.get('/users', getAllUsers);

export { router };
