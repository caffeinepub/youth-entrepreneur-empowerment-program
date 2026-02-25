import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DirectoryPage from './pages/DirectoryPage';
import EntrepreneurProfilePage from './pages/EntrepreneurProfilePage';
import DashboardPage from './pages/DashboardPage';
import ResourcesPage from './pages/ResourcesPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import CommunityPage from './pages/CommunityPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/register', component: RegisterPage });
const directoryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/directory', component: DirectoryPage });
const entrepreneurProfileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/entrepreneur/$id', component: EntrepreneurProfilePage });
const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dashboard', component: DashboardPage });
const resourcesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/resources', component: ResourcesPage });
const storiesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/stories', component: StoriesPage });
const storyDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/story/$id', component: StoryDetailPage });
const communityRoute = createRoute({ getParentRoute: () => rootRoute, path: '/community', component: CommunityPage });

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  directoryRoute,
  entrepreneurProfileRoute,
  dashboardRoute,
  resourcesRoute,
  storiesRoute,
  storyDetailRoute,
  communityRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
