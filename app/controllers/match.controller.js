const MatchService = require('../services/match.service');

const MatchController = {
  getMatches: async (req, res) => {
    try {
      const userId = req.params.userId;
      const matches = await MatchService.findMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error('MatchController error:', error);
      res.status(500).json({ 
        error: error.message || 'Internal server error' 
      });
    }
  }
};

module.exports = MatchController;