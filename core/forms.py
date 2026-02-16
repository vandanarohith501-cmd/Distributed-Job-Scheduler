from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Job, Skill, TechStack, FreelancerProfile


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'user_type', 'password1', 'password2']


class JobForm(forms.ModelForm):
    required_skills = forms.ModelMultipleChoiceField(
        queryset=Skill.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )
    tech_Stack = forms.ModelMultipleChoiceField(
        queryset=TechStack.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

    class Meta:
        model = Job
        fields = ['title', 'description', 'required_skills', 'tech_Stack', 'pay_per_hour', 'experience_level']


class FreelancerProfileForm(forms.ModelForm):
    skills = forms.ModelMultipleChoiceField(
        queryset=Skill.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )
    tech_stack = forms.ModelMultipleChoiceField(
        queryset=TechStack.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

    class Meta:
        model = FreelancerProfile
        fields = ['education', 'experience', 'skills', 'tech_stack', 'bio', 'hourly_rate']
        widgets = {
            'education': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Degrees, certifications, courses...'}),
            'experience': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Work history, projects, achievements...'}),
            'bio': forms.Textarea(attrs={'rows': 3, 'placeholder': 'A brief about yourself and what you offer...'}),
        }
