---
name: Release Checklist 🧹
about: Walk through a release checklist
title: "Release Checklist X.X"
labels: "release"
---

This is a complete walk through of the application. When we do a release, start a new release, and title it with the release version

First, reseed the database before running a complete check.

## Module 1: User Management Checklist

### As a GovAdmin, I can:

- [ ] login with email govadmin@openelectionsportland.org and password of password
- [ ] can access /campaigns
- [ ] Add a new campaign and a campaign admin user at the same time

### As a campaign admin, I can

- [ ] Receives email notification of invite to join from government admin
- [ ] Accepts invite and add a password
- [ ] login with new password
- [ ] cannot access /campaigns
- [ ] access my campaign /dashboard
- [ ] access /manage-portal
- [ ] add a new user 
- [ ] access Manage User 'profile' page
- [ ] remove a user
- [ ] resend and invite

### As a new campaign staff, I can

- [ ] Receive invitation email and sign up with a password
- [ ] access the /manage-portal but not see any add new user or manage user buttons

### As any logged in User, I can:

- [ ] log out
- [ ] access reset my password from dashboard and successfully change my password
- [ ] log in with my changed password
- [ ] From sign in screen, request a password reset
- [ ] I receive a password reset email, and can submit an updated password
- [ ] log in with my reset password
