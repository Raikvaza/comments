import React, { createContext, useContext, useState } from "react";
import { ToggleProviderProps } from "../../types/types";
import { ToggleContextType } from "../../types/types";

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

export function useToggle() {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error("useToggle must be used within a ToggleProvider");
  }
  return context;
}

//Context to update the commentSection after CommentForm submit

export const ToggleProvider: React.FC<ToggleProviderProps> = ({ children }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <ToggleContext.Provider value={{ toggle, setToggle }}>
      {children}
    </ToggleContext.Provider>
  );
};
