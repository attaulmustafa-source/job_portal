# Job Portal — Phase 1

Next.js + TypeScript + Tailwind app for the Job Portal Management System.

## Theme
- Primary buttons: blue (`#2563eb`)
- Text: black / near-black
- Sidebar: white with blue active item

## Run
```bash
cd web
npm run dev
```
Open http://localhost:3000

## Phase 1 flows
1. Register with email + password + confirm password (Job Seeker or Employer)
2. Verify email (simulated)
3. Login with email/username + password
4. Job Seeker: complete profile (CNIC, phone, etc.) → then apply for jobs
5. Employer: complete profile + organization → submit → admin approve → post jobs
6. Job Seeker cannot become Employer

## Phase 2 flows
1. Jobs require an **expiry date**
2. Expired jobs cannot accept applications
3. Job search/filter + job detail page
4. Employer edit / publish / unpublish jobs
5. Application status lifecycle (Applied → … → Selected/Rejected)
6. In-app notifications for apply, status, and approval events
7. Dashboards show active vs expired job counts

## Phase 3 (Resumes only)
1. Admin manages resume templates (Classic / Modern / Compact)
2. Job seeker creates resumes from active templates
3. Edit, preview, and download/print resume
4. Admin View CV uses saved resume when available

## Phase 4 (Placement & Counselling)
1. Admin manages placement centers and officers
2. Seeker requests counselling at a center
3. Officer approves/rejects and schedules sessions
4. Officer completes sessions with feedback

## Phase 5 (Reports)
1. Admin / Employer / Officer Reports pages
2. Filters: report type, date range, search
3. Summary cards with simple chart bars
4. Export Excel (CSV) and PDF (print → Save as PDF)

## Demo accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@jobportal.local | admin123 |
| Employer | employer@jobportal.local | employer123 |
| Officer | officer@jobportal.local | officer123 |
| NAVTCC Seeker | graduate@navtcc.local | navtcc123 |

Demo NAVTCC CNIC: `35202-1234567-1`

Data is stored in browser `localStorage` (keys `*_v2`). If old demo data appears wrong, clear site localStorage once.
