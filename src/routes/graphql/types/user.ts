
import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { UUIDType } from "./uuid.js";
import { ProfileType } from './profile.js'
import { PostType } from './post.js';
import { subscribersOnAuthors } from './subscribersOnAuthors.js';
import { dbObject } from '../utils/prismaClient.js';
import { SubscribersOnAuthors, User } from '@prisma/client';
import { GetResult } from '@prisma/client/runtime/library.js';
import { resolve } from 'path';
import { GraphQlObject } from '../typesTS/GrapQLObjectType.js';

export const UserType: GraphQlObject<User> = new GraphQLObjectType({
  name: 'User',
  description: '',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: ProfileType,
      resolve: (user: User) => dbObject.client.profile.findUnique({ where: { userId: user.id }})
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user: User) => dbObject.client.post.findMany({ where: { authorId: user.id }})
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: (user: User) =>
       dbObject.client.subscribersOnAuthors.findMany({ where: { subscriberId: user.id }})
       .then(async (subscribersOnAuthors: SubscribersOnAuthors[]) => 
        subscribersOnAuthors.map(async sub => await dbObject.client.user.findUnique({where: { id: sub.authorId}})))
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: (user: User) =>
       dbObject.client.subscribersOnAuthors.findMany({ where: { authorId: user.id }})
       .then(async (subscribersOnAuthors: SubscribersOnAuthors[]) =>
        subscribersOnAuthors.map(async sub => await dbObject.client.user.findUnique({where: { id: sub.subscriberId}})))
    },
  })
})

export const userFields = {
  users: {
    type: new GraphQLList(UserType),
    resolve: () => dbObject.client.user.findMany(),
  },
  user: {
    type: UserType,
    args: {
      id: {
         type:UUIDType
      },
    },
    resolve: (_, {id}) => dbObject.client.user.findUnique({
      where: {
        id: id as string
      },
    }),
  }
}