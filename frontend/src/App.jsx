import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboardMain';
import UserManagement from './pages/UserManagement';
import ProjectManagement from './pages/ProjectManagement';
import TeamManagement from './pages/TeamManagement';
import TimesheetMonitoring from './pages/TimesheetMonitoring';
import ClientDashboard from './pages/ClientDashboardMain';
import MyProjects from './pages/MyProjects';
import ProjectProgress from './pages/ProjectProgress';
import TeamMembers from './pages/TeamMembers';
import TimesheetActivity from './pages/TimesheetActivity';
import Feedback from './pages/Feedback';
import Reports from './pages/Reports';
import Messages from './pages/Messages';
import HRLayout from './components/HRLayout';
import HRDashboardMain from './pages/HRDashboardMain';
import HREmployeeManagement from './pages/HREmployeeManagement';
import HRAttendance from './pages/HRAttendance';
import HRPayroll from './pages/HRPayroll';
import HRTimesheetMonitoring from './pages/HRTimesheetMonitoring';
import HRReports from './pages/HRReports';
import TeamLeadDashboardMain from './pages/TeamLeadDashboardMain';
import TeamLeadAssignedProjects from './pages/TeamLeadAssignedProjects';
import TeamLeadTaskManagement from './pages/TeamLeadTaskManagement';
import TeamLeadTeamMembers from './pages/TeamLeadTeamMembers';
import TeamLeadTimesheets from './pages/TeamLeadTimesheets';
import TeamLeadReports from './pages/TeamLeadReports';
import EmployeeLayout from './components/EmployeeLayout';
import EmployeeDashboardMain from './pages/EmployeeDashboardMain';
import EmployeeMyProjects from './pages/EmployeeMyProjects';
import EmployeeMyTasks from './pages/EmployeeMyTasks';
import EmployeeSubmitTimesheet from './pages/EmployeeSubmitTimesheet';
import EmployeeTimesheetHistory from './pages/EmployeeTimesheetHistory';
import EmployeeProjectProgress from './pages/EmployeeProjectProgress';
import EmployeeMessages from './pages/EmployeeMessages';

import ManagerDashboardMain from './pages/ManagerDashboardMain';
import AssignedProjects from './pages/AssignedProjects';
import TeamLeads from './pages/TeamLeads';
import Employees from './pages/Employees';
import ManagerProjectProgress from './pages/ManagerProjectProgress';
import ManagerTimesheets from './pages/ManagerTimesheets';
import ManagerReports from './pages/ManagerReports';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/users" element={<UserManagement />} />
          <Route path="/admin-dashboard/projects" element={<ProjectManagement />} />
          <Route path="/admin-dashboard/teams" element={<TeamManagement />} />
          <Route path="/admin-dashboard/timesheets" element={<TimesheetMonitoring />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/client-dashboard/my-projects" element={<MyProjects />} />
          <Route path="/client-dashboard/project-progress" element={<ProjectProgress />} />
          <Route path="/client-dashboard/team-members" element={<TeamMembers />} />
          <Route path="/client-dashboard/timesheet-activity" element={<TimesheetActivity />} />
          <Route path="/client-dashboard/feedback" element={<Feedback />} />
          <Route path="/client-dashboard/reports" element={<Reports />} />
          <Route path="/client-dashboard/messages" element={<Messages />} />
          <Route path="/hr-dashboard" element={<HRLayout />}>
            <Route index element={<HRDashboardMain />} />
            <Route path="employees" element={<HREmployeeManagement />} />
            <Route path="attendance" element={<HRAttendance />} />
            <Route path="payroll" element={<HRPayroll />} />
            <Route path="timesheets" element={<HRTimesheetMonitoring />} />
            <Route path="reports" element={<HRReports />} />
          </Route>
          <Route path="/teamlead-dashboard" element={<TeamLeadDashboardMain />} />
          <Route path="/teamlead-dashboard/assigned-projects" element={<TeamLeadAssignedProjects />} />
          <Route path="/teamlead-dashboard/task-management" element={<TeamLeadTaskManagement />} />
          <Route path="/teamlead-dashboard/team-members" element={<TeamLeadTeamMembers />} />
          <Route path="/teamlead-dashboard/timesheets" element={<TeamLeadTimesheets />} />
          <Route path="/teamlead-dashboard/reports" element={<TeamLeadReports />} />
          
          <Route path="/employee-dashboard" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboardMain />} />
            <Route path="projects" element={<EmployeeMyProjects />} />
            <Route path="tasks" element={<EmployeeMyTasks />} />
            <Route path="submit-timesheet" element={<EmployeeSubmitTimesheet />} />
            <Route path="timesheet-history" element={<EmployeeTimesheetHistory />} />
            <Route path="progress" element={<EmployeeProjectProgress />} />
            <Route path="messages" element={<EmployeeMessages />} />
          </Route>
          
          <Route path="/manager-dashboard" element={<ManagerDashboardMain />} />
          <Route path="/manager-dashboard/assigned-projects" element={<AssignedProjects />} />
          <Route path="/manager-dashboard/team-leads" element={<TeamLeads />} />
          <Route path="/manager-dashboard/employees" element={<Employees />} />
          <Route path="/manager-dashboard/project-progress" element={<ManagerProjectProgress />} />
          <Route path="/manager-dashboard/timesheets" element={<ManagerTimesheets />} />
          <Route path="/manager-dashboard/reports" element={<ManagerReports />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
