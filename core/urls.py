from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("login/", views.login_view, name="login"),
    path("logout/", auth_views.LogoutView.as_view(next_page="home"), name="logout"),
    path("register/", views.register_view, name="register"),

    path("recruiter/dashboard/", views.recruiter_dashboard, name="recruiter_dashboard"),
    path("freelancer/dashboard/", views.freelancer_dashboard, name="freelancer_dashboard"),
    path("add-job/", views.add_job, name="add_job"),
    path("freelancer/profile/create/", views.create_freelancer_profile, name="create_freelancer_profile"),
    path("freelancer/profile/edit/", views.edit_freelancer_profile, name="edit_freelancer_profile"),
]
