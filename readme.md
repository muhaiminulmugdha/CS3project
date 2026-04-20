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
│   ├── auth.js                 ← Require login middleware
│   └── teacherOnly.js          ← Require teacher role middleware
├── models/
│   ├── User.js                 ← User schema (username, email, password, role, banned, googleId)
│   ├── Question.js             ← Question schema (text, username, class, language, assessment)
│   └── Answer.js               ← Answer schema (text, username, upvotes, downvotes, voters)
├── routes/
│   ├── questionsRoutes.js      ← All question + answer routes
│   ├── feedRoute.js            ← HelpBros feed route
│   ├── teacherRoutes.js        ← Teacher dashboard routes
│   ├── authRoutes.js           ← Google OAuth routes
│   └── users/
│       └── userRoutes.js       ← Auth + account routes
├── views/
│   ├── index.ejs               ← Landing page ← Ahnaf (needs styling)
│   ├── about.ejs               ← About page ← Ahnaf (needs styling)
│   ├── login.ejs               ← Login page (email + Google SSO)
│   ├── signup.ejs              ← Signup page
│   ├── ask_bros.ejs            ← Main Q&A feed
│   ├── help_bros.ejs           ← Stack Overflow style feed
│   ├── question.ejs            ← Question detail + answers
│   ├── edit_question.ejs       ← Edit question page
│   ├── edit_answer.ejs         ← Edit answer page
│   ├── account.ejs             ← Account settings + delete account
│   ├── profile.ejs             ← User profile page
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
        ├── index.css           ← Ahnaf (needs styling)
        └── about.css           ← Ahnaf (needs styling)
```

---

## ✅ Features

### 🔐 Authentication
- Sign up with username, email, password
- Sign in with Google (restricted to @cpsd.us emails)
- Teacher/dev emails bypass @cpsd.us restriction
- Duplicate email and username check
- Password hashing with bcryptjs
- Login / Logout (session destroyed on logout)
- Protected routes — must be logged in to access
- Banned users redirected on login attempt

### ❓ Questions
- Post a question with:
  - Question text
  - Class (APCSP, CS2, IT2)
  - Language (Python, JavaScript, HTML, CSS, Java, C++, Other)
  - Assessment name (optional)
- View all questions on AskBros page (20 per page)
- Answer count shown on each question card
- Class, language, assessment tags shown on cards
- Edit your own question
- Delete your own question (and all its answers)
- Live search — filters questions as you type
- Filter by class and language
- Pagination — 20 questions per page

### 💬 Answers
- Post answers on question detail page
- Upvote / downvote answers
- Answers sorted by most upvotes
- Edit your own answer
- Delete your own answer
- Username and date shown on each answer

### 📋 HelpBros Page
- Stack Overflow style feed
- Shows all questions with answer count
- Filter by class and language
- Pagination — 20 questions per page
- Click any question to go answer it

### 👤 Account Page
- Change your username
- Change your password
- Delete your account (anonymizes answered questions, deletes unanswered ones)

### 🧑 Profile Page
- Click any username to see their profile
- Shows all their questions and answers in tabs
- Displays role badge, join date, question/answer counts

### 👩‍🏫 Teacher / Admin System
- Emails in `config/devEmail.js` automatically get teacher role on signup
- Teachers can also be promoted from the dashboard
- Teacher dashboard at `/dashboard` shows:
  - Total users, questions, answers, banned users stats
  - Full user list with roles and status
  - Ban / unban any student
  - Promote student to teacher
  - Delete any question
  - Delete any answer

### 🎨 UI
- Light / Dark mode toggle (preference saved in localStorage)
- Search bar in center of nav
- FalconFlow branding (Slackey + Inter fonts)
- Orange/warm color scheme
- index.ejs and about.ejs styling → assigned to Ahnaf

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
SESSION_SECRET=falconflow_secret_2026
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
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

For Render deployment, add these in **Render Dashboard → Environment Variables**.

---

## 👩‍🏫 Teacher Access

Add emails to `config/devEmail.js` to give teacher role on signup:

```javascript
const devEmails = [
    'teacher@cpsd.us',
    'admin@cpsd.us',
    // Add more teacher emails here
];

module.exports = devEmails;
```

When they sign up with that email, they automatically get the teacher role.
Teachers can also be promoted by an existing teacher from the `/dashboard` page.

---

## 🌿 Git Workflow

Each team member works on their own branch and merges to master to deploy.

```bash
# 1. Switch to your branch
git checkout "you branch"   # or mugdho or ahnaf

# 2. Make changes and test locally
npm run server

# 3. Commit your changes
git add .
git commit -m "feat: describe what you built"
git push origin "your branch"

# 4. Deploy to Render (merge to master)
git checkout master
git pull origin master
git merge "your branch"
git push origin master

# 5. Go back to your branch
git checkout muhtasim
```

> Render automatically redeploys when master is updated — wait ~2 minutes after pushing

---

## 🌐 Routes Reference

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/` | Landing page | Public |
| GET | `/login` | Login page | Public |
| POST | `/api/v1/users/login` | Login action | Public |
| GET | `/signup` | Signup page | Public |
| POST | `/api/v1/users/signup` | Signup action | Public |
| GET | `/auth/google` | Google SSO start | Public |
| GET | `/auth/google/callback` | Google SSO callback | Public |
| GET | `/logout` | Logout | Login required |
| GET | `/ask_bros` | Main Q&A feed | Login required |
| POST | `/ask-question` | Post a question | Login required |
| GET | `/question/:id` | Question detail | Login required |
| POST | `/question/:id/answer` | Post an answer | Login required |
| GET | `/question/:id/edit` | Edit question page | Owner/Teacher |
| POST | `/question/:id/edit` | Save question edit | Owner/Teacher |
| POST | `/question/:id/delete` | Delete question | Owner/Teacher |
| GET | `/answer/:id/edit` | Edit answer page | Owner/Teacher |
| POST | `/answer/:id/edit` | Save answer edit | Owner/Teacher |
| POST | `/answer/:id/delete` | Delete answer | Owner/Teacher |
| POST | `/answer/:id/vote` | Upvote/downvote | Login required |
| GET | `/help_bros` | HelpBros feed | Login required |
| GET | `/account` | Account settings | Login required |
| POST | `/account/username` | Change username | Login required |
| POST | `/account/password` | Change password | Login required |
| POST | `/account/delete` | Delete account | Login required |
| GET | `/profile/:username` | User profile | Login required |
| GET | `/dashboard` | Teacher dashboard | Teacher only |
| POST | `/dashboard/ban/:id` | Ban/unban user | Teacher only |
| POST | `/dashboard/promote/:id` | Promote to teacher | Teacher only |
| POST | `/dashboard/question/:id/delete` | Delete any question | Teacher only |
| POST | `/dashboard/answer/:id/delete` | Delete any answer | Teacher only |

---

## 👥 Team

| Name | Branch | Assigned |
|---|---|---|
| Mugdho | `mugdho` | TBD |
| Muhtasim | `muhtasim` | Backend + Features |
| Ahnaf | `ahnaf` | Style index.ejs + about.ejs |

---

## 🚧 Still To Do

- [ ] Style `index.ejs` — Ahnaf
- [ ] Style `about.ejs` — Ahnaf
- [ ] Best/verified answer feature
- [ ] Notifications

---

## 🤝 Discord

Team communication on Discord:

| Channel | Purpose |
|---|---|
| `#general` | General chat |
| `#code-help` | Ask for coding help |
| `#bugs` | Report bugs |
| `#features` | Feature ideas |
| `#git-updates` | Paste commit messages |