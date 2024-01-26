import { typeDefs, resolvers } from '../../../src/graphql/schema';
import { ApolloServer } from '@apollo/server';

interface TestContext {
  db: any;
}

let testServer: ApolloServer<TestContext>;

const projects = [
      {
        id: 'abcdef',
        url: 'https://registry.verra.org/app/projectDetail/VCS/4699',
        status: 'Under validation',
        country: 'USA'
      },
      {
        id: 'abc123',
        url: 'https://registry.verra.org/app/projectDetail/VCS/4699',
        status: 'Under validation',
        country: 'USA'
      }
    ];

// Create a mock for ProjectRepository 
const mockProjectRepository = {
  findAll: jest.fn().mockResolvedValue(projects),
  findByPk: (id: string): any => {
    const project = projects.find(obj => obj.id === id)
    return project
  }
};

//reduce an array of objects to a single obje

// Mock context with db.getRepository
const mockContext = {
  db: {
    getRepository: jest.fn().mockReturnValue(mockProjectRepository)
  }
};

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
  const response = await testServer.executeOperation(
    {
      query: GET_PROJECTS,
    }, {
      contextValue: mockContext
    }
  )

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
    expect(response.body.singleResult.data?.projects).toEqual(projects);
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
  const response = await testServer.executeOperation(
    {
      query: GET_PROJECTS,
    }, {
      contextValue: mockContext
    }
  )

  expect(response.body.kind === 'single');
  if (response.body.kind === 'single') {
    // Expectations
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.projects).toEqual([
      {
        url: 'https://registry.verra.org/app/projectDetail/VCS/4699',
      },
      {
        url: 'https://registry.verra.org/app/projectDetail/VCS/4699',
      }
    ]);
  }
});

it('returns a single project when using the project(id: UUIDV4) query', async () => {
  // Define the GraphQL query for fetching projects
  const GET_PROJECT = `
    query GetProject($projectId: String!) {
      project(id: $projectId) {
        id
        url
      }
    }
  `;

  // Execute the query
  const response = await testServer.executeOperation(
    {
      query: GET_PROJECT,
      variables: {
        "projectId": "abcdef"
      },
    }, {
      contextValue: mockContext
    }
  )

  expect(response.body.kind === 'single');
  if (response.body.kind === 'single') {
    // Expectations
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.project).toEqual({
      id: "abcdef",
      url: 'https://registry.verra.org/app/projectDetail/VCS/4699',
    });
  }
});
