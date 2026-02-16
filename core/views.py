from .forms import CustomUserCreationForm, JobForm, FreelancerProfileForm
from .models import FreelancerProfile
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required


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
                return redirect("create_freelancer_profile")
    else:
        form = CustomUserCreationForm()

    return render(request, "register.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            if user.user_type == "recruiter":
                return redirect("recruiter_dashboard")
            else:
                return redirect("freelancer_dashboard")
    else:
        form = AuthenticationForm()

    return render(request, "login.html", {"form": form})


@login_required
def recruiter_dashboard(request):
    return render(request, "recruiter_dashboard.html")


@login_required
def freelancer_dashboard(request):
    if request.user.user_type != "freelancer":
        return redirect("recruiter_dashboard")
    try:
        profile = request.user.Freelancer_profile
    except FreelancerProfile.DoesNotExist:
        return redirect("create_freelancer_profile")
    return render(request, "freelancer_dashboard.html", {"profile": profile})


@login_required
def create_freelancer_profile(request):
    if request.user.user_type != "freelancer":
        return redirect("recruiter_dashboard")
    try:
        profile = request.user.Freelancer_profile
        return redirect("edit_freelancer_profile")
    except FreelancerProfile.DoesNotExist:
        pass
    if request.method == "POST":
        form = FreelancerProfileForm(request.POST)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            form.save_m2m()
            return redirect("freelancer_dashboard")
    else:
        form = FreelancerProfileForm()
    return render(request, "freelancer_profile_form.html", {"form": form, "is_edit": False})


@login_required
def edit_freelancer_profile(request):
    if request.user.user_type != "freelancer":
        return redirect("recruiter_dashboard")
    try:
        profile = request.user.Freelancer_profile
    except FreelancerProfile.DoesNotExist:
        return redirect("create_freelancer_profile")
    if request.method == "POST":
        form = FreelancerProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect("freelancer_dashboard")
    else:
        form = FreelancerProfileForm(instance=profile)
    return render(request, "freelancer_profile_form.html", {"form": form, "is_edit": True})

@login_required
def add_job(request):
    if request.user.user_type != "recruiter":
        return redirect("freelancer_dashboard")
    if request.method == "POST":
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.recuriter = request.user
            job.save()
            form.save_m2m()
            return redirect("recruiter_dashboard")
    else:
        form = JobForm()
    return render(request, "add_job.html", {"form": form})