# NotesVault

A modern, full-stack note-taking application built with React and Node.js.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Note Management**: Create, edit, delete, and organize notes
- **Tag System**: Add tags to notes for better organization
- **Search & Filter**: Search notes by title/content and filter by tags
- **Tag Cloud Explorer**: Visual tag cloud with quick filtering
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/PushkarDesai-06/NotesVault.git
   cd NotesVault
   ```
2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=8000
   ```
3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```
4. **Start the Development Servers**

   Backend (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   Frontend (Terminal 2):

   ```bash
   cd frontend
   npm run dev
   ```
5. **Access the Application**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Notes

- `GET /api/notes` - Get all notes (optional: `?tag=tagname`)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note (full)
- `PATCH /api/notes/:id` - Update note (partial)
- `DELETE /api/notes/:id` - Delete note

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Create Notes**: Click "New Note" to create a note with title, content, and tags
3. **Search & Filter**: Use the search bar or tag filters to find specific notes
4. **Tag Explorer**: Visit the Tag Cloud page to explore notes by tags
5. **Edit/Delete**: Click any note to edit or delete it

## Project Structure

```
NotesVault/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── index.js         # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── lib/         # Axios configuration
│   │   └── main.tsx     # App entry point
│   └── package.json
└── README.md
```

## License

This project is licensed under the MIT License.

## Author

**Pushkar Desai**

- GitHub: [@PushkarDesai-06](https://github.com/PushkarDesai-06)
