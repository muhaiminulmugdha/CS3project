# FalconFlow 🦅

A Q&A platform for high school CS students to ask and answer questions — like a mini Stack Overflow. Built for Cambridge Public Schools CS classes.

---

## 🌐 Live Site
https://falconflow-f30q.onrender.com

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Backend server |
| MongoDB Atlas | Cloud database |
| EJS | HTML templating |
| bcryptjs | Password hashing |
| express-session | User sessions |
| Passport.js + Google OAuth | Google SSO |
| helmet | Security headers |
| express-rate-limit | Rate limiting |
| xss-clean | XSS protection |
| @google/genai | Gemini AI hints |
| Render | Hosting + auto deploy |

---

## 📁 Project Structure

```
CS3project/
├── index.js                    ← App entry point
├── .env                        ← Environment variables (never push to GitHub)
├── config/
│   ├── db.js                   ← MongoDB connection
│   ├── passport.js             ← Google OAuth setup
│   └── devEmail.js             ← Teacher email whitelist
├── middleware/
│   ├── auth.js                 ← Require login middleware (checks ban status from DB)
│   └── teacherOnly.js          ← Require teacher role middleware
├── models/
│   ├── User.js                 ← User schema (username, email, password, role, banned, googleId)
│   ├── Question.js             ← Question schema (text, username, class, language, assessment, bestAnswer)
│   └── Answer.js               ← Answer schema (text, username, upvotes, downvotes, voters)
├── routes/
│   ├── questionsRoutes.js      ← All question + answer routes
│   ├── feedRoute.js            ← HelpBros feed route with sort options
│   ├── teacherRoutes.js        ← Teacher dashboard routes
│   ├── authRoutes.js           ← Google OAuth routes
│   ├── aiRoutes.js             ← Gemini AI similar questions route
│   └── users/
│       └── userRoutes.js       ← Auth + account + leaderboard routes
├── views/
│   ├── index.ejs               ← Landing page
│   ├── about.ejs               ← About page
│   ├── login.ejs               ← Login page (email + Google SSO)
│   ├── signup.ejs              ← Signup page
│   ├── ask_bros.ejs            ← Main Q&A feed with AI hints
│   ├── help_bros.ejs           ← Stack Overflow style feed
│   ├── question.ejs            ← Question detail + answers + voting
│   ├── edit_question.ejs       ← Edit question page
│   ├── edit_answer.ejs         ← Edit answer page
│   ├── account.ejs             ← Account settings + delete account
│   ├── profile.ejs             ← User profile page
│   ├── leaderboard.ejs         ← Leaderboard page
│   └── dashboard.ejs           ← Teacher dashboard
└── public/
    └── styles/
        ├── askbros.css
        ├── question.css
        ├── helpbros.css
        ├── login.css
        ├── signup.css
        ├── account.css
        ├── dashboard.css
        ├── profile.css
        ├── leaderboard.css
        ├── index.css
        └── about.css
```

---

## ✅ Features

### 🔐 Authentication
- Sign up with username, email, password
- Sign in with Google (restricted to @cpsd.us emails)
- Teacher/dev emails bypass @cpsd.us restriction
- Duplicate email and username check
- Password hashing with bcryptjs (min 6 characters)
- Username validation (3-20 characters)
- Login / Logout (session destroyed on logout)
- Protected routes — must be logged in to access
- Banned users redirected on every request (checked against DB)
- Root `/` redirects to login if not logged in

### ❓ Questions
- Post a question with class, language, and assessment tags
- View all questions on AskBros page (20 per page)
- Answer count shown on each question card
- Edit your own question
- Delete your own question (and all its answers)
- Live search — filters questions as you type
- Filter by class (APCSP, CS2, IT2) and language
- Pagination — 20 questions per page
- Input validation (no empty questions, max 1000 chars)

### 🤖 AI Hints (Gemini)
- As a student types their question, AI suggests similar existing questions
- Triggers after 3 seconds of no typing (debounced)
- Shows up to 3 similar questions with tags
- Vanishes when student clicks a hint
- Has a close button to dismiss
- Powered by Google Gemini 2.5 Flash

### 💬 Answers
- Post answers on question detail page
- Upvote / downvote answers
- Answers sorted by most upvotes
- Edit your own answer
- Delete your own answer
- Username and date shown on each answer
- Input validation (no empty answers, max 5000 chars)

### ✅ Best Answer
- Question owner or teacher can mark one answer as best
- Best answer shown at top with green highlight badge
- Click again to unmark

### 📋 HelpBros Page
- Stack Overflow style feed
- Shows all questions with answer count
- Filter by class and language
- Filter by unanswered questions
- Sort by newest, oldest, or most answered
- Pagination — 20 questions per page

### 👤 Account Page
- Change your username (validates uniqueness)
- Change your password (validates current password)
- Delete your account (anonymizes answered questions, deletes unanswered ones)

### 🧑 Profile Page
- Click any username to see their profile
- Shows all their questions and answers in tabs
- Displays role badge, join date, question/answer counts

### 🏆 Leaderboard
- Shows top contributors ranked by score
- Score = Answers × 10 + Upvotes × 5 + Questions × 2
- Podium display for top 3
- "You" badge highlights current user
- Teacher badge shown next to teacher usernames

