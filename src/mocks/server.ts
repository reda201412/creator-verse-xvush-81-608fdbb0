import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Crée un serveur MSW avec les gestionnaires définis
export const server = setupServer(...handlers);

// Exporte les types pour une utilisation facile
export * from 'msw';
export { http, HttpResponse } from 'msw';
