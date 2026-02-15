from django.contrib import admin
from .models import Skill, TechStack, User, Job, FreelancerProfile, JobApplication

admin.site.register(Skill)
admin.site.register(TechStack)
admin.site.register(User)
admin.site.register(Job)
admin.site.register(FreelancerProfile)
admin.site.register(JobApplication)