### 👩‍🏫 Teacher / Admin System
- Emails in `config/devEmail.js` automatically get teacher role on signup
- Teacher dashboard at `/dashboard` shows:
  - Total users, questions, answers, banned users stats
  - Full user list with roles and status
  - Ban / unban any student
  - Promote student to teacher
  - Delete any question or answer

### 🎨 UI
- Light / Dark mode toggle (preference saved in localStorage)
- Responsive design — works on mobile and desktop
- FalconFlow branding (Slackey + Inter fonts)
- Orange/warm color scheme

### 🔒 Security
- Helmet security headers
- Rate limiting (100 req/15min general, 10 req/15min auth)
- XSS protection via xss-clean
- Banned users checked against DB on every request
- Ownership checks on all edit/delete operations
- Input validation on all forms
- Secrets stored in environment variables (never in code)
- Trust proxy configured for Render deployment
- Session cookie with httpOnly, secure, sameSite settings

### ✅ Full CRUD
| Operation | Questions | Answers |
|---|---|---|
| Create | ✅ Post question | ✅ Post answer |
| Read | ✅ View all questions | ✅ View all answers |
| Update | ✅ Edit your question | ✅ Edit your answer |
| Delete | ✅ Delete your question | ✅ Delete your answer |

---

## 🏃 How to Run Locally

### Prerequisites
- Node.js installed
- Git installed

### Steps

**1. Clone the repo:**
```bash
git clone https://github.com/muhaiminulmugdha/CS3project.git
cd CS3project
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create a `.env` file** in the root of the project:
```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

> Ask Muhtasim on Discord for the credentials

**4. Start the server:**
```bash
npm run server
```

**5. Open in browser:**
```
http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SESSION_SECRET` | Secret key for session encryption |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GEMINI_API_KEY` | Google Gemini API key for AI hints |
| `NODE_ENV` | Set to `production` on Render |

---

## 👩‍🏫 Teacher Access

Add emails to `config/devEmail.js` to give teacher role on signup:

```javascript
const devEmails = [
    'teacher@cpsd.us',
    'admin@cpsd.us',
];

module.exports = devEmails;
```

---

## 🌿 Git Workflow

```bash
# 1. Switch to your branch
git checkout muhtasim

# 2. Make changes and test locally
npm run server

# 3. Commit your changes
git add .
git commit -m "feat: describe what you built"
git push origin muhtasim

# 4. Deploy to Render
git checkout master
git pull origin master
git merge muhtasim
git push origin master
git checkout muhtasim
```

---

## 🌐 Routes Reference

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/` | Redirects to login or index | Public |
| GET | `/login` | Login page | Public |
| POST | `/api/v1/users/login` | Login action | Public |
| GET | `/signup` | Signup page | Public |
| POST | `/api/v1/users/signup` | Signup action | Public |
| GET | `/auth/google` | Google SSO start | Public |
| GET | `/auth/google/callback` | Google SSO callback | Public |
| GET | `/about` | About page | Public |
| GET | `/logout` | Logout | Login required |
| GET | `/ask_bros` | Main Q&A feed | Login required |
| POST | `/ask-question` | Post a question | Login required |
| GET | `/question/:id` | Question detail | Login required |
| POST | `/question/:id/answer` | Post an answer | Login required |
| POST | `/answer/:id/vote` | Upvote/downvote | Login required |
| POST | `/question/:id/best-answer/:answerId` | Mark best answer | Owner/Teacher |
| GET | `/question/:id/edit` | Edit question page | Owner/Teacher |
| POST | `/question/:id/edit` | Save question edit | Owner/Teacher |
| POST | `/question/:id/delete` | Delete question | Owner/Teacher |
| GET | `/answer/:id/edit` | Edit answer page | Owner/Teacher |
| POST | `/answer/:id/edit` | Save answer edit | Owner/Teacher |
| POST | `/answer/:id/delete` | Delete answer | Owner/Teacher |
| GET | `/help_bros` | HelpBros feed | Login required |
| GET | `/leaderboard` | Leaderboard | Login required |
| GET | `/account` | Account settings | Login required |
| POST | `/account/username` | Change username | Login required |
| POST | `/account/password` | Change password | Login required |
| POST | `/account/delete` | Delete account | Login required |
| GET | `/profile/:username` | User profile | Login required |
| POST | `/api/ai/similar-questions` | AI similar questions | Login required |
| GET | `/dashboard` | Teacher dashboard | Teacher only |
| POST | `/dashboard/ban/:id` | Ban/unban user | Teacher only |
| POST | `/dashboard/promote/:id` | Promote to teacher | Teacher only |
| POST | `/dashboard/question/:id/delete` | Delete any question | Teacher only |
| POST | `/dashboard/answer/:id/delete` | Delete any answer | Teacher only |

---

## 👥 Team

| Name | Branch | Assigned |
|---|---|---|
| Mugdho | `mugdho` | TBH |
| Muhtasim | `muhtasim` | Backend + Features |
| Ahnaf | `ahnaf` | Style index.ejs + about.ejs |

