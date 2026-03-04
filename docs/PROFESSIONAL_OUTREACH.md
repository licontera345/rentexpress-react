# Professional Outreach: GitLab Issue Workflow

This document describes the expected workflow for reporting issues and responding to them in the RentExpress app-web GitLab repository. It follows industry-standard communication protocols and ensures a clear, professional interaction between the reporter (user) and the developer.

---

## 1. Creating an issue (reporter / user)

When you encounter a bug or unexpected behaviour:

1. In your GitLab project, go to **Issues** → **New issue**.
2. Choose the **Bug Report** template (or paste the template below) so that the issue follows the required format.
3. Fill in every section using clear, formal English and the terminology below.

### Issue template (use this format)

```markdown
## Summary
Short description of the problem.

## Steps to Reproduce
1. Go to...
2. Click on...
3. Observe error...

## Expected Result
What should happen.

## Actual Result
What actually happens.

## Environment
- OS:
- Browser / Version:
- App Version:
```

**Guidelines:** Use imperative verbs (*Go to*, *Click*, *Enter*). Be precise and factual. Avoid informal language. If you need to ask for clarification later, the developer will reply in the issue thread.

---

## 2. Responding as the developer

As the developer, you handle the issue through the following stages. Reply in the same issue thread, using professional formulas and correct English.

### Step 1: Acknowledge

Reply promptly to confirm that you have read the issue.

**Example:**

> Thank you for reporting this. I have read the issue and will look into it as soon as possible.

### Step 2: Ask for clarification (if needed)

If any step is unclear or the environment is missing, ask for specific details.

**Example:**

> Could you please confirm which browser and version you were using when the error occurred? Also, does the problem happen every time you follow these steps, or only under certain conditions?

### Step 3: Confirm reproduction

After reproducing the bug locally, confirm it in a comment.

**Example:**

> I have been able to reproduce this issue in [browser/version]. The behaviour matches your description. I will proceed to implement a fix.

### Step 4: Implement the fix and link the merge request

Create a branch, fix the bug, and open a Merge Request (MR). Post the MR link in the issue.

**Example:**

> A fix has been implemented in branch `fix/issue-XX-brief-description`. Merge Request: !XX — [Title of the MR]. Please review when you have a moment.

### Step 5: Close the issue

After the MR is merged and the fix is verified, close the issue with a short summary.

**Example:**

> The fix has been merged to `main`. This issue is now resolved. Thank you again for your report. Closing.

---

## 3. Professional formulas and terminology

Use these expressions consistently in issues and comments:

| Situation | Example |
|-----------|--------|
| Acknowledging | "Thank you for reporting this." / "I have read the issue and will look into it." |
| Asking for details | "Could you please confirm…?" / "Would you mind providing…?" |
| Confirming reproduction | "I have been able to reproduce this issue." / "Steps to reproduce confirmed." |
| Expected vs actual | "Expected result: … Actual result: …" |
| Proposing a fix | "I suggest we…" / "A fix has been implemented in…" |
| Closing | "This issue is now resolved. Closing." |

---

## 4. Summary checklist

- [ ] Issue created using the Bug Report template (Summary, Steps to Reproduce, Expected Result, Actual Result, Environment).
- [ ] Developer acknowledges the issue.
- [ ] Developer asks for clarification if needed.
- [ ] Developer confirms reproduction.
- [ ] Developer implements fix and links the Merge Request in the issue.
- [ ] Developer closes the issue after the MR is merged.

This workflow ensures that the GitLab repository serves as an exemplary, professional record of communication and problem-solving (e.g. for portfolio or Europass-style showcases).

---

## 5. Complete worked example (copy-paste ready)

Below you will find a full example: the **issue text** to paste when creating the issue in GitLab, and the **developer comments** to paste in order. A real fix for this bug is included in the repository (404 page accessibility), so you can create a branch, open a Merge Request, and link it in the third comment.

### Issue title (use as the issue title in GitLab)

```
404 page: decorative icon not hidden from screen readers
```

### Issue description (paste this into the issue body)

```markdown
## Summary
The 404 (Not Found) page displays a decorative car emoji (🚗) that is not marked as presentational. Screen readers announce it as "car emoji" or similar, which adds noise and does not help users. Decorative content should be hidden from the accessibility tree.

## Steps to Reproduce
1. Go to any non-existent route (e.g. `/invalid-path`) so that the 404 page is displayed.
2. Use a screen reader (e.g. NVDA, VoiceOver) or browser accessibility tools to focus the page content.
3. Observe that the emoji is announced instead of being skipped.

## Expected Result
The decorative icon should be hidden from assistive technologies (e.g. with `aria-hidden="true"`) so that only the title, description, and action buttons are announced.

## Actual Result
The emoji is exposed to the accessibility tree and is announced by screen readers, which is unnecessary for a decorative element.

## Environment
- **OS:** Windows 11
- **Browser / Version:** Chrome 131
- **App Version:** 0.0.0 (dev)
```

### Developer comment 1 — Acknowledge (paste as first comment)

```
Thank you for reporting this. I have read the issue and will look into it as soon as possible.
```

### Developer comment 2 — Confirm reproduction (paste as second comment)

```
I have been able to reproduce this issue in Chrome 131 with the accessibility tree. The decorative icon is indeed exposed. I will proceed to implement a fix by marking it as presentational (aria-hidden).
```

### Developer comment 3 — Fix and Merge Request (paste as third comment; replace `!XX` with your MR number)

```
A fix has been implemented in branch `fix/issue-1-404-aria-hidden`. The decorative icon container now has `aria-hidden="true"` so it is skipped by screen readers. Merge Request: !XX — "fix: hide 404 decorative icon from screen readers". Please review when you have a moment.
```

### Developer comment 4 — Closing (paste after the MR is merged, then close the issue)

```
The fix has been merged to `main`. This issue is now resolved. Thank you again for your report. Closing.
```

---

## 6. Optional: apply the fix and open the MR yourself

The codebase includes the fix in `src/pages/public/NotFound.jsx` (the icon container has `aria-hidden="true"`). To complete the workflow on GitLab: create the issue with the title and description above; paste the four developer comments in order (update comment 3 with your real MR number); create branch `fix/issue-1-404-aria-hidden`, commit, push, and open a Merge Request; after the MR is merged, paste the closing comment and close the issue.
