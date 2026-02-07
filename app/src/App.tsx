import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { StarfieldBackground } from '@/components/StarfieldBackground';
import { Home } from '@/pages/Home';
import { Understanding } from '@/pages/Understanding';
import { AamalDua } from '@/pages/AamalDua';
import { DuaDetail } from '@/pages/DuaDetail';
import { Calendar } from '@/pages/Calendar';
import { Education } from '@/pages/Education';
import { AdminOrder } from '@/pages/AdminOrder';

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <StarfieldBackground />

      {/* Navigation */}
      <Navigation />

      {/* Main Content with Page Transitions */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/understanding" element={<Understanding />} />
            <Route path="/aamal-dua" element={<AamalDua />} />
            <Route path="/aamal-dua/:id" element={<DuaDetail />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/education" element={<Education />} />
            <Route path="/admin/order" element={<AdminOrder />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;