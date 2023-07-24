import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInputObjectType, GraphQLBoolean } from 'graphql';
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

const postMutations = {
  createPost: {
    type: PostType,
    args: {
      dto: {
        type: new GraphQLNonNull(new GraphQLInputObjectType({
          name: 'CreatePostInput',
          fields: () => ({
            title: {
              type: new GraphQLNonNull(GraphQLString)
            },
            content: {
              type: new GraphQLNonNull(GraphQLString)
            },
            authorId: {
              type: new GraphQLNonNull(UUIDType)
            },
          })
        }))
      }
     
    },
    resolve: (_, {dto: {title, content, authorId}}: {dto: {[key: string]: string}}) => dbObject.client.post.create({
      data: { title, content, authorId },
    })
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
     id: {
      type: new GraphQLNonNull(UUIDType)
     }
    },
    resolve: (_, {id}: {id: string}) => dbObject.client.post.delete({
      where: {
        id
      },
    }).then(() => true)
  },
  changePost: {
    type: PostType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType)
      },
      dto: {
        type: new GraphQLNonNull(new GraphQLInputObjectType({
          name: 'ChangePostInput',
          fields: () => ({
            title: {
              type: GraphQLString
            },
            content: {
              type: GraphQLString
            },
            authorId: {
              type: UUIDType
            },
          })
        }))
      }
     
    },
    resolve: (_, {id, dto: {title, content, authorId}}: {id: string, dto: {[key: string]: string}}) =>
      dbObject.client.post.update({
        where: { id },
        data: { title, content, authorId },
    })
  }
}

export { PostType, postFields, postMutations }