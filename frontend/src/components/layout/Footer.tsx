import { Link } from "react-router-dom";
import { Plane, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-sky rounded-lg">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Take Flight
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for seamless flight booking experiences. 
              Discover the world with ease and comfort.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/flights" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Search Flights
                </Link>
              </li>
              <li>
                <Link 
                  to="/bookings" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Manage Booking
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Check-in
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Travel Guidelines
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Take Flight. All rights reserved. Powered by advanced microservices architecture.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;