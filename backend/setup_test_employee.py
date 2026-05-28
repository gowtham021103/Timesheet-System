import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import Project, Team, Task

User = get_user_model()

# Create Employee
user, created = User.objects.get_or_create(username='jetski_emp', defaults={'role': 'employee'})
if created:
    user.set_password('jetskipassword')
    user.save()
    print("User jetski_emp created")
else:
    user.role = 'employee'
    user.set_password('jetskipassword')
    user.save()
    print("User jetski_emp updated")

# Create a Team Lead if not exists
tl, created = User.objects.get_or_create(username='jetski_tl', defaults={'role': 'teamlead'})
if created:
    tl.set_password('jetskipassword')
    tl.save()

# Create a Client if not exists
client, created = User.objects.get_or_create(username='jetski_client', defaults={'role': 'client'})
if created:
    client.set_password('jetskipassword')
    client.save()

# Create a Manager if not exists
manager, created = User.objects.get_or_create(username='jetski_manager', defaults={'role': 'manager'})
if created:
    manager.set_password('jetskipassword')
    manager.save()

# Create a project and assign tl and emp
project, created = Project.objects.get_or_create(
    name="Employee Test Project",
    defaults={
        "description": "A project for testing employee dashboard",
        "status": "In Progress",
        "progress": 50,
        "deadline": "2026-12-31",
        "client": client,
        "manager": manager
    }
)
if not created:
    project.client = client
    project.manager = manager
project.team_lead = tl
project.save()

# Assign employee to the project via Team
try:
    team, created = Team.objects.get_or_create(
        project=project,
        employee=user,
        manager=manager,
        team_lead=tl
    )
    print("Employee assigned to project via Team")
except Exception as e:
    print(f"Error assigning employee: {e}")

# Create a task for the employee
task, created = Task.objects.get_or_create(
    task_title="Verify Dashboard",
    employee=user,
    project=project,
    defaults={
        "description": "Test all buttons and forms",
        "status": "Pending",
        "deadline": "2026-04-01"
    }
)
print("Task created for employee")
