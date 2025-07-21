import React from 'react';
import './App.css';
import { useGetMeQuery } from './redux/api/userApi';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';

import useUserRoutes from './components/routes/userRoutes';
import useAdminRoutes from './components/routes/adminRoutes';
import NotFound from './components/NotFound';

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();
  const { isLoading } = useGetMeQuery();

  if (isLoading) {
    return <div>Loading user...</div>; // or a spinner
  }

  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div className="container">
          <Routes>
            {userRoutes}
            {adminRoutes}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
