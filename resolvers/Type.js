import { GraphQLScalarType } from 'graphql';

export const Photo = {
  // parentはPhotoオブジェト(photosの1要素)自体
  id: (parent) => parent.id || parent._id,
  url: (parent) => `/img/photos/${parent.id}.jpg`,
  postedBy: (parent, args, { db }) =>
    db.collection('users').findOne({ githubLogin: parent.githubUser }),
  taggedUsers: async (parent, args, { db }) => {
    const tags = await db.collection('tags').find().toArray();

    const logins = tags
      .filter((tag) => tag.photoID === parent.id)
      .map((tag) => tag.userID);

    return db
      .collection('users')
      .find({ githubLogin: { $in: logins } })
      .toArray();
  },
};

export const User = {
  postedPhotos: (parent, args, { db }) =>
    db.collection('photos').find({ githubUser: parent.githubLogin }).toArray(),

  inPhotos: async (parent, args, { db }) => {
    const tags = await db.collection('tags').find().toArray();

    const photoIDs = tags
      .filter((tag) => tag.userID === parent.githubLogin)
      .map((tag) => tag.photoID);
    return db
      .collection('photos')
      .find({ id: { $in: photoIDs } })
      .toArray();
  },
};

export const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A valid date time value.',
  parseValue: (value) => new Date(value),
  serialize: (value) => new Date(value).toISOString(),
  parseLiteral: (ast) => ast.value,
});
