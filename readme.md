# FalconFlow 🦅

A Q&A platform for high school CS students to ask and answer questions — like a mini Stack Overflow.

---

## 🚀 Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (cloud)
- **View Engine:** EJS
- **Auth:** bcryptjs + express-session
- **Hosting:** Render (coming soon)

---

## 📁 Project Structure

```
CS3project/
├── index.js
├── package.json
├── package-lock.json
├── readme.md
├── .gitignore
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Question.js
│   └── Answer.js
├── routes/
│   ├── questionsRoutes.js
│   ├── feedRoute.js
│   ├── commentsRoutes.js
│   ├── routes.js
│   └── users/
│       └── userRoutes.js
├── views/
│   ├── index.ejs
│   ├── about.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── ask_bros.ejs
│   ├── question.ejs
│   ├── help_bros.ejs
│   └── comment_here.ejs
└── public/
    └── styles/
        ├── askbros.css
        ├── question.css
        ├── login.css
        ├── signup.css
        ├── index.css
        ├── about.css
        └── helpbros.css
```
---

## ✅ Completed (April 18, 2026)

- Switched from MySQL to MongoDB Atlas (cloud database)
- Connected MongoDB using Mongoose
- Questions can be posted and displayed on AskBros page
- Clicking a question opens a detail page (`/question/:id`)
- Answers can be posted on the question detail page
- Light/Dark mode toggle on AskBros and Question pages
- Login page with error message display
- Signup route with password hashing (bcryptjs)
- Fixed CSS loading issues (added `/` to stylesheet paths)
- Removed duplicate Question model definition
- Session setup with express-session

---


## 🏃 How to Run Locally

cd CS3project
npm install
npm run server

Open: http://localhost:3000

---

## 🔐 Environment Variables (for deployment)

When deploying to Render, add these:
- `MONGODB_URI` — your MongoDB Atlas connection string
- `SESSION_SECRET` — a secret string for sessions

---

## 👥 Team

- **Mugdho** — branch: `mugdho`
- **Muhtasim** — branch: `muhtasim`
- **Ahnaf** — branch: `ahnaf`

---

## 🌿 Git Workflow

1. Pull latest from `master`
2. Work on your own branch
3. Push changes
4. Create Pull Request → `master`
