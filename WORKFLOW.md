# WORKFLOW.md — Task Execution Workflow

This document defines the standard workflow for AI-guided task execution in the
Spiral project. Follow this process when requesting new features, bug fixes, or
documentation tasks.

## Task Phases

### Phase 1: Task Intake

When you request a new task, I will:

1. **Confirm task understanding** — Clarify the requirement with you:
    - What is the expected outcome?
    - Are there any acceptance criteria?
    - Are there any edge cases or gotchas to consider?

2. **Classify the task** — Determine the type:
    - `feat` — new feature or enhancement
    - `fix` — bug fix
    - `docs` — documentation or readme updates
    - `refactor` — code restructuring (no behavior change)
    - `chore` — maintenance, dependencies, tooling

3. **Get approval** — Confirm with you before proceeding to issue creation.

### Phase 2: GitHub Issue Creation

I will use GitHub CLI (`gh`) to create a new issue:

```bash
gh issue create \
  --title "<TYPE>: <DESCRIPTION>" \
  --body "<Detailed description of the task>" \
  --assignee <username>
```

**Before executing, I will:**

- Show you the proposed title and description
- Ask if you want any labels added (e.g., `enhancement`, `bug`, `documentation`)
- Confirm the issue number before proceeding

**Issue Title Format:**

```
<TYPE>: Brief description
```

Examples:

- `feat: Add keyboard shortcut to save current visualization`
- `fix: Algorithm loading fails on canvas resize`
- `docs: Document CHANGELOG.md format and update guidelines`

### Phase 3: Branch Creation

Once the issue is created, I will create a feature branch using conventional
commit syntax:

```bash
git checkout -b <TYPE>/issue-<NUMBER>-<slug>
```

**Branch Naming Rules:**

- Start with type: `feat`, `fix`, `docs`, `refactor`, `chore`
- Follow with `/issue-` and the GitHub issue number
- End with a slug (kebab-case) summarizing the change
- Max length: ~50 characters total

**Examples:**

- `feat/issue-42-keyboard-save-visualization`
- `fix/issue-15-canvas-resize-loading`
- `docs/issue-99-changelog-update-guidelines`

**Before switching branches, I will:**

- Show you the proposed branch name
- Confirm it aligns with the issue
- Verify I'm on the correct base branch (`spiral2`)

### Phase 4: Implementation

I will implement the task according to [AGENTS.md](AGENTS.md) rules:

- **Code style:** 4-space indentation, single quotes, PascalCase/camelCase
  conventions
- **ES modules:** `import`/`export`, no CommonJS
- **No bundler:** Code runs directly in Electron renderer
- **Algorithm updates:** If adding/removing algorithms, update
  [src/AlgorithmChooser.js](src/AlgorithmChooser.js)
- **Keyboard shortcuts:** Update both [src/Spiral.js](src/Spiral.js) and
  [src/MusicPlayer.js](src/MusicPlayer.js) if applicable
- **Canvas state:** Always use `ctx.save()`/`ctx.restore()` for transforms or
  composite operations

### Phase 5: Verification & Testing

After implementation, I will:

1. **Run basic checks** (if applicable):
    - Test the app: `pnpm start`
    - Verify no runtime errors in console
    - Test the specific feature/fix manually
    - If algorithms added: verify they load correctly in `AlgorithmChooser.js`
    - If UI changed: verify layout and responsiveness

2. **Code review** — Ensure:
    - Code follows [AGENTS.md](AGENTS.md) conventions
    - No console errors or warnings
    - Related files updated (e.g., keyboard shortcuts, algorithm registry)

3. **Report findings** — Let you know:
    - ✅ What passed verification
    - ⚠️ What needs attention (if any)
    - Ask for confirmation before proceeding to CHANGELOG

### Phase 6: Changelog Update

I will suggest a CHANGELOG entry and wait for your approval:

**Format:**

```
## YYYY-MM-DD

- <TYPE>: Brief description of the change
```

**Examples:**

```
## 2026-02-07

- feat: Add keyboard shortcut to save current visualization
- fix: Algorithm loading fails on canvas resize
- docs: Update CHANGELOG.md format guidelines
```

