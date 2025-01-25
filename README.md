# Tea Roulette 🫖

Ever had that awkward moment in the office when everyone's craving tea, but no one wants to make it? Tea Roulette is here to save the day! It's a fun, fair, and simple web app that randomly picks who's making the next round of tea.

![Tea Roulette Demo](public/demo.gif) <!-- TODO deploy at Vercel and maybe a demo video/gif/screenshots -->

## What's This All About? 🤔

You know how it goes - it's always the same people volunteering to make tea, while others mysteriously disappear when it's tea time. Tea Roulette brings some fun and fairness to the age-old office tea round by:

- 🎲 Randomly selecting who makes the tea
- 👥 Letting you add or remove people easily
- 🎮 Making the selection process fun with animations
- 📱 Working on any device (phones, tablets, computers)
- ⚡ Being super quick and easy to use

## Features

- ✨ Dynamic participant management
  - Add/remove individual participants
  - Clear all participants at once
  - Duplicate name validation
  - Real-time list updates
- 🎲 Random selection
  - Fair selection algorithm
  - Animated result announcement
  - Minimum 2 participants required
- 🎨 Modern UI/UX
  - Dark/Light theme support
  - Responsive design
  - Interactive hover effects
  - Toast notifications
  - Accessible components
- 💫 Visual Feedback
  - Success/Error notifications
  - Loading states
  - Hover animations
  - Theme transitions

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React Framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling & Components**:
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
  - [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable components built with:
    - [Radix UI](https://www.radix-ui.com/) (for primitive components)
    - [Tailwind CSS](https://tailwindcss.com/) (for styling)
    - [Class Variance Authority](https://cva.style/docs) (for component variants)
  - [Lucide Icons](https://lucide.dev/) for icons
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- **Font**: [Roboto](https://fonts.google.com/specimen/Roboto) from Google Fonts

## Recent Updates

- 🌓 Added dark/light theme toggle
- 🎨 Enhanced toast notifications with success variant
- 🔄 Clear all participants functionality
- 💅 Improved button hover effects
- 📱 Better mobile responsiveness
- 🎯 Enhanced visual feedback for actions
- ♿ Improved accessibility

## How to Use It 🚀

1. **Add Your Team**:
   - Type in everyone's name who wants tea
   - Click 'Add' or hit Enter to add them to the list
   - You'll see everyone's name appear as little tags

2. **Pick a Tea Maker**:
   - Click the big 'Select Tea Maker' button
   - Watch as it randomly selects someone
   - The chosen one's name will be highlighted
   - Time to put the kettle on! ☕

3. **Managing the List**:
   - Remove someone by clicking the '×' on their name tag
   - Add new people anytime
   - Start fresh whenever you want

## Why Use Tea Roulette? 🌟

- ✨ **Fair for Everyone**: No more "I made it last time!" debates
- 🎯 **Quick Decisions**: No more time wasted deciding who's turn it is
- 🎮 **Makes it Fun**: Turns a chore into a game
- 👥 **Team Building**: Great for office morale
- 🚀 **Super Simple**: No training needed, just add names and go!

## For the Tech-Curious 🤓

If you're interested in the technical details, Tea Roulette is built with:

- Modern web technologies for speed and reliability
- Beautiful, accessible design that works for everyone
- Secure and privacy-focused (no data stored)
- Open source - feel free to peek under the hood!

[Technical details are expanded in the sections below]

## Installation 🛠️

For those who want to run their own version:

1. Clone this project
2. Run `npm install`
3. Start it with `npm run dev`
4. Open `http://localhost:3000` in your browser

## Technical Details 🔧

### Tech Stack & Architecture

- **Frontend Framework**: [Next.js 14](https://nextjs.org/)
  - Server-side rendering for better performance
  - App Router for modern routing
  - React Server Components for optimal loading

- **Language**: [TypeScript](https://www.typescriptlang.org/)
  - Type safety for better development experience
  - Reduced runtime errors
  - Better code documentation

- **UI & Styling**:
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
  - [shadcn/ui](https://ui.shadcn.com/) components built with:
    - Radix UI primitives for accessibility
    - Class Variance Authority for component variants
    - Tailwind CSS for styling
  - [Lucide Icons](https://lucide.dev/) for consistent iconography
  - [Roboto](https://fonts.google.com/specimen/Roboto) font for clean typography

### Features In-Depth

1. **Participant Management**
   - Dynamic addition/removal of team members
   - Duplicate name validation
   - Real-time list updates
   - Input validation and error handling

2. **Tea Maker Selection**
   - Randomized selection algorithm
   - Animated selection process
   - Toast notifications for results
   - Minimum participant validation

3. **User Interface**
   - Responsive design for all screen sizes
   - Accessible components (ARIA compliant)
   - Interactive animations and transitions
   - Clear visual feedback for actions

4. **Performance**
   - Client-side state management
   - Optimized bundle size
   - Fast page loads
   - No external API dependencies

### Project Structure

```
tea-roulette/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with font setup
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and Tailwind
├── components/            # React components
│   └── ui/               # shadcn/ui components
│       ├── button.tsx    # Button component
│       ├── card.tsx      # Card component
│       ├── input.tsx     # Input component
│       ├── label.tsx     # Label component
│       ├── toast.tsx     # Toast notifications
│       └── use-toast.ts  # Toast hook
├── lib/                   # Utility functions
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

### Running Locally

1. **Prerequisites**
   - Node.js 18.x or later
   - npm 9.x or later

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/tea-roulette.git
   cd tea-roulette

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

3. **Available Scripts**
   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm start` - Run production build
   - `npm run lint` - Run ESLint

4. **Environment Setup**
   - No environment variables required
   - Works out of the box
   - Optional: Configure port via `next.config.js`

### Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use functional components
   - Implement proper error handling
   - Write meaningful component props

2. **Component Structure**
   - Keep components small and focused
   - Use composition over inheritance
   - Implement proper prop typing
   - Follow shadcn/ui patterns

3. **State Management**
   - Use React hooks for local state
   - Implement proper error boundaries
   - Handle loading states
   - Manage side effects properly

4. **Theme Support**
   - Support both dark and light modes
   - Use CSS variables for theming
   - Smooth theme transitions
   - Consistent color palette

### Future Enhancements

- [ ] Persistent storage for teams
- [ ] Multiple team support
- [ ] Tea round history
- [ ] Statistics dashboard
- [ ] Custom selection rules
- [ ] Dark mode support
- [ ] Team preferences
- [ ] Export/import functionality

### Performance Considerations

- Optimized bundle size
- Minimal dependencies
- Efficient state updates
- Responsive animations
- Accessibility compliance

### Contributing Guidelines

1. Fork the repository
2. Create your feature branch
3. Follow code style guidelines
4. Add proper documentation
5. Submit a pull request


## Contributing 🤝

Got ideas to make Tea Roulette even better? We'd love to hear them! Feel free to:

- 🐛 Report bugs
- 💡 Suggest new features
- 🎨 Improve the design
- 📝 Update documentation

## Support & Feedback 💬

Having trouble or got suggestions? We'd love to hear from you:

- 📧 Open an issue on GitHub
- 🌟 Star the project if you like it
- 📢 Share it with your team
