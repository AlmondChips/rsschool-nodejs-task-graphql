
import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList, GraphQLInputObjectType, GraphQLBoolean } from 'graphql';
import { UUIDType } from "./uuid.js";
import { ProfileType } from './profile.js'
import { PostType } from './post.js';
import { dbObject } from '../utils/prismaClient.js';
import { SubscribersOnAuthors, User } from '@prisma/client';
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

export const userMutations = {
  createUser: {
    type: UserType,
    args: {
      dto: {
        type: new GraphQLNonNull(new GraphQLInputObjectType({
          name: 'CreateUserInput',
          fields: {
            name: {
              type: new GraphQLNonNull(GraphQLString)
            },
            balance: {
              type: new GraphQLNonNull(GraphQLFloat)
            }
          }
        }))
      }
    },
    resolve: (_, {dto: {name, balance}}: { dto: {name: string, balance: number}}) => dbObject.client.user.create({
      data: { name, balance },
    })
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: {
      id: {
         type: new GraphQLNonNull(UUIDType)
        },
    },
    resolve: (_, {id}: {id: string}) => dbObject.client.user.delete({
      where: { id },
    }).then(() => true)
  },
  changeUser: {
    type: UserType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType)
      },
      dto: {
        type: new GraphQLNonNull(new GraphQLInputObjectType({
          name: 'ChangeUserInput',
          fields: {
            name: {
              type: GraphQLString
            },
            balance: {
              type: GraphQLFloat
            }
          }
        }))
      }
    },
    resolve: (_, {id, dto: {name, balance}}: {id: string, dto: {name: string, balance: number}}) =>
      dbObject.client.user.update({
        where: { id },
        data: { name, balance },
    })
  },
}

