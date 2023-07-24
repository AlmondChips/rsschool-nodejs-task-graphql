import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { MemberType, MemberTypeId } from './memberType.js';
import { dbObject } from '../utils/prismaClient.js';
import { Profile } from '@prisma/client';
import { GraphQlObject } from '../typesTS/GrapQLObjectType.js';

export const ProfileType: GraphQlObject<Profile> = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    user: { 
      type: new GraphQLNonNull(UserType),
      resolve: (profile: Profile) => dbObject.client.user.findUnique({ where: { id: profile.userId }})
     },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: (profile: Profile) => dbObject.client.memberType.findUnique({ where: { id: profile.memberTypeId }})
      },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId)},
  }),
})

export const profileFields = {
  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: () => dbObject.client.profile.findMany(),
  },
  profile: {
    type: ProfileType,
    args: {
      id: {
        type: UUIDType
      }
    },
    resolve: (_, {id}) => dbObject.client.profile.findUnique({
      where: {
        id: id as string,
      }
    }),
  }
}