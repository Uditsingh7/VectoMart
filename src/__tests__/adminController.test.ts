import { Request, Response } from 'express';
import * as adminController from '../controllers/adminController';
import GroceryItem from '../models/groceryItem.model';

// Jest mock is used to mock a module, here its mocking a grocery item.
jest.mock('../models/groceryItem.model');

// decribe is use to group related test cases together. In this there is a test suite for 
// admin controller, within it, it has a test case for adding grocery item
describe('Admin Controller', () => {
    describe('addGroceryItem', () => {
        // it defined individual test case. In this case, it test 
        // add grocery item function
        it('should add a new grocery item', async () => {
            // Mock request and response objects
            // req: This is a mocked request object. It simulates an HTTP request to the addGroceryItem controller. 
            // It has a body property containing the data that would typically be sent in the request body.
            const req = { body: { name: 'Test Item', price: 10, quantity: 5 } } as Request;

            // Res: this  is a mocked response object. It simulates an HTTP response of the add grocery item
            // status: jest.fn().mockReturnThis(): is used to mock the status method of response object
            // jest.fn(): creates a mock function
            // mockReturnThis: ensures that the status methd returns this, allowing for method chaining
            // This is often used to simulate the behavior of res.status(201).

            // json: jest.fn(): This mocks the json method of the response object. 
            // The jest.fn() creates a mock function to capture the data that would typically be sent in the response body as JSON.

            // The as unknown as Response is a type assertion in TypeScript. 
            // In this context, it's used to tell the TypeScript compiler to treat the res object as an instance of the Response type, 
            // even though it might not have all the properties of a standard Response object. 
            // This is a common pattern when mocking objects in TypeScript tests.
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            // Mock create method of GroceryItem model

            // jest.spyOn is a Jest utility that allows you to create a spy on an object's method. 
            // Spies are used to track calls to the method and optionally mock its behavior. 
            // This is particularly useful in testing to ensure that methods are being called with the correct arguments and to mock their return values.

            // jest.spyOn(GroceryItem, 'create'): 
            // This line creates a spy on the create method of the GroceryItem model.

            // .mockResolvedValueOnce(...): This part of the code mocks the behavior of the create method. 
            // It specifies that the create method should return a resolved Promise with the provided value 
            // ({ name: 'Test Item', price: 10, quantity: 5 }) just once.

            // It allows the test to track whether the create method of the 
            // GroceryItem model is called and with what arguments.

            // Mocking Behavior: It ensures that the create method does not actually execute the database operation but returns the mocked value instead. 
            // This is essential for unit testing as it isolates the unit of code being tested from the rest of the application.
            const createMock = jest.spyOn(GroceryItem, 'create').mockResolvedValueOnce({
                name: 'Test Item',
                price: 10,
                quantity: 5,
            } as unknown as GroceryItem);

            // Call controller function

            // Here, the addGroceryItem function from the adminController is being called 
            // with the mock request (req) and response (res) objects.
            await adminController.addGroceryItem(req, res);

            // Verify response

            // In these lines, we are using Jest's expect function to verify   
            // that the res.status and res.json methods were called with the expected arguments.

            // This verifies that the HTTP status 201 Created was sent in the response.
            expect(res.status).toHaveBeenCalledWith(201);

            // This checks that the response body matches the expected object, 
            // which contains a message indicating success and the details of the newly added grocery item.
            expect(res.json).toHaveBeenCalledWith({
                message: 'New grocery item added!',
                item: {
                    name: 'Test Item',
                    price: 10,
                    quantity: 5,
                },
            });

            // Verify that create method of GroceryItem model was called with correct arguments
            expect(createMock).toHaveBeenCalledWith({
                name: 'Test Item',
                price: 10,
                quantity: 5,
            });
        });
    });

    // Describes the test suite for a group of test
    describe('Update Grocery Item Controller', () => {
        // it defined individual test case. In this case, it test 
        // update grocery item function
        it('should update an existing grocery item', async () => {
            // Partial<Request>: Partial is a TypeScript utility type that makes all properties of a type optional. 
            // Here, mockRequest is a mock object for the request with optional properties.
            const mockRequest: Partial<Request> = {
                params: { itemId: '1' },
                body: { name: 'New Item Name', price: 10.99, quantity: 20 },
            };

            // Similar to the request, mockResponse is a mock object for the response with optional properties.
            // In TypeScript, Partial<T> is a utility type that constructs a type with all properties of T set to optional. 
            // This means that every property in the resulting type is optional. 
            // In the provided code, mockRequest and mockResponse are mock objects for the request and response with optional properties because not all properties of the original Request and Response types are necessary for this specific test case.
            const mockResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findByPk and save methods of GroceryItem model
            const mockFindByPk = jest.spyOn(GroceryItem, 'findByPk');
            mockFindByPk.mockResolvedValueOnce({
                id: 1,
                name: 'Existing Item Name',
                price: 5.99,
                quantity: 10,
                save: jest.fn(),
            } as any);

            // Call the controller function
            await adminController.updateGroceryItem(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Grocery item updated successfully',
                data: expect.objectContaining({
                    id: 1,
                    name: 'New Item Name',
                    price: 10.99,
                    quantity: 20,
                }),
            });

            // Verify that the findByPk method was called with the correct itemId
            expect(mockFindByPk).toHaveBeenCalledWith('1');
        });

    });
    describe('Delete Grocery Item Controller', () => {
        it('should delete an existing grocery item', async () => {
            const mockRequest: Partial<Request> = {
                params: { itemId: '1' },
            };

            const mockResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findByPk and destroy methods of GroceryItem model
            const mockFindByPk = jest.spyOn(GroceryItem, 'findByPk');
            mockFindByPk.mockResolvedValueOnce({
                id: 1,
                name: 'Existing Item Name',
                price: 5.99,
                quantity: 10,
                destroy: jest.fn(),
            } as any);

            // Call the controller function
            await adminController.deleteGroceryItem(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Grocery item deleted successfully',
            });

            // Verify that the findByPk method was called with the correct itemId
            expect(mockFindByPk).toHaveBeenCalledWith('1');
        });
    });

    describe('View Grocery Items Controller', () => {
        it('should retrieve and return grocery items', async () => {
            const mockRequest: Partial<Request> = {
                query: { page: '1', pageSize: '10', sortBy: 'createdAt', sortOrder: 'DESC' },
            };

            const mockResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findAndCountAll method of GroceryItem model
            const mockFindAndCountAll = jest.spyOn(GroceryItem, 'findAndCountAll');
            mockFindAndCountAll.mockResolvedValueOnce({
                count: 2,
                rows: [
                    { id: 1, name: 'Item 1', price: 10.99, quantity: 5 },
                    { id: 2, name: 'Item 2', price: 15.99, quantity: 8 },
                ],
            } as any);

            // Call the controller function
            await adminController.viewGroceryItems(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Grocery items retrieved successfully',
                data: {
                    totalCount: 2,
                    currentPage: 1,
                    pageSize: 10,
                    groceryItems: [
                        { id: 1, name: 'Item 1', price: 10.99, quantity: 5 },
                        { id: 2, name: 'Item 2', price: 15.99, quantity: 8 },
                    ],
                },
            });

            // Verify that the findAndCountAll method was called with the correct parameters
            expect(mockFindAndCountAll).toHaveBeenCalledWith({
                limit: 10,
                offset: 0,
                order: [['createdAt', 'DESC']],
            });
        });
    });

    describe('Manage Inventory Controller', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should increase the quantity', async () => {
            const mockRequest: Partial<Request> = {
                body: { itemId: 1, operation: "increase", quantity: 20 },
            };

            const mockResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findByPk and save methods of GroceryItem model
            const mockFindByPk = jest.spyOn(GroceryItem, 'findByPk');
            mockFindByPk.mockResolvedValueOnce({
                id: 1,
                name: 'Existing Item Name',
                price: 5.99,
                quantity: 10,
                save: jest.fn(),
            } as any);

            // Call the controller function
            await adminController.manageInventory(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Inventory managed successfully',
                data: expect.objectContaining({
                    id: 1,
                    name: 'Existing Item Name',
                    price: 5.99,
                    quantity: 30,
                }),
            });

            // Verify that the findByPk method was called with the correct itemId
            expect(mockFindByPk).toHaveBeenCalledWith(1);
        });

        it('should handle decrease operation', async () => {
            // test case for handling invalid operations
        });
        it('should handle set zero operation', async () => {
            // test case for handling invalid operations
        });
        it('should handle invalid operations', async () => {
            // test case for handling invalid operations
        });

        it('should handle non-existent item', async () => {
            // test case for handling non-existent item
        });

        it('should handle insufficient quantity', async () => {
            // test case for handling insufficient quantity
        });

        it('should handle internal server error', async () => {
            // test case for handling internal server error
        });
    });
});
