import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from api.views import hr_dashboard_stats, hr_employees, hr_payroll, hr_reports
from users.models import User

def test_hr_functionality():
    factory = RequestFactory()
    
    print("--- 1. Testing HR Dashboard Stats ---")
    request = factory.get('/api/hr/dashboard/')
    response = hr_dashboard_stats(request)
    print(f"Status Code: {response.status_code}")
    print(f"Content: {json.dumps(response.data, indent=2)}")
    
    print("\n--- 2. Testing Employee CRUD (CREATE) ---")
    data = {
        "username": "tester_emp",
        "password": "testerpassword",
        "email": "tester@test.com",
        "role": "employee",
        "department": "QA",
        "joining_date": "2026-01-01",
        "hourly_rate": 45.0
    }
    request = factory.post('/api/hr/employees/', data, content_type='application/json')
    response = hr_employees(request)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 201:
        emp_id = response.data['id']
        print(f"Created employee ID: {emp_id}")
    
        print("\n--- 3. Testing Employee CRUD (UPDATE) ---")
        update_data = {"department": "QA & DevOps"}
        request = factory.put(f'/api/hr/employees/{emp_id}/', update_data, content_type='application/json')
        response = hr_employees(request, pk=emp_id)
        print(f"Status Code: {response.status_code}")
        print(f"Updated Department: {response.data['department']}")
    
    print("\n--- 4. Testing Payroll Calculation ---")
    request = factory.get('/api/hr/payroll/')
    response = hr_payroll(request)
    print(f"Status Code: {response.status_code}")
    print(f"Payroll Count: {len(response.data)}")
    if len(response.data) > 0:
        print(f"Sample Payroll: {json.dumps(response.data[0], indent=2)}")

    print("\n--- 5. Testing Reports ---")
    request = factory.get('/api/hr/reports/')
    response = hr_reports(request)
    print(f"Status Code: {response.status_code}")
    print(f"Report Summary: {json.dumps(response.data, indent=2)}")

if __name__ == "__main__":
    test_hr_functionality()
