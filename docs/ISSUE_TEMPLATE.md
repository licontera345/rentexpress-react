# Professional outreach: GitLab issue and developer response

This document provides a **ready-to-use GitLab issue** in the required format and the **developer response** (acknowledgement, reproduction, fix with MR link, closure). Copy the sections into your GitLab repository as needed.

---

## Part 1 — Create a new issue (paste the following into GitLab Issues)

**Title:** Session expiry does not show a clear message when redirecting to login

---

## Summary

Short description of the problem.

When the backend returns 401 (e.g. session expired or token invalid), the user is redirected to the login page but no message is displayed to explain why they were logged out. This can confuse users who believe they were signed in.

---

## Steps to Reproduce

1. Go to the application and log in as a customer or employee.
2. Wait for the session to expire (or simulate by deleting the token in browser dev tools and triggering any API request).
3. Perform an action that triggers a request to the backend (e.g. navigate to "My Reservations" or refresh the dashboard).
4. Observe the redirect and the login page.

---

## Expected Result

What should happen.

The user should be redirected to the login page and see a brief, polite message such as "Your session has expired. Please sign in again." so they understand why they need to log in again.

---

## Actual Result

What actually happens.

The user is redirected to the login page but no message is shown. The URL may contain state (e.g. `?from=session_expired`) that is not used to display a message to the user.

---

## Environment

- **OS:** Windows 10 / macOS 14 / Ubuntu 22.04
- **Browser / Version:** Chrome 120 / Firefox 121 / Edge 120
- **App Version:** 0.0.0 (development build from main)

---

## Part 2 — Developer response (first reply: acknowledgement and clarification)

**Paste this as the first comment on the issue.**

---

Thank you for reporting this. I have read the issue and I can see how the current behaviour would be confusing for users when their session expires.

To move forward, could you confirm the following?

1. Does this happen consistently after the session expires (e.g. after a few minutes of inactivity), or only in specific flows?
2. Are you using the application in development (e.g. `npm run dev`) or a deployed build?

Once I have this information, I will try to reproduce the behaviour and then implement a fix (e.g. showing a message when the login page is opened with `state.from === 'session_expired'`). I will link the merge request here once it is ready for review.

---

## Part 3 — Developer response (after reproduction and fix)

**Paste this as a follow-up comment after you have implemented the fix and opened a merge request.**

---

I have been able to reproduce the issue. When the backend returns 401, the app redirects to the login page with `state: { from: 'session_expired' }`, but the login page did not read this state to display a message.

I have implemented a fix that:

1. Checks for `location.state?.from === 'session_expired'` when the login page loads.
2. Displays a short, user-friendly message (e.g. "Your session has expired. Please sign in again.") above the login form.

**Merge request:** [Link to your MR, e.g. `!12` or full URL]

The fix is ready for review. Once it is merged, I will close this issue.

---

## Part 4 — Developer response (closing the issue)

**Paste this when the MR has been merged.**

---

The fix has been merged to the default branch. The login page now shows a clear message when the user is redirected after session expiry.

Closing this issue. Thank you again for the report; please reopen or open a new issue if you notice any related problems.

---

## Checklist for your repository

- [ ] Create the issue in your GitLab **app-web** project using the format above (Summary, Steps to Reproduce, Expected Result, Actual Result, Environment).
- [ ] Reply as developer: acknowledge the issue and ask for clarification if needed.
- [ ] Confirm reproduction in a follow-up comment.
- [ ] Implement the fix (or a similar small improvement), open a merge request, and paste the MR link in the issue.
- [ ] After the MR is merged, add a closing comment and close the issue.

This workflow demonstrates professional communication and issue handling as required by the assignment (CA4.2, CA4.5).
