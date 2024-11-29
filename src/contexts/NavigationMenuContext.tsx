import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context value
interface NavigationMenuContextType {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

// Default context value (matching the shape of the expected context type)
const defaultContextValue: NavigationMenuContextType = {
  isOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
  toggleMenu: () => {},
};

// Create the Context with the default value
const NavigationMenuContext =
  createContext<NavigationMenuContextType>(defaultContextValue);

// Provider component
interface NavigationMenuProviderProps {
  children: ReactNode;
}

export const NavigationMenuProvider = ({
  children,
}: NavigationMenuProviderProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Function to open the menu
  const openMenu = () => setIsOpen(true);

  // Function to close the menu
  const closeMenu = () => setIsOpen(false);

  // Function to toggle the menu
  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  return (
    <NavigationMenuContext.Provider
      value={{ isOpen, openMenu, closeMenu, toggleMenu }}
    >
      {children}
    </NavigationMenuContext.Provider>
  );
};

// Custom hook to access the context
export const useNavigationMenu = () => {
  return useContext(NavigationMenuContext);
};
