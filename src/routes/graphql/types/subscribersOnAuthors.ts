import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { SubscribersOnAuthors } from '@prisma/client';
import { dbObject } from '../utils/prismaClient.js';

export const subscribersOnAuthors = new GraphQLObjectType({
  name: 'subscribersOnAuthors',
  description: 'Post created by the user',
  fields: () =>
    ({
      subscriber: {
        type: new GraphQLNonNull(UserType),
        resolve: (subscribersOnAuthors: SubscribersOnAuthors) =>
        dbObject.client.user.findMany({ where: { id: subscribersOnAuthors.subscriberId }}),
      },
      subscriberId: {
        type: new GraphQLNonNull(GraphQLString),
      },
      author: {
        type: new GraphQLNonNull(UserType),
        resolve: (subscribersOnAuthors: SubscribersOnAuthors) =>
        dbObject.client.user.findMany({ where: { id: subscribersOnAuthors.authorId }})
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
      },
    }),
})