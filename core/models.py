from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('freelancer', 'Freelancer'),
        ('recruiter', 'Recruiter'),
    )

    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES
    )

    email = models.EmailField(unique=True)

    groups = models.ManyToManyField(
        Group,
        related_name='core_users',
        blank=True,
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='core_users_permissions',
        blank=True,
    )

    def __str__(self):
        return f"{self.username} ({self.user_type})"


class Skill(models.Model):
   name = models.CharField(max_length=100, unique=True)
   def __str__(self):
      return self.name
   
class TechStack(models.Model):
    name = models.CharField(max_length =100, unique=True)
    def __str__(self):
        return self.name
    
class FreelancerProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE,
        related_name='Freelancer_profile',
        limit_choices_to={'user_type': 'freelancer'}
    )
    education = models.TextField()
    experience = models.TextField()
    skills = models.ManyToManyField(Skill, blank=True)
    tech_stack = models.ManyToManyField(TechStack, blank = True)
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True)

    def __str__(self):
        return self.user.username 

class Job(models.Model):
    Experience = (
        ('junior', 'Junior'),
        ('mid', 'Mid-level'),
        ('senior', 'Senior'),
    )
    recuriter = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='jobs',
        limit_choices_to={'user_type': 'recruiter'}
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    required_skills = models.ManyToManyField(Skill, blank=True)
    tech_Stack = models.ManyToManyField(TechStack, blank=True)
    pay_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    experience_level = models.CharField(max_length=10, choices=Experience) 
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class JobApplication(models.Model):
    STATUS_CHOICES = (
        ('applied', 'Applied'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    freelancer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="applications",
        limit_choices_to={'user_type': 'freelancer'}
    )

    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='applied'
    )
    cover_letter = models.TextField(blank=True)

    class Meta:
        unique_together = ('job', 'freelancer')

    def __str__(self):
        return f"{self.freelancer} applied for {self.job}"




   