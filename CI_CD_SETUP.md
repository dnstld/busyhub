# CI/CD Setup for TypeScript Checks

This repository includes automated checks to ensure code quality and prevent TypeScript errors from being merged.

## 🔄 GitHub Actions Workflows

### 1. TypeScript Check (`.github/workflows/typescript.yml`)

- **Triggers**: Push to `main`/`develop` branches, Pull Requests
- **Purpose**: Dedicated TypeScript compilation check
- **Commands**: `pnpm run type-check`

### 2. Code Quality (`.github/workflows/quality.yml`)

- **Triggers**: Push to `main`/`develop` branches, Pull Requests
- **Purpose**: Comprehensive code quality checks
- **Commands**: ESLint, TypeScript, Build verification

### 3. CI Pipeline (`.github/workflows/ci.yml`)

- **Triggers**: Push to `main`/`develop` branches, Pull Requests
- **Purpose**: Full CI pipeline with multiple Node.js versions
- **Matrix**: Node.js 18.x and 20.x

## 🪝 Local Git Hooks

### Pre-commit Hook

Automatically runs before each commit to catch issues early:

```bash
# Install the hooks
pnpm run setup-hooks

# Manual setup (alternative)
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
```

### What the hook checks:

- ✅ TypeScript compilation (`tsc --noEmit`)
- ✅ ESLint rules (`next lint`)

### Bypassing hooks (when needed):

```bash
git commit --no-verify -m "emergency fix"
```

## 📋 Available Scripts

```bash
# TypeScript type checking
pnpm run type-check

# ESLint checking
pnpm run lint

# Auto-fix ESLint issues
pnpm run lint:fix

# Setup Git hooks
pnpm run setup-hooks

# Build verification
pnpm run build
```

## 🚀 Workflow Integration

### For Contributors:

1. **Before committing**: Pre-commit hook automatically runs
2. **On push**: GitHub Actions verify your changes
3. **Pull requests**: All checks must pass before merging

### For Maintainers:

- Branch protection rules ensure all checks pass
- TypeScript errors block merges automatically
- Quality reports available in PR comments

## 🛠 Setup Instructions

### New Repository Setup:

```bash
# Clone and install dependencies
git clone <repository>
cd <repository>
pnpm install

# Setup Git hooks
pnpm run setup-hooks

# Verify setup
pnpm run type-check
pnpm run lint
```

### Adding Branch Protection:

1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass"
4. Select: `TypeScript Check`, `Code Quality Checks`

## 🔧 Troubleshooting

### Common Issues:

**TypeScript errors in CI but not locally:**

```bash
# Ensure you're using the same TypeScript version
pnpm run type-check
```

**ESLint failures:**

```bash
# Auto-fix common issues
pnpm run lint:fix

# Check specific files
pnpm run lint -- --fix src/path/to/file.ts
```

**Hook not running:**

```bash
# Verify hook installation
git config core.hooksPath
# Should output: .githooks

# Re-run setup
pnpm run setup-hooks
```

## 📊 Monitoring

### GitHub Actions Status:

- ✅ All checks passing: Ready to merge
- ❌ TypeScript errors: Fix before merging
- ⚠️ ESLint warnings: Should be addressed

### Local Development:

```bash
# Quick status check
pnpm run type-check && pnpm run lint && echo "✅ All good!"
```

This setup ensures high code quality and prevents TypeScript issues from reaching production! 🎯
