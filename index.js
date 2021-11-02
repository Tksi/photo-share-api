import { ApolloServer } from 'apollo-server';
import { GraphQLScalarType } from 'graphql';

let _id = 0; //idのインクリメント用
const users = [
  { githubLogin: 'mHattrup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake' },
  { githubLogin: 'sSchmidt', name: 'Scot Schmidt' },
];
const photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
    created: '3-28-1977',
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
    created: '3-28-1977',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
    created: '2018-04-15T19:09:57.308Z',
  },
];
const tags = [
  { photoID: '1', userID: 'gPlake' },
  { photoID: '2', userID: 'sSchmidt' },
  { photoID: '2', userID: 'mHattrup' },
  { photoID: '2', userID: 'gPlake' },
];

// スキーマ : データの要件
const typeDefs = `
  scalar DateTime

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type User{
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  type Query {
    totalPhotos: Int!
    allPhotos(after: DateTime): [Photo!]!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

// リソルバ : フィールドのデータを返す関数
const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: photos,
  },

  Mutation: {
    postPhoto: (parent, args) => {
      const newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date(),
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },

  // Photo型が呼ばれたときに実行されるっぽい(データは書き換えてはいない)
  Photo: {
    // parentはPhotoオブジェト(photosの1要素)自体
    url: (parent) => `http://example.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      console.log(parent);
      return users.find((user) => user.githubLogin === parent.githubUser);
    },
    taggedUsers: (parent) =>
      tags
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userID) => users.find((user) => user.githubLogin === userID)),
  },

  User: {
    postedPhotos: (parent) =>
      photos.filtter((photo) => photo.githubUser === parent.githubLogin),
    inPhotos: (parent) =>
      tags
        .filter((tag) => tag.userID === parent.id)
        .map((tag) => tag.photoID)
        .map((photoID) => photos.find((photo) => photo.id === photoID)),
  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valide date time value.',
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};

new ApolloServer({ typeDefs, resolvers })
  .listen()
  .then(({ url }) => console.log(url));
