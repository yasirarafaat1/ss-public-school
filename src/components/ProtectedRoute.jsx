import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../services/firebaseService'; // Import auth and the listener
import { Spinner } from 'react-bootstrap'; // For loading state

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start in loading state

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user); // Set true if user exists, false otherwise
            setIsLoading(false); // Finished loading auth state
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Run only once on mount

    if (isLoading) {
        // Show a loading indicator while checking auth state
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // If not loading and not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // If authenticated, render the child components (the protected page)
    return children;
};

export default ProtectedRoute; 