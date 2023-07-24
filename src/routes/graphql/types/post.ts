import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { dbObject } from '../utils/prismaClient.js';
import { Post } from '@prisma/client';
import { GraphQlObject } from '../typesTS/GrapQLObjectType.js';

const PostType: GraphQlObject<Post> = new GraphQLObjectType({
  name: 'postType',
  description: 'Post created by the user',
  fields: () =>
    ({
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
      },
      author: {
        type: new GraphQLNonNull(UserType),
        resolve: (post: Post) => dbObject.client.user.findUnique( {where: { id: post.authorId } })
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
      },
    }),
})

const postFields = {
  posts: {
    type: new GraphQLList(PostType),
    resolve: () => dbObject.client.post.findMany(),
  },
  post: {
    type: PostType,
    args: {
      id: {type: UUIDType},
    },
    resolve: (_, {id}) => dbObject.client.post.findUnique({
      where: {
        id: id as string,
      }
    }),
  }
}

export { PostType, postFields }