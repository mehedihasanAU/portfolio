# Modern Portfolio Website with Admin Panel

A stunning 3D interactive portfolio website with an Apple-inspired color scheme and a full-featured admin panel for content management.

## Features

- **3D Interactive Room Environment** - Built with Three.js
- **Apple-Inspired Design** - Clean gray color palette matching Apple's aesthetic
- **Smooth Animations** - GSAP-powered transitions and effects
- **Admin Panel** - Manage all content without touching code
- **Backend API** - RESTful API with JWT authentication
- **Responsive Design** - Works beautifully on all devices
- **Dark/Light Theme** - Toggle between themes seamlessly

## Tech Stack

### Frontend
- **Vite** - Build tool
- **Three.js** - 3D graphics
- **GSAP** - Animations
- **Sass** - Styling
- **Howler.js** - Audio

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **Multer** - File uploads

## Installation

### Prerequisites

Make sure you have Node.js installed (v16 or higher recommended).

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up the Database

Run the seed script to create the database and populate it with initial data:

```bash
npm run seed
```

This will create:
- An admin user (username: `admin`, password: `admin123`)
- Initial portfolio content from your information

### Step 3: Start the Backend Server

In one terminal, start the backend server:

```bash
npm run server
```

The server will run on `http://localhost:3000`

### Step 4: Start the Frontend Development Server

In another terminal, start the Vite development server:

```bash
npm run dev
```

The portfolio will be available at `http://localhost:5173` (or another port if 5173 is busy)

## Usage

### Accessing the Admin Panel

1. Open your browser and go to: `http://localhost:5173/admin/admin.html`
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`

### Managing Content

Once logged in, you can:

- **Update About Me** - Edit your bio, title, and profile image
- **Manage Work Experience** - Add, edit, or delete work entries
- **Manage Publications** - Add, edit, or delete publications
- **Update Contact Info** - Change your email, GitHub, LinkedIn, and Instagram links
- **Upload Images** - Upload new images for your profile and work entries

### Viewing the Portfolio

Simply open `http://localhost:5173` to see your portfolio website.

## Project Structure

```
sooahs-room-folio/
├── admin/                  # Admin panel files
│   ├── admin.html         # Admin dashboard
│   ├── admin.css          # Admin styles
│   └── admin.js           # Admin functionality
├── server/                # Backend server
│   ├── server.js          # Express server
│   ├── auth.js            # Authentication
│   ├── database.js        # Database operations
│   ├── portfolio.js       # Portfolio API routes
│   ├── seed.js            # Database seeding
│   ├── uploads/           # Uploaded images
│   └── portfolio.db       # SQLite database
├── src/                   # Frontend source
│   ├── main.js            # Main JavaScript
│   ├── api.js             # API integration
│   ├── style.scss         # Main styles
│   ├── shaders/           # GLSL shaders
│   └── styles/            # Additional styles
├── public/                # Static assets
│   └── images/            # Images
├── index.html             # Main HTML file
├── package.json           # Dependencies
└── .env                   # Environment variables
```

## API Endpoints

### Public Endpoints
- `GET /api/portfolio/all` - Get all portfolio data
- `GET /api/portfolio/about` - Get about section
- `GET /api/portfolio/work` - Get work experience
- `GET /api/portfolio/publications` - Get publications
- `GET /api/portfolio/contact` - Get contact info

### Protected Endpoints (Require Authentication)
- `POST /api/auth/login` - Login
- `PUT /api/portfolio/about` - Update about section
- `POST /api/portfolio/work` - Add work experience
- `PUT /api/portfolio/work/:id` - Update work experience
- `DELETE /api/portfolio/work/:id` - Delete work experience
- `POST /api/portfolio/publications` - Add publication
- `PUT /api/portfolio/publications/:id` - Update publication
- `DELETE /api/portfolio/publications/:id` - Delete publication
- `PUT /api/portfolio/contact` - Update contact info
- `POST /api/portfolio/upload` - Upload image

## Customization

### Changing Admin Password

1. Access the admin panel
2. Or manually update the database using a SQLite browser
3. Or modify the `server/seed.js` file and re-run `npm run seed`

### Updating Colors

The Apple color scheme is defined in:
- `src/style.scss` - Main color variables
- `src/shaders/theme/fragment.glsl` - 3D scene colors
- `admin/admin.css` - Admin panel colors

### Environment Variables

Edit `.env` file to change:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)

## Building for Production

### Build the Frontend

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Deploy

1. Upload the `dist/` folder to your web host
2. Upload the `server/` folder to your Node.js server
3. Set up environment variables on your server
4. Run `npm install --production` on the server
5. Start the server with `npm start`

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use, you can change them:
- Backend: Edit `PORT` in `.env`
- Frontend: Vite will automatically use the next available port

### Database Issues

If you encounter database errors:
1. Delete `server/portfolio.db`
2. Run `npm run seed` again

### API Connection Issues

Make sure:
1. The backend server is running (`npm run server`)
2. The API_BASE_URL in `admin/admin.js` and `src/api.js` matches your server URL

## Credits

- Original design inspired by Kim Soo-ah's Room Portfolio
- 3D environment built with Three.js
- Animations powered by GSAP
- Apple color palette

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

---

**Admin Credentials (Default)**
- Username: `admin`
- Password: `admin123`

**⚠️ Important**: Change the admin password and JWT secret before deploying to production!
