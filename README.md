# Task Management Application

A modern task management application built with React and MongoDB, featuring a clean UI and powerful task organization capabilities.

## Features

- Task creation, editing, and deletion
- Task categorization and priority levels
- Calendar view for task scheduling
- Task statistics and analytics
- Responsive design for mobile and desktop
- Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd task-management
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Environment Setup

1. Create a MongoDB Atlas account and database
2. Configure environment variables:
   - MONGODB_URI: Your MongoDB connection string
   - PORT: Server port (default: 3000)
   - NODE_ENV: Development/production environment

## Project Structure

```
task-management/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Dashboard.js
│   │   │   └── Navbar.js
│   │   └── tasks/
│   │       ├── TaskList.js
│   │       ├── TaskForm.js
│   │       ├── TaskStats.js
│   │       └── TaskCard.js
│   ├── contexts/
│   │   └── TaskContext.js
│   └── App.js
├── public/
├── .env
├── .gitignore
└── package.json
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [your-email@example.com]
Project Link: [https://github.com/yourusername/task-management] 