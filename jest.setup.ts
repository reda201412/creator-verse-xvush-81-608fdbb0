import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { server } from './src/mocks/server';

// Configuration de MSW pour les tests
beforeAll(() => {
  // Démarrer le serveur de mocks avant tous les tests
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  // Réinitialiser les mocks entre chaque test
  jest.clearAllMocks();
  // Nettoyer le DOM après chaque test
  cleanup();
  // Réinitialiser les requêtes interceptées
  server.resetHandlers();});

afterAll(() => {
  // Arrêter le serveur de mocks après tous les tests
  server.close();
});

// Configuration pour éviter les avertissements liés à act()
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Configuration pour éviter les avertissements de dépréciation
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Ignorer les avertissements spécifiques si nécessaire
    if (
      args[0]?.includes('Warning: An update to %s inside a test was not wrapped in act') ||
      args[0]?.includes('Warning: React.createFactory()')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    // Ignorer les avertissements spécifiques si nécessaire
    if (args[0]?.includes('Deprecation warning')) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  // Restaurer les méthodes console d'origine
  console.error = originalError;
  console.warn = originalWarn;
});
