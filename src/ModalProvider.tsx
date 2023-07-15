import { createContext, useState, useRef } from "react";
import React = require("react");
import ModalRouter, { RouterHandle, PageRoute, ModalActionsProvider } from "./ModalRouter";
import { ModalPages } from "./utils/types";

// Create a context for the modal state and functions
export type ModalContextType = {
  modalRouter: React.MutableRefObject<RouterHandle | null>;
  pages: ModalPages;
  setPages: (pages: ModalPages) => void;
  push: (pageRoute: PageRoute) => void;
  clear: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

interface IModalProvider {
  children: React.ReactNode;
  pages: ModalPages;
}

const ModalProvider: React.FC<IModalProvider> = ({
  children,
  pages,
}) => {
  const [internalPages, setInternalPages] = useState(pages);

  const modalRouter = useRef<RouterHandle>(null);

  const push = (pageRoute: PageRoute) => {
    modalRouter.current?.push(pageRoute);
  };

  const clear = () => {
    modalRouter.current?.clear();
  };

  const setPages = (newPages: ModalPages) => {
    setInternalPages((prevPages) => ({
      ...prevPages,
      ...newPages,
    }));
  };

  // Wrap children in the ModalContext provider
  return (
    <ModalContext.Provider
      value={{ modalRouter, pages: internalPages, push, clear, setPages }}
    >
      <ModalActionsProvider>
        {children}
        <ModalRouter ref={modalRouter} pages={internalPages} />
      </ModalActionsProvider>
    </ModalContext.Provider>
  );
};

export default ModalProvider;