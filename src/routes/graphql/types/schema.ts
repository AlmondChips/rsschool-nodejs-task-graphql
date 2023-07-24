import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberFields } from "./memberType.js";
import { userFields } from './user.js';
import { profileFields } from './profile.js';
import { postFields } from './post.js';

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        ...memberFields,
        ...userFields,
        ...profileFields,
        ...postFields
      }),
    })
  })