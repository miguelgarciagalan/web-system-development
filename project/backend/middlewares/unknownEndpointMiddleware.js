// middlewares/unknownEndpointMiddleware.js

export const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'Unknown endpoint' });
};
