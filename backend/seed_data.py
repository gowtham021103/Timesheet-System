import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Project, Team, Timesheet, ProjectUpdate, Feedback, Message
from users.models import User

# Get users
admin = User.objects.get(username='admin')
client = User.objects.get(username='client')
manager = User.objects.get(username='manager')
teamlead = User.objects.get(username='teamlead')
employee = User.objects.get(username='employee')

# Create Projects
p1 = Project.objects.create(
    name='Website Redesign',
    description='Complete overhaul of the company website.',
    client=client,
    deadline=date.today() + timedelta(days=30),
    manager=manager,
    status='Active',
    progress=45
)

p2 = Project.objects.create(
    name='Mobile App Development',
    description='Building a cross-platform mobile app.',
    client=client,
    deadline=date.today() + timedelta(days=60),
    manager=manager,
    status='Active',
    progress=20
)

# Create Team Assignments
Team.objects.create(manager=manager, team_lead=teamlead, employee=employee, project=p1)

# Create Updates
ProjectUpdate.objects.create(project=p1, update_text='Homepage design finished.')
ProjectUpdate.objects.create(project=p1, update_text='Backend API integration started.')

# Create Feedback
Feedback.objects.create(project=p1, task_name='UI Mockups', client_feedback='Approved. Please proceed with the frontend.', is_approved=True)

# Create Timesheets
Timesheet.objects.create(user=employee, project=p1, date=date.today(), hours=8.0, status='Approved')

print("Sample data seeded successfully!")
