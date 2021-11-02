export const Mutation = {
  postPhoto: async (parent, args, { db }) => {
    const newPhoto = {
      id: (await db.collection('photos').estimatedDocumentCount()) + 1,
      ...args.input,
      created: new Date(),
    };
    db.collection('photos').insert(newPhoto);
    return newPhoto;
  },
};
