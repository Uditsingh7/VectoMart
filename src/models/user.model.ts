import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
    public role!: 'Admin' | 'User';
}


User.init(
    {
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('Admin', 'User'),
            allowNull: false,
            validate: {
                isIn: [['Admin', 'User']],
            },
        }
    },
    {
        sequelize,
        tableName: 'user',
        schema: 'grocery_booking_schema',
        timestamps: true, // Enable timestamps
        underscored: true, // Use underscores instead of camelCase for automatically added attributes
    }
);

export default User;
