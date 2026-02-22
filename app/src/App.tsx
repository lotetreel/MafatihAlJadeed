import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { StarfieldBackground } from '@/components/StarfieldBackground';
import { Home } from '@/pages/Home';
import { AamalDua } from '@/pages/AamalDua';
import { DuaDetail } from '@/pages/DuaDetail';
import { Calendar } from '@/pages/Calendar';
import { RamadanFiqh } from '@/pages/RamadanFiqh';
import { AdminOrder } from '@/pages/AdminOrder';

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Only scroll to top if we are navigating forward.
    // Navigating back (POP) will let the browser naturally restore the scroll position.
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
}

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <ScrollToTop />
      {/* Background */}
      <StarfieldBackground />

      {/* Navigation */}
      <Navigation />

      {/* Main Content with Page Transitions */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/aamal-dua" element={<AamalDua />} />
            <Route path="/aamal-dua/:id" element={<DuaDetail />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/ramadhan-fiqh" element={<RamadanFiqh />} />
            <Route path="/admin/order" element={<AdminOrder />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;