# SkillSync AI - Free AI-Powered Skill Gap Analyzer

A complete full-stack web application that analyzes resumes against job roles using AI and provides personalized skill recommendations.

## 🚀 Features

- **User Authentication**: Secure JWT-based registration and login
- **Resume Analysis**: Upload PDF resumes for automatic analysis
- **AI-Powered Insights**: Uses Groq API with LLaMA 3 70B model for intelligent analysis
- **Skill Gap Detection**: Identifies found skills and missing skills for target roles
- **Performance Scoring**: Get a 0-100 score based on skill match
- **Detailed Feedback**: Receive actionable suggestions for skill improvement
- **History Tracking**: View all past analyses in one place
- **Responsive UI**: Clean, modern card-based design

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Groq SDK** - AI integration

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Groq API key (free)

## 🔑 Get API Keys

### 1. MongoDB Atlas (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster (free tier available)
4. Create a database user with username and password
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/skillsync?retryWrites=true&w=majority`

### 2. Groq API (Free)
1. Visit [Groq Console](https://console.groq.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the key (keep it secret!)

## 📁 Project Structure

```
SkillSync AI/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Role.js              # Job role schema
│   │   └── Report.js            # Analysis report schema
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── analyzeController.js # Analysis logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── analyzeRoutes.js     # Analysis endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── utils/
│   │   ├── pdfParser.js         # PDF text extraction
│   │   └── groqAPI.js           # AI analysis
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Dashboard.js     # Main analysis page
│   │   │   └── History.js       # Past analyses
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   └── History.css
│   │   ├── services/
│   │   │   └── api.js           # API calls
│   │   ├── App.js               # Main component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
cd d:\FullStack_Team\ project
```

### 2. Setup Backend

#### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

#### Step 2: Create `.env` File
Create a `.env` file in the `backend` folder with:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsync?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_use_a_strong_random_string_at_least_32_characters
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

**Example JWT_SECRET:**
```
gfJR3k9mPqWxYzAbCdEfGhIjKlMnOpQr
```

#### Step 3: Start Backend Server
```bash
npm start
```

You should see:
```
✓ MongoDB connected successfully
✓ Default roles initialized
✓ Server running on port 5000
```

### 3. Setup Frontend

#### Step 1: Install Frontend Dependencies
Open a new terminal/command prompt:
```bash
cd frontend
npm install
```

#### Step 2: Create `.env` File
Create a `.env` file in the `frontend` folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Step 3: Start Frontend Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📖 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Analysis

#### Analyze Resume
```
POST /api/analyze
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data

Form Data:
- resume: [PDF file]
- roleName: "Fullstack Developer"

Response:
{
  "message": "Analysis completed successfully",
  "report": {
    "_id": "report_id",
    "userId": "user_id",
    "role": "Fullstack Developer",
    "skillsFound": ["javascript", "react", "node"],
    "missingSkills": ["mongodb", "html"],
    "score": 75,
    "feedback": "You have a strong foundation in JavaScript and React...",
    "suggestions": ["Learn MongoDB for backend database", "Master HTML fundamentals"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get History
```
GET /api/history
Authorization: Bearer jwt_token_here

Response:
{
  "message": "History retrieved successfully",
  "reports": [
    {
      "_id": "report_id",
      "role": "Fullstack Developer",
      "score": 75,
      ...
    }
  ]
}
```

## 🎮 How to Use

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Upload Resume**: Select a PDF resume file
4. **Choose Role**: Pick from available job roles (Fullstack Developer, Software Engineer, AI Engineer)
5. **Analyze**: Click "Analyze Resume" button
6. **View Results**: See your skills analysis with scores and feedback
7. **Check History**: View all your past analyses

## 🎯 Available Job Roles

- **Fullstack Developer**: HTML, CSS, JavaScript, React, Node.js, MongoDB
- **Software Engineer**: Java, Python, DSA, SQL
- **AI Engineer**: Python, Machine Learning, Deep Learning, NLP, TensorFlow

## ⚙️ Environment Variables

### Backend (.env)
```
MONGO_URI          # MongoDB connection string
JWT_SECRET         # Secret key for JWT signing
GROQ_API_KEY       # Groq API key
PORT               # Server port (default: 5000)
```

### Frontend (.env)
```
REACT_APP_API_URL  # Backend API URL (default: http://localhost:5000/api)
```

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication with 30-day expiration
- Protected API endpoints with middleware
- Secure token storage in localStorage
- Input validation on all endpoints
- CORS enabled for frontend-backend communication

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Roles Collection
```javascript
{
  _id: ObjectId,
  roleName: String (unique),
  requiredSkills: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Reports Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  role: String,
  skillsFound: [String],
  missingSkills: [String],
  score: Number (0-100),
  feedback: String,
  suggestions: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test Account (After Setup)
1. Register a new account with your email
2. Upload a sample resume PDF
3. Select a job role
4. Verify the analysis results

### Sample Roles to Test
- Fullstack Developer
- Software Engineer
- AI Engineer

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your MONGO_URI in .env
- Ensure MongoDB Atlas cluster is active
- Verify IP whitelist in MongoDB Atlas (add your IP)
- Check network connection

### "Groq API error"
- Verify GROQ_API_KEY is correct
- Check API key has not expired
- Ensure you have API quota available
- Check internet connection

### "Frontend can't connect to backend"
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Verify CORS is enabled in Express
- Clear browser cache and reload

### "PDF parsing error"
- Ensure file is a valid PDF
- Try with a different PDF
- Check PDF doesn't require password
- Verify file size is reasonable

### "CORS Error"
- Backend is running on http://localhost:5000
- Frontend is running on http://localhost:3000
- Restart both servers

## 🚀 Production Deployment

### Backend (Vercel, Heroku, or Railway)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel, Netlify, or GitHub Pages)
1. Update REACT_APP_API_URL to production API
2. Run `npm run build`
3. Deploy build folder to hosting platform

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check console logs for detailed error messages

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [React Documentation](https://react.dev)
- [JWT Documentation](https://jwt.io)
- [Groq API Documentation](https://console.groq.com/docs)

---

**Built with ❤️ for skill development**
