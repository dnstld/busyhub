#!/bin/bash
# Setup script for Git hooks

echo "🔧 Setting up Git hooks..."

# Make the pre-commit hook executable
chmod +x .githooks/pre-commit

# Configure Git to use our custom hooks directory
git config core.hooksPath .githooks

echo "✅ Git hooks configured successfully!"
echo ""
echo "The following hooks are now active:"
echo "  - pre-commit: TypeScript and ESLint checks"
echo ""
echo "To disable hooks temporarily, commit with --no-verify flag:"
echo "  git commit --no-verify -m 'your message'"
