# Project API

## Getting Started Docker

NOTE: node_modules is not shared with the container (as a quick way to avoid potential permissions issues). Make sure yarn install is run in the container if you make any changes (it will run automatically when the container is first built)

You will need docker compose and docker installed

Start the project with `docker compose up -d` to start detached
- `yarn install` should run but you will need to run `yarn docker-yarn-install` for future updates
- shutdown when detached with `docker compose down`

Visit the graphql sandbox at [localhost:4000](http://localhost:4000)

Example Query:

```
query {
  projects {
    country
    id
    status
    url
  }
}
```

Run tests with `yarn docker-test`

Build dist (e.g. for production) with `yarn build`

## Choices and issues
- This API is read only. From my discussion with Georgie it sounds like this is a reasonable assumption for now.
- I've used Docker for quick, repeatable dev env setup. In my experience you can get into trouble if you wait too long to add this
- I've used Apollo Server + Express
    - I want to build a graphql API. I've been learning to do this in a few languages recently (prior experience was PHP). Looking at some of Sylvera's data and talking with Georgie I get the sense this could be a good approach.
    - Express may or may not be necessary for this exercise but it should help with OAuth2 later if needed. It may also enable reusue of the auth strategy in your current API depending on how that code is written - https://api.sylvera.com/docs/2023-09-01#section/Introduction. It's always better to reusue well tested and understood auth approaches when you can rather than writing from scratch.
    - I've been trying to use Apollo Client with graphql subscriptions from Rails ActionCable in a separate project but it's not quite working. Apparently there might be some websockets handling mismatch so it would be nice to try Apollo server instead on that project (not wedded to ruby as it's early days)
- It would be nice to use top level awaits with `"type": "module"` in package.json but this is breaking imports as node requires file extensions. As we are transpiling for production from Typescript we would need to write something custom to get `import X from 'x.ts'` transpiled to `import X from 'x.js'`. This needs a bit more thought 
- I'm trying out repository mode in sequelize typescript however, I think custom respositories and some kind of IoC patter like inversify js might be a better approach. Not loving the current approach to mocking, though I initially thought this would be straighforward.
- While express is appropriate for a project like this, I think in a team I might prefer a more full featured framework with strong conventions. It would be easy end up with quite a messy code base without this.

## TODO
- Linting (and other static analysis?) based on team standards
- Allow filtering by attributes as an option in the projects query
- Add Auth
    - Granular permissions?
- Versioning less of an issue with graphql - deprecatable fields, more granular queries. Probably leave this for now.
- Consider error handling
- Consider documentation beyond schema itself and sandbox/playground/graphiql - descriptions with "" - https://graphql.com/learn/schema/?
- Generate types from schema - started this process before just creating the Project interface manually but reset. See here: https://www.apollographql.com/docs/apollo-server/workflow/generate-types/

### TODO - extra functionality beyond the brief
- Create a mutation
- Do some queries with nested types?
- Split up the tests on a per query basis?
- Add some extra tables and fields after setting up migration infrastructure
- Consider realtime data + think about using graphql subscriptions?

### TODO Later
- CI/CD
- Use postgres
    - Extra docker container
- Switch to config in .env
- Consider data sources apart from sqlite/postgres. More than one DB? Other systems?

