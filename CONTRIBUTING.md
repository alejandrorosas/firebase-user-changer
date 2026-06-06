# Contributing Guidelines

Thank you for your interest in contributing to Firebase User Changer! To ensure a smooth development process and successful integration of your changes, please follow these guidelines.

## Local Development & Testing

1. Fork and clone the repository.
2. Make your code changes in your local workspace.
3. To test your changes:
   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** (top-left corner) and select the repository directory.
   - Test the popup and background script behavior.

## Pull Request Requirements

We use GitHub Actions to automate version numbers and changelogs. Because of this, every pull request has the following requirements:

### 1. PR Labels (Required)
Every Pull Request must be labeled with **exactly one** of the following labels. The CI build will fail if no label or multiple labels are present:

*   `major`: For breaking changes or significant feature releases.
*   `minor`: For new non-breaking features.
*   `patch`: For backward-compatible bug fixes.
*   `dependencies`: For dependency updates.
*   `skip-changelog`: For documentation updates or trivial edits that do not need to be in the release notes.

### 2. Code Quality
*   Keep your changes focused. If you want to make multiple unrelated changes, please submit them as separate Pull Requests.
*   Ensure that the `manifest.json` version remains at `0.0.0` and `0.0.0-dev` in your branch (the actual release version is injected automatically during deployment).
