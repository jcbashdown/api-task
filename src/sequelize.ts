import { Sequelize } from 'sequelize-typescript';
import config from './config/config';

//get the correct config for the current environment
const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

export const sequelize = new Sequelize({...envConfig, repositoryMode: true});//Let's try respository mode. Not yet sure how useful it is vs custom repositories

export async function authenticateDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
