import { typeDefs, resolvers } from '../../../src/graphql/schema';
import { ApolloServer } from '@apollo/server';

let testServer: ApolloServer;

// Initialize the ApolloServer before any tests run
beforeAll(() => {
  testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
});

//Really these are integration tests
it('returns a list of projects', async () => {
  // Define the GraphQL query for fetching projects
  const GET_PROJECTS = `
    query GetProjects{
      projects {
        id
        url
        status
        country
      }
    }
  `;

  // Execute the query
  const response = await testServer.executeOperation({
    query: GET_PROJECTS
  })

  expect(response.body.kind === 'single');
  //This if prevents a Typescript error. It would be better to use `as` to assert the type of the response
  //However Apollo server doesn't appear to provide a type for this.
  //It feels like this might be a common issue with these tests so setting up a custom type might be a good approach
  //Something like:
  //interface SingleResultResponse<T = any> {
  //  kind: 'single';
  //  singleResult: {
  //    data?: T;
  //    errors?: any[];
  //  };
  //}
  if (response.body.kind === 'single') {
    // Expectations
    expect(response.body.singleResult.errors).toBeUndefined();
    //get the first element in the projects array
    expect(response.body.singleResult.data?.projects).toEqual([
      {
        id: 'abcdef',
        url: 'https://en.wikipedia.org/wiki/The_Awakening',
        status: 'published',
        country: 'USA'
      },
      {
        id: 'abc123',
        url: 'https://en.wikipedia.org/wiki/The_Awakening_(novel)',
        status: 'published',
        country: 'USA'
      }
    ]);
  }
});
it('returns a list of projects titles when only asked for titles', async () => {
  // Define the GraphQL query for fetching projects
  const GET_PROJECTS = `
    query GetProjects {
      projects {
        url
      }
    }
  `;

  // Execute the query
  const response = await testServer.executeOperation({
    query: GET_PROJECTS
  })

  expect(response.body.kind === 'single');
  //This if prevents a Typescript error. It would be better to use `as` to assert the type of the response
  //However Apollo server doesn't appear to provide a type for this.
  //It feels like this might be a common issue with these tests so setting up a custom type might be a good approach
  //Something like:
  //interface SingleResultResponse<T = any> {
  //  kind: 'single';
  //  singleResult: {
  //    data?: T;
  //    errors?: any[];
  //  };
  //}
  if (response.body.kind === 'single') {
    // Expectations
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.projects).toEqual([
      //two project objects
      {
        url: 'https://en.wikipedia.org/wiki/The_Awakening',
      },
      {
        url: 'https://en.wikipedia.org/wiki/The_Awakening_(novel)',
      }
    ]);
  }
});
