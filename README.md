<div align="center">

# 🚨 ResQ-Now — Emergency Resource Connect

**A real-time, community-powered emergency resource sharing platform**  
Connecting citizens, volunteers, NGOs, hospitals, and donors during emergencies for faster coordination and response.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>


---

## 🌟 About

**ResQ-Now** is an emergency resource coordination platform built to save lives by bridging the gap between those in need and those who can help. During disasters and emergencies, every second counts — ResQ-Now enables real-time communication and resource sharing between citizens, volunteers, NGOs, hospitals, and donors.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📍 **Emergency Requests** | Real-time posting and tracking of emergency requests |
| 🗺️ **Location-Based Tracking** | Map-integrated resource and volunteer tracking |
| 🧑‍🤝‍🧑 **Volunteer & NGO Coordination** | Structured system for volunteers and organizations to coordinate |
| 🩸 **Resource & Blood Requests** | Dedicated blood donation and resource request system |
| 🔐 **Authentication** | Secure user authentication powered by Supabase Auth |
| ⚡ **Real-Time Updates** | Live database synchronization using Supabase Realtime |
| 📱 **Responsive UI** | Fast, mobile-friendly interface built with Next.js App Router |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 |
| **Backend** | Supabase |
| **Styling** | Tailwind CSS |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account

### 1. Clone the Repository

```bash
git clone https://github.com/shiwanijha48-bot/ResQ-Now.git
cd ResQ-Now
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 🔒 **Never commit your `.env.local` file.** It is already listed in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📁 Project Structure

```
ResQ-Now/
├── app/                # Pages and routes (Next.js App Router)
├── components/         # Reusable UI components
├── lib/                # Supabase client configuration
├── public/             # Static assets (images, icons)
├── .env.local          # Environment variables (not committed)
├── tailwind.config.js  # Tailwind CSS configuration
└── next.config.js      # Next.js configuration
```

---

## 🔥 Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New Project** and fill in the details
3. Once the project is ready, go to **Project Settings → API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon / Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Paste them into your `.env.local` file

> 💡 You may also need to create your database tables. Check the `/lib` folder for schema references.

---

## 📌 Future Improvements

1. 🤖 AI-based emergency matching system
2. 📲 SMS / WhatsApp alert notifications
3. 🛡️ Admin dashboard for monitoring requests
4. 📱 Mobile app version (React Native)
5. ✅ Verified volunteer badge system
6. 🌍 Multi-language support

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'Add: your feature description'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

> For major changes, please open an **Issue** first to discuss what you'd like to change.

---


## 💡 Author

<div align="center">

Built with ❤️ by **Shiwani Jha**

[![GitHub](https://img.shields.io/badge/GitHub-shiwanijha48--bot-181717?style=for-the-badge&logo=github)](https://github.com/shiwanijha48-bot)

*If you find this project helpful, please consider giving it a ⭐ on GitHub!*

</div>
