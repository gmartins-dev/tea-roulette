# Drink Runner Roulette 🫖

A fun and fair way to decide who makes the drinks in your office! Built with Next.js and integrated with the API.

## Features

- ✨ Dynamic participant management
  - Add/remove participants with real-time API sync
  - Clear all participants at once
  - Automatic name parsing (first name + last name)
  - Real-time list updates
- 🎲 Random selection via API
  - Fair selection algorithm
  - Animated result announcement
  - Minimum 2 participants required
  - Persistent user records
- 🎨 Modern UI/UX
  - Dark/Light theme support
  - Responsive design
  - Interactive hover effects
  - Toast notifications
  - Loading states & animations
  - Accessible components
- 💫 Visual Feedback
  - Success/Error notifications
  - Loading indicators
  - Hover animations
  - Theme transitions
- 🔧 Error Handling
  - API error boundaries
  - Graceful fallbacks
  - User-friendly error messages
  - Automatic retries

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React Framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Integration**: Nisien Tea Round Picker API
- **Styling & Components**:
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
  - [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable components
  - [Lucide Icons](https://lucide.dev/) for icons
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Font**: [Roboto](https://fonts.google.com/specimen/Roboto)

## Getting Started

1. **Prerequisites**
   - Node.js 18.x or later
   - Docker and Docker Compose
   - npm 9.x or later

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/tea-roulette.git
   cd tea-roulette

   # Install dependencies
   npm install

   # Start the API (in brent-work directory)
   cd docker
   docker compose up -d

   # Create .env.local in root directory
   echo "NEXT_PUBLIC_API_URL=http://localhost:8794" > .env.local
   echo "API_URL=http://localhost:8794" >> .env.local

   # Start the frontend
   npm run dev
   ```

3. **Open** `http://localhost:3000` in your browser

## API Integration

The application integrates with the your own API, which provides:
- User management
- Random tea maker selection
- Drink run tracking
- Persistent data storage

## Development Guidelines

1. **Code Style**
   - TypeScript best practices
   - Functional components
   - Proper error handling
   - Meaningful component props

2. **API Integration**
   - Proper error handling
   - Loading states
   - Retry logic
   - Type safety

3. **State Management**
   - React hooks for local state
   - Error boundaries
   - Loading states
   - Side effects management

4. **Theme Support**
   - Dark/light mode
   - CSS variables
   - Smooth transitions
   - Consistent palette

## Error Handling

The application includes comprehensive error handling:
- API error boundaries
- User-friendly error messages
- Automatic retries for failed requests
- Loading states for all async operations
