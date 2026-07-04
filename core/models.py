from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    # Standard user
    def __str__(self):
        return self.username

class Organization(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organizations')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.organization.name} - {self.name}"

class RetryPolicy(models.Model):
    STRATEGY_CHOICES = (
        ('fixed', 'Fixed Delay'),
        ('linear', 'Linear Backoff'),
        ('exponential', 'Exponential Backoff'),
    )
    name = models.CharField(max_length=100)
    strategy = models.CharField(max_length=20, choices=STRATEGY_CHOICES, default='fixed')
    max_retries = models.IntegerField(default=3)
    base_delay_seconds = models.IntegerField(default=60)
    
    def __str__(self):
        return self.name

class Queue(models.Model):
    name = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='queues')
    priority = models.IntegerField(default=1)
    concurrency_limit = models.IntegerField(default=10)
    is_paused = models.BooleanField(default=False)
    default_retry_policy = models.ForeignKey(RetryPolicy, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('name', 'project')
        indexes = [
            models.Index(fields=['is_paused']),
        ]

    def __str__(self):
        return f"{self.project.name} - {self.name}"

class Worker(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hostname = models.CharField(max_length=255)
    queues = models.ManyToManyField(Queue, related_name='workers')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"Worker {self.id} on {self.hostname}"

class WorkerHeartbeat(models.Model):
    worker = models.OneToOneField(Worker, on_delete=models.CASCADE, related_name='heartbeat')
    last_seen = models.DateTimeField(auto_now=True)
    current_load = models.IntegerField(default=0)

    def __str__(self):
        return f"Heartbeat for {self.worker.id}"

class Job(models.Model):
    STATE_CHOICES = (
        ('queued', 'Queued'),
        ('scheduled', 'Scheduled'),
        ('claimed', 'Claimed'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    queue = models.ForeignKey(Queue, on_delete=models.CASCADE, related_name='jobs')
    name = models.CharField(max_length=255)
    payload = models.JSONField(default=dict)
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='queued')
    
    retry_policy = models.ForeignKey(RetryPolicy, on_delete=models.SET_NULL, null=True, blank=True)
    retries_count = models.IntegerField(default=0)
    
    scheduled_at = models.DateTimeField(null=True, blank=True)
    execute_after = models.DateTimeField(null=True, blank=True) # for delayed jobs or retries
    
    claimed_by = models.ForeignKey(Worker, on_delete=models.SET_NULL, null=True, blank=True, related_name='claimed_jobs')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['state', 'queue', 'execute_after']),
        ]

    def __str__(self):
        return f"Job {self.id} - {self.name} ({self.state})"

class JobExecution(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='executions')
    worker = models.ForeignKey(Worker, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=Job.STATE_CHOICES)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

class JobLog(models.Model):
    execution = models.ForeignKey(JobExecution, on_delete=models.CASCADE, related_name='logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    level = models.CharField(max_length=20, default='INFO')
    message = models.TextField()

class ScheduledJob(models.Model):
    """For recurring (cron) jobs"""
    queue = models.ForeignKey(Queue, on_delete=models.CASCADE, related_name='scheduled_jobs')
    name = models.CharField(max_length=255)
    cron_expression = models.CharField(max_length=100)
    payload = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    last_run_at = models.DateTimeField(null=True, blank=True)
    next_run_at = models.DateTimeField(null=True, blank=True)

class DeadLetterQueue(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name='dlq_entry')
    reason = models.TextField()
    moved_at = models.DateTimeField(auto_now_add=True)