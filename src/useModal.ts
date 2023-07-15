import { useContext, useEffect } from "react";
import { ModalContext } from "./ModalProvider";
import { ModalPages } from "./utils/types";

export const useModal = (pages?: ModalPages) => {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('useModal must be used within a ModalProvider');
    }
  
    useEffect(() => {
      if (pages) {
        context.setPages(pages);
      }
    }, []);
  
    return context;
  };