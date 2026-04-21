# Contributing to SouthEastSocial

## Branching Strategy

All work happens on feature branches cut from `develop`. **Never commit directly to `main` or `develop`.**

- `feature/` — new functionality
- `fix/` — bug fixes
- `chore/` — tooling, config, dependency updates
- `docs/` — documentation only changes
- `refactor/` — code restructuring without behaviour change

### Branch flow

```
feature/your-branch → develop → main
```

- PRs go from your feature branch **to `develop`**
- `develop → main` is a release PR, opened per milestone
- Branch from the latest `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
```

## Commit Messages

This repo enforces [Conventional Commits](https://www.conventionalcommits.org/). Non-conforming commits are rejected at commit time via commitlint + husky.

**Format:**

```
<type>(<optional scope>): <short description>
```

**Allowed types:**

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `chore` | Build, config, tooling changes |
| `docs` | Documentation only |
| `refactor` | Code change that doesn't add a feature or fix a bug |
| `style` | Formatting, whitespace (no logic change) |
| `test` | Adding or updating tests |

**Examples:**

```
feat(events): add category filter to listing page
fix(auth): redirect to login when session expires
chore: upgrade payload to 3.1.0
docs: add environment variable guide to README
```

## Pull Requests

- Open PRs against `develop`, not `main`
- Include a clear description of what changed and why
- Link the related GitHub issue
- One logical unit of work per PR — don't bundle unrelated changes

## Milestones

Work is tracked against GitHub milestones:

1. Setup & Config
2. Collections & Auth
3. Public UI
4. Email Flows
5. Polish & Deploy

## Local Setup

See the [README](./README.md) for environment setup instructions.
