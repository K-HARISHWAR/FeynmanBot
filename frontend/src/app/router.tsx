import { createBrowserRouter } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer.tsx';
import { LandingPage } from '../pages/LandingPage.tsx';
import { TeachPage } from '../pages/TeachPage.tsx';
import { ReportPage } from '../pages/ReportPage.tsx';
import { DashboardPage } from '../pages/DashboardPage.tsx';
import { HistoryPage } from '../pages/HistoryPage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { RegisterPage } from '../pages/RegisterPage.tsx';
import { ProtectedRoute } from '../components/auth/ProtectedRoute.tsx';
import { PublicOnlyRoute } from '../components/auth/PublicOnlyRoute.tsx';

// Simple wrapper to apply layout to pages
const withLayout = (Component: React.ComponentType, isProtected = false, isPublicOnly = false) => {
  let content = <Component />;
  
  if (isProtected) {
    content = <ProtectedRoute>{content}</ProtectedRoute>;
  } else if (isPublicOnly) {
    content = <PublicOnlyRoute>{content}</PublicOnlyRoute>;
  }

  return (
    <PageContainer>
      {content}
    </PageContainer>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: withLayout(LandingPage),
  },
  {
    path: '/login',
    element: withLayout(LoginPage, false, true),
  },
  {
    path: '/register',
    element: withLayout(RegisterPage, false, true),
  },
  {
    path: '/dashboard',
    element: withLayout(DashboardPage, true),
  },
  {
    path: '/history',
    element: withLayout(HistoryPage, true),
  },
  {
    path: '/teach',
    element: withLayout(TeachPage, true),
  },
  {
    path: '/report/:reportId',
    element: withLayout(ReportPage, true),
  },
  {
    path: '*',
    element: withLayout(() => <div className="text-center p-12"><h2>404 - Not Found</h2></div>),
  }
]);
