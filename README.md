# Project G-LEARNEX

**AI-Powered Educational Platform Connecting Students, Parents, and Tutors**

Project G-LEARNEX is a comprehensive full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that facilitates quality education through AI-powered learning assistance, real-time collaboration, and progress tracking.

---

## 🌍 Supporting UNSDG 4: Quality Education

Project G-LEARNEX is committed to **UNSDG Goal 4: Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all**.

### How G-LEARNEX Supports UNSDG 4:

- **Accessibility**: Provides AI-powered homework assistance accessible to all students, regardless of their background or location
- **Personalized Learning**: Offers tailored educational resources and step-by-step guidance through AI assistance
- **Parental Involvement**: Enables parents to actively track and support their children's educational progress
- **Tutor Support**: Connects students with qualified tutors for personalized learning experiences
- **Community Learning**: Facilitates peer-to-peer learning through discussion boards and collaborative features
- **Progress Tracking**: Comprehensive analytics help identify learning gaps and celebrate achievements

By leveraging technology to bridge educational gaps, G-LEARNEX aims to make quality education accessible, engaging, and effective for everyone.

---

## Features

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
- **Tutor Resource Upload**: Tutors can upload educational resources with admin approval workflow
- **Resource Management**: Tutors can manage their uploaded resources (edit, delete)
- **Admin Approval**: Resources require admin approval before becoming publicly available
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
- **Resource Approval**: Review and approve tutor-uploaded resources
- **Analytics Dashboard**: Insights into platform usage and student performance

### 👨‍👩‍👧‍👦 Parent-Child Live Sessions
- **Real-time Video/Audio Calls**: Parents can initiate live sessions with their children
- **AI Co-Attendee**: Claude AI assistant available during sessions for educational support
- **Session Management**: Complete session lifecycle with invitations, acceptance, and recording
- **Educational Focus**: Designed specifically for homework help and collaborative learning

---

## 📹 Parent-Child Live Sessions with AI Co-Attendee

### Overview
A collaborative learning feature that enables parents to initiate real-time video/audio sessions with their children for homework help and educational support. Includes an AI assistant (Claude) that can be called upon during sessions to provide additional educational guidance.

### Key Features
- **Real-time Communication**: WebRTC-based video/audio calls between parents and children
- **AI Educational Assistant**: Claude AI available during sessions for homework help
- **Session Management**: Complete lifecycle from invitation to session recording
- **Educational Focus**: Designed specifically for collaborative learning and homework assistance
- **Security**: Parent-child relationship validation and session access controls

### Session Flow
1. **Initiation**: Parent selects child and session type (video/audio/chat)
2. **Invitation**: Real-time notification sent to child with 5-minute expiry
3. **Acceptance**: Child can accept or decline the invitation
4. **Active Session**: Video/audio call begins with optional AI assistant
5. **AI Support**: Either participant can call AI for educational help
6. **Completion**: Session ends with optional summary and recording

### AI Co-Attendee Capabilities
- Answers homework questions with step-by-step explanations
- Provides educational support appropriate for child's grade level
- Maintains conversation context throughout the session
- Guides students to solutions rather than giving direct answers
- Supports multiple subjects (Math, Science, English, History, etc.)

### Technical Implementation
- **WebRTC**: Peer-to-peer video/audio using simple-peer library
- **Socket.IO**: Real-time signaling and session management
- **Claude AI**: Educational assistant with context awareness
- **MongoDB**: Session data, AI interactions, and recordings storage

### User Roles & Permissions
- **Parents**: Can initiate sessions, manage AI settings, end sessions
- **Students**: Can accept/decline invitations, call AI, participate in sessions
- **AI Assistant**: Responds only when called, provides educational support

---

## 📤 Tutor Resource Upload Feature

### Overview
Tutors can now upload educational resources that require admin approval before becoming publicly available to students and parents.

### Resource Upload Process
1. **Tutor Uploads**: Tutors fill out a comprehensive form with resource details
2. **Admin Review**: Resources are held in "pending" status until reviewed
3. **Approval/Rejection**: Admins can approve, reject, or delete pending resources
4. **Public Access**: Approved resources appear in the resource hub for all users

### Supported File Types
- PDF documents (.pdf)
- Images (.jpg, .jpeg, .png)
- Text documents (.doc, .docx, .txt)
- Maximum file size: 10MB

### Required Fields
- Title (required)
- Description (required)
- Subject (required)
- Grade Level: Primary, High School, Tertiary (required)
- Resource Type: Notes, Past Papers, Worksheets, Study Guide, Other (required)
- File upload (required)
- Tags (optional, comma-separated)

### User Roles & Permissions
- **Tutors**: Can upload, view, edit (pending only), and delete their own resources
- **Students/Parents**: Can only view approved resources
- **Admins**: Can view all resources, approve/reject pending resources, and delete any resource

### Dashboard Integration
- **Tutor Dashboard**: New "My Resources" tab with upload form and resource management
- **Admin Dashboard**: New "Pending Resources" tab for approval workflow

---

## Tech Stack

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
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Step 1: Clone the Repository
```bash
git clone https://github.com/CodeKagete2060/Project_G-LEARNEX.git
cd project-g-learnex
```

### Step 2: Install Dependencies

**Install backend dependencies:**
```bash
cd backend
npm install
```

**Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

### Step 3: Environment Configuration

**Backend Environment:**
Create a `.env` file in the `backend/` directory based on `.env.example`

**Frontend Environment:**
Create a `.env` file in the `frontend/` directory based on `.env.example`

### Step 4: Run the Application

