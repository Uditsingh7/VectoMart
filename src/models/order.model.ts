import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize'; 

class Order extends Model {
    public id!: number;
    public userId!: number;
    public totalAmount!: number;
    public orderDate!: Date;
    public status!: string;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: true 
        },
    },
    {
        sequelize,
        tableName: 'order',
        schema: 'grocery_booking_schema',
        timestamps: true,
        modelName: 'order', 
        underscored: true, // Use underscores instead of camelCase for automatically added attributes
    }
);

export default Order;
