import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLInt, GraphQLEnumType } from 'graphql';
import { ProfileType } from './profile.js';
import { dbObject } from '../utils/prismaClient.js';
import { MemberType as TMemberType } from '@prisma/client';
import { MemberTypeId } from './memberEnum.js';

export const MemberType = new GraphQLObjectType({
  name: 'memberType',
  description: '',
  fields: 
    {
      id: {
        type: new GraphQLNonNull(MemberTypeId),
      },
      discount: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      postsLimitPerMonth: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: (memberType: TMemberType) => dbObject.client.profile.findMany({ where: { memberTypeId: memberType.id }})
      }
    },
})

export const memberFields = {
  memberTypes: {
  type: new GraphQLList(MemberType),
  resolve: () => dbObject.client.memberType.findMany(),
  },
  memberType: {
    type: MemberType,
    args: {
      id: {
        type: MemberTypeId
      }
    },
    resolve: (_, {id}) => dbObject.client.memberType.findUnique({
      where: {
        id: id as string
      },
    }),
    }
}