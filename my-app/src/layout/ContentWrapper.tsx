"use client"
import React from 'react';
import HeaderPage from './header/HeaderPage';
import Footer from './footer/Footer';

const ContentWrapper = ({ children }: any) => {
    return (
        <>
            <div>
                <HeaderPage />
                {children}
                <Footer />
            </div>
        </>
    );
};

export default ContentWrapper;