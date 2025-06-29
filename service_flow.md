# Endorse-Flow-Nexus Service Flow

This document describes the full, detailed service flow for the Endorse-Flow-Nexus platform, covering all major user roles and system interactions.

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Publisher
    participant FE as Frontend (React)
    participant Supabase as Supabase API
    participant DB as PostgreSQL
    participant Advertiser
    participant SPTeam as SP Team

    %% Publisher applies for campaign
    Publisher->>FE: Login/Sign Up
    FE->>Supabase: Auth request
    Supabase->>DB: Check/Create user
    Supabase-->>FE: Auth token
    FE-->>Publisher: Show dashboard

    Publisher->>FE: Browse campaigns
    FE->>Supabase: Fetch active campaigns
    Supabase->>DB: SELECT campaigns WHERE status='active'
    Supabase-->>FE: Campaign list
    FE-->>Publisher: Show campaigns

    Publisher->>FE: Apply for campaign
    FE->>Supabase: Insert campaign_application
    Supabase->>DB: INSERT INTO campaign_applications
    DB-->>Supabase: Enforce UNIQUE(campaign_id, publisher_id)
    Supabase-->>FE: Application status
    FE-->>Publisher: Show application submitted

    %% SP Team reviews application
    SPTeam->>FE: Login
    FE->>Supabase: Auth request
    Supabase->>DB: Check user
    Supabase-->>FE: Auth token
    FE->>Supabase: Fetch pending applications
    Supabase->>DB: SELECT campaign_applications WHERE status='pending'
    Supabase-->>FE: Application list
    FE-->>SPTeam: Show applications
    SPTeam->>FE: Approve/Reject application
    FE->>Supabase: Update application status
    Supabase->>DB: UPDATE campaign_applications SET status
    DB->>Supabase: Trigger notification (if status changes)
    Supabase->>DB: INSERT INTO notifications
    Supabase-->>FE: Update result
    FE-->>SPTeam: Show result

    %% Advertiser reviews application
    Advertiser->>FE: Login
    FE->>Supabase: Auth request
    Supabase->>DB: Check user
    Supabase-->>FE: Auth token
    FE->>Supabase: Fetch SP-approved applications
    Supabase->>DB: SELECT campaign_applications WHERE status='sp_approved'
    Supabase-->>FE: Application list
    FE-->>Advertiser: Show applications
    Advertiser->>FE: Approve/Reject application
    FE->>Supabase: Update application status
    Supabase->>DB: UPDATE campaign_applications SET status
    DB->>Supabase: Trigger notification (if status changes)
    Supabase->>DB: INSERT INTO notifications
    Supabase-->>FE: Update result
    FE-->>Advertiser: Show result

    %% Publisher uploads video after approval
    Publisher->>FE: Upload video
    FE->>Supabase: Insert video
    Supabase->>DB: INSERT INTO videos
    Supabase-->>FE: Video status
    FE-->>Publisher: Show upload result

    %% SP Team and Advertiser review video
    SPTeam->>FE: Review video
    FE->>Supabase: Update video status
    Supabase->>DB: UPDATE videos SET status
    DB->>Supabase: Trigger notification (if status changes)
    Supabase->>DB: INSERT INTO notifications
    Supabase-->>FE: Update result
    FE-->>SPTeam: Show result

    Advertiser->>FE: Review video
    FE->>Supabase: Update video status
    Supabase->>DB: UPDATE videos SET status
    DB->>Supabase: Trigger notification (if status changes)
    Supabase->>DB: INSERT INTO notifications
    Supabase-->>FE: Update result
    FE-->>Advertiser: Show result

    %% Notifications
    Supabase->>FE: Realtime notification (websocket/subscription)
    FE-->>Publisher: Show notification
    FE-->>SPTeam: Show notification
    FE-->>Advertiser: Show notification
```

---

## Step-by-Step Service Flow

### 1. **User Authentication**
- All users (Publisher, SP Team, Advertiser) sign up or log in via the frontend.
- The frontend sends authentication requests to Supabase, which checks/creates users in the database and returns an auth token.

### 2. **Publisher Campaign Application**
- Publisher browses active campaigns (fetched from Supabase/PostgreSQL).
- Publisher applies for a campaign; the frontend sends an insert request to Supabase.
- Supabase enforces a unique constraint (one application per publisher per campaign).
- Publisher receives application status feedback.

### 3. **SP Team Application Review**
- SP Team logs in and fetches pending applications.
- SP Team approves or rejects applications via the frontend.
- The frontend updates the application status in Supabase/PostgreSQL.
- If the status changes, a notification is triggered and inserted into the notifications table.
- SP Team receives feedback on the result.

### 4. **Advertiser Application Review**
- Advertiser logs in and fetches SP-approved applications.
- Advertiser approves or rejects applications via the frontend.
- The frontend updates the application status in Supabase/PostgreSQL.
- If the status changes, a notification is triggered and inserted into the notifications table.
- Advertiser receives feedback on the result.

### 5. **Publisher Video Upload**
- After approval, the publisher uploads a video for the campaign.
- The frontend sends the video data to Supabase/PostgreSQL.
- Publisher receives upload status feedback.

### 6. **SP Team and Advertiser Video Review**
- SP Team and Advertiser review video submissions.
- They approve or reject videos via the frontend.
- The frontend updates the video status in Supabase/PostgreSQL.
- If the status changes, a notification is triggered and inserted into the notifications table.
- Reviewers receive feedback on the result.

### 7. **Notifications**
- Supabase sends real-time notifications to the frontend via websockets/subscriptions.
- All users see notifications for relevant events (application/video approval or rejection).

---

This flow ensures a clear, auditable, and user-friendly endorsement workflow for all roles in the Endorse-Flow-Nexus platform. 