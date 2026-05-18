// App.js المصحح
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import CompanyRegisterPage from './pages/CompanyRegisterPage';
import CompanyDashboard from './pages/CompanyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import EditProfile from './pages/student/EditProfile';
import Applications from './pages/student/Applications';
import Internships from './pages/Internships';
import Notifications from './pages/student/Notifications';
import RateCompany from './pages/student/RateCompany';
import CreateInternship from './pages/company/CreateInternship';
import InternshipDetails from './components/InternshipDetails';
import CompanyApplications from './pages/company/CompanyApplications';
import SavedInternships from './pages/student/SavedInternships';
import Settings from './pages/student/Settings';
import EditCompanyProfile from './pages/company/EditCompanyProfile';
import MyInternships from './pages/company/MyInternships';
import EditInternship from './pages/company/EditInternship';
import StudentProfile from './pages/company/StudentProfile';
import AdminStudentProfile from './pages/admin/StudentProfile'; 
import AdminDashboard from './pages/admin/AdminDashboard';
import CompareInternships from './pages/student/CompareInternships';
import Agreements from './pages/student/Agreements';
import ViewAgreement from './pages/student/ViewAgreement';
import SignAgreement from './pages/student/SignAgreement';
import CompanyNotifications from './pages/company/CompanyNotifications';
import CompanyInternshipApplications from './pages/company/CompanyInternshipApplications';
import CompanyPendingPage from "./pages/CompanyPendingPage";
import Activity from './pages/student/Activity';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import RoleSelectionPage from './pages/RoleSelectionPage';
import CompanyAgreements from './pages/company/CompanyAgreements';
import AdminInternshipDetails from './pages/admin/AdminInternshipDetails';
import CompanyActivity from './pages/company/Activity';
import SmartRecommendations from './pages/student/SmartRecommendations';
import CompanySettings from './pages/company/CompanySettings';
import { Toaster } from 'react-hot-toast';
import TestSignature from './test-signature';
import CompanySignAgreement from './pages/company/CompanySignAgreement';
import AdminSignAgreement from './pages/admin/AdminSignAgreement';
import ApplicationDetails from './pages/company/ApplicationDetails';
import CompanyDetails from './pages/admin/CompanyDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentPendingPage from './pages/student/StudentPendingPage';





function App() {
  return (
    <BrowserRouter>
    {/* ✅ إضافة Toater هنا - داخل الـ return وقبل Routes */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
            icon: '✅',
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
            icon: '❌',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RoleSelectionPage />} />
        <Route path="/student/register" element={<StudentRegisterPage />} />
        <Route path="/company/register" element={<CompanyRegisterPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/student/profile/edit" element={<EditProfile />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/rate-company/:companyId/:internshipId/:agreementId" element={<RateCompany />} />
        <Route path="/company/create-internship" element={<CreateInternship />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />
        <Route path="/student/applications" element={<Applications />} />
        <Route path="/company/applications" element={<CompanyApplications />} />
        <Route path="/student/saved-internships" element={<SavedInternships />} />
        <Route path="/student/settings" element={<Settings />} />
        <Route path="/company/profile/edit" element={<EditCompanyProfile />} />
        <Route path="/company/internships" element={<MyInternships />} />
        <Route path="/company/internships/edit/:id" element={<EditInternship />} />
        <Route path="/company/student/:studentId" element={<StudentProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/internships/:internshipId/compare" element={<CompareInternships />} />
        <Route path="/student/agreements" element={<Agreements />} />                    
        <Route path="/student/agreements/:agreementId/view" element={<ViewAgreement />} />
        <Route path="/student/agreements/:agreementId/sign" element={<SignAgreement />} />
        <Route path="/company/notifications" element={<CompanyNotifications />} />
        <Route path="/company/pending" element={<CompanyPendingPage />} />
        <Route path="/student/activity" element={<Activity />} /> 
        <Route path="/company/internships/:internshipId/applications" element={<CompanyInternshipApplications />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/company/agreements" element={<CompanyAgreements />} />
        <Route path="/company/agreements/:agreementId/view" element={<ViewAgreement />} />
        <Route path="/admin/internship-details/:applicationId" element={<AdminInternshipDetails />} />
        <Route path="/company/activity" element={<CompanyActivity />} />
        <Route path="/student/recommendations" element={<SmartRecommendations />} />
        <Route path="/company/settings" element={<CompanySettings />} />
        <Route path="/test-signature" element={<TestSignature />} />
        <Route path="/company/agreements/:agreementId/sign" element={<CompanySignAgreement />} />
        <Route path="/admin/agreements/:agreementId/sign" element={<AdminSignAgreement />} />
        <Route path="/company/applications/:id" element={<ApplicationDetails />} />
        <Route path="/admin/student/:id" element={<AdminStudentProfile />} />
        <Route path="/admin/companies/:companyId" element={<CompanyDetails />} />
        <Route path="/student/pending" element={<StudentPendingPage />} />
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;