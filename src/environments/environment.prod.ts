export const environment = {
  production: true,
  apiUrl: '/api', // Proxied via Netlify _redirects to avoid 3rd-party cookie blocking
  socketUrl: '/'   // Same proxy for sockets if supported, or direct depending on needs
};
