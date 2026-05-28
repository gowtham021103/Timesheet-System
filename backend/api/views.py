from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from .models import Project, Team, Timesheet, ProjectUpdate, Feedback, Message, Task, Payroll
from .serializers import (
    UserSerializer, ProjectSerializer, TeamSerializer, TimesheetSerializer,
    ProjectUpdateSerializer, FeedbackSerializer, MessageSerializer, TaskSerializer, PayrollSerializer
)
from django.db.models import Sum, Avg

User = get_user_model()

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({
            'username': user.username,
            'role': user.role,
            'id': user.id
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        role = self.request.query_params.get('role')
        user_id = self.request.query_params.get('user_id')
        
        if role == 'client' and user_id:
            return Project.objects.filter(client_id=user_id)
        return Project.objects.all()

    @action(detail=False, methods=['get'], url_path='client')
    def get_client_projects(self, request):
        user_id = request.query_params.get('user_id')
        if request.user.is_authenticated and getattr(request.user, 'role', '') == 'client':
            projects = Project.objects.filter(client=request.user)
        elif user_id:
            projects = Project.objects.filter(client_id=user_id)
        else:
            return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='manager')
    def get_manager_projects(self, request):
        user_id = request.query_params.get('user_id')
        if request.user.is_authenticated and getattr(request.user, 'role', '') == 'manager':
            projects = Project.objects.filter(manager=request.user)
        elif user_id:
            projects = Project.objects.filter(manager_id=user_id)
        else:
            return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def manager_projects_list(request):
    user_id = request.query_params.get('user_id')
    if request.user.is_authenticated and getattr(request.user, 'role', '') == 'manager':
        projects = Project.objects.filter(manager=request.user)
    elif user_id:
        projects = Project.objects.filter(manager_id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

from django.db.models import Avg

@api_view(['GET'])
def manager_dashboard_stats(request):
    user_id = request.query_params.get('user_id')
    user = request.user
    
    if user.is_authenticated and getattr(user, 'role', '') == 'manager':
        pass
    elif user_id:
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id, role='manager')
        except User.DoesNotExist:
            return Response({"error": "Manager not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    projects = Project.objects.filter(manager=user)
    total_projects = projects.count()
    active_projects = projects.filter(status="Active").count()
    
    team_leads = Team.objects.filter(manager=user).values('team_lead').distinct().count()
    employees = Team.objects.filter(manager=user).values('employee').distinct().count()
    
    pending_timesheets = Timesheet.objects.filter(project__manager=user, status="Pending").count()
    
    progress_dict = projects.aggregate(Avg('progress'))
    completion_rate = progress_dict['progress__avg'] or 0
    
    data = {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "team_leads": team_leads,
        "employees": employees,
        "pending_timesheets": pending_timesheets,
        "completion_rate": round(completion_rate)
    }
    return Response(data)

@api_view(['GET'])
def teamleads_list(request):
    team_leads = User.objects.filter(role="teamlead")
    serializer = UserSerializer(team_leads, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def assign_teamlead(request):
    project_id = request.data.get('project_id')
    teamlead_id = request.data.get('teamlead_id')
    
    try:
        project = Project.objects.get(id=project_id)
        teamlead = User.objects.get(id=teamlead_id, role="teamlead")
        
        project.team_lead = teamlead
        project.save()
        
        return Response({"status": "Success", "message": "Team lead assigned successfully"})
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "Team lead not found"}, status=status.HTTP_404_NOT_FOUND)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        role = self.request.query_params.get('role')
        user_id = self.request.query_params.get('user_id')
        
        if role == 'teamlead' and user_id:
            return Task.objects.filter(project__team_lead_id=user_id)
        elif role == 'employee' and user_id:
            return Task.objects.filter(employee_id=user_id)
        return Task.objects.all()

class ProjectUpdateViewSet(viewsets.ModelViewSet):
    queryset = ProjectUpdate.objects.all()
    serializer_class = ProjectUpdateSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get_queryset(self):
        role = self.request.query_params.get('role')
        user_id = self.request.query_params.get('user_id')
        
        if role == 'manager' and user_id:
            return Team.objects.filter(manager_id=user_id)
        return Team.objects.all()

class TimesheetViewSet(viewsets.ModelViewSet):
    queryset = Timesheet.objects.all()
    serializer_class = TimesheetSerializer

    def get_queryset(self):
        role = self.request.query_params.get('role')
        user_id = self.request.query_params.get('user_id')
        
        if role == 'client' and user_id:
            # Show timesheets for projects assigned to this client
            return Timesheet.objects.filter(project__client_id=user_id)
        elif role == 'manager' and user_id:
            # Show timesheets for projects managed by this manager
            return Timesheet.objects.filter(project__manager_id=user_id)
        return Timesheet.objects.all()

    @action(detail=True, methods=['patch'], url_path='approve')
    def approve_timesheet(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.status = 'Approved'
        timesheet.save()
        return Response({'status': 'Timesheet approved'})

    @action(detail=True, methods=['patch'], url_path='reject')
    def reject_timesheet(self, request, pk=None):
        timesheet = self.get_object()
        timesheet.status = 'Rejected'
        timesheet.save()
        return Response({'status': 'Timesheet rejected'})

@api_view(['POST'])
def approve_timesheet_api(request):
    timesheet_id = request.data.get('timesheet_id')
    try:
        timesheet = Timesheet.objects.get(id=timesheet_id)
        timesheet.status = 'Approved'
        timesheet.save()
        return Response({"status": "Timesheet approved"})
    except Timesheet.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def reject_timesheet_api(request):
    timesheet_id = request.data.get('timesheet_id')
    try:
        timesheet = Timesheet.objects.get(id=timesheet_id)
        timesheet.status = 'Rejected'
        timesheet.save()
        return Response({"status": "Timesheet rejected"})
    except Timesheet.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def teamlead_dashboard_stats(request):
    user_id = request.query_params.get('user_id')
    user = request.user
    
    if user.is_authenticated and getattr(user, 'role', '') == 'teamlead':
        pass
    elif user_id:
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id, role='teamlead')
        except User.DoesNotExist:
            return Response({"error": "Team lead not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    projects = Project.objects.filter(team_lead=user)
    total_projects = projects.count()
    
    employees = get_user_model().objects.filter(team_employee_assigned__team_lead=user, role='employee').distinct().count()
    
    pending_timesheets = Timesheet.objects.filter(project__team_lead=user, status='Pending').count()
    completed_tasks = Task.objects.filter(project__team_lead=user, status='Completed').count()
    
    progress_dict = projects.aggregate(Avg('progress'))
    completion_rate = progress_dict['progress__avg'] or 0
    
    data = {
        "total_projects": total_projects,
        "employees": employees,
        "pending_timesheets": pending_timesheets,
        "completed_tasks": completed_tasks,
        "completion_rate": round(completion_rate)
    }
    return Response(data)

@api_view(['GET'])
def teamlead_projects(request):
    user_id = request.query_params.get('user_id')
    if request.user.is_authenticated and getattr(request.user, 'role', '') == 'teamlead':
        projects = Project.objects.filter(team_lead=request.user)
    elif user_id:
        projects = Project.objects.filter(team_lead_id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def teamlead_employees(request):
    user_id = request.query_params.get('user_id')
    if request.user.is_authenticated and getattr(request.user, 'role', '') == 'teamlead':
        user = request.user
    elif user_id:
        user = get_user_model().objects.get(id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)

    employees = get_user_model().objects.filter(team_employee_assigned__team_lead=user, role='employee').distinct()
    
    data = []
    for emp in employees:
        emp_tasks = Task.objects.filter(employee=emp, project__team_lead=user)
        assigned_project = Team.objects.filter(employee=emp, team_lead=user).first()
        proj_name = assigned_project.project.name if assigned_project else "Unassigned"
        data.append({
            "id": emp.id,
            "username": emp.username,
            "assigned_project": proj_name,
            "task_count": emp_tasks.count(),
            "status": "Active"
        })
        
    return Response(data)

@api_view(['GET'])
def teamlead_timesheets(request):
    user_id = request.query_params.get('user_id')
    if request.user.is_authenticated and getattr(request.user, 'role', '') == 'teamlead':
        user = request.user
    elif user_id:
        user = get_user_model().objects.get(id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    timesheets = Timesheet.objects.filter(project__team_lead=user)
    serializer = TimesheetSerializer(timesheets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def teamlead_reports(request):
    user_id = request.query_params.get('user_id')
    if request.user.is_authenticated and getattr(request.user, 'role', '') == 'teamlead':
        user = request.user
    elif user_id:
        user = get_user_model().objects.get(id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    projects = Project.objects.filter(team_lead=user)
    report_data = {
        "employee_work_hours": [],
        "task_completion": [],
        "project_progress": []
    }
    
    for proj in projects:
        report_data["project_progress"].append({
            "project": proj.name,
            "progress": proj.progress
        })
        
    return Response(report_data)

@api_view(['GET'])
def employee_dashboard_stats(request):
    user_id = request.query_params.get('user_id')
    user = request.user
    
    if user.is_authenticated and getattr(user, 'role', '') == 'employee':
        pass
    elif user_id:
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id, role='employee')
        except User.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    projects = Project.objects.filter(teams__employee=user).distinct()
    total_projects = projects.count()
    
    tasks = Task.objects.filter(employee=user)
    total_tasks = tasks.count()
    pending_tasks = tasks.filter(status='Pending').count()
    completed_tasks = tasks.filter(status='Completed').count()
    
    submitted_timesheets = Timesheet.objects.filter(user=user).count()
    
    completion_rate = 0
    if total_tasks > 0:
        completion_rate = round((completed_tasks / total_tasks) * 100)
    else:
        progress_dict = projects.aggregate(Avg('progress'))
        completion_rate = round(progress_dict['progress__avg'] or 0)
        
    data = {
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "submitted_timesheets": submitted_timesheets,
        "completion_rate": completion_rate
    }
    return Response(data)

@api_view(['GET'])
def employee_projects(request):
    user_id = request.query_params.get('user_id')
    user = request.user
    if user.is_authenticated and getattr(user, 'role', '') == 'employee':
        pass
    elif user_id:
        user = get_user_model().objects.get(id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    projects = Project.objects.filter(teams__employee=user).distinct()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def employee_tasks(request):
    user_id = request.query_params.get('user_id')
    user = request.user
    if user.is_authenticated and getattr(user, 'role', '') == 'employee':
        pass
    elif user_id:
        user = get_user_model().objects.get(id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    tasks = Task.objects.filter(employee=user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def employee_timesheets(request):
    user_id = request.query_params.get('user_id')
    user = request.user
    if user.is_authenticated and getattr(user, 'role', '') == 'employee':
        pass
    elif user_id:
        user = get_user_model().objects.get(id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    timesheets = Timesheet.objects.filter(user=user)
    serializer = TimesheetSerializer(timesheets, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_task_status(request):
    task_id = request.data.get('task_id')
    status_val = request.data.get('status')
    try:
        task = Task.objects.get(id=task_id)
        task.status = status_val
        task.save()
        return Response({"status": "Task updated"})
    except Task.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def submit_timesheet(request):
    user_id = request.query_params.get('user_id')
    user = request.user
    if user.is_authenticated and getattr(user, 'role', '') == 'employee':
        pass
    elif user_id:
        user = get_user_model().objects.get(id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    project_id = request.data.get('project_id')
    date = request.data.get('date')
    hours_worked = request.data.get('hours_worked')
    description = request.data.get('description', '')
    
    try:
        project = Project.objects.get(id=project_id)
        Timesheet.objects.create(
            user=user,
            project=project,
            date=date,
            hours=hours_worked,
            description=description,
            status='Pending'
        )
        return Response({"status": "Timesheet submitted successfully"})
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def send_message(request):
    user_id = request.query_params.get('user_id')
    user = request.user
    if user.is_authenticated and getattr(user, 'role', '') == 'employee':
        pass
    elif user_id:
        User = get_user_model()
        user = User.objects.get(id=user_id)
    else:
        return Response({"error": "Authentication or user_id required"}, status=status.HTTP_401_UNAUTHORIZED)
        
    receiver_id = request.data.get('receiver')
    message_content = request.data.get('message')
    
    try:
        User = get_user_model()
        receiver = User.objects.get(id=receiver_id)
        msg = Message.objects.create(
            sender=user,
            receiver=receiver,
            content=message_content
        )
        return Response({"status": "Message sent successfully", "id": msg.id})
    except User.DoesNotExist:
        return Response({"error": "Receiver not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# HR DASHBOARD VIEWS
@api_view(['GET'])
def hr_dashboard_stats(request):
    total_employees = User.objects.filter(role='employee').count()
    total_managers = User.objects.filter(role='manager').count()
    total_teamleads = User.objects.filter(role='teamlead').count()
    active_employees = User.objects.filter(role='employee', status='Active').count()
    pending_timesheets = Timesheet.objects.filter(status='Pending').count()
    
    # Calculate Monthly Payroll Cost (example: for current month/total)
    total_payroll_cost = Payroll.objects.aggregate(Sum('salary'))['salary__sum'] or 0
    
    data = {
        "total_employees": total_employees,
        "active_employees": active_employees,
        "total_managers": total_managers,
        "total_teamleads": total_teamleads,
        "pending_timesheets": pending_timesheets,
        "monthly_payroll_cost": float(total_payroll_cost)
    }
    return Response(data)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def hr_employees(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                emp = User.objects.get(pk=pk, role='employee')
                serializer = UserSerializer(emp)
                return Response(serializer.data)
            except User.DoesNotExist:
                return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            employees = User.objects.filter(role='employee')
            serializer = UserSerializer(employees, many=True)
            return Response(serializer.data)
            
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'PUT':
        try:
            emp = User.objects.get(pk=pk)
            serializer = UserSerializer(emp, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
            
    elif request.method == 'DELETE':
        try:
            emp = User.objects.get(pk=pk)
            # Deactivate instead of hard delete might be safer if user prefers
            emp.status = 'Inactive'
            emp.save()
            return Response({"status": "Employee deactivated"})
        except User.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def hr_attendance(request):
    attendance = Timesheet.objects.all().order_by('-date')
    serializer = TimesheetSerializer(attendance, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def hr_payroll(request):
    """
    Dynamically calculate payroll for all employees based on approved timesheets.
    """
    employees = User.objects.filter(role='employee')
    payroll_list = []
    
    # We use a fixed "month" for the current cycle for simplicity in this demo,
    # but in a real app, this would be the current calendar month/year.
    current_month = "March 2026"
    
    for emp in employees:
        # 1. Calculate All Timesheets Status
        all_timesheets = Timesheet.objects.filter(user=emp)
        if not all_timesheets.exists():
            timesheet_status = "No Data"
        elif all_timesheets.filter(status='Pending').exists():
            timesheet_status = "Pending Approval"
        else:
            timesheet_status = "Approved"
            
        # 2. Calculate Approved Hours & Salary
        approved_hours = all_timesheets.filter(status='Approved').aggregate(Sum('hours'))['hours__sum'] or 0
        hourly_rate = emp.hourly_rate or 0
        salary = float(approved_hours) * float(hourly_rate)
        
        # 3. Determine Payment Status
        # Check if a 'Paid' record exists for this employee and month
        is_paid = Payroll.objects.filter(employee=emp, month=current_month, is_paid=True).exists()
        
        if is_paid:
            payment_status = "Paid"
        elif salary > 0:
            payment_status = "Eligible"
        else:
            payment_status = "Not Eligible"
            
        payroll_list.append({
            "employee_id": emp.id,
            "employee_name": emp.username,
            "month": current_month,
            "total_hours": float(approved_hours),
            "hourly_rate": float(hourly_rate),
            "salary": salary,
            "timesheet_status": timesheet_status,
            "payment_status": payment_status
        })
        
    return Response(payroll_list)

@api_view(['POST'])
def hr_process_payment(request):
    """
    Process payment for an employee for the current cycle.
    """
    employee_id = request.data.get('employee_id')
    current_month = "March 2026"
    
    try:
        employee = User.objects.get(id=employee_id, role='employee')
        
        # Calculate current dynamic values to store in the record
        approved_hours = Timesheet.objects.filter(user=employee, status='Approved').aggregate(Sum('hours'))['hours__sum'] or 0
        hourly_rate = employee.hourly_rate or 0
        salary = float(approved_hours) * float(hourly_rate)
        
        if salary <= 0:
            return Response({"error": "No approved hours to pay"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Create or update Payroll record
        payroll_record, created = Payroll.objects.update_or_create(
            employee=employee,
            month=current_month,
            defaults={
                'total_hours': approved_hours,
                'hourly_rate': hourly_rate,
                'salary': salary,
                'is_paid': True
            }
        )
        
        return Response({
            "status": "Success",
            "message": f"Payment processed for {employee.username}",
            "amount": salary
        })
        
    except User.DoesNotExist:
        return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def hr_timesheets(request):
    timesheets = Timesheet.objects.all().order_by('-date')
    serializer = TimesheetSerializer(timesheets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def hr_reports(request):
    total_employees = User.objects.filter(role='employee').count()
    total_hours = Timesheet.objects.filter(status='Approved').aggregate(Sum('hours'))['hours__sum'] or 0
    total_payroll = 0
    
    employees = User.objects.filter(role='employee')
    for emp in employees:
        emp_hours = Timesheet.objects.filter(user=emp, status='Approved').aggregate(Sum('hours'))['hours__sum'] or 0
        total_payroll += float(emp_hours) * float(emp.hourly_rate or 0)
        
    data = {
        "total_employees": total_employees,
        "total_hours_worked": float(total_hours),
        "total_payroll_cost": total_payroll,
        "project_productivity": [] # Detailed report can go here
    }
    
    projects = Project.objects.all()
    for proj in projects:
        proj_hours = Timesheet.objects.filter(project=proj, status='Approved').aggregate(Sum('hours'))['hours__sum'] or 0
        data["project_productivity"].append({
            "project": proj.name,
            "hours": float(proj_hours)
        })
        
    return Response(data)
