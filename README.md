# Distributed Job Scheduler

A highly scalable, multi-tenant distributed job scheduler built with Django and React.

## Architecture

This project is designed to handle asynchronous background jobs safely across multiple worker nodes.

### Backend (Django)
*   **Database-Backed Queue:** Jobs are inserted into a database-backed queue system.
*   **Concurrency Control:** Background workers pick up jobs via a custom polling engine (`python manage.py runworker`). To prevent race conditions (multiple workers grabbing the same job), the system uses `transaction.atomic()` alongside `select_for_update(skip_locked=True)`. This ensures atomic row-level locking, allowing multiple worker nodes to run concurrently and safely.
*   **REST API:** Clean endpoints (`/api/jobs/`, `/api/queues/`, `/api/metrics/`, `/api/workers/`) expose system state to the frontend in real-time.
*   **Multi-Tenancy:** Architecture includes `Organization` and `Project` schemas to partition queues for different tenants.

### Frontend (React & Tailwind CSS)
*   **Real-time Dashboard:** A responsive, dark-themed UI built with React and Tailwind CSS.
*   **Live Monitoring:** Automatically polls the backend API to reflect real-time updates on Job Executions, Active Queues, Worker Node heartbeats, and aggregated metrics.
*   **Queue Management:** Allows users to manually Pause/Resume active queues, and Retry failed jobs with a single click.

## Running Locally

To run the full stack locally, open three separate terminal windows and run the following commands:

**Terminal 1: Start the API Backend**
```bash
python manage.py runserver
```

**Terminal 2: Start a Background Worker**
*(You can run this command in multiple terminals to simulate a distributed fleet of worker nodes!)*
```bash
python manage.py runworker
```

**Terminal 3: Start the Web Dashboard**
```bash
npm start
```
*The dashboard will automatically open at `http://localhost:3000`.*
