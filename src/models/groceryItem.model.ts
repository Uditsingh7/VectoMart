import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';


// Sequeslise models are JS classes that represents tables in the databases. 
// Each model corresponds to a table, and instances of the model represent rows in the table.
// Models provide object oriented way to interact with the db, allowing you to perfomr the CRUD
// operations using method attributes.

// grocery item represents an item that can be ordered in the booking system. 

// the properties are defined with the ts public keyword and are asserted to be specific types
class GroceryItem extends Model {
    // Public is an access modifier that allows these properties to be accesssed and modified outside of the class

    // ! after each property is a ts non-null assertion operator. It tell ts that it will
    // initialized before they are used, even though they are defined with an initial value undefined by sequelize
    public id!: number;
    public name!: string;
    public price!: number;
    public quantity!: number;
}


// Model Initialisation with `init` method
// It is an sequelize method used to initialized the models definition
// It takes two arguments, attribute and options
// Arguments: an object defining the columns of the model
// Options: object defining the options for the model, such as db connection,table name, schema name and more.

GroceryItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'grocery_items',
        schema: 'grocery_booking_schema',
        timestamps: true,
        underscored: true, // Use underscores instead of camelCase for automatically added attributes
    }
);

export default GroceryItem;
