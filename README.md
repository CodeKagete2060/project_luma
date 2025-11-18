# Project LUMA

**AI-Powered Educational Platform Connecting Students, Parents, and Tutors**

Project LUMA is a comprehensive full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that facilitates quality education through AI-powered learning assistance, real-time collaboration, and progress tracking.

---

## 🌍 Supporting UNSDG 4: Quality Education

Project LUMA is committed to **UNSDG Goal 4: Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all**. 

### How LUMA Supports UNSDG 4:

- **Accessibility**: Provides AI-powered homework assistance accessible to all students, regardless of their background or location
- **Personalized Learning**: Offers tailored educational resources and step-by-step guidance through AI assistance
- **Parental Involvement**: Enables parents to actively track and support their children's educational progress
- **Tutor Support**: Connects students with qualified tutors for personalized learning experiences
- **Community Learning**: Facilitates peer-to-peer learning through discussion boards and collaborative features
- **Progress Tracking**: Comprehensive analytics help identify learning gaps and celebrate achievements

By leveraging technology to bridge educational gaps, LUMA aims to make quality education accessible, engaging, and effective for everyone.

---

## ✨ Features

### 🔑 User Management
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Separate dashboards for Students, Parents, Tutors, and Admins
- **User Profiles**: Comprehensive user profiles with grade levels, subjects, and relationships

### 🤖 AI-Powered Learning
- **Assignment Assistant**: AI chatbot providing step-by-step homework help
- **Smart Search**: Advanced search functionality for resources and topics
- **Context-Aware Responses**: Intelligent Q&A system with hints and examples

### 📚 Learning Resources
- **Resource Hub**: Upload, browse, and download educational materials (PDFs, notes, etc.)
- **Resource Management**: Tutors can upload and organize study materials
- **Resource Summarization**: AI-powered summaries for quick understanding

### 🎥 Live & Recorded Sessions
- **Live Tutoring**: Real-time session creation and joining (WebRTC ready)
- **Recorded Sessions**: Access to past tutoring sessions for review
- **Session Management**: Organize and manage tutoring sessions

### 👨‍👩‍👧 Parental Involvement
- **Progress Tracking**: Real-time monitoring of student assignments and performance
- **Notifications**: Instant notifications for assignment completions and milestones
- **Child Management**: Link and manage multiple children's accounts

### 💬 Community Learning
- **Discussion Board**: Q&A forum with threaded replies
- **Peer Engagement**: Upvote and like discussions and replies
- **Subject-Based Organization**: Discussions organized by subjects

### 👨‍💼 Admin Tools
- **User Management**: Comprehensive user administration
- **Content Management**: Manage resources and discussions
- **Analytics Dashboard**: Insights into platform usage and student performance

---

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time notifications
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

### Frontend
- **React.js** with React Router
- **Axios** for API communication
- **Framer Motion** for smooth animations
- **Socket.io-client** for real-time features
- **Tailwind CSS** for styling
- **Marked** for markdown rendering

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Step 1: Clone the Repository
```bash
git clone https://github.com/CodeKagete2060/Project_LUMA.git
cd project_luma
```

### Step 2: Install Dependencies

**Option A: Install all dependencies at once (recommended)**
```bash
npm run install-all
```

**Option B: Install separately**
```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the `server/` directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWTSECRET=your_jwt_secret_key_here

# Server Port
PORT=5000

# Client URL (for CORS and Socket.io)
CLIENT_URL=http://localhost:5173

# LLM Configuration (optional)
LLM_PROVIDER=mock
LLM_RATE_LIMIT=30

# Storage Path (optional, defaults to server/uploads)
STORAGE_PATH=./uploads
```

### Step 4: Run the Application

**Development Mode (runs both client and server):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Start client
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📁 Project Structure

```
project_luma/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utilities (axios, socket)
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth, upload middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utilities (LLM, etc.)
│   ├── uploads/           # Uploaded files
│   ├── server.js          # Main server file
│   └── package.json
│
└── package.json           # Root package.json with scripts
```

---

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment (Tutor)
- `PATCH /api/assignments/:id/status` - Update assignment status
- `POST /api/assignments/:id/submit` - Submit assignment
- `PATCH /api/assignments/:id/grade` - Grade assignment (Tutor)

### Learning
- `POST /api/learning/assistant` - AI assistant query
- `GET /api/learning/resources` - List resources
- `POST /api/learning/resources` - Upload resource (Tutor)
- `GET /api/learning/resources/:id` - Get resource

### Sessions
- `POST /api/sessions/create` - Create session (Tutor)
- `GET /api/sessions/list` - List sessions
- `POST /api/sessions/upload` - Upload recording

### Discussions
- `GET /api/discussions` - List discussions
- `POST /api/discussions` - Create discussion
- `GET /api/discussions/:id` - Get discussion
- `POST /api/discussions/:id/replies` - Add reply
- `POST /api/discussions/:id/upvote` - Upvote discussion

### Progress
- `GET /api/progress` - Get progress
- `POST /api/progress/update/:studentId` - Update progress

### Notifications
- `GET /api/notifications/:userId` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read

### Admin
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/users` - List users
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

---

## 🎨 Design System

### Color Palette
- **Primary**: `#121057` (Deep Blue)
- **Secondary**: `#4b4b54` (Gray)
- **Background**: `#e8e8e8` (Light Gray)

### Layout
- **Sidebar-to-Content Ratio**: 2:8 (20% sidebar, 80% content)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: Smooth transitions using Framer Motion

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration
- Input validation and sanitization

---

## 📝 Development Notes

### Adding Real LLM Integration

To integrate OpenAI or another LLM provider, update `server/utils/llm.js`:

```javascript
if (provider === 'openai') {
  // Add OpenAI API integration
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: question }]
  });
  return { answer: response.choices[0].message.content, steps: [], hints: [] };
}
```

### File Storage

Currently using local file storage. For production, integrate with:
- AWS S3
- Cloudinary
- Azure Blob Storage

Update `server/middleware/uploadMiddleware.js` accordingly.

### WebRTC Integration

For live video sessions, integrate:
- Daily.co
- Twilio Video
- Agora.io

Update `client/src/pages/learning/JoinSession.jsx` with WebRTC logic.

---

## 🤝 Contributing

This is a development project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

ISC

---

## 👥 Authors

- **CodeKagete2060** - Initial development

---

## 🙏 Acknowledgments

- UNSDG 4 for inspiring quality education initiatives
- The open-source community for amazing tools and libraries
- All contributors and testers

---

**Built with ❤️ for Quality Education**
