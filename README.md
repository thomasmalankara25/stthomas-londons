# St. Thomas Malankara Catholic Church Website

A modern, feature-rich website for St. Thomas Malankara Catholic Church built with Next.js 14, featuring a comprehensive admin panel, event management, news system, and rich content editing capabilities.

## 🚀 Features

### 🌐 Public Website
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Hero Section**: Video background with animated content and church branding
- **Mass Information**: Dynamic display of church details, mass times, and contact information
- **Events Management**: 
  - Interactive events carousel with navigation
  - Individual event detail pages
  - Event registration system
  - Support for external registration links
- **News System**: 
  - News carousel with category filtering
  - Individual news article pages
  - Rich content display
- **Community Section**: Dedicated page for community information
- **About Us**: Church information and history
- **Navigation**: Responsive navigation with mobile menu
- **Footer**: Contact information and social links

### 🔐 Admin Panel
- **Authentication System**: Secure login with session management
- **Dashboard Overview**: 
  - Content statistics (news, events, registrations)
  - Quick action buttons
  - Recent activity feed
- **Content Management**:
  - **News Management**: Create, edit, delete, and publish news articles
  - **Events Management**: Create, edit, delete, and manage events
  - **Registration Management**: View and manage event registrations
  - **Membership Management**: Handle church membership applications
- **Settings Management**: 
  - Church information configuration
  - Mass schedule settings
  - Contact details management
- **Rich Text Editor**: Advanced content editing with TipTap editor

### 📝 Content Features
- **Rich Text Editing**: Full-featured editor with formatting tools
  - Bold, italic, underline
  - Text alignment (left, center, right, justify)
  - Link management
  - HTML content storage
- **Image Management**: AWS S3 integration for image uploads
- **Content Categories**: Organized content with category system
- **Status Management**: Draft/published status for content workflow

### 🎯 Event System
- **Event Types**: Support for different registration methods
  - No registration required
  - Internal registration forms
  - External registration links
- **Registration Forms**: Customizable form fields
- **Date & Time Management**: Flexible event scheduling
- **Location & Category Support**: Organized event information

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14**: React framework with App Router
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Advanced animations and transitions

### UI Components & Libraries
- **Radix UI**: Accessible component primitives
  - Tabs, Dialog, Switch, Label, Separator
- **Lucide React**: Beautiful icon library
- **Class Variance Authority**: Component variant management
- **Tailwind CSS Animate**: Animation utilities

### Rich Text Editing
- **TipTap**: Modern rich text editor
  - Starter Kit with basic formatting
  - Link extension
  - Text alignment
  - Underline support
  - HTML output

### Backend & Database
- **Supabase**: Open-source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication system

### Cloud Services
- **AWS S3**: Image and file storage
  - Presigned URLs for secure uploads
  - CORS configuration
  - Bucket management

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing
- **pnpm**: Fast package manager

## 🏗️ Project Architecture

### Directory Structure
```
stthomas-londons/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes
│   ├── events/            # Event-related pages
│   ├── news/              # News-related pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/             # Reusable React components
│   ├── ui/                # Base UI components
│   ├── admin-*.tsx        # Admin-specific components
│   └── *.tsx              # General components
├── lib/                    # Utility libraries
│   ├── api/               # API service layers
│   ├── supabase.ts        # Database configuration
│   ├── auth.ts            # Authentication logic
│   └── utils.ts           # Helper functions
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
├── scripts/                # Database setup scripts
└── styles/                 # Additional styling
```

### Key Components

#### Core Components
- **`AnimatedWrapper`**: Framer Motion wrapper for animations
- **`AnimatedSection`**: Animated content sections
- **`EventsCarousel`**: Interactive events display
- **`NewsCarousel`**: News articles carousel
- **`RichTextEditor`**: TipTap-based content editor

#### Admin Components
- **`AdminAuthGuard`**: Route protection for admin pages
- **`AdminNavigation`**: Admin panel navigation
- **`AdminPanel`**: Main admin dashboard

#### UI Components
- **`Button`**: Customizable button component
- **`Card`**: Content card layouts
- **`Tabs`**: Tabbed interface
- **`Badge`**: Status and category badges
- **`Form`**: Form components with validation

### Service Layer Architecture
- **`eventsService`**: Event CRUD operations
- **`newsService`**: News article management
- **`massService`**: Church settings management
- **`membershipService`**: Membership applications
- **`authService`**: Authentication management
- **`s3UploadService`**: File upload handling

## 🗄️ Database Schema

### Core Tables
- **`events`**: Event information and registration settings
- **`news`**: News articles and content
- **`mass`**: Church settings and mass information
- **`event_registrations`**: Event registration data
- **`membership_applications`**: Church membership requests

### Key Fields
- **Events**: title, description, event_date, location, category, registration_form, external_link
- **News**: title, description, content, author, category, status, image_url
- **Mass Settings**: church_name, email, mass_time, address

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Supabase account and project
- AWS S3 bucket and credentials

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd stthomas-londons

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and AWS credentials

# Run database setup scripts
# Execute scripts/create-tables.sql in your Supabase SQL editor
# Execute scripts/create-mass-table.sql for mass settings

# Start development server
pnpm dev
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_bucket_name
```

## 📱 Responsive Design

The website is built with a mobile-first approach using Tailwind CSS:
- **Mobile**: Optimized for small screens with collapsible navigation
- **Tablet**: Adaptive layouts for medium screens
- **Desktop**: Full-featured layouts with enhanced navigation

## 🎨 Design System

### Color Palette
- **Primary**: #A67C52 (Warm brown)
- **Secondary**: #8B6F47 (Darker brown)
- **Accent**: #D4B896 (Light beige)
- **Background**: #f8f4ef (Warm off-white)

### Typography
- **Headings**: Bold, hierarchical typography
- **Body**: Readable sans-serif fonts
- **Rich Text**: Properly styled HTML content

### Animations
- **Page Transitions**: Smooth page-to-page navigation
- **Component Animations**: Framer Motion-powered interactions
- **Hover Effects**: Interactive element feedback

## 🔒 Security Features

- **Authentication**: Secure admin login system
- **Route Protection**: Protected admin routes
- **Input Validation**: Form validation and sanitization
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure credential management

## 🚀 Deployment

### Build Process
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Deployment Options
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site generation support
- **AWS**: Full-stack deployment
- **Docker**: Containerized deployment

## 📊 Performance Features

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages for better SEO
- **CDN Integration**: AWS S3 for static asset delivery
- **Responsive Images**: Adaptive image sizing

## 🔧 Development Features

- **Hot Reloading**: Fast development iteration
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code quality enforcement
- **Component Library**: Reusable UI components
- **API Routes**: Serverless API endpoints

## 📈 Future Enhancements

- **Real-time Updates**: WebSocket integration for live content
- **Advanced Analytics**: User behavior tracking
- **Multi-language Support**: Internationalization
- **Advanced Search**: Full-text search capabilities
- **Email Integration**: Newsletter and notification system
- **Mobile App**: React Native companion app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for St. Thomas Malankara Catholic Church.

## 📞 Support

For technical support or questions about the website, please contact the church administration.

---

**Built with ❤️ for St. Thomas Malankara Catholic Church**