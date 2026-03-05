# Chesapeake Shared Components Makefile

.PHONY: build test lint clean install dev

# Run Vite dev server (component showcase at root index.html + src/)
dev:
	npm run dev

# Lint and typecheck the shared components
lint:
	@echo "Linting shared components..."
	npm run fmt:check
	npm run lint
	npm run typecheck

fmt:
	@echo "Formatting files..."
	npm run fmt

# Clean any generated files
clean:
	@echo "Cleaning shared components..."
	@rm -rf dist/ node_modules/.cache/

# Validate the package structure
validate:
	@echo "Validating shared package structure..."
	@echo "✓ Checking package.json exports..."
	@node -e "const pkg = require('./package.json'); console.log('Exports:', Object.keys(pkg.exports || {}));"
	@echo "✓ Checking CSS files exist..."
	@test -f styles/index.css && echo "✓ styles/index.css exists" || echo "✗ styles/index.css missing"
	@test -f styles/tokens.css && echo "✓ styles/tokens.css exists" || echo "✗ styles/tokens.css missing"
	@test -f styles/base.css && echo "✓ styles/base.css exists" || echo "✗ styles/base.css missing"
	@test -f styles/components.css && echo "✓ styles/components.css exists" || echo "✗ styles/components.css missing"
	@echo "✓ Shared package validation complete"

# Show package info
info:
	@echo "Chesapeake Shared Components Package Info:"
	@echo "=========================================="
	@echo "Package: $(shell node -e "console.log(require('./package.json').name)")"
	@echo "Version: $(shell node -e "console.log(require('./package.json').version)")"
	@echo "Exports:"
	@node -e "const pkg = require('./package.json'); Object.keys(pkg.exports || {}).forEach(exp => console.log('  -', exp))"
	@echo ""
	@echo "CSS Files:"
	@ls -la styles/ 2>/dev/null || echo "No styles directory found"
	@echo ""
	@echo "Component Files:"
	@find components -name "*.tsx" -o -name "*.ts" | head -10

add_component:
	npm exec -y shadcn@latest add $(COMPONENT)

# lint, pull upstream trunk, rebasing under your local stack. if draft commits
# exist, push them onto trunk
sync: ./repo_sync.sh
	$(SHELL) ./repo_sync.sh
