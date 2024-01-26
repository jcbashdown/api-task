import { readFileSync } from 'fs';

const typeDefs = readFileSync('./src/graphql/schema.graphql', { encoding: 'utf-8' });

//It should be possible to auto generate this from the schema https://www.apollographql.com/docs/apollo-server/workflow/generate-types/
interface Project {
  id: string;
  url: string;
  status: string;
  country: string;
}

const projects: Project[] = [
];

// This resolver retrieves projects from the "projects" array above.
const resolvers = {
  Query: {
    projects: (): Project[] => projects,
  },
};

export {typeDefs, resolvers};
