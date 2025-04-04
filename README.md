# Community Entrepreneurship Platform - Frontend

## Project Overview

This platform aims to address the high unemployment and underemployment rates in Cameroon, particularly among youth and women, by creating a digital ecosystem that connects local entrepreneurs with potential partners, investors, and resources.

### Project Mission

The Community Entrepreneurship Platform is designed to strengthen the entrepreneurial ecosystem in Cameroon by:

- Connecting local entrepreneurs with financial, technical, and institutional partners
- Providing communities with reliable, up-to-date information about economic opportunities
- Facilitating networking between entrepreneurs, investors, and experts
- Offering project management and tracking tools for local communities
- Supporting crowdfunding and grant access for entrepreneurs
- Promoting community-based entrepreneurial initiatives

The platform particularly targets young people, women, and vulnerable groups in regions with limited economic opportunities, aligning with local development initiatives promoted by the Ministry of Small and Medium Enterprises and local NGOs.

## Frontend Implementation

This repository contains the frontend implementation of the Community Entrepreneurship Platform, built with React.js and Vite.

### Tech Stack

- **React.js**: Frontend library for building user interfaces
- **Vite**: Next-generation frontend build tool
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Declarative routing for React applications
- **Axios**: Promise-based HTTP client for making API requests
- **Context API**: For state management

### Getting Started

#### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

#### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-organization/community-entrepreneurship-platform-frontend.git
   cd community-entrepreneurship-platform-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Project Structure

```
src/
├── assets/            # Static assets (images, fonts, etc.)
├── components/        # Reusable UI components
│   ├── auth/          # Authentication-related components
│   ├── common/        # Common UI elements (buttons, inputs, etc.)
│   ├── dashboard/     # Dashboard components
│   ├── projects/      # Project-related components
│   └── profile/       # User profile components
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
├── layouts/           # Page layout components
├── pages/             # Top-level page components
├── services/          # API service functions
├── utils/             # Utility functions
├── App.jsx            # Main application component
└── main.jsx          # Application entry point
```

### Key Features Implemented

1. **User Management**
   - User registration and authentication
   - Role-based user profiles (entrepreneurs, investors, NGOs, institutions)
   - Profile customization with skills, project history, and specific needs

2. **Project Publication & Promotion**
   - Project creation with descriptions, objectives, budgets, and media
   - Crowdfunding campaign integration
   - Interactive dashboard for tracking project progress

3. **Networking & Collaboration**
   - Partner search functionality with specific criteria
   - Community events calendar
   - Integrated messaging system

4. **Resource Access**
   - Digital library with educational resources
   - Opportunities listings (grants, competitions)

5. **Impact Tracking**
   - Performance dashboard with key indicators
   - Collaboration history tracking

6. **Advanced Features**
   - Geolocation of projects and partners
   - Socioeconomic impact analysis tools
   - Offline mode for essential information

### User Roles

The frontend implements different views and permissions for these user types:
- Entrepreneurs
- Investors
- NGOs and associations
- Public institutions
- Super Administrators

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the [MIT License](LICENSE).

### Backend Integration

This frontend connects to a Django backend with PostgreSQL database. See the backend repository for API documentation and setup instructions.