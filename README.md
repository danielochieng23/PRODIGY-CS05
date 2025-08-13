# Rubica.com - Premium Classifieds Website

A modern, full-stack classifieds website built with React, Node.js, and MongoDB. Inspired by skokka.in, this platform provides a comprehensive solution for classified advertisements with user authentication, ad management, and responsive design.

## Features

- **User Authentication**: Secure registration, login, and profile management
- **Ad Management**: Create, edit, delete, and browse classified ads
- **Search & Filtering**: Advanced search with location and category filters
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Image Upload**: Support for multiple image uploads per ad
- **Categories**: Organized ad categories and subcategories
- **Location-based**: City and state-based ad filtering
- **Premium Ads**: Featured/premium ad highlighting

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Express-validator** for input validation

### Frontend
- **React 18** with functional components
- **React Router DOM** for navigation
- **React Query** for state management
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Montserrat** font family
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rubica-website
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rubica
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   
   # Email Configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Cloudinary Configuration (optional)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Frontend URL
   CLIENT_URL=http://localhost:3000
   ```

4. **Seed the database** (optional)
   ```bash
   cd backend
   node seeds/categories.js
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server at `http://localhost:5000`
   - Frontend server at `http://localhost:3000`

## Project Structure

```
rubica-website/
├── backend/
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── seeds/             # Database seed files
│   ├── uploads/           # File upload directory
│   ├── utils/             # Utility functions
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server entry point
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main App component
│   │   └── index.js       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json           # Root package.json
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Ads
- `GET /api/ads` - Get all ads (with filtering)
- `GET /api/ads/:id` - Get single ad
- `POST /api/ads` - Create new ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad
- `GET /api/ads/user/my-ads` - Get user's ads

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin only)

### Locations
- `GET /api/locations/cities` - Get popular cities
- `GET /api/locations/states` - Get states

### Users
- `GET /api/users/:id` - Get user by ID

## Styling & Design

The website uses:
- **Montserrat** font family throughout
- **Tailwind CSS** for responsive design
- **Custom color palette** with primary red theme
- **Mobile-first** responsive approach
- **Modern UI/UX** with smooth animations

## Development Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-deps` - Install all dependencies

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features Implementation Status

- ✅ Project setup and structure
- ✅ Backend API with authentication
- ✅ Database models and relationships
- ✅ Frontend with React and routing
- ✅ User authentication system
- ✅ Homepage with search and categories
- ✅ Responsive design with Montserrat font
- 🚧 Ad posting and management (basic structure)
- 🚧 Search and filtering functionality (basic structure)
- 🚧 Image upload and gallery
- 🚧 Advanced user features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by skokka.in
- Built with modern web technologies
- Montserrat font by Julieta Ulanovsky

---

**Note**: This is a educational/portfolio project. Ensure compliance with local laws and regulations when deploying for actual use.