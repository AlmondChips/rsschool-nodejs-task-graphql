import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { MemberType } from './memberType.js';

export const ProfileType: GraphQLObjectType<unknown, unknown> = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    user: { type: new GraphQLNonNull(UserType) },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: { type: new GraphQLNonNull(MemberType)},
    memberTypeId: { type: new GraphQLNonNull(GraphQLInt)},
  }),
})