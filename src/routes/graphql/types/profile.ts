import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { MemberType } from './memberType.js';
import { dbObject } from '../utils/prismaClient.js';
import { Profile } from '@prisma/client';
import { GraphQlObject } from '../typesTS/GrapQLObjectType.js';
import { MemberTypeId } from './memberEnum.js';

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
};

export const profileMutations = {
  createProfile: {
    type: ProfileType,
    args: {
     dto: {
      type: new GraphQLNonNull(new GraphQLInputObjectType({
        name: 'CreateProfileInput',
        fields: () => ({
          isMale: {
            type: new GraphQLNonNull(GraphQLBoolean)
          },
          yearOfBirth: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          userId: {
            type: new GraphQLNonNull(UUIDType)
          },
          memberTypeId: {
            type: MemberTypeId,
          },
        })
      }))
     }
    },
    resolve: (_, {dto: {isMale, yearOfBirth, userId, memberTypeId}}:
       {dto: {isMale: boolean, yearOfBirth: number, userId: string, memberTypeId: string}}) =>
        dbObject.client.profile.create({data: {isMale, yearOfBirth, userId, memberTypeId}})
  },
  deleteProfile: {
    type: GraphQLBoolean,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      }
    },
    resolve: (_, {id}: {id: string}) =>
        dbObject.client.profile.delete({where: { id }}).then(() => true)
  },
  changeProfile: {
    type: ProfileType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType)
      },
     dto: {
      type: new GraphQLNonNull(new GraphQLInputObjectType({
        name: 'ChangeProfileInput',
        fields: () => ({
          isMale: {
            type: GraphQLBoolean
          },
          yearOfBirth: {
            type: GraphQLInt
          },
          userId: {
            type: UUIDType
          },
          memberTypeId: {
            type: MemberTypeId,
          },
        })
      }))
     }
    },
    resolve: async (_, {id, dto: {isMale, yearOfBirth, userId, memberTypeId}}:
       {id: string, dto: {isMale: boolean, yearOfBirth: number, userId: string, memberTypeId: string}}) => {
          const user = await dbObject.client.user.findFirst({ where: {id: userId}})
          if (!user) throw Error(`Field "userId" is not defined by type "ChangeProfileInput"`);
          return dbObject.client.profile.update({
              where: { id },
              data: {
                isMale,
                yearOfBirth,
                userId,
                memberTypeId
              },
            })
       }
  
  },
}