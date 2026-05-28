from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import login_view, UserViewSet, ProjectViewSet, TeamViewSet, TimesheetViewSet
# Oops typo vows vs views

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'project-updates', views.ProjectUpdateViewSet)
router.register(r'feedbacks', views.FeedbackViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'teams', views.TeamViewSet)
router.register(r'timesheets', views.TimesheetViewSet)
router.register(r'tasks', views.TaskViewSet)

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('manager/projects/', views.manager_projects_list, name='manager-projects'),
    path('manager/dashboard/', views.manager_dashboard_stats, name='manager-dashboard-stats'),
    path('teamleads/', views.teamleads_list, name='teamleads-list'),
    path('assign-teamlead/', views.assign_teamlead, name='assign-teamlead'),
    path('teamlead/dashboard/', views.teamlead_dashboard_stats, name='teamlead-dashboard-stats'),
    path('teamlead/projects/', views.teamlead_projects, name='teamlead-projects'),
    path('teamlead/employees/', views.teamlead_employees, name='teamlead-employees'),
    path('teamlead/timesheets/', views.teamlead_timesheets, name='teamlead-timesheets'),
    path('teamlead/reports/', views.teamlead_reports, name='teamlead-reports'),
    path('timesheets/approve/', views.approve_timesheet_api, name='approve-timesheet-api'),
    path('timesheets/reject/', views.reject_timesheet_api, name='reject-timesheet-api'),
    path('employee/dashboard/', views.employee_dashboard_stats, name='employee-dashboard-stats'),
    path('employee/projects/', views.employee_projects, name='employee-projects'),
    path('employee/tasks/', views.employee_tasks, name='employee-tasks'),
    path('employee/timesheets/', views.employee_timesheets, name='employee-timesheets'),
    path('tasks/update/', views.update_task_status, name='update-task-status'),
    path('timesheets/submit/', views.submit_timesheet, name='submit-timesheet'),
    path('messages/', views.send_message, name='send-message'),
    
    # HR Dashboards
    path('hr/dashboard/', views.hr_dashboard_stats, name='hr-dashboard-stats'),
    path('hr/employees/', views.hr_employees, name='hr-employees'),
    path('hr/employees/<int:pk>/', views.hr_employees, name='hr-employee-detail'),
    path('hr/attendance/', views.hr_attendance, name='hr-attendance'),
    path('hr/payroll/', views.hr_payroll, name='hr-payroll'),
    path('hr/process-payment/', views.hr_process_payment, name='hr-process-payment'),
    path('hr/timesheets-monitor/', views.hr_timesheets, name='hr-timesheets-monitor'),
    path('hr/reports/', views.hr_reports, name='hr-reports'),
    path('', include(router.urls)),
]
