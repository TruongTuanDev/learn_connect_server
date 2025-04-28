const mockPosts = [
  { id: "1", username: "Trúc Cute", timeAgo: "20 phút trước", content: "Hôm nay mình học được FutureBuilder trong Flutter rất hay!", likes: 15, comments: 8, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "2", username: "Tuấn Dev", timeAgo: "1 giờ trước", content: "Làm backend bằng ExpressJS thật là vui 😊", likes: 30, comments: 12, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "3", username: "Tâm Flutter", timeAgo: "3 giờ trước", content: "Mình mới học xong phần FutureBuilder và thử kết nối API!", likes: 22, comments: 5, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "4", username: "Phúc Dev", timeAgo: "Hôm qua", content: "Ai còn nhớ cách dùng setState() trong StatefulWidget không nhỉ?", likes: 12, comments: 3, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "5", username: "Toàn UI/UX", timeAgo: "2 ngày trước", content: "Thiết kế UI trong Flutter có vẻ giống Figma ghê luôn!", likes: 19, comments: 7, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "6", username: "HIEUTHUHAI Designer", timeAgo: "3 ngày trước", content: "Mình thích cách Flutter xử lý layout bằng widget rất trực quan.", likes: 27, comments: 6, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "7", username: "QuangHung Mobile", timeAgo: "4 ngày trước", content: "Flutter hot reload đúng là cứu tinh cho dev mobile 😍", likes: 35, comments: 14, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "8", username: " Backend", timeAgo: "5 ngày trước", content: "Làm API cho Flutter dùng ExpressJS + MongoDB đơn giản ghê!", likes: 17, comments: 4, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "9", username: "Khánh AI", timeAgo: "6 ngày trước", content: "Kết hợp Flutter và Firebase là lựa chọn hợp lý cho MVP.", likes: 28, comments: 10, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "10", username: "Ngọc Tester", timeAgo: "1 tuần trước", content: "Flutter test widget siêu mạnh, tích hợp CI/CD dễ dàng.", likes: 21, comments: 9, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "11", username: "Phúc DevOps", timeAgo: "2 tuần trước", content: "Triển khai Flutter Web trên Vercel chưa tới 5 phút 😎", likes: 32, comments: 11, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
  { id: "12", username: "My Crypto", timeAgo: "3 tuần trước", content: "Flutter đang trở thành framework frontend đa nền tảng mạnh nhất hiện nay.", likes: 45, comments: 17, avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg" },
];

const db = require('../models');
const Like = db.like;
const Comment = db.comment;

exports.findAll = async (req, res) => {
  try {
    console.log("Fetching likes and comments for posts...");
    console.log("Like model:", typeof Like.findOne === 'function' ? "Valid" : "Invalid");
    console.log("Comment model:", typeof Comment.countDocuments === 'function' ? "Valid" : "Invalid");

    const updatedPosts = await Promise.all(
      mockPosts.map(async (post) => {
        console.log(`Processing post with ID: ${post.id}`);

        if (typeof Like.findOne !== 'function') {
          throw new Error("Like model is not valid. Check like.model.js and index.js");
        }
        const like = await Like.findOne({ postId: post.id });
        const likeCount = like ? like.count : 0;

        if (typeof Comment.countDocuments !== 'function') {
          throw new Error("Comment model is not valid. Check comment.model.js and index.js");
        }
        const commentCount = await Comment.countDocuments({ postId: post.id });

        return {
          ...post,
          likes: likeCount,
          comments: commentCount,
        };
      })
    );

    res.status(200).json(updatedPosts);
    console.log("ok nhanha:");

  } catch (err) {
    console.error("Error in findAll:", err);
    res.status(500).json({ message: err.message || "Error retrieving posts." });
  }
};