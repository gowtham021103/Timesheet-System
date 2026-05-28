import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from api.models import Timesheet, Project

# Ensure HR user exists
hr_user, created = User.objects.get_or_create(
    username='hr',
    defaults={'role': 'hr', 'email': 'hr@example.com'}
)
if created:
    hr_user.set_password('hrpassword')
    hr_user.save()
    print("HR user created")

# Update existing employees with HR info
employees = User.objects.filter(role='employee')
departments = ['IT', 'Design', 'Marketing', 'Sales']
base_rate = 25.0

for i, emp in enumerate(employees):
    emp.department = departments[i % len(departments)]
    emp.joining_date = date.today() - timedelta(days=365)
    emp.status = 'Active'
    emp.hourly_rate = base_rate + (i * 5)
    emp.save()
    print(f"Updated employee {emp.username} with department {emp.department} and rate {emp.hourly_rate}")

# Ensure some approved timesheets exist for payroll calculation
# (Timesheets are already there from previous seeds, let's make sure they are 'Approved')
Timesheet.objects.all().update(status='Approved')
print("All timesheets set to 'Approved' for payroll testing")

print("HR Seed data completed!")
