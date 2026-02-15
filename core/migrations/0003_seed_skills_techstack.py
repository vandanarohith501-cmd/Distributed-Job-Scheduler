# Generated migration to seed default Skills and TechStack

from django.db import migrations


def seed_skills_techstack(apps, schema_editor):
    Skill = apps.get_model('core', 'Skill')
    TechStack = apps.get_model('core', 'TechStack')

    skills = ['Python', 'JavaScript', 'React', 'Django', 'Node.js', 'HTML/CSS', 'SQL', 'Git', 'API Development', 'UI/UX Design']
    for name in skills:
        Skill.objects.get_or_create(name=name)

    tech_stack = ['Django', 'React', 'Vue.js', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'REST APIs', 'GraphQL']
    for name in tech_stack:
        TechStack.objects.get_or_create(name=name)


def reverse_seed(apps, schema_editor):
    pass  # Don't delete - users may have linked to these


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_job_recuriter'),
    ]

    operations = [
        migrations.RunPython(seed_skills_techstack, reverse_seed),
    ]
