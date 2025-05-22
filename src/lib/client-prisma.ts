
// Mock implementation of Prisma client for browser usage

// Define a simple mock implementation of a model
class MockModel {
  private data: Record<string, any>[] = [];
  
  async findUnique(query: any) {
    const { where } = query;
    const id = where?.id;
    
    if (id) {
      return this.data.find(item => item.id === id) || null;
    }
    
    return null;
  }
  
  async findMany(query?: any) {
    if (!query) return [...this.data];
    
    let filteredData = [...this.data];
    
    // Basic where filtering
    if (query.where) {
      for (const [key, value] of Object.entries(query.where)) {
        filteredData = filteredData.filter(item => item[key] === value);
      }
    }
    
    // Basic sorting
    if (query.orderBy) {
      const field = Object.keys(query.orderBy)[0];
      const direction = query.orderBy[field] === 'asc' ? 1 : -1;
      
      filteredData.sort((a, b) => {
        return a[field] > b[field] ? direction : -direction;
      });
    }
    
    // Basic limit
    if (query.take) {
      filteredData = filteredData.slice(0, query.take);
    }
    
    return filteredData;
  }
  
  async findFirst(query: any) {
    const results = await this.findMany(query);
    return results[0] || null;
  }
  
  async create(data: any) {
    const newItem = { ...data.data };
    if (!newItem.id) {
      newItem.id = Math.floor(Math.random() * 10000).toString();
    }
    this.data.push(newItem);
    return newItem;
  }
  
  async update(query: any) {
    const { where, data } = query;
    const id = where?.id;
    
    if (id) {
      const index = this.data.findIndex(item => item.id === id);
      if (index !== -1) {
        this.data[index] = { ...this.data[index], ...data };
        return this.data[index];
      }
    }
    
    throw new Error('Record not found');
  }
  
  async delete(query: any) {
    const { where } = query;
    const id = where?.id;
    
    if (id) {
      const index = this.data.findIndex(item => item.id === id);
      if (index !== -1) {
        const deleted = this.data[index];
        this.data.splice(index, 1);
        return deleted;
      }
    }
    
    throw new Error('Record not found');
  }
}

// Create a basic mock client
const clientPrisma = {
  // Define your models here
  video: new MockModel(),
  user: new MockModel(),
  profile: new MockModel(),
  
  // Add a basic transaction mock
  $transaction: async (operations: any[]) => {
    return Promise.all(operations);
  },
  
  // Add disconnect method
  $disconnect: async () => {
    console.log('Mock Prisma client disconnected');
    return Promise.resolve();
  },
  
  // Add connect method
  $connect: async () => {
    console.log('Mock Prisma client connected');
    return Promise.resolve();
  }
};

export default clientPrisma;
