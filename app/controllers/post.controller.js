// app/controllers/post.controller.js

// Không cần require model nếu không dùng DB
// const db = require('../models');
// const Post = db.post;

// Mock dữ liệu giả định
const mockPosts = [
    {
      username: "Trúc Cute",
      timeAgo: "20 phút trước",
      content: "Hôm nay mình học được FutureBuilder trong Flutter rất hay!",
      likes: 15,
      comments: 8,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "Tuấn Dev",
      timeAgo: "1 giờ trước",
      content: "Làm backend bằng ExpressJS thật là vui 😊",
      likes: 30,
      comments: 12,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "Tâm Flutter",
      timeAgo: "3 giờ trước",
      content: "Mình mới học xong phần FutureBuilder và thử kết nối API!",
      likes: 22,
      comments: 5,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "Phúc Dev",
      timeAgo: "Hôm qua",
      content: "Ai còn nhớ cách dùng setState() trong StatefulWidget không nhỉ?",
      likes: 12,
      comments: 3,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "Toàn UI/UX",
      timeAgo: "2 ngày trước",
      content: "Thiết kế UI trong Flutter có vẻ giống Figma ghê luôn!",
      likes: 19,
      comments: 7,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "HIEUTHUHAI Designer",
      timeAgo: "3 ngày trước",
      content: "Mình thích cách Flutter xử lý layout bằng widget rất trực quan.",
      likes: 27,
      comments: 6,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "QuangHung Mobile",
      timeAgo: "4 ngày trước",
      content: "Flutter hot reload đúng là cứu tinh cho dev mobile 😍",
      likes: 35,
      comments: 14,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: " Backend",
      timeAgo: "5 ngày trước",
      content: "Làm API cho Flutter dùng ExpressJS + MongoDB đơn giản ghê!",
      likes: 17,
      comments: 4,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "Khánh AI",
      timeAgo: "6 ngày trước",
      content: "Kết hợp Flutter và Firebase là lựa chọn hợp lý cho MVP.",
      likes: 28,
      comments: 10,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "Ngọc Tester",
      timeAgo: "1 tuần trước",
      content: "Flutter test widget siêu mạnh, tích hợp CI/CD dễ dàng.",
      likes: 21,
      comments: 9,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "Phúc DevOps",
      timeAgo: "2 tuần trước",
      content: "Triển khai Flutter Web trên Vercel chưa tới 5 phút 😎",
      likes: 32,
      comments: 11,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
    {
      username: "My Crypto",
      timeAgo: "3 tuần trước",
      content: "Flutter đang trở thành framework frontend đa nền tảng mạnh nhất hiện nay.",
      likes: 45,
      comments: 17,
      avatarUrl: "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    },
  ];


  // Controller GET /posts trả dữ liệu giả
  exports.findAll = async (req, res) => {
    try {
      res.status(200).json(mockPosts);
    } catch (err) {
      res.status(500).json({ message: err.message || "Error retrieving posts." });
    }
  };
