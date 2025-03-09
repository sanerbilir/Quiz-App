import React from 'react';
import './Footer.css'; // Import the CSS for custom styles

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p>MyApp © {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}

export default Footer;