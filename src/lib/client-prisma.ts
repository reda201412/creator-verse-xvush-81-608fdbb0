
// This is a client-side mock for @prisma/client to prevent issues in the browser
const clientPrismaMock = {
  // Add any mock methods you need for client-side here
  video: {
    findMany: () => Promise.resolve([]),
    create: (data: any) => Promise.resolve(data),
    update: (data: any) => Promise.resolve(data),
    delete: (data: any) => Promise.resolve(data),
  },
};

export default clientPrismaMock;
