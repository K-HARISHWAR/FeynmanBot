import { createBrowserRouter } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer.tsx';
import { LandingPage } from '../pages/LandingPage.tsx';
import { TeachPage } from '../pages/TeachPage.tsx';
import { ReportPage } from '../pages/ReportPage.tsx';
import { DashboardPage } from '../pages/DashboardPage.tsx';
import { HistoryPage } from '../pages/HistoryPage.tsx';

// Simple wrapper to apply layout to pages
const withLayout = (Component: React.ComponentType) => (
  <PageContainer>
    <Component />
  </PageContainer>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: withLayout(LandingPage),
  },
  {
    path: '/dashboard',
    element: withLayout(DashboardPage),
  },
  {
    path: '/history',
    element: withLayout(HistoryPage),
  },
  {
    path: '/teach',
    element: withLayout(TeachPage),
  },
  {
    path: '/report/:reportId',
    element: withLayout(ReportPage),
  },
  {
    path: '*',
    element: withLayout(() => <div className="text-center p-12"><h2>404 - Not Found</h2></div>),
  }
]);
