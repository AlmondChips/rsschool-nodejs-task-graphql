import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberFields } from "./memberType.js";
import { userFields, userMutations } from './user.js';
import { profileFields, profileMutations } from './profile.js';
import { postFields, postMutations } from './post.js';
import { subscribeMutations } from './subscribersOnAuthors.js'

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        ...memberFields,
        ...userFields,
        ...profileFields,
        ...postFields
      }),
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: () => ({
        ...userMutations,
        ...profileMutations,
        ...postMutations,
        ...subscribeMutations,
      })
    })
  })