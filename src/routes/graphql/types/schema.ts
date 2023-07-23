import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberFields } from "./memberType.js";
import { userFields } from './user.js';

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        ...memberFields,
        ...userFields,
      }),
    })
  })