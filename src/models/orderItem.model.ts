import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';
import GroceryItem from './groceryItem.model';
import Order from './order.model';

class OrderItem extends Model {
    public id!: number;
    public orderId!: number;
    public itemId!: number;
    public quantity!: number;
    public price!: number;
    public totalPrice!: number;
}

OrderItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Order',
                key: 'id'
            }
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'GroceryItem',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
    },
    {
        sequelize,
        tableName: 'order_item',
        schema: 'grocery_booking_schema',
        timestamps: true,
        modelName: 'OrderItem',
        underscored: true, // Use underscores instead of camelCase for automatically added attributes
    }
);
// OrderItem belongsTo GroceryItem through Item (through table)
// Define the association with alias
OrderItem.belongsTo(GroceryItem, { foreignKey: 'itemId', as: 'groceryItem' });
GroceryItem.hasMany(OrderItem, { foreignKey: 'itemId', as: 'orderItems' });


OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as:'order'
});

Order.hasMany(OrderItem,{ foreignKey:'orderId', as:'orderItems'})

export default OrderItem;
