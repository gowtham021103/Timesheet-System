from django.db import models
from django.conf import settings

class Project(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Completed', 'Completed'),
        ('Pending', 'Pending'),
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_projects')
    deadline = models.DateField()
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='managed_projects')
    team_lead = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    progress = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class ProjectUpdate(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='updates')
    update_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Update for {self.project.name} at {self.created_at}"

class Feedback(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='feedbacks')
    task_name = models.CharField(max_length=255)
    client_feedback = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.task_name} - {self.project.name}"

class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver} at {self.timestamp}"

class Team(models.Model):
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='team_manager_assigned')
    team_lead = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='team_lead_assigned')
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='team_employee_assigned')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='teams')

    def __str__(self):
        return f"{self.manager} -> {self.team_lead} -> {self.employee}"

class Task(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assigned_tasks')
    task_title = models.CharField(max_length=255)
    description = models.TextField()
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.task_title} - {self.employee.username}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_project_progress()

    def delete(self, *args, **kwargs):
        project = self.project
        super().delete(*args, **kwargs)
        if project:
            total_tasks = project.tasks.count()
            if total_tasks > 0:
                completed = project.tasks.filter(status='Completed').count()
                project.progress = int(round((completed / total_tasks) * 100))
            else:
                project.progress = 0
            project.save(update_fields=['progress'])

    def update_project_progress(self):
        project = self.project
        if project:
            total_tasks = project.tasks.count()
            if total_tasks > 0:
                completed = project.tasks.filter(status='Completed').count()
                project.progress = int(round((completed / total_tasks) * 100))
                project.save(update_fields=['progress'])

class Timesheet(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='timesheets')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='timesheets')
    date = models.DateField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.project.name} - {self.date}"

class Payroll(models.Model):
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payrolls')
    month = models.CharField(max_length=20) # e.g., "March 2026"
    total_hours = models.DecimalField(max_digits=10, decimal_places=2)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    salary = models.DecimalField(max_digits=15, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payroll {self.month} - {self.employee.username}"
