# ESLint Snakecase

A custom ESLint plugin to enforce snake_case naming conventions for variable and function names within a JavaScript codebase. This plugin provides auto-fixing capabilities and is configured to ignore imported functions and class names.

## Features
* Enforces snake_case naming for local identifiers such as variables, functions, and parameters.
* Ignores external imports and class names (e.g., class MyClass remains unchanged).
* Auto-fixes declarations and references to ensure consistent naming.

## Installation

```bash
npm install eslint-snakecase --save-dev
```

