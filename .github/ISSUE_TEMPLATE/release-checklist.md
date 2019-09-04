---
name: Release Checklist 🧹
about: Walk through a release checklist
title: "Release Checklist X.X"
labels: "release"
---

This is a complete walk through of the application. When we do a release, start a new release, and title it with the release version

First, reseed the database before running a complete check (for final city acceptance).

## Module 2: Contribution Submission

As a campaign admin and staff:

- [ ] View contributions and filter by status
- [ ] View contributions and filter by 'from' date
- [ ] View contributions and filter by 'to' date
- [ ] View contributions and filter by from, to and status date
- [ ] Clear any search fields by clicking 'Clear'

Add a new contribution flow(s):

Type: Other Receipt
- [ ] I should see subtype list ending in Refunds and Rebates
- [ ] I should not submit for match (or its defaulted to no)

Type: Contribution
SubType: Any Inkind contributions
- [ ] I should not see submit for match (or defaulted to no)
- [ ] I shouldn't see payment methods or check number
- [ ] I should be required to select inkind description type

Contributor Type:
- [ ] If I select a Business or other type, I should not see employer information.
- [ ] If I select Individual or Candidates Family, I should see employer information
- [ ] If I enter an occupation letter date, then the fields go away

Type: Contribution
SubType: Cash

- [ ] Payment Method Type is required
- [ ] If amount is over 500, submit for match defaults to no
- [ ] If check or money order selected, I should see field for check number, which is required

Attestation Letter (to revisit on Friday)
- [ ] After I submit a contribution, I should be able to add an attestation letter with a comment.

As a campaign staff
- [ ] contributions/:id - draft status - I cannot submit the contribution, but I can archive and save it
- [ ] contributions/:id - submitted, processed status - I can only view

As a campaign admin
- [ ] contributions/:id - draft status - I can submit, archive, or save the contribution
- [ ] contributions/:id - submitted, processed status - I can only view


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

