// Route definitions for the application

export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  EDITOR: '/editor',
  EDITOR_VIDEO: '/editor/video',
  EDITOR_TRANSCRIPT: '/editor/transcript',
  EDITOR_TIMELINE: '/editor/timeline',
  EDITOR_SPLIT: '/editor/split',
  EDITOR_EXPORT: '/editor/export',
  SETTINGS: '/settings',
  EXPORT: '/export'
};

export const EDITOR_VIEWS = {
  VIDEO: 'video',
  TRANSCRIPT: 'transcript',
  TIMELINE: 'timeline',
  SPLIT: 'split',
  EXPORT: 'export'
};

// Route configurations
export const routeConfig = [
  {
    path: ROUTES.HOME,
    name: 'Home',
    component: 'HomePage',
    exact: true
  },
  {
    path: ROUTES.PROJECTS,
    name: 'Projects',
    component: 'ProjectsPage',
    exact: true
  },  {
    path: ROUTES.EDITOR,
    name: 'Editor',
    component: 'EditorLayout',
    exact: false,
    children: [
      {
        path: ROUTES.EDITOR_VIDEO,
        name: 'Video',
        component: 'VideoView',
        exact: true
      },
      {
        path: ROUTES.EDITOR_TRANSCRIPT,
        name: 'Transcript',
        component: 'TranscriptView',
        exact: true
      },
  
      {
        path: ROUTES.EDITOR_EXPORT,
        name: 'Export',
        component: 'ExportView',
        exact: true
      }
    ]
  },
  // {
  //   path: ROUTES.SETTINGS,
  //   name: 'Settings',
  //   component: 'SettingsPage',
  //   exact: true
  // },
  {
    path: ROUTES.EXPORT,
    name: 'Export',
    component: 'ExportPage',
    exact: true
  }
];

// Navigation items
export const navigationItems = [
  {
    label: 'Home',
    path: ROUTES.HOME,
    icon: 'home'
  },
  {
    label: 'Projects',
    path: ROUTES.PROJECTS,
    icon: 'folder'
  },
  {
    label: 'Editor',
    path: ROUTES.EDITOR,
    icon: 'edit'
  },
  {
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: 'settings'
  }
];
