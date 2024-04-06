import { Request, Response } from 'express';
import GroceryItem from '../models/groceryItem.model';
import User from '../models/user.model';

// Add new grocery items to the system
export const addGroceryItem = async (req: Request, res: Response) => {
    try {
        // Extract data from request body
        const { name, price, quantity } = req.body;

        // Validate input data
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name is required and must be a string' });
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: 'Price is required and must be a positive number' });
        }
        if (isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ error: 'Quantity is required and must be a non-negative integer' });
        }
        // Check if the item with the same name already exists
        const existingItem = await GroceryItem.findOne({ where: { name } });
        if (existingItem) {
            return res.status(400).json({ error: 'A grocery item with the same name already exists' });
        }

        // Create a new GroceryItem instance
        const newItem = await GroceryItem.create({
            name: name,
            price: price,
            quantity: quantity
        });

        // Respond with success message and the newly created item
        res.status(201).json({
            message: "New grocery item added!",
            item: newItem
        });
    } catch (error) {
        // Handle errors
        console.error('Error adding grocery item:', error);
        res.status(500).json({ error: 'Failed to add grocery item' });
    }
};




// Update details (e.g., name, price) of existing grocery items
export const updateGroceryItem = async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const { name, price, quantity } = req.body;

    try {
        // Find the grocery item by its ID
        const groceryItem = await GroceryItem.findByPk(itemId);

        // Check if the grocery item exists
        if (!groceryItem) {
            return res.status(404).json({ message: 'Grocery item not found' });
        }

        // Update the grocery item with the new data
        groceryItem.name = name || groceryItem.name;
        groceryItem.price = price || groceryItem.price;
        groceryItem.quantity = quantity >= 0 ? quantity : groceryItem.quantity;

        // Save the updated grocery item
        await groceryItem.save();

        // Return a success response
        return res.status(200).json({
            status: 'success',
            message: 'Grocery item updated successfully',
            data: groceryItem
        });
    } catch (error) {
        console.error('Error updating grocery item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



// Remove the grocery item 
export const deleteGroceryItem = async (req: Request, res: Response) => {
    // Extract the item ID from the request parameters
    const itemId = req.params.itemId;

    try {
        // Check if the item exists in the database
        const existingItem = await GroceryItem.findByPk(itemId);

        if (!existingItem) {
            return res.status(404).json({ message: 'Grocery item not found' });
        }

        // Delete the item
        await existingItem.destroy();

        // Return a success response
        return res.status(200).json({
            status: 'success',
            message: 'Grocery item deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting grocery item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const viewGroceryItems = async (req: Request, res: Response) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const offset = (page - 1) * pageSize;

        // Sorting and ordering parameters
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sortOrder = req.query.sortOrder as string || 'DESC';

        // Query the database to retrieve grocery items with pagination, sorting, and ordering
        const { count, rows: groceryItems } = await GroceryItem.findAndCountAll({
            limit: pageSize,
            offset: offset,
            order: [[sortBy, sortOrder]]
        });

        // Check if there are any grocery items
        if (groceryItems.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No grocery items found',
                data: null
            });
        }

        // If there are grocery items, return them as a response along with total count
        return res.status(200).json({
            status: 'success',
            message: 'Grocery items retrieved successfully',
            data: {
                totalCount: count,
                currentPage: page,
                pageSize: pageSize,
                groceryItems: groceryItems
            }
        });

    } catch (error) {
        console.error('Error retrieving grocery items:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: null
        });
    }
};


// Manage inventory levels of grocery items
export const manageInventory = async (req: Request, res: Response) => {
    try {
        const { itemId, operation, quantity } = req.body;

        // Retrieve the grocery item
        const groceryItem = await GroceryItem.findByPk(itemId);

        if (!groceryItem) {
            return res.status(404).json({ message: 'Grocery item not found' });
        }

        // Update the quantity based on the operation
        if (operation === 'increase') {
            groceryItem.quantity += quantity;
        } else if (operation === 'decrease') {
            if (groceryItem.quantity < quantity) {
                return res.status(400).json({ message: 'Insufficient quantity in inventory' });
            }
            groceryItem.quantity -= quantity;
        } else if (operation === 'setZero') {
            groceryItem.quantity = 0;
        } else {
            return res.status(400).json({ message: 'Invalid operation' });
        }

        // Save the changes to the database
        await groceryItem.save();

        return res.status(200).json({
            status: 'success',
            message: 'Inventory managed successfully',
            data: groceryItem
        });
    } catch (error) {
        console.error('Error managing inventory:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// Get all users list

export const getAllUsers = async (req: Request, res: Response) => {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;
    const role = req.query.role as string || null;
    let whereClaus = {};
    if (role) {
        whereClaus = {
            role: role
        }
        console.log("where clause: ", whereClaus);
    }

    // Sorting and ordering parameters
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'DESC';
    const users = await User.findAndCountAll({
        attributes: {
            exclude: ['password']
        },
        limit: pageSize,
        offset: offset,
        order: [[sortBy, sortOrder]],
        where: whereClaus
    });
    return res.status(200).json(users);
}

