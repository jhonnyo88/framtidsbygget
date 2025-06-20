# Core Framework Package

**Package ID:** F1  
**System:** Core UI Framework Components  
**Status:** Complete  
**Token Count:** ~25,000 tokens

---

## Package Contents

### Core Components
- `/components/MainDashboard/` - Main game dashboard and navigation
- `/components/Navigation/` - App navigation system
- `/components/Layout/` - Layout components and containers
- `/components/Router/` - Routing configuration

### Framework Features
- `/features/ThemeProvider/` - Theme and styling system
- `/features/ErrorBoundary/` - Error handling
- `/features/LoadingSystem/` - Loading states and skeletons
- `/features/ResponsiveProvider/` - Responsive utilities

### Implementation Guides
- `/guides/Dashboard_Implementation.md` - Building the main dashboard
- `/guides/Navigation_Patterns.md` - Navigation best practices
- `/guides/Layout_System.md` - Using the layout system
- `/guides/Routing_Setup.md` - Route configuration

---

## Quick Start

```jsx
import { AppLayout } from '@/components/Layout';
import { MainDashboard } from '@/components/MainDashboard';
import { NavigationBar } from '@/components/Navigation';

function App() {
  return (
    <AppLayout>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/games/*" element={<GameRoutes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AppLayout>
  );
}
```

---

## Core Components

### MainDashboard
Central hub for game selection and player progress

```jsx
<MainDashboard
  playerData={playerData}
  availableGames={games}
  onGameSelect={handleGameSelect}
/>
```

Features:
- Game selection grid
- Player statistics overview
- Achievement highlights
- Quick actions
- Responsive layout

### Navigation System
Flexible navigation with mobile support

```jsx
<NavigationBar
  items={navItems}
  user={currentUser}
  onNavigate={handleNavigate}
/>
```

Features:
- Desktop horizontal nav
- Mobile drawer menu
- Breadcrumbs
- Active state indicators
- Accessibility support

### Layout Components
Consistent page structure

```jsx
<PageLayout
  header={<PageHeader title="Uppdrag" />}
  sidebar={<GameFilters />}
  footer={<GameFooter />}
>
  <PageContent>
    {/* Main content */}
  </PageContent>
</PageLayout>
```

---

## Layout System

### Grid System
```jsx
<Grid container spacing={3}>
  <Grid item xs={12} md={8}>
    <MainContent />
  </Grid>
  <Grid item xs={12} md={4}>
    <Sidebar />
  </Grid>
</Grid>
```

### Container System
```jsx
<Container maxWidth="lg">
  <Section spacing="large">
    <SectionHeader title="Dina Spel" />
    <SectionContent>
      {/* Content */}
    </SectionContent>
  </Section>
</Container>
```

### Spacing System
- `xs`: 4px
- `sm`: 8px  
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

---

## Routing Configuration

```jsx
// Route structure
const routes = [
  {
    path: '/',
    element: <MainDashboard />,
    children: []
  },
  {
    path: '/games',
    element: <GameLayout />,
    children: [
      { path: 'welfare', element: <WelfareGame /> },
      { path: 'crisis', element: <CrisisGame /> },
      { path: 'puzzle', element: <PuzzleGame /> },
      { path: 'memory', element: <MemoryGame /> }
    ]
  },
  {
    path: '/profile',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'achievements', element: <Achievements /> }
    ]
  }
];
```

### Route Guards
```jsx
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

---

## Theme System

### Theme Provider
```jsx
const theme = {
  colors: {
    primary: '#1976D2',
    secondary: '#FFA726',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#212121',
      secondary: '#757575'
    }
  },
  spacing: {
    unit: 8,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  }
};

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### Using Theme
```jsx
const StyledComponent = styled.div`
  background: ${props => props.theme.colors.background.paper};
  padding: ${props => props.theme.spacing.md}px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}px) {
    padding: ${props => props.theme.spacing.lg}px;
  }
`;
```

---

## Error Handling

### Error Boundary
```jsx
<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error);
    logErrorToService(error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>
```

### Error Fallback Component
```jsx
const ErrorFallback = ({ error, resetError }) => (
  <div className="error-fallback">
    <h1>Något gick fel</h1>
    <p>{error.message}</p>
    <button onClick={resetError}>Försök igen</button>
  </div>
);
```

---

## Loading System

### Loading States
```jsx
const LoadingScreen = () => (
  <div className="loading-screen">
    <CircularProgress />
    <Typography>Laddar spelet...</Typography>
  </div>
);

const SkeletonScreen = () => (
  <div className="skeleton-screen">
    <Skeleton variant="rect" height={200} />
    <Skeleton variant="text" count={3} />
  </div>
);
```

### Suspense Integration
```jsx
<Suspense fallback={<LoadingScreen />}>
  <LazyLoadedComponent />
</Suspense>
```

---

## Responsive Utilities

### useMediaQuery Hook
```jsx
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');

return (
  <div>
    {isMobile && <MobileLayout />}
    {isTablet && <TabletLayout />}
    {isDesktop && <DesktopLayout />}
  </div>
);
```

### Responsive Components
```jsx
<ResponsiveContainer>
  <DesktopOnly>
    <DetailedView />
  </DesktopOnly>
  <MobileOnly>
    <CompactView />
  </MobileOnly>
</ResponsiveContainer>
```

---

## Performance Optimizations

### Code Splitting
```jsx
// Route-based splitting
const WelfareGame = lazy(() => import('./games/WelfareGame'));
const CrisisGame = lazy(() => import('./games/CrisisGame'));

// Component-based splitting
const HeavyComponent = lazy(() => 
  import(/* webpackChunkName: "heavy" */ './HeavyComponent')
);
```

### Memoization
```jsx
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    processData(data), [data]
  );
  
  return <div>{processedData}</div>;
});
```

---

## Best Practices

1. **Component Composition**: Build complex UIs from simple components
2. **Consistent Spacing**: Use theme spacing values
3. **Mobile-First**: Design for mobile, enhance for desktop
4. **Accessibility**: Include ARIA labels and keyboard navigation
5. **Performance**: Lazy load routes and heavy components
6. **Error Boundaries**: Wrap feature areas with error boundaries
7. **Type Safety**: Use TypeScript for props and state

---

## Related Packages

- **DS-001 to DS-006**: Design System components
- **S1**: State Management integration
- **F2**: Common Features (modals, forms)
- **F3**: Advanced UI features