import React, { createContext, useState, useContext, ReactNode } from "react";

interface NavigationMenuContextType {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

const defaultContextValue: NavigationMenuContextType = {
  isOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
  toggleMenu: () => {},
};

const NavigationMenuContext =
  createContext<NavigationMenuContextType>(defaultContextValue);

interface NavigationMenuProviderProps {
  children: ReactNode;
}

export const NavigationMenuProvider = ({
  children,
}: NavigationMenuProviderProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  return (
    <NavigationMenuContext.Provider
      value={{ isOpen, openMenu, closeMenu, toggleMenu }}
    >
      {children}
    </NavigationMenuContext.Provider>
  );
};

export const useNavigationMenu = () => {
  return useContext(NavigationMenuContext);
};
