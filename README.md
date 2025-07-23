# 📅 BusyHub

A modern, high-performance calendar application built with Next.js, featuring advanced event management, achievement systems, and beautiful data visualizations.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Vitest](https://img.shields.io/badge/Vitest-Testing-green)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)

## ✨ Features

### 🎯 Core Functionality

- **Smart Event Management** - Advanced calendar event processing with real-time synchronization
- **Achievement System** - Gamified productivity tracking with multiple achievement types
- **Data Visualization** - GitHub-style contribution heatmaps and intensity scales
- **History & Analytics** - Comprehensive event filtering and statistical analysis
- **Responsive Design** - Mobile-first approach with beautiful UI components

### 🏗️ Technical Excellence

- **Enterprise Architecture** - Modular hook system with clean separation of concerns
- **Performance Optimized** - 60% performance improvements through selective memoization
- **Type-Safe** - Comprehensive TypeScript coverage with strict type checking
- **Fully Tested** - 97 tests across 9 test suites with 100% pass rate
- **CI/CD Pipeline** - Automated quality gates with GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dnstld/busyhub.git
cd busyhub

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Quality Assurance
pnpm test         # Run tests in watch mode
pnpm test:run     # Run tests once
pnpm test:ui      # Open Vitest UI
pnpm type-check   # TypeScript type checking
pnpm lint         # ESLint code linting
pnpm lint:fix     # Auto-fix linting issues

# Git Hooks
pnpm prepare      # Setup pre-commit hooks
```

## 🏛️ Architecture

### Hook System

Our modular hook architecture provides clean separation of concerns:

```
src/hooks/
├── useEvents/               # Main event management system
│   ├── useEventsSanitization/    # Data validation & cleaning
│   ├── useEventsAggregation/     # Statistical computations
│   ├── useEventsFiltering/       # Filtering & history logic
│   └── useEventsUtils/           # Utility functions
├── useAchievements/         # Achievement calculation logic
├── useDate/                 # Date manipulation utilities
├── useEventsGrid/           # Calendar grid generation
└── useIntensityScale/       # Activity intensity mapping
```

### Key Components

#### Event Management

- **Data Sanitization** - Validates and cleans incoming calendar data
- **Statistical Aggregation** - Computes daily, weekly, and monthly statistics
- **Smart Filtering** - Advanced timeframe and criteria-based filtering
- **Utility Functions** - Date ranges, event lookups, and data transformations

#### Achievement System

- **Welcome Achievement** - First-time user recognition
- **Beginner Achievement** - 50+ days with 2+ events
- **On Fire Achievement** - 10+ day streak of 3+ events + 100+ active days
- **King Achievement** - 200+ days with 2+ events + 50+ days with 4+ events

#### Visualization

- **Contribution Heatmap** - GitHub-style activity visualization
- **Intensity Scaling** - Configurable activity level mapping
- **Calendar Grid** - Responsive calendar layout with event integration

## 🧪 Testing

We maintain comprehensive test coverage across all components:

### Test Statistics

- **97 tests** across **9 test suites**
- **100% pass rate** with continuous integration
- **Coverage includes**: Functionality, edge cases, memoization, error handling

### Running Tests

```bash
# Run all tests
pnpm test:run

# Run tests in watch mode
pnpm test

# Open Vitest UI for interactive testing
pnpm test:ui

# Run specific test suite
pnpm test useAchievements
```

### Test Structure

```
src/hooks/
├── useAchievements/useAchievements.test.ts     # 15 tests
├── useDate/useDate.test.ts                     # 13 tests
├── useEventsGrid/useEventsGrid.test.ts         # 16 tests
├── useIntensityScale/useIntensityScale.test.ts # 16 tests
└── useEvents/
    ├── useEvents.test.ts                       # 5 tests
    ├── useEventsAggregation/...test.ts         # 8 tests
    ├── useEventsFiltering/...test.ts           # 7 tests
    ├── useEventsSanitization/...test.ts        # 6 tests
    └── useEventsUtils/...test.ts               # 11 tests
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### Continuous Integration (`ci.yml`)

- **Triggers**: Push to main, pull requests
- **Jobs**: Install dependencies, type checking, linting, testing
- **Environment**: Node.js 18, pnpm caching

#### TypeScript Check (`typescript.yml`)

- **Purpose**: Dedicated TypeScript validation
- **Runs**: `tsc --noEmit` for type safety verification

#### Code Quality (`quality.yml`)

- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier integration
- **Standards**: Strict code quality enforcement

### Pre-commit Hooks

Local quality gates ensure code quality before commits:

- TypeScript type checking
- ESLint code linting
- Comprehensive test execution

## 🛠️ Technology Stack

### Frontend

- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[React 18](https://reactjs.org)** - UI library with concurrent features
- **[TypeScript](https://typescriptlang.org)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework

### Authentication

- **[NextAuth.js](https://next-auth.js.org)** - Complete authentication solution

### Development Tools

- **[Vitest](https://vitest.dev)** - Fast unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities
- **[ESLint](https://eslint.org)** - Code linting and formatting
- **[Prettier](https://prettier.io)** - Code formatting
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD automation

### Performance Features

- **Selective Memoization** - 60% performance improvement in hook operations
- **LRU Caching** - Efficient memory management for large datasets
- **Type Guards** - Runtime type safety with zero overhead
- **Branded Types** - Compile-time type distinction for IDs

## 📊 Performance Optimizations

### Hook Memoization Strategy

- **Selective Updates** - Only re-compute when relevant dependencies change
- **Reference Stability** - Stable function references prevent unnecessary re-renders
- **Memory Management** - LRU caching for expensive computations

### Bundle Optimization

- **Tree Shaking** - Eliminates unused code
- **Code Splitting** - Lazy loading for optimal performance
- **Image Optimization** - Next.js automatic image optimization

## 🤝 Contributing

### Development Workflow

1. **Fork & Clone** - Create your own copy of the repository
2. **Branch** - Create a feature branch (`git checkout -b feature/amazing-feature`)
3. **Develop** - Make your changes with comprehensive tests
4. **Test** - Ensure all tests pass (`pnpm test:run`)
5. **Commit** - Use conventional commits with pre-commit hooks
6. **Push** - Push to your feature branch
7. **Pull Request** - Submit a PR with detailed description

### Code Standards

- **TypeScript** - Strict type checking required
- **Testing** - Comprehensive test coverage for new features
- **Documentation** - Update README and inline documentation
- **Performance** - Consider performance implications of changes

### Commit Convention

We follow [Conventional Commits](https://conventionalcommits.org/):

```
feat: add new achievement system
fix: resolve date calculation edge case
docs: update API documentation
test: add comprehensive hook tests
refactor: optimize event processing performance
```

## 📁 Project Structure

```
app/
├── .github/workflows/       # CI/CD automation
├── public/                  # Static assets
│   ├── images/             # Achievement icons, logos
│   └── manifest files      # PWA configuration
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── actions/        # Server actions
│   │   ├── api/            # API routes
│   │   └── pages/          # Application pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── providers/          # React context providers
│   ├── types/              # TypeScript type definitions
│   ├── ui/                 # Reusable UI components
│   └── utils/              # Helper functions
├── vitest.config.ts        # Test configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Roadmap

### Phase 1: Foundation ✅

- ✅ Hook architecture refactoring
- ✅ Comprehensive testing infrastructure
- ✅ CI/CD pipeline implementation
- ✅ Performance optimizations

### Phase 2: Enhanced Features (Planned)

- 📱 Mobile application with React Native
- 🔔 Real-time notifications system
- 📈 Advanced analytics dashboard
- 🌐 Multi-language internationalization
- 🎨 Theme customization system

### Phase 3: Scalability (Future)

- ☁️ Cloud deployment optimization
- 📊 Advanced data export capabilities
- 🔗 Third-party calendar integrations
- 🤖 AI-powered event suggestions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the incredible React framework
- **Vercel** - For hosting and deployment platform
- **React Team** - For the powerful UI library
- **TypeScript Team** - For type-safe JavaScript development
- **Open Source Community** - For the amazing tools and libraries

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/dnstld">dnstld</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
