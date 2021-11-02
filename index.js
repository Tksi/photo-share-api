import { ApolloServer } from 'apollo-server';

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
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
  },
];

// スキーマ : データの要件
const typeDefs = `
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
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
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
    allPhotos: () => photos,
  },

  Mutation: {
    postPhoto: (parent, args) => {
      const newPhoto = {
        id: _id++,
        ...args.input,
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
  },

  User: {
    postedPhotos: (parent) =>
      photos.filtter((photo) => photo.githubUser === parent.githubLogin),
  },
};

new ApolloServer({ typeDefs, resolvers })
  .listen()
  .then(({ url }) => console.log(url));
