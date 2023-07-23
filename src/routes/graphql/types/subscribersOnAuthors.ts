import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';

export const subscribersOnAuthors = new GraphQLObjectType({
  name: 'subscribersOnAuthors',
  description: 'Post created by the user',
  fields: () =>
    ({
      subscriber: {
        type: new GraphQLNonNull(UserType),
      },
      subscriberId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      author: {
        type: new GraphQLNonNull(UserType),
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
      },
    }),
})