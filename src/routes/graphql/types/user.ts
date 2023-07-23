import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { UUIDType } from "./uuid.js";
import { ProfileType } from './profile.js'
import { PostType } from './post.js';
import { subscribersOnAuthors } from './subscribersOnAuthors.js';
import { dbObject } from '../utils/prismaClient.js';

export const UserType: GraphQLObjectType<unknown, unknown> = new GraphQLObjectType({
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
    },
    posts: {
      type: new GraphQLList(PostType)
    },
    userSubscribedTo: {
      type: new GraphQLList(subscribersOnAuthors)
    },
    subscribedToUser: {
      type: new GraphQLList(subscribersOnAuthors)
    },
  })
})

export const userFields = {
  users: {
    type: new GraphQLList(UserType),
    resolve: async () => await dbObject.client.user.findMany(),
  },
  user: {
    type: UserType,
    args: {
      id: {
         type:UUIDType
      },
    },
    resolve: async (_, {id}) => await dbObject.client.user.findUnique({
      where: {
        id: id as string
      },
    }),
  }
}