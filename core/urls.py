from django.urls import path
from . import views

urlpatterns = [
    path("api/queues/", views.queues_api, name="api_queues"),
    path("api/queues/<int:queue_id>/toggle/", views.toggle_queue_api, name="api_toggle_queue"),
    path("api/jobs/", views.jobs_api, name="api_jobs"),
    path("api/jobs/<uuid:job_id>/retry/", views.retry_job_api, name="api_retry_job"),
    path("api/workers/", views.workers_api, name="api_workers"),
    path("api/metrics/", views.metrics_api, name="api_metrics"),
]
