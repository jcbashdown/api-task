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
it('returns a list of books', async () => {
  // Define the GraphQL query for fetching books
  const GET_BOOKS = `
    query GetBooks {
      books {
        title
        author
      }
    }
  `;

  // Execute the query
  const response = await testServer.executeOperation({
    query: GET_BOOKS 
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
    expect(response.body.singleResult.data?.books).toEqual([
      { title: 'The Awakening', author: 'Kate Chopin' },
      { title: 'City of Glass', author: 'Paul Auster' },
    ]);
  }
});
it('returns a list of books titles when only asked for titles', async () => {
  // Define the GraphQL query for fetching books
  const GET_BOOKS = `
    query GetBooks {
      books {
        title
      }
    }
  `;

  // Execute the query
  const response = await testServer.executeOperation({
    query: GET_BOOKS 
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
    expect(response.body.singleResult.data?.books).toEqual([
      { title: 'The Awakening' },
      { title: 'City of Glass' },
    ]);
  }
});
