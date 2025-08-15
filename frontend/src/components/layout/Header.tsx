import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  Menu, 
  X, 
  User, 
  Calendar, 
  Settings,
  LogOut 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // This would come from auth context in real app
  const isAuthenticated = false;
  const user = { name: "John Doe", role: "user" };

  const navigation = [
    { name: "Flights", href: "/flights" },
    { name: "My Bookings", href: "/bookings", auth: true },
    { name: "Profile", href: "/profile", auth: true },
  ];

  const adminNavigation = [
    { name: "Dashboard", href: "/admin" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-elevation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-sky rounded-lg group-hover:scale-105 transition-transform">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Take Flight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.auth && !isAuthenticated) return null;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {isAuthenticated && user.role === "admin" && (
              adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-gradient-sky flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookings" className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="default" className="bg-gradient-sunset" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => {
                if (item.auth && !isAuthenticated) return null;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="default" className="bg-gradient-sunset justify-start" asChild>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;