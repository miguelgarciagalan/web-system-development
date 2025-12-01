// routes/indexRoutes.js

import express from 'express';

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'StudyCalendar API running',
  });
});

export default router;
