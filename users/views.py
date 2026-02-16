from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to Freelancer Hiring Platform")

