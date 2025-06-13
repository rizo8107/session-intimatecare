import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { AuthProvider } from './contexts/AuthContext';
import { ExpertProvider } from './contexts/ExpertContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ExpertProfile from './pages/ExpertProfile';
import ExpertDashboard from './pages/ExpertDashboard';
import UserDashboard from './pages/UserDashboard';
import AuthPage from './pages/AuthPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import ExplorePage from './pages/ExplorePage';
import ContactUsPage from './pages/ContactUsPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import AboutUsPage from './pages/AboutUsPage';
import ServicesOverviewPage from './pages/ServicesOverviewPage';

function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route element={<ExpertProvider><Outlet /></ExpertProvider>}>
                  <Route path="/expert/:id" element={<ExpertProfile />} />
                  <Route path="/expert/:id/book" element={<BookingPage />} />
                </Route>
                <Route path="/dashboard/expert" element={<ExpertDashboard />} />
                <Route path="/dashboard/user" element={<UserDashboard />} />
                <Route path="/booking/confirmation" element={<BookingConfirmation />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="/refund-policy" element={<RefundPolicyPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/services" element={<ServicesOverviewPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </DatabaseProvider>
  );
}

export default App;