from django.contrib import admin
from .models import User, Organization, Project, RetryPolicy, Queue, Worker, WorkerHeartbeat, Job, JobExecution, JobLog, ScheduledJob, DeadLetterQueue

admin.site.register(User)
admin.site.register(Organization)
admin.site.register(Project)
admin.site.register(RetryPolicy)
admin.site.register(Queue)
admin.site.register(Worker)
admin.site.register(WorkerHeartbeat)
admin.site.register(Job)
admin.site.register(JobExecution)
admin.site.register(JobLog)
admin.site.register(ScheduledJob)
admin.site.register(DeadLetterQueue)
