<<<<<<< HEAD
from django.shortcuts import render
=======
>>>>>>> f6fc65bd7c35f94f3595b10b69fe9c24f4088df6
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to Freelancer Hiring Platform")

<<<<<<< HEAD
def login_view(request):
    return render(request, 'login.html')

def register_view(request):
    return render(request, 'register.html')
=======
>>>>>>> f6fc65bd7c35f94f3595b10b69fe9c24f4088df6
