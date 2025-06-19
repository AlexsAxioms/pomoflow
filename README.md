# PomoFlow - Advanced Productivity Dashboard

A modern, feature-rich Pomodoro timer application with task management, note-taking, calendar integration, and focus music. Built with Next.js 15, React 19, and TypeScript.

![PomoFlow Dashboard](https://via.placeholder.com/800x400/1a1a2e/white?text=PomoFlow+Dashboard)

## ✨ Features

### 🍅 **Pomodoro Timer**
- **Customizable Sessions**: Default 25/5/15 minute work/break/long break cycles
- **Premium Timer Presets**: Short Burst, Deep Focus, Study Session modes
- **Visual Progress**: Beautiful circular progress indicator with smooth animations
- **Auto-switching**: Automatic transitions between work and break modes
- **Session Tracking**: Track completed sessions and long break intervals

### 📝 **Task Management**
- **Full CRUD Operations**: Create, edit, complete, and delete tasks
- **Priority System**: High/Medium/Low priorities with visual indicators
- **Smart Limits**: Free users limited to 3 tasks/day, premium unlimited
- **Advanced Filtering**: Search by text, filter by priority and category
- **Completion Tracking**: Separate active and completed task lists with timestamps

### 📋 **Rich Notes System**
- **Markdown Support**: Full markdown rendering with live preview
- **Slash Commands**: Type "/" for quick formatting (bold, italic, lists, etc.)
- **Tagging System**: Organize notes with color-coded tags
- **Rich Text Editing**: Formatting toolbar with common text options
- **Search Functionality**: Real-time search across titles, content, and tags

### 📅 **Calendar Integration**
- **Provider Support**: Google Calendar and Outlook integration UI
- **Event Display**: Professional event viewer with type categorization
- **Pomodoro Optimization**: Smart recommendations based on calendar gaps
- **Event Types**: Meeting, Focus, Break, Review, Call categorization

### 🎵 **Focus Music Player**
- **Premium Music Library**: Lo-Fi, Jazz, Ambient, and Binaural beats
- **Playlist Management**: Create and manage custom playlists
- **Audio Controls**: Full playback controls with progress tracking
- **Volume Control**: Integrated volume slider

### 🎨 **Advanced Dashboard**
- **Drag & Drop Widgets**: Freeform positioning of dashboard components
- **Resize Functionality**: Adjustable widget sizes with corner handles
- **Layout Persistence**: Saves custom layouts to localStorage
- **Dark Theme**: Beautiful glass morphism design with gradient backgrounds
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PomoFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase (optional - for data sync)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Stripe (optional - for premium features)
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

4. **Add audio files (optional)**
   - Place MP3 files in `/public/audio/` directory
   - See `/public/audio/README.md` for required file names
   - Free music sources provided in the audio README

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL for data sync |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role for server operations |
| `STRIPE_SECRET_KEY` | No | Stripe secret key for premium features |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret for payment processing |

### Audio Files

To enable the music player, add these MP3 files to `/public/audio/`:
- `lofi.mp3` - Lo-Fi background music
- `jazz-cafe.mp3` - Jazz café ambience  
- `coffee-jazz.mp3` - Coffee shop with jazz
- `sleep-calm.mp3` - Sleep and calm sounds
- `alpha-waves.mp3` - Alpha wave frequencies
- `beta-waves.mp3` - Beta wave frequencies
- `theta-waves.mp3` - Theta wave frequencies
- `delta-waves.mp3` - Delta wave frequencies

## 📱 Usage

### Basic Workflow
1. **Start a Pomodoro Session**: Click play on the timer
2. **Add Tasks**: Use the task management widget to organize your work
3. **Take Notes**: Capture thoughts and ideas during sessions
4. **Track Progress**: Monitor completed sessions and tasks
5. **Customize Layout**: Drag and resize widgets to your preference

### Premium Features
- Unlimited daily tasks (vs 3 for free users)
- Custom timer configurations
- Advanced statistics and analytics
- Priority support

### Keyboard Shortcuts
- **Space**: Start/pause timer
- **R**: Reset timer  
- **Escape**: Close modals
- **/** in notes: Open formatting menu

## 🛠 Technology Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4+ with custom glass morphism
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Webpack 5 (via Next.js)
- **Deployment**: Vercel-ready

## 🏗 Project Structure

```
PomoFlow/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── calendar/          # Calendar page
│   ├── notes/             # Notes page
│   ├── tasks/             # Tasks page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── theme-provider.tsx # Theme context
├── lib/                   # Utility libraries
│   ├── storage.ts         # localStorage utilities
│   ├── stripe.ts          # Stripe configuration
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # General utilities
├── public/               # Static assets
│   ├── audio/            # Music files
│   └── images/           # Reference images
└── styles/               # Additional CSS files
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep blues and purples with glass effects
- **Accent**: Emerald green for CTAs and success states
- **Background**: Gradient from `#0f0f23` to `#16213e`
- **Text**: White with various opacity levels

### Typography
- **Font**: Arial, Helvetica, sans-serif
- **Headings**: Bold weights with neon text effects
- **Body**: Regular weight with optimal line spacing

### Glass Morphism Effects
- **Cards**: Semi-transparent backgrounds with blur effects
- **Buttons**: Glassmorphic hover states
- **Modals**: Backdrop blur with border highlights

## 🔒 Data Storage

### Local Storage
- **Tasks**: Persisted in `pomoflow-tasks` key
- **Notes**: Persisted in `pomoflow-notes` key  
- **Layout**: Widget positions in `pomoflow-dashboard-layout`
- **Preferences**: User settings in `pomoflow-user-preferences`

### Data Export/Import
- Export all data as JSON
- Import from exported JSON files
- Clear all data functionality

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub/GitLab
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm run start
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting  
npm run lint

# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icons
- **Next.js** team for the amazing framework
- **Vercel** for hosting and deployment platform

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Community**: Join our Discord community (coming soon)

---

**Built with ❤️ by the PomoFlow team**