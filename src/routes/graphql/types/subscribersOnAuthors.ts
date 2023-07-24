import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
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

// subscribeTo(userId: $userId1, authorId: $authorId1) {
//   id
// }
// unsubscribeFrom(userId: $userId2, authorId: $authorId2)

export const subscribeMutations = {
  subscribeTo: {
    type: UserType,
    args: {
      userId: {
        type: new GraphQLNonNull(UUIDType),
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: (_, {userId, authorId }: {userId: string, authorId: string }) =>
      dbObject.client.subscribersOnAuthors.create({data: {
        subscriberId: userId,
        authorId: authorId,
      }}).then(() => dbObject.client.user.findUnique({where: {id: authorId}}))
  },
  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: {
      userId: {
        type: new GraphQLNonNull(UUIDType),
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: (_, {userId, authorId}: {userId: string, authorId: string}) => dbObject.client.subscribersOnAuthors.delete({
      where: {   subscriberId_authorId: {
        subscriberId: userId,
        authorId: authorId,
      }},
    }).then(() => true)

  }
}