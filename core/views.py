from .forms import CustomUserCreationForm, JobForm
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Job, JobApplication


def home(request):
    return render(request, "home.html")


def register_view(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)

            if user.user_type == "recruiter":
                return redirect("recruiter_dashboard")
            else:
                return redirect("freelancer_dashboard")
    else:
        form = CustomUserCreationForm()

    return render(request, "register.html", {"form": form})


def login_view(request):
    next_url = (request.GET.get("next") or request.POST.get("next") or "").strip()
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            if next_url and next_url.startswith("/") and "//" not in next_url:
                return redirect(next_url)
            if user.user_type == "recruiter":
                return redirect("recruiter_dashboard")
            return redirect("freelancer_dashboard")
    else:
        form = AuthenticationForm()

    return render(request, "login.html", {"form": form, "next_url": next_url})




@login_required
def recruiter_dashboard(request):
    jobs = Job.objects.filter(recuriter=request.user).order_by("-created_at")
    return render(request, "recruiter_dashboard.html", {"jobs": jobs})



@login_required
def freelancer_dashboard(request):
    jobs_qs = Job.objects.filter(is_active=True).select_related("recuriter").prefetch_related(
        "required_skills", "tech_Stack"
    )
    sort = request.GET.get("sort", "created_at")
    order = request.GET.get("order", "desc")
    valid_sorts = ["created_at", "pay_per_hour", "title", "experience_level"]
    if sort not in valid_sorts:
        sort = "created_at"
    order_prefix = "-" if order == "desc" else ""
    jobs_qs = jobs_qs.order_by(f"{order_prefix}{sort}")

    paginator = Paginator(jobs_qs, 6)
    page = request.GET.get("page")
    try:
        jobs = paginator.page(page)
    except PageNotAnInteger:
        jobs = paginator.page(1)
    except EmptyPage:
        jobs = paginator.page(paginator.num_pages)

    applied_job_ids = JobApplication.objects.filter(
        freelancer=request.user
    ).values_list("job_id", flat=True)

    return render(request, "freelancer_dashboard.html", {
        "jobs": jobs,
        "applied_job_ids": list(applied_job_ids),
        "sort": sort,
        "order": order,
    })


@login_required
def job_detail(request, job_id):
    job = get_object_or_404(
        Job.objects.select_related("recuriter").prefetch_related(
            "required_skills", "tech_Stack"
        ),
        pk=job_id,
    )
    # Non-owners can only view active jobs
    if not job.is_active and job.recuriter != request.user:
        messages.info(request, "This job is no longer available.")
        return redirect("freelancer_dashboard" if request.user.user_type == "freelancer" else "recruiter_dashboard")
    has_applied = JobApplication.objects.filter(
        job=job, freelancer=request.user
    ).exists()
    return render(request, "job_detail.html", {"job": job, "has_applied": has_applied})


@login_required
def apply_to_job(request, job_id):
    if request.user.user_type != "freelancer":
        messages.error(request, "Only freelancers can apply for jobs.")
        return redirect("freelancer_dashboard")
    job = get_object_or_404(Job, pk=job_id, is_active=True)
    if JobApplication.objects.filter(job=job, freelancer=request.user).exists():
        messages.info(request, "You have already applied for this job.")
        return redirect("job_detail", job_id=job_id)
    JobApplication.objects.create(job=job, freelancer=request.user)
    messages.success(request, "Your application has been submitted successfully.")
    return redirect("job_detail", job_id=job_id)


@login_required
def add_job(request):
    if request.user.user_type != "recruiter":
        messages.error(request, "Only recruiters can post jobs.")
        return redirect("home")
    if request.method == "POST":
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.recuriter = request.user
            job.save()
            form.save_m2m()  # Save many-to-many (required_skills, tech_Stack)
            messages.success(request, "Job posted successfully.")
            return redirect("recruiter_dashboard")
        return render(request, "add_job.html", {"form": form})
    form = JobForm()
    return render(request, "add_job.html", {"form": form})


@login_required
def create_freelancer_profile(request):
    return redirect("freelancer_dashboard")


@login_required
def edit_freelancer_profile(request):
    return redirect("freelancer_dashboard")
