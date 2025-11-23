🌟 Inkle Assignment – Data Table Application

A modern, responsive React-based data table application featuring advanced filtering, editing workflows, and dynamic country management — all wrapped in a clean, intuitive user interface.


---

✨ Features

📊 Interactive Data Table powered by TanStack Table

🌍 Multi-Select Country Filter for advanced filtering

✏️ Edit Modal with clean UI and validation

🔧 Dynamic Country Editing connected to MockAPI

📱 Fully Responsive layout

🎨 Modern UI/UX styling

✅ Form Validation & Error Handling



---

🛠️ Technologies Used

React 18

TanStack Table v8

CSS3

MockAPI (for CRUD)



---

🚀 Getting Started

Prerequisites

Node.js 14+

npm or yarn



---

Installation

# 1. Clone the repository
git clone <repository-url>
cd my-app

# 2. Install dependencies
npm install

# 3. Optional: Environment variables
cp .env.example .env.local

# 4. Start development server
npm run dev

App runs at:

http://localhost:5174


---

🔌 API Endpoints

Data Type	Endpoint

Customers	https://685013d7e7c42cfd17974a33.mockapi.io/taxes
Countries	https://685013d7e7c42cfd17974a33.mockapi.io/countries



---

📁 Project Structure

src/
├── components/
│   ├── DataTable.jsx
│   ├── DataTable.css
│   ├── EditModal.jsx
│   └── EditModal.css
├── App.jsx
├── App.css
└── index.css


---

🧩 Core Components

DataTable

Sortable table

Multi-select country filter

Integrates EditModal


EditModal

Clean dropdown design

Edit country names dynamically

Form validation & error UI



---

🏗️ Build for Production

npm run build

Output is created in:

dist/


---

🚀 Deployment

Netlify

npm run build

Deploy the dist/ folder.

Vercel

npm run build

Deploy using the Vercel dashboard.

GitHub Pages

npm run build
# Push dist contents to gh-pages branch


---

🛠️ Development Tools

# Lint project
npm run lint

# Preview production build
npm run preview


---


🤝 Contributing

# 1. Fork the project
# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Commit changes
git commit -m "✨ Added amazing feature"

# 4. Push to GitHub
git push origin feature/amazing-feature

# 5. Open Pull Request


---

📄 License

This project was created for the Inkle Assignment.


---

⭐ Support

If you liked this project, please consider giving it a ⭐ on GitHub!
