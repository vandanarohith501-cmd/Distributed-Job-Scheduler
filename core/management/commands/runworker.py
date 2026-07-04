import time
import uuid
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from core.models import Worker, WorkerHeartbeat, Queue, Job, JobExecution, JobLog

class Command(BaseCommand):
    help = 'Runs a worker process to poll and execute jobs'

    def handle(self, *args, **options):
        # Register Worker
        hostname = "worker-" + str(uuid.uuid4())[:8]
        worker = Worker.objects.create(hostname=hostname)
        heartbeat = WorkerHeartbeat.objects.create(worker=worker)
        self.stdout.write(self.style.SUCCESS(f"Started {worker}"))
        
        try:
            while True:
                # Update heartbeat
                heartbeat.last_seen = timezone.now()
                heartbeat.save(update_fields=['last_seen'])
                
                job = self.claim_job(worker)
                if job:
                    self.execute_job(worker, job)
                else:
                    time.sleep(1) # Wait before polling again
        except KeyboardInterrupt:
            self.stdout.write("Shutting down worker gracefully...")
            worker.is_active = False
            worker.save(update_fields=['is_active'])
            
    def claim_job(self, worker):
        with transaction.atomic():
            now = timezone.now()
            
            # Find a job that is queued or scheduled, and ready to execute
            job = Job.objects.select_for_update(skip_locked=True).filter(
                state__in=['queued', 'scheduled'],
            ).filter(
                execute_after__isnull=True
            ).first()
            
            if not job:
                # Try finding delayed jobs that are now ready
                job = Job.objects.select_for_update(skip_locked=True).filter(
                    state__in=['queued', 'scheduled'],
                    execute_after__lte=now
                ).first()

            if job:
                job.state = 'claimed'
                job.claimed_by = worker
                job.save(update_fields=['state', 'claimed_by', 'updated_at'])
                return job
        return None
        
    def execute_job(self, worker, job):
        job.state = 'running'
        job.save(update_fields=['state', 'updated_at'])
        
        execution = JobExecution.objects.create(
            job=job,
            worker=worker,
            status='running'
        )
        
        JobLog.objects.create(execution=execution, level='INFO', message=f'Starting job {job.name}')
        
        try:
            # Simulate work execution
            self.stdout.write(f"Executing job {job.id} - {job.name}")
            time.sleep(2) 
            
            # Complete Job
            job.state = 'completed'
            job.save(update_fields=['state', 'updated_at'])
            
            execution.status = 'completed'
            execution.completed_at = timezone.now()
            execution.save()
            
            JobLog.objects.create(execution=execution, level='INFO', message=f'Job completed successfully')
            self.stdout.write(self.style.SUCCESS(f"Completed job {job.id}"))
        except Exception as e:
            # Handle Failure and Retries
            policy = job.retry_policy or job.queue.default_retry_policy
            
            if policy and job.retries_count < policy.max_retries:
                job.retries_count += 1
                job.state = 'queued'
                
                # Calculate delay based on strategy
                if policy.strategy == 'fixed':
                    delay = policy.base_delay_seconds
                elif policy.strategy == 'linear':
                    delay = policy.base_delay_seconds * job.retries_count
                else: # exponential
                    delay = policy.base_delay_seconds * (2 ** (job.retries_count - 1))
                    
                job.execute_after = timezone.now() + timezone.timedelta(seconds=delay)
                job.save(update_fields=['state', 'retries_count', 'execute_after', 'updated_at'])
                
                execution.status = 'failed'
                execution.error_message = str(e)
                execution.completed_at = timezone.now()
                execution.save()
                
                JobLog.objects.create(execution=execution, level='WARNING', message=f'Job failed, scheduling retry {job.retries_count}/{policy.max_retries} in {delay}s: {str(e)}')
                self.stdout.write(self.style.WARNING(f"Failed job {job.id}, retrying in {delay}s"))
            else:
                # Permanent Failure
                job.state = 'failed'
                job.save(update_fields=['state', 'updated_at'])
                
                execution.status = 'failed'
                execution.error_message = str(e)
                execution.completed_at = timezone.now()
                execution.save()
                
                JobLog.objects.create(execution=execution, level='ERROR', message=f'Job failed permanently: {str(e)}')
                self.stdout.write(self.style.ERROR(f"Permanently failed job {job.id}: {str(e)}"))
