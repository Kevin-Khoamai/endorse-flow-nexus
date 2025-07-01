# Endorse-Flow-Nexus User Stories

> **Note:** Every new feature or bugfix must have a corresponding GitHub Pull Request (PR) linked to a user story.

---

## User Story Checklist

- [x] Publisher: Browse campaigns, view details, apply, see status, receive notifications, upload video, see video status
- [x] SP Team: View/review applications, approve/reject applications, view/review videos, approve/reject videos, monitor campaigns
- [x] Advertiser: Create campaigns, view applications, approve/reject applications, review videos, approve/reject videos, see analytics
- [x] General: Sign up, select role, sign in, dashboard access, sign out, real-time notifications
- [x] System: Enforce one application per campaign, send notifications, RLS, responsive UI
- [ ] Publisher: Edit/withdraw application, view feedback, track earnings, filter/search campaigns, manage profile
- [ ] SP Team: Leave feedback, assign reviews, generate reports
- [ ] Advertiser: Invite collaborators, schedule campaigns, export analytics, in-app messaging, auto-approve rules
- [ ] General: Email/push notifications, mobile app, 2FA, password reset, help center, changelog/news feed
- [ ] System: Payment integration, admin dashboard, multi-language, accessibility, API access

---

## User Roles
- **Publisher**: Browses campaigns, applies for endorsements, uploads videos.
- **SP Team**: Reviews applications, approves/rejects videos, monitors campaigns.
- **Advertiser**: Creates campaigns, reviews applications, approves/rejects content.

---

## User Stories

### Publisher
- [x] As a publisher, I want to browse a list of active campaigns so I can find endorsement opportunities. (`PublisherDashboard.tsx`, `useCampaigns.ts`)
- [x] As a publisher, I want to view campaign details so I can decide if I want to apply. (`PublisherDashboard.tsx`, `CampaignCard.tsx`)
- [x] As a publisher, I want to apply for a campaign by submitting my experience, audience, and video ideas. (`PublisherDashboard.tsx`, `useApplications.ts`)
- [x] As a publisher, I want to see the status of my applications (pending, approved, rejected) so I know what to do next. (`TransactionStatusList.tsx`, `useApplications.ts`)
- [x] As a publisher, I want to receive notifications when my application or video is approved or rejected. (`useNotifications.ts`, notification triggers in DB)
- [x] As a publisher, I want to upload a video after my application is approved so I can complete the endorsement process. (`PublisherDashboard.tsx`, `useVideos.ts`)
- [x] As a publisher, I want to see the status of my video submissions. (`TransactionStatusList.tsx`, `useVideos.ts`)

### SP Team
- [x] As an SP team member, I want to view all campaign applications so I can review them for quality. (`SPTeamDashboard.tsx`, `useApplications.ts`)
- [x] As an SP team member, I want to approve or reject publisher applications. (`SPTeamDashboard.tsx`, `useApplications.ts`)
- [x] As an SP team member, I want to view all video submissions for campaigns. (`SPTeamDashboard.tsx`, `useVideos.ts`)
- [x] As an SP team member, I want to approve or reject video submissions. (`SPTeamDashboard.tsx`, `useVideos.ts`)
- [x] As an SP team member, I want to monitor the progress and status of all campaigns and applications. (`SPTeamDashboard.tsx`, `TransactionStatusList.tsx`)

### Advertiser
- [x] As an advertiser, I want to create new campaigns with details, requirements, and deadlines. (`AdvertiserDashboard.tsx`, `useCampaigns.ts`)
- [x] As an advertiser, I want to view all applications to my campaigns. (`AdvertiserDashboard.tsx`, `useApplications.ts`)
- [x] As an advertiser, I want to approve or reject publisher applications. (`AdvertiserDashboard.tsx`, `AdvertiserApprovalList.tsx`)
- [x] As an advertiser, I want to review video submissions for my campaigns. (`AdvertiserDashboard.tsx`, `AdvertiserApprovalList.tsx`)
- [x] As an advertiser, I want to approve or reject video submissions. (`AdvertiserDashboard.tsx`, `AdvertiserApprovalList.tsx`)
- [x] As an advertiser, I want to see analytics and progress for my campaigns. (`AdvertiserDashboard.tsx`)

### General
- [x] As a user, I want to sign up and select my role (publisher, SP team, advertiser). (`Auth.tsx`, `AuthContext.tsx`)
- [x] As a user, I want to sign in and access my dashboard based on my role. (`Auth.tsx`, `Index.tsx`, `RoleSelection.tsx`)
- [x] As a user, I want to sign out securely. (`Layout.tsx`, `AuthContext.tsx`)
- [x] As a user, I want to receive real-time notifications for important events (e.g., approvals, rejections). (`useNotifications.ts`, Supabase triggers)

---

## System/Platform Stories
- [x] As a system, I want to enforce that each publisher can only apply once per campaign. (`campaign_applications` table UNIQUE constraint)
- [x] As a system, I want to send notifications to publishers when their application or video is reviewed. (DB triggers, `useNotifications.ts`)
- [x] As a system, I want to enforce row-level security so users can only access their own data. (`supabase/migrations/*.sql` RLS policies)
- [x] As a system, I want to provide a responsive and user-friendly interface for all roles. (`Tailwind CSS`, responsive layouts in components)

---

## Future & Advanced User Stories

### Publisher
- [ ] As a publisher, I want to edit or withdraw my application before it is reviewed.
- [ ] As a publisher, I want to view feedback or comments from the SP Team or Advertiser on my application or video.
- [ ] As a publisher, I want to track my earnings and payment status for completed campaigns.
- [ ] As a publisher, I want to filter and search campaigns by category, budget, or brand.
- [ ] As a publisher, I want to manage my profile, including social links and portfolio.

### SP Team
- [ ] As an SP team member, I want to leave comments or feedback on applications and videos for publishers and advertisers to see.
- [ ] As an SP team member, I want to assign applications or videos to specific team members for review.
- [ ] As an SP team member, I want to generate reports on campaign performance and team activity.

### Advertiser
- [ ] As an advertiser, I want to invite collaborators or team members to help manage campaigns.
- [ ] As an advertiser, I want to schedule campaigns to start or end at specific times.
- [ ] As an advertiser, I want to export analytics and application data for offline analysis.
- [ ] As an advertiser, I want to communicate directly with publishers via in-app messaging.
- [ ] As an advertiser, I want to set up automated rules for application approval (e.g., auto-approve based on criteria).

### General
- [ ] As a user, I want to receive email or push notifications for important events.
- [ ] As a user, I want to access the platform from a mobile app with a native experience.
- [ ] As a user, I want to use two-factor authentication for enhanced security.
- [ ] As a user, I want to reset my password or recover my account if I forget my credentials.
- [ ] As a user, I want to access a help center or support chat for assistance.
- [ ] As a user, I want to see a changelog or news feed about platform updates.

### System/Platform
- [ ] As a system, I want to support payment integration for campaign payouts (e.g., Stripe, PayPal).
- [ ] As a system, I want to provide an admin dashboard for managing users, campaigns, and content moderation.
- [ ] As a system, I want to support multi-language/localization for global users.
- [ ] As a system, I want to ensure accessibility (WCAG compliance) for all users.
- [ ] As a system, I want to provide API access for third-party integrations. 
