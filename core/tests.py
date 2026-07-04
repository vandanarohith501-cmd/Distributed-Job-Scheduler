import threading
from django.test import TestCase
from django.utils import timezone
from core.models import User, Organization, Project, Queue, Job, Worker, RetryPolicy
from core.management.commands.runworker import Command

class JobSchedulerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.org = Organization.objects.create(name='Test Org', owner=self.user)
        self.project = Project.objects.create(name='Test Project', organization=self.org)
        
        self.retry_policy = RetryPolicy.objects.create(
            name='Standard Retry',
            strategy='exponential',
            max_retries=3,
            base_delay_seconds=60
        )
        
        self.queue = Queue.objects.create(
            name='default',
            project=self.project,
            default_retry_policy=self.retry_policy
        )

    def test_job_creation(self):
        job = Job.objects.create(name='Test Job', queue=self.queue)
        self.assertEqual(job.state, 'queued')
        self.assertEqual(Job.objects.count(), 1)

    def test_worker_claim_job(self):
        job = Job.objects.create(name='Test Job', queue=self.queue)
        worker = Worker.objects.create(hostname='worker-1')
        
        cmd = Command()
        claimed_job = cmd.claim_job(worker)
        
        self.assertIsNotNone(claimed_job)
        self.assertEqual(claimed_job.id, job.id)
        self.assertEqual(claimed_job.state, 'claimed')
        self.assertEqual(claimed_job.claimed_by.id, worker.id)

    def test_job_execution_success(self):
        job = Job.objects.create(name='Test Job', queue=self.queue)
        worker = Worker.objects.create(hostname='worker-1')
        
        cmd = Command()
        # Mock the sleep so tests run fast
        import time
        original_sleep = time.sleep
        time.sleep = lambda x: None
        
        try:
            cmd.execute_job(worker, job)
            
            job.refresh_from_db()
            self.assertEqual(job.state, 'completed')
            self.assertEqual(job.executions.count(), 1)
            self.assertEqual(job.executions.first().status, 'completed')
        finally:
            time.sleep = original_sleep
