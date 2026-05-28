import os
import django
import sys
from django.db.models import Sum

# Setup Django
sys.path.append(r'd:\enterprise level timesheet management system\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import Timesheet, Project, Payroll, Team

User = get_user_model()

def run_verification():
    print("--- Starting Dynamic Payroll Verification ---")
    
    # 1. Get/Create Test Employee
    emp, created = User.objects.get_or_create(
        username='employee1',
        defaults={'role': 'employee', 'password': 'employee123', 'status': 'Active', 'hourly_rate': 25.0}
    )
    if emp.hourly_rate == 0:
        emp.hourly_rate = 25.0
        emp.save()
    
    print(f"Employee: {emp.username}, Hourly Rate: ${emp.hourly_rate}")

    # 2. Get/Create Test Project and Manager/Client
    manager, _ = User.objects.get_or_create(username='manager1', defaults={'role': 'manager'})
    client, _ = User.objects.get_or_create(username='client1', defaults={'role': 'client'})
    project, _ = Project.objects.get_or_create(
        name='Verification Project',
        defaults={'manager': manager, 'client': client, 'deadline': '2026-12-31'}
    )
    
    # Ensure employee is in the team
    Team.objects.get_or_create(employee=emp, manager=manager, project=project, team_lead=manager)

    # 3. Clear existing timesheets for this employee to start fresh
    Timesheet.objects.filter(user=emp).delete()
    Payroll.objects.filter(employee=emp).delete()
    print("Cleared existing timesheets and payroll for employee1.")

    # 4. Check Initial Payroll (Should be "No Data")
    from api.views import hr_payroll
    from rest_framework.test import APIRequestFactory
    factory = APIRequestFactory()
    request = factory.get('/api/hr/payroll/')
    response = hr_payroll(request)
    emp_data = next(item for item in response.data if item['employee_name'] == emp.username)
    print(f"Initial Timesheet Status: {emp_data['timesheet_status']}")
    assert emp_data['timesheet_status'] == "No Data"

    # 5. Submit a Timesheet (Should be "Pending Approval")
    ts = Timesheet.objects.create(
        user=emp,
        project=project,
        date='2026-03-18',
        hours=8.0,
        status='Pending'
    )
    print("Submitted 8 hours (Pending).")
    
    response = hr_payroll(request)
    emp_data = next(item for item in response.data if item['employee_name'] == emp.username)
    print(f"New Timesheet Status: {emp_data['timesheet_status']}")
    assert emp_data['timesheet_status'] == "Pending Approval"
    assert emp_data['salary'] == 0 # Only approved counts

    # 6. Approve Timesheet (Should be "Approved" and Salary = 200)
    ts.status = 'Approved'
    ts.save()
    print("Approved 8 hours.")
    
    response = hr_payroll(request)
    emp_data = next(item for item in response.data if item['employee_name'] == emp.username)
    print(f"Final Timesheet Status: {emp_data['timesheet_status']}")
    print(f"Calculated Salary: ${emp_data['salary']}")
    assert emp_data['timesheet_status'] == "Approved"
    assert emp_data['salary'] == 200.0
    assert emp_data['payment_status'] == "Eligible"

    # 7. Process Payment
    from api.views import hr_process_payment
    post_request = factory.post('/api/hr/process-payment/', {'employee_id': emp.id}, format='json')
    pay_response = hr_process_payment(post_request)
    print(f"Payment Action Response: {pay_response.data['status']}")
    assert pay_response.data['status'] == "Success"

    # 8. Final Check (Should be "Paid")
    response = hr_payroll(request)
    emp_data = next(item for item in response.data if item['employee_name'] == emp.username)
    print(f"Final Payment Status: {emp_data['payment_status']}")
    assert emp_data['payment_status'] == "Paid"

    print("--- Verification Successful! ---")

if __name__ == "__main__":
    run_verification()
