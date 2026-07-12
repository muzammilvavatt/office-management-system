# Office Management System

A robust, full-stack web application designed to streamline internal operations, track employee attendance with geofencing, manage projects, and optimize task delegation.

Built with modern web technologies, this system provides a secure, fast, and intuitive experience for both Administrators and Employees.

## ✨ Key Features

- **📍 Geofenced Attendance Tracking:** Strictly enforce office premises for clock-ins using the browser's Geolocation API. (Includes an `isWFH` bypass for remote workers).
- **⏱️ Precision Task Time Tracking:** Employees can start and pause task timers. The system tracks time spent down to the minute.
- **📈 Task Delegation & Workflow:** Admins can assign tasks to employees with specific allotted times. Employees can request time extensions directly through the portal.
- **🔔 Real-Time Notification Hub:** Two-way notification system. Employees are notified of new tasks and extension approvals. Admins are notified of task completions and extension requests.
- **📁 Secure File Management:** Upload, preview, and download project files directly to Supabase storage.
- **👥 Role-Based Access Control:** Distinct Admin and Employee views. Admins have full oversight over projects, tasks, and team management.
- **📊 Activity Logging:** Detailed audit trails for every action taken within the system.

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Database:** PostgreSQL (Hosted on [Supabase](https://supabase.com/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Authentication:** Custom session-based auth with `bcryptjs`
- **Deployment:** [Vercel](https://vercel.com/) (Sydney Region for optimal latency)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account and PostgreSQL database url.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muzammilvavatt/office-management-system.git
   cd office-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Supabase connection strings:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"
   
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

4. **Initialize the Database**
   ```bash
   npx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔐 Default Accounts

*(If a seed script was run, otherwise register a new account and manually upgrade the role in the database)*
- **Admin:** `admin@example.com` | `password`
- **Employee:** `employee@example.com` | `password`

## 🌍 Localization

This application is strictly localized for **India Standard Time (IST)**. All timestamps, activity feeds, and attendance records are formatted using the `en-IN` locale and `Asia/Kolkata` timezone to prevent serverless UTC drift.

---
*Developed for efficient office management.*
