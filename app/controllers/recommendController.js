const axios = require('axios');

async function getRecommendedFriends(req, res) {
  const { id_user } = req.query;

  if (!id_user) {
    return res.status(400).json({ status: 'error', message: 'Missing id_user' });
  }

  try {
    // Gửi request qua server AI
    const response = await axios.get(`http://localhost:8000/recommend`, {
      params: { id_user: id_user }
    });

    // Nếu server AI trả thành công
    if (response.data.status === 'success') {
      return res.json({ status: 'success', friends: response.data.data });
    } else {
      return res.status(500).json({ status: 'error', message: 'AI server error' });
    }
  } catch (error) {
    console.error('Error calling AI server:', error.message);
    return res.status(500).json({ status: 'error', message: 'Cannot connect to AI server' });
  }
}

module.exports = { getRecommendedFriends };
