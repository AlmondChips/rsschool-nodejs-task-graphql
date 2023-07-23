import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLInt, GraphQLEnumType } from 'graphql';
import { ProfileType } from './profile.js';
import { dbObject } from '../utils/prismaClient.js';

const MemberTypeId = new GraphQLEnumType({
name: 'MemberTypeId',
values: {
  basic: {
    value: 'basic'
  },
  business: {
    value: 'business'
  }
}
})

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
      }
    },
})

export const memberFields = {
  memberTypes: {
  type: new GraphQLList(MemberType),
  resolve: async () => await dbObject.client.memberType.findMany(),
  },
  memberType: {
    type: MemberType,
    args: {
      id: {
        type: MemberTypeId
      }
    },
    resolve: async (_, {id}) => await dbObject.client.memberType.findUnique({
      where: {
        id: id as string
      },
    }),
    }
}