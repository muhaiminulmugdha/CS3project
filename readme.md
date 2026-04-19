Here's the updated `README.md`:

```markdown
# FalconFlow 🦅

A Q&A platform for high school CS students to ask and answer questions — like a mini Stack Overflow.

---

## 🌐 Live Site
https://falconflow-f30q.onrender.com

---

## 🚀 Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (cloud)
- **View Engine:** EJS
- **Auth:** bcryptjs + express-session
- **Hosting:** Render (auto deploys from master branch)

---

## 📁 Project Structure

CS3project/
├── index.js
├── .env
├── config/
│   ├── db.js
│   └── devEmail.js
├── middleware/
│   ├── auth.js
│   └── teacherOnly.js
├── models/
│   ├── User.js
│   ├── Question.js
│   └── Answer.js
├── routes/
│   ├── questionsRoutes.js
│   ├── feedRoute.js
│   ├── teacherRoutes.js
│   ├── routes.js
│   └── users/
│       └── userRoutes.js
├── views/
│   ├── index.ejs
│   ├── about.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── ask_bros.ejs
│   ├── help_bros.ejs
│   ├── question.ejs
│   ├── edit_question.ejs
│   ├── account.ejs
│   ├── dashboard.ejs
│   └── comment_here.ejs
└── public/
    └── styles/
        ├── askbros.css
        ├── question.css
        ├── helpbros.css
        ├── login.css
        ├── signup.css
        ├── account.css
        ├── dashboard.css
        ├── index.css
        └── about.css

---

## ✅ Features Completed

### Auth
- Signup with duplicate email and username check
- Login with bcrypt password hashing
- Session-based authentication
- Protected routes (login required)
- Banned user detection on login

### Questions
- Post questions (logged in users only)
- View all questions (AskBros page)
- View question detail with answers
- Edit your own question
- Delete your own question
- Live search on AskBros and HelpBros pages
- Username shown on each question

### Answers
- Post answers on question detail page
- Username shown on each answer

### HelpBros Page
- Stack Overflow style feed
- Shows all questions with answer count
- Ask Question button

### Account Page
- Change username
- Change password

### Teacher / Admin System
- Email whitelist in `config/devEmail.js`
- Teacher role assigned on signup automatically
- Teacher dashboard at `/dashboard`
- Dashboard shows: total users, questions, answers, banned users
- Ban / unban any student
- Promote student to teacher
- Delete any question from dashboard

### UI
- Light / Dark mode toggle (saved in localStorage)
- Search bar in center of nav (live search)
- Responsive design
- FalconFlow branding (Slackey + Inter fonts)

### Full CRUD
- ✅ Create — post questions and answers
- ✅ Read — view questions and answers
- ✅ Update — edit your own questions
- ✅ Delete — delete your own questions

---

## 🚧 Still To Do

- [ ] Fix logout (clear session properly)
- [ ] Answer count on AskBros question cards
- [ ] Delete answers from teacher dashboard
- [ ] Style remaining pages (about, comment_here)
- [ ] Answer edit feature
- [ ] Notifications

---

## 🏃 How to Run Locally

```bash
cd CS3project
npm install
npm run server
```

Open: http://localhost:3000

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

For Render deployment, add these in the Render dashboard under Environment Variables.

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

Teachers can also promote students to teacher from the dashboard.

---

## 👥 Team

- **Mugdho** — branch: `mugdho`
- **Muhtasim** — branch: `muhtasim`
- **[Third friend]** — branch: TBD

---

## 🌿 Git Workflow

```bash
# Work on your branch
git checkout muhtasim

# Make changes and test locally
npm run server

# Commit when done
git add .
git commit -m "feat: your feature description"
git push origin muhtasim

# Deploy to Render
git checkout master
git merge muhtasim
git push origin master
git checkout muhtasim
```

---

## 🤝 Discord

Team communication on Discord — channels:
- `#general`
- `#code-help`
- `#bugs`
- `#features`
- `#git-updates`
```
