import { ApolloServer } from 'apollo-server';

let _id = 0; //idのインクリメント用
const photos = [];

// スキーマ : データの要件
const typeDefs = `
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(name: String! description: String): Photo!
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
        ...args,
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  // Photo型が呼ばれたときに実行されるっぽい(データそを書き換えてはいない)
  Photo: {
    // parentはPhotoオブジェト自体
    url: (parent) => `http://example.com/img/${parent.id}.jpg`,
  },
};

new ApolloServer({ typeDefs, resolvers })
  .listen()
  .then(({ url }) => console.log(url));
