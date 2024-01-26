import { SequelizeOptions } from 'sequelize-typescript';
import { Project } from '../models/Project';

type Config = {
  [env: string]: SequelizeOptions;
};

const sequelizeOptions: SequelizeOptions = {
  dialect: 'sqlite',
  storage: './database.sqlite',
  models: [Project], // Array of model classes
};

//TODO: get from .env
const config: Config = {
  development: sequelizeOptions
  //planning to mock or stub the db in all tests for now
  //could also consider an in memory db
  // ... other environments
};

//Not working with sequelize cli
//export default config;

export = config;