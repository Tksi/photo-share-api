export const Query = {
  totalPhotos: (parent, args, { db }) =>
    db.collection('photos').estimatedDocumentCount(),
  allPhotos: (parent, args, { db }) => db.collection('photos').find().toArray(),
};
