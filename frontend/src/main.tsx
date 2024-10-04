import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Accounts from './pages/accounts/Accounts';
import HomePage from './pages/home/Home';

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/accounts" element={<Accounts />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
