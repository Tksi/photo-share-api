const { ApolloServer } = require('apollo-server');

const photos = [];

// スキーマ : データの要件
const typeDefs = `
  type Query {
    totalPhotos: Int!
  }

  type Mutation {
    postPhoto(name: String! description: String): Boolean!
  }
`;

// リソルバ : フィールドのデータを返す関数
const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
  },
  Mutation: {
    postPhoto: (parent, args) => {
      photos.push(args);
      return true;
    },
  },
};

new ApolloServer({ typeDefs, resolvers })
  .listen()
  .then(({ url }) => console.log(url));
