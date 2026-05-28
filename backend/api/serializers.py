from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, Team, Timesheet, ProjectUpdate, Feedback, Message, Task, Payroll

User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.username')
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = Task
        fields = ['id', 'project', 'project_name', 'employee', 'employee_name', 'task_title', 'description', 'deadline', 'status']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role', 'department', 'joining_date', 'status', 'hourly_rate']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class ProjectSerializer(serializers.ModelSerializer):
    manager_name = serializers.ReadOnlyField(source='manager.username')
    client_name = serializers.ReadOnlyField(source='client.username')
    team_lead_name = serializers.ReadOnlyField(source='team_lead.username')

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'client', 'client_name', 'deadline', 'manager', 'manager_name', 'team_lead', 'team_lead_name', 'status', 'progress']

class ProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUpdate
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    receiver_name = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name', 'content', 'timestamp']

class TeamSerializer(serializers.ModelSerializer):
    manager_name = serializers.ReadOnlyField(source='manager.username')
    team_lead_name = serializers.ReadOnlyField(source='team_lead.username')
    employee_name = serializers.ReadOnlyField(source='employee.username')
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = Team
        fields = ['id', 'manager', 'manager_name', 'team_lead', 'team_lead_name', 'employee', 'employee_name', 'project', 'project_name']

class TimesheetSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = Timesheet
        fields = ['id', 'user', 'username', 'project', 'project_name', 'date', 'hours', 'status', 'description']

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.username')

    class Meta:
        model = Payroll
        fields = ['id', 'employee', 'employee_name', 'month', 'total_hours', 'hourly_rate', 'salary', 'is_paid', 'created_at']