**Before adding, I will:**

- Show you the proposed entry
- Ask if the description is accurate
- Confirm the date (or update if needed)
- Update [CHANGELOG.md](CHANGELOG.md) only after approval

### Phase 7: Pull Request Creation

Once everything is verified and CHANGELOG is updated, I will create a PR:

```bash
gh pr create \
  --title "<TYPE>: <DESCRIPTION>" \
  --body "<Detailed description of changes>" \
  --head <branch-name> \
  --base spiral2
```

**Before submitting, I will:**

- Show you the draft PR title and description
- Ask if you want to add labels (e.g., `ready-to-merge`, `review-pending`)
- Ask for any additional context or notes
- Confirm you're ready to merge before creating the PR

**PR Description Template:**

```markdown
## Changes

- Brief summary of what changed

## Issue

Closes #<ISSUE_NUMBER>

## Testing

- [ ] Tested in pnpm start
- [ ] No console errors
- [ ] Feature/fix works as expected

## Checklist

- [x] Code follows [AGENTS.md](AGENTS.md) conventions
- [x] CHANGELOG.md updated
- [x] Related files updated (if applicable)
```

## Decision Points (Where I Ask You)

Throughout the workflow, I will pause and ask for confirmation at these points:

| Phase | Decision Point       | Options                                                   |
| ----- | -------------------- | --------------------------------------------------------- |
| 1     | Task clarity         | Approve task description, request changes, or cancel      |
| 2     | Issue creation       | Approve title/description, add labels, or revise          |
| 3     | Branch naming        | Approve branch name or request different format           |
| 5     | Verification results | Accept findings, request more testing, or mark as blocked |
| 6     | Changelog entry      | Approve entry, revise wording, or update date             |
| 7     | PR creation          | Approve PR details, request changes, or add notes         |

## Exit Conditions

I will **pause and ask for clarification** if:

- The task is unclear or ambiguous after Phase 1
- Implementation hits a blocker (missing info, design decision needed)
- Verification reveals unexpected behavior
- The PR conflicts with existing code or requires cross-file updates
- The task scope expands beyond the original issue

I will **not proceed** without your confirmation at these checkpoints.

## Conventional Commits Reference

This workflow uses conventional commit syntax for branch names and messages. The
types are:

- **`feat`** — A new feature or enhancement
- **`fix`** — A bug fix
- **`docs`** — Documentation, README, or CHANGELOG updates
- **`refactor`** — Code restructuring without behavior change
- **`chore`** — Maintenance, dependencies, build tools, CI/CD
- **`perf`** — Performance improvements
- **`style`** — Code style (formatting, missing semicolons, etc.) — rarely used
  in this project

For this project, the most common types are `feat`, `fix`, and `docs`.

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│ 1. INTAKE: Clarify task, classify type, get approval         │
├─────────────────────────────────────────────────────────────┤
│ 2. ISSUE: Create GitHub issue (gh issue create)              │
├─────────────────────────────────────────────────────────────┤
│ 3. BRANCH: Switch to feature branch (feat/issue-N-slug)      │
├─────────────────────────────────────────────────────────────┤
│ 4. IMPLEMENT: Code the feature per AGENTS.md rules           │
├─────────────────────────────────────────────────────────────┤
│ 5. VERIFY: Test app, check console, report findings          │
├─────────────────────────────────────────────────────────────┤
│ 6. CHANGELOG: Suggest entry, update file upon approval       │
├─────────────────────────────────────────────────────────────┤
│ 7. PR: Create pull request (gh pr create) and prepare merge   │
└─────────────────────────────────────────────────────────────┘
```

## Usage

When you request a new task, say something like:

> "I want a new feature to display the FPS counter in the top-right corner of
> the canvas."

Then I will follow this workflow, starting with Phase 1 (Task Intake) and
proceeding through all phases with your confirmation at each decision point.

If you want to skip certain phases (e.g., skip PR creation and just commit to
the branch), let me know and I'll adapt the workflow accordingly.
