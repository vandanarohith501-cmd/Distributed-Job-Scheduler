import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Queue, Job, Worker, Project, Organization

@csrf_exempt
@require_http_methods(["GET", "POST"])
def queues_api(request):
    if request.method == "GET":
        queues = Queue.objects.all().values('id', 'name', 'priority', 'concurrency_limit', 'is_paused')
        return JsonResponse({"queues": list(queues)})
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            org, _ = Organization.objects.get_or_create(name="Default Org", owner_id=1) 
            proj, _ = Project.objects.get_or_create(name="Default Project", organization=org)
            
            queue = Queue.objects.create(
                name=data.get('name', 'Unnamed Queue'),
                project=proj,
                priority=data.get('priority', 1),
                concurrency_limit=data.get('concurrency_limit', 10)
            )
            return JsonResponse({"id": queue.id, "name": queue.name}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def toggle_queue_api(request, queue_id):
    try:
        queue = Queue.objects.get(id=queue_id)
        queue.is_paused = not queue.is_paused
        queue.save(update_fields=['is_paused'])
        return JsonResponse({"id": queue.id, "is_paused": queue.is_paused})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def jobs_api(request):
    if request.method == "GET":
        jobs = Job.objects.all().order_by('-created_at')[:100].values(
            'id', 'name', 'state', 'queue__name', 'created_at', 'updated_at'
        )
        return JsonResponse({"jobs": list(jobs)})
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            queue_id = data.get('queue_id')
            if not queue_id:
                 queue = Queue.objects.first()
            else:
                 queue = Queue.objects.get(id=queue_id)
                 
            job = Job.objects.create(
                name=data.get('name', 'Unnamed Job'),
                queue=queue,
                payload=data.get('payload', {})
            )
            return JsonResponse({"id": str(job.id), "name": job.name, "state": job.state}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def retry_job_api(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        job.state = 'queued'
        job.save(update_fields=['state'])
        return JsonResponse({"id": str(job.id), "state": job.state})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@require_http_methods(["GET"])
def workers_api(request):
    workers = Worker.objects.all().values('id', 'hostname', 'is_active', 'heartbeat__last_seen')
    return JsonResponse({"workers": list(workers)})

@require_http_methods(["GET"])
def metrics_api(request):
    queued = Job.objects.filter(state='queued').count()
    running = Job.objects.filter(state='running').count()
    completed = Job.objects.filter(state='completed').count()
    failed = Job.objects.filter(state='failed').count()
    active_workers = Worker.objects.filter(is_active=True).count()
    
    return JsonResponse({
        "jobs": {
            "queued": queued,
            "running": running,
            "completed": completed,
            "failed": failed,
        },
        "workers": {
            "active": active_workers
        }
    })
