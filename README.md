# 📅 BusyHub

A Next.js calendar analytics app that transforms Google Calendar data into productivity insights with beautiful visualizations and achievement tracking.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tests](https://img.shields.io/badge/Tests-221%20passing-green)

## 🚀 Quick Start

```bash
git clone https://github.com/dnstld/busyhub.git
cd busyhub/app
pnpm install
pnpm dev
```

Open http://localhost:3000

## 📋 What it does

- **Calendar Analytics**: Connects to Google Calendar and generates productivity insights
- **Visual Heatmaps**: GitHub-style activity visualization
- **Achievement System**: Gamified tracking with streak counters
- **Data Export**: Share calendar insights as images

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Auth**: NextAuth.js with Google OAuth
- **API**: Google Calendar API (read-only)
- **Testing**: Vitest, React Testing Library (221 tests)
- **Deployment**: Vercel

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router (pages, API routes)
├── hooks/                  # Custom React hooks (main business logic)
│   ├── use-events/        # Calendar data processing
│   ├── use-achievements/  # Achievement calculations
│   └── use-ai-analysis/   # AI-powered insights
├── components/            # UI components
│   ├── containers/        # Page-level components
│   ├── presenters/        # Chart/visualization components
│   └── ui/               # Reusable UI elements
├── providers/            # React Context providers
├── utils/               # Helper functions
└── types/              # TypeScript definitions
```

## 🧪 Development

```bash
# Development
pnpm dev                # Start dev server
pnpm build             # Build production
pnpm test              # Run tests
pnpm lint              # Code linting
pnpm type-check        # TypeScript validation

# Google OAuth Setup (required)
cp .env.example .env.local
# Add your Google OAuth credentials
```

### Environment Variables

```env
# Google OAuth (required)
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret

# OpenAI (optional - for AI insights)
OPENAI_API_KEY=your_openai_key
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Write tests** for new functionality
4. **Ensure** all tests pass: `pnpm test:run`
5. **Submit** a pull request

### Key Areas for Contribution

- **UI/UX**: Improve charts, animations, mobile responsiveness
- **Features**: New achievement types, export formats, calendar integrations
- **Performance**: Optimize data processing, caching strategies
- **Testing**: Expand test coverage, add E2E tests
- **Documentation**: API docs, component stories

### Code Style

- Use TypeScript strict mode
- Follow existing patterns in `/hooks` for business logic
- Add tests for new features
- Use conventional commits: `feat:`, `fix:`, `docs:`, etc.

## � Key Features to Understand

### Hooks System

Business logic is organized in custom hooks:

- `use-events`: Handles Google Calendar data fetching and processing
- `use-achievements`: Calculates user achievements based on calendar activity
- `use-ai-analysis`: Generates AI-powered productivity insights

### Calendar Integration

- Uses Google Calendar API with read-only permissions
- Processes events for the current year
- Supports real-time token refresh

### Achievement System

Tracks user milestones:

- Welcome (first connection)
- Beginner (50+ active days)
- On Fire (10+ day streaks)
- King (200+ days with events)

## � Common Issues

**OAuth Errors**: Ensure Google OAuth is properly configured in Google Cloud Console
**Build Failures**: Run `pnpm clean` and reinstall dependencies
**Test Failures**: Check if environment variables are set correctly

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
