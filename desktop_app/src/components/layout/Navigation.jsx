import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../config/routes';

const Navigation = ({ isOpen = true, onToggle }) => {
  const location = useLocation();
  const navItems = [
    { path: ROUTES.HOME, label: 'Home', icon: '🏠' },
    { path: ROUTES.EDITOR, label: 'Editor', icon: '✂️' },
    { path: ROUTES.SETTINGS, label: 'Settings', icon: '⚙️' }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 bg-zinc-900 p-2 rounded-lg text-white hover:bg-zinc-800 transition-colors"
      >
        ☰
      </button>
    );
  }

  return (
    <motion.nav
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      className="fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 z-40 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Luna Audio</h1>
        <button
          onClick={onToggle}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 text-zinc-400 text-sm">
        <p>© 2025 Luna Audio Editor</p>
        <p>Version 1.0.0</p>
      </div>
    </motion.nav>
  );
};

export default Navigation;
