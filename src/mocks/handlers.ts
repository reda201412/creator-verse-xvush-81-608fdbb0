import { http, HttpResponse } from 'msw';

// Configuration de base pour les réponses API simulées
export const handlers = [
  // Exemple de gestionnaire pour une API d'authentification
  http.post('/api/auth/login', async () => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 150));

    return HttpResponse.json({
      token: 'fake-jwt-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
    });
  }),

  // Exemple de gestionnaire pour récupérer le profil utilisateur
  http.get('/api/user/profile', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));

    return HttpResponse.json({
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Test bio',
      createdAt: new Date().toISOString(),
    });
  }),

  // Gestionnaire par défaut pour les routes non gérées
  http.all('*', ({ request }) => {
    console.error(`Aucun gestionnaire pour ${request.method} ${request.url}`);
    return new HttpResponse(null, { status: 404 });
  }),
];