**Run backend:**
```bash
cd backend
npm run dev
```

**Run frontend (in another terminal):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Step 5: Deployment

**Backend (Render):**
1. Push backend code to GitHub
2. Connect Render to `backend/` folder
3. Add environment variables from `.env.example`
4. Deploy

**Frontend (Vercel):**
1. Push frontend code to GitHub
2. Import project in Vercel selecting `frontend/` folder
3. Add `VITE_API_URL` environment variable
4. Deploy

### Step 6: Seed Sample Data (Optional)
To populate the application with sample data for demonstration purposes:

```bash
# Navigate to backend directory
cd backend

# Run the seed script
node src/seed/sampleData.js
```

**Sample Data Includes:**
- **Users**: 3 Students, 1 Parent, 2 Tutors, 1 Admin
- **Assignments**: 5 assignments with varying difficulty and completion status
- **Progress Records**: Student progress tracking with scores and milestones
- **Discussions**: 3 discussion threads with replies
- **Notifications**: Sample notifications for assignments and milestones
- **Learning Resources**: 5 educational resources (lesson notes, guides)
- **Tutoring Sessions**: 2 sample sessions (upcoming and completed)

**Sample Login Credentials:**
- **Admin**: admin@example.com / password123
- **Tutor1**: tutor1@example.com / password123
- **Tutor2**: tutor2@example.com / password123
- **Student1**: student1@example.com / password123
- **Student2**: student2@example.com / password123
- **Student3**: student3@example.com / password123
- **Parent1**: parent1@example.com / password123

---

## 📁 Project Structure

```
project-g-learnex/
│
├── backend/                # Express backend (Deploy to Render)
│   ├── src/
│   │   ├── config/        # Database, environment configs
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models/schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── utils/         # Helper functions
│   │   └── server.js      # Main server file
│   ├── package.json       # Backend dependencies only
│   ├── .env.example       # Backend environment variables
│   ├── .gitignore         # Backend-specific gitignore
│   ├── README.md          # Backend deployment instructions
│   └── render.yaml        # Render deployment config
│
├── frontend/               # React frontend (Deploy to Vercel)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context/state management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service calls
│   │   ├── utils/         # Helper functions
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── styles/        # CSS/styling files
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Frontend dependencies only
│   ├── index.html         # HTML entry point
│   ├── vite.config.js     # Vite config
│   ├── .env.example       # Frontend environment variables
│   ├── .gitignore         # Frontend-specific gitignore
│   ├── README.md          # Frontend deployment instructions
│   └── vercel.json        # Vercel deployment config
│
├── .gitignore            # Root gitignore
├── README.md             # Project overview
└── LICENSE               # License file
```

---

## API Endpoints

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
- `GET /api/learning/resources` - List resources (approved for students/parents, all for tutors/admins)
- `GET /api/learning/resources/my-uploads` - Get tutor's uploaded resources
- `POST /api/learning/resources` - Upload resource (Tutor only)
- `PUT /api/learning/resources/:id` - Edit resource (Tutor, pending status only)
- `DELETE /api/learning/resources/:id` - Delete resource (Tutor)
- `GET /api/learning/resources/:id` - Get resource
- `POST /api/learning/resources/:id/summarize` - Summarize resource

### Live Sessions (Parent-Child)
- `POST /api/live-sessions/create` - Parent creates live session
- `POST /api/live-sessions/:sessionId/invite` - Send invitation to child
- `PUT /api/live-sessions/:sessionId/accept` - Child accepts invitation
- `PUT /api/live-sessions/:sessionId/decline` - Child declines invitation
- `PUT /api/live-sessions/:sessionId/end` - End session
- `GET /api/live-sessions/:sessionId/status` - Get session status
- `GET /api/live-sessions/my-sessions` - Get user's sessions
- `POST /api/live-sessions/:sessionId/ai/call` - Call AI assistant
- `POST /api/live-sessions/:sessionId/ai/ask` - Ask AI question
- `GET /api/live-sessions/:sessionId/ai/history` - Get AI interaction history
- `POST /api/live-sessions/:sessionId/ai/feedback` - Rate AI response
- `POST /api/live-sessions/:sessionId/signal/offer` - WebRTC offer
- `POST /api/live-sessions/:sessionId/signal/answer` - WebRTC answer
- `POST /api/live-sessions/:sessionId/signal/ice-candidate` - WebRTC ICE candidate

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
- `GET /api/admin/resources/pending` - Get pending resources for approval
- `PATCH /api/admin/resources/:id/approve` - Approve resource
- `PATCH /api/admin/resources/:id/reject` - Reject resource
- `GET /api/admin/resources` - List all resources
- `DELETE /api/admin/resources/:id` - Delete resource

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

To integrate OpenAI or another LLM provider, update `backend/src/utils/llm.js`:

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

Update `backend/src/middleware/uploadMiddleware.js` accordingly.

### WebRTC Integration

For live video sessions, integrate:
- Daily.co
- Twilio Video
- Agora.io

Update `frontend/src/pages/learning/JoinSession.jsx` with WebRTC logic.

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

## Acknowledgments

- UNSDG 4 for inspiring quality education initiatives
- The open-source community for amazing tools and libraries
- All contributors and testers

---

## 🚀 Live Demo

**Frontend (User Interface):** [PASTE_YOUR_VERCEL_FRONTEND_URL_HERE]

**Backend API:** [PASTE_YOUR_RENDER_BACKEND_URL_HERE]

*Replace the placeholder URLs above with your actual deployed application links after deployment.*

---

**Built for Quality Education**
