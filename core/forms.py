from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Job, Skill, TechStack, FreelancerProfile


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'user_type', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.setdefault('class', 'form-control')


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
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Senior Python Developer'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 5, 'placeholder': 'Describe the role, responsibilities, and requirements...'}),
            'pay_per_hour': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'min': '0', 'placeholder': 'e.g. 1500'}),
            'experience_level': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'title': 'Job Title',
            'description': 'Description',
            'pay_per_hour': 'Pay per hour (₹)',
            'experience_level': 'Experience Level',
        }

    def clean_title(self):
        title = self.cleaned_data.get('title', '').strip()
        if not title:
            raise forms.ValidationError('Job title is required.')
        if len(title) > 200:
            raise forms.ValidationError('Title must be 200 characters or less.')
        return title

    def clean_description(self):
        description = self.cleaned_data.get('description', '').strip()
        if not description:
            raise forms.ValidationError('Description is required.')
        return description

    def clean_pay_per_hour(self):
        pay = self.cleaned_data.get('pay_per_hour')
        if pay is not None and pay < 0:
            raise forms.ValidationError('Pay per hour must be 0 or greater.')
        if pay is not None and pay > 9999999.99:
            raise forms.ValidationError('Pay amount is too large.')
        return pay


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
