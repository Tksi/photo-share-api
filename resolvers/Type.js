import { GraphQLScalarType } from 'graphql';

export const Photo = {
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
};

export const User = {
  postedPhotos: (parent) =>
    photos.filtter((photo) => photo.githubUser === parent.githubLogin),
  inPhotos: (parent) =>
    tags
      .filter((tag) => tag.userID === parent.id)
      .map((tag) => tag.photoID)
      .map((photoID) => photos.find((photo) => photo.id === photoID)),
};

export const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A valid date time value.',
  parseValue: (value) => new Date(value),
  serialize: (value) => new Date(value).toISOString(),
  parseLiteral: (ast) => ast.value,
});
