# Instructions for AI Coding Agents

This repository is designed to be easily maintained by AI coding agents. When working on this codebase, please follow the guidelines and rules defined below.

## Manifest and Versioning Rules

- **Static Development Version**: Always maintain `"version": "0.0.0"` and `"version_name": "0.0.0-dev"` inside `manifest.json` on the `main` branch. 
- **Release Version Injection**: Version numbers are dynamically injected by GitHub Actions on tag push (`v*`). Do not manually increment or commit production version numbers in the source code.
