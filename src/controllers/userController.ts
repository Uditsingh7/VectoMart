// adminController.ts
import { Request, Response } from 'express';
import GroceryItem from '../models/groceryItem.model';
import { Op } from 'sequelize';
import Order from '../models/order.model';
import OrderItem from '../models/orderItem.model';


interface OrderItemPayload {
    itemId: number;
    quantity: number;
}


// User placing the order
export const placeOrder = async (req: Request, res: Response) => {
    try {
        // Extracting Users Id from the request body
        const userId = req.body.userId as number;

        // Extract order items from the request body
        const items: OrderItemPayload[] = req.body.items;

        // Fetch all items from the database to check availability and calculate total amount
        const fetchedItems = await GroceryItem.findAll({
            where: {
                //Op is an object provided by Sequelize which contains a collection of operators used in querying the database.
                // Assuming itemId is included in each order item object
                // Op.in operator is used to filter the records where a particular column's value matches any value in an array.
                //This means the query is looking for GroceryItem records where the id matches any of the itemId values in the items array.
                id: { [Op.in]: items.map((item) => item.itemId) }
            }
        });

        // Calculate total amount and check item availability
        let totalAmount = 0;
        const unavailableItems: number[] = [];

        // Check for any unavialbale item/quantity in the db
        for (const item of items) {
            const fetchedItem = fetchedItems.find((fetchedItem) => fetchedItem.id === item.itemId);
            // if not found or quantity issue then push it to the unavialble items
            if (!fetchedItem || fetchedItem.quantity < item.quantity) {
                unavailableItems.push(item.itemId);
            } else {
                // Else, calcualte the total amount of the order items.
                totalAmount += fetchedItem.price * item.quantity;
            }
        }
        // If there is more than  one unvailable item, send a bad request response with errors
        if (unavailableItems.length > 0) {
            return res.status(400).json({ message: 'One or more items are not available in sufficient quantity', unavailableItems });
        }

        // If all fine, we have calcualted total order price/amount, now we can store order details in the order table
        // associating to the userid
        // Create a new order
        const order = await Order.create({
            userId,
            totalAmount,
            status: 'Placed' // Assuming the initial status of the order is 'Placed'
        });

        // Create order items, for each item in the order, in order item table

        // The map function iterates over each item in the items array. For each item, 
        // it searches for the corresponding item details in the fetchedItems array and creates a new OrderItem record. 
        // The Promise.all ensures that all these operations are performed in parallel.

        // Promise.all is used to execute multiple promises in parallel.
        // it waits for all the promises to resolve and returns an array of their results
        // In this code, it's used to efficiently create multiple OrderItem records simultaneously.
        const orderItems = await Promise.all(items.map(async (item) => {
            const fetchedItem = fetchedItems.find((fetchedItem) => fetchedItem.id === item.itemId);
            // An error will be thrown with a message indicating that the item with the specific ID was not found.
            if (!fetchedItem) {
                throw new Error(`Item with ID ${item.itemId} not found`);
            }
            const totalPrice = fetchedItem.price * item.quantity;

            // Create order item
            return OrderItem.create({
                orderId: order.id,
                itemId: item.itemId,
                quantity: item.quantity,
                price: fetchedItem.price,
                totalPrice
            });
        }));

        // Update quantities of items in the grocery_item table
        await Promise.all(items.map(async (item) => {
            const fetchedItem = fetchedItems.find((fetchedItem) => fetchedItem.id === item.itemId);
            if (!fetchedItem) {
                throw new Error(`Item with ID ${item.itemId} not found`);
            }
            fetchedItem.quantity -= item.quantity;
            await fetchedItem.save();
        }));

        // Success response
        return res.status(201).json({
            message: 'Order placed successfully',
            order,
            orderItems
        });
    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const queryExtraParameters = async (req: Request) => {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    // Sorting and ordering parameters
    const sortBy = req.query.sortBy as string || 'createdAt';
    const orderBy = req.query.orderBy as string || 'DESC';

    return { page, pageSize, offset, sortBy, orderBy };
}



// Get all available grocery items
export const getAvailableGroceryItems = async (req: Request, res: Response) => {
    try {
        const searchQuery = req.query.q as string || '';
        const { page, pageSize, offset, sortBy, orderBy } = await queryExtraParameters(req);

        // Query the database to retrieve available grocery items with pagination, sorting, and ordering
        const { count, rows: groceryItems } = await GroceryItem.findAndCountAll({
            where: {
                quantity: {
                    [Op.gt]: 0 // Check if quantity is greater than 0
                },
                name: {
                    [Op.iLike]: `%${searchQuery}%` // Search for any occurrence of the query in the item's name
                }

            },
            limit: pageSize,
            offset: offset,
            order: [[sortBy, orderBy]]
        });

        // Check if there are any grocery items
        if (groceryItems.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No available grocery items found',
                data: null
            });
        }

        // If there are grocery items, return them as a response along with total count
        return res.status(200).json({
            status: 'success',
            message: 'Available grocery items retrieved successfully',
            data: {
                totalCount: count,
                currentPage: page,
                pageSize: pageSize,
                groceryItems: groceryItems
            }
        });

    } catch (error) {
        console.error('Error retrieving available grocery items:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: null
        });
    }
};


export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.findAndCountAll({ where: { userId: userId } });
        return res.status(200).send(orders);
    }
    catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve user's order history"
        })
    }
}

interface QueryCondition {
    where?: {
        order_id?: number
    },
    include: any[],
    limt?: number,
    offset?: number,
    order?: any[]
}
export const getOrderItems = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const userId = parseInt(req.params.userId);
        const { page, pageSize, offset, sortBy, orderBy } = await queryExtraParameters(req);
        let queryCondition: QueryCondition = {
            include: [{
                model: GroceryItem,
                as: 'groceryItem',
                attributes: ['name'], // Select the columns you want from the GroceryItem table
            },
            {
                model: Order,
                as: 'order',
                where: {
                    user_id: userId
                },
                attributes: ['userId']
            }
            ],
            limt: pageSize,
            offset: offset,
            order: [[sortBy, orderBy]]
        }
        if (orderId) {
            queryCondition.where = {
                order_id: orderId
            }
        }

        const { count, rows: orderItems } = await OrderItem.findAndCountAll(
            queryCondition
        )
        // Check if there are any grocery items
        if (orderItems.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No order items found',
                data: null
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Order items retrieved successfully',
            data: {
                totalCount: count,
                currentPage: page,
                pageSize: pageSize,
                orderItems: orderItems
            }
        });
    }
    catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve order details."
        })
    }
}



