
// Mock implementation of Firebase functionality
export const db = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => ({
        exists: true,
        id,
        data: () => ({
          id,
          name: `Mock ${name} ${id}`,
          createdAt: new Date(),
          // Add other fields as needed
        }),
      }),
      set: async (data: any) => Promise.resolve(),
      update: async (data: any) => Promise.resolve(),
      delete: async () => Promise.resolve(),
    }),
    where: () => ({
      get: async () => ({
        docs: [],
        empty: true,
      }),
      orderBy: () => ({
        limit: () => ({
          get: async () => ({
            docs: [],
            empty: true,
          }),
        }),
      }),
    }),
    add: async (data: any) => ({
      id: `mock-${Date.now()}`,
      get: async () => ({
        exists: true,
        id: `mock-${Date.now()}`,
        data: () => data,
      }),
    }),
  }),
};

export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: Function) => {
    callback(null);
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({ user: null }),
  createUserWithEmailAndPassword: async () => ({ user: null }),
  signOut: async () => {},
};

export const storage = {
  ref: (path: string) => ({
    put: async (file: File) => ({
      ref: {
        getDownloadURL: async () => `https://example.com/mock-file-${Date.now()}`,
      },
    }),
    putString: async (dataUrl: string) => ({
      ref: {
        getDownloadURL: async () => `https://example.com/mock-file-${Date.now()}`,
      },
    }),
    getDownloadURL: async () => `https://example.com/mock-file-${Date.now()}`,
    delete: async () => Promise.resolve(),
  }),
};
