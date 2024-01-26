import { readFileSync } from 'fs';

import { MyContext } from '../index';
import Project from '../models/Project';

const typeDefs = readFileSync('./src/graphql/schema.graphql', { encoding: 'utf-8' });

// This resolver retrieves projects from the "projects" array above.
const resolvers = {
  Query: {
    projects: async (_: any, __: any, { db }: MyContext): Promise<Project[]> => {
      //Get the projects repository from the db
      const projectsRepository = db.getRepository(Project);
      return await projectsRepository.findAll();
    },
    project: async (_: any, { id }: any, { db }: MyContext): Promise<Project | null> => {
      //Get the projects repository from the db
      const projectsRepository = db.getRepository(Project);
      return await projectsRepository.findByPk(id);
    }
  },
};

export {typeDefs, resolvers};
