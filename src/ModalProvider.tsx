import { createContext, useState, useRef, useEffect } from "react";
import ModalRouter, {
  RouterHandle,
  PageRoute,
  ModalActionsProvider,
} from "./ModalRouter";
import { ModalPages } from "./utils/types";
import React from "react";

// Create a context for the modal state and functions
export type ModalContextType = {
  modalRouter: React.MutableRefObject<RouterHandle | null>;
  pages: ModalPages;
  setPages: (pages: ModalPages) => void;
  push: (pageRoute: PageRoute) => void;
  pop: () => void;
  clear: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

interface IModalProvider extends React.PropsWithChildren {
  pages?: ModalPages;
}

const ModalProvider: React.FC<IModalProvider> = ({ children, pages }) => {
  const [internalPages, setInternalPages] = useState(pages ?? {});
  const modalRootRef = useRef<HTMLDivElement | null>(null);
  const modalRouter = useRef<RouterHandle>(null);

  useEffect(() => {
    // Create the modal root element if it doesn't exist
    if (!modalRootRef.current) {
      const modalRoot = document.createElement("div");
      modalRoot.id = "modal-root";
      document.body.appendChild(modalRoot);
      modalRootRef.current = modalRoot;
    }

    return () => {
      // Clean up the modal root element when the component is unmounted
      if (modalRootRef.current) {
        document.body.removeChild(modalRootRef.current);
        modalRootRef.current = null;
      }
    };
  }, []);

  const push = (pageRoute: PageRoute) => {
    modalRouter.current?.push(pageRoute);
  };

  const clear = () => {
    modalRouter.current?.clear();
  };

  const pop = () => {
    modalRouter.current?.pop();
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
      value={{ modalRouter, pages: internalPages, push, pop, clear, setPages }}
    >
      <ModalActionsProvider>
        {children}
        <ModalRouter ref={modalRouter} pages={internalPages} />
      </ModalActionsProvider>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
