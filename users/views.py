from django.shortcuts import render
from django.http import HttpResponse


def home(request):
    return HttpResponse("Welcome to Freelancer Hiring Platform")


def login_view(request):
    return render(request, 'login.html')


def register_view(request):
    return render(request, 'register.html')
