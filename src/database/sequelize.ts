// src/database/sequelize.ts
// Sequelise is a promised based ORM that supports various databses such  as Postgres, MySQL and SQLite3
// It provides an easy to use apis to interact with the db using js objects, eliminating to write the sql queries
// Sequelise simpifies db operations and enhance code maintainability.

import { Sequelize } from 'sequelize';

// Dot-env package is to use load the env variables from  ``.env`` file in project root directory.
// This allows u to store sensitive data and configuration specific info (like db creds) outside of your codebase, 
// which is a best practice for your security
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres', // dialect  property tells Sequelize what type of database we are using here.
  host: process.env.DB_HOST, // DB host name
  port: parseInt(process.env.DB_PORT || '5432', 10), // port on which db is running
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export default sequelize;
