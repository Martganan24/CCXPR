import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // ✅ Import User Context
import Sidebar from "./components/Sidebar"; // ✅ Sidebar Component
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Affiliate from "./pages/Affiliate";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import "./styles/global.css"; // ✅ Global Styles

function App() {
  return (
    <UserProvider> {/* ✅ Wrap Everything Inside UserProvider */}
      <Router>
        <div className="app-container">
          <Sidebar /> {/* ✅ Sidebar Always Visible */}
          <div className="content"> {/* ✅ Page Content Area */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
