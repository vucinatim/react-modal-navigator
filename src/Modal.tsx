import { useState, useEffect } from "react";


import { IoClose } from 'react-icons/io5';
import Divider from "./utils/Divider";
import React from "react";
import ReactDOM from "react-dom";

export interface IModal extends React.PropsWithChildren {
  onClose: () => void;
  title: string;
  leading?: JSX.Element;
  trailing?: JSX.Element;
  disablePadding?: boolean;
  disableScroll?: boolean;
  backdropClassName?: string;
  className?: string;
}

const Modal: React.FC<IModal> = ({
  onClose,
  leading,
  trailing,
  children,
  title,
  disablePadding,
  disableScroll,
  className,
  backdropClassName,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // create ref for the StyledModalWrapper component
  const modalWrapperRef = React.useRef<any>(null);

  useEffect(() => {
    // check if the user has clickedinside or outside the modal
    const backDropHandler = (e: any) => {
      if (
        modalWrapperRef.current &&
        !modalWrapperRef.current.contains(e.target)
      ) {
        handleClose();
      }
    };

    setIsBrowser(true);
    window.addEventListener('mousedown', backDropHandler);
    return () => window.removeEventListener('mousedown', backDropHandler);
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    // Wait for the animation to complete, then call onClose
    console.log('on TransitionEnd');
    setTimeout(() => {
      console.log('onClose');
      onClose();
    }, 280); // The duration of the animation
  };

  const modalContent = (
    <div
      style={{ zIndex: 9999 }}
      className={`fixed bottom-0 left-0 right-0 top-0 flex h-full w-full animate-fade-in items-center justify-center bg-gray-900/50 backdrop-blur-sm ${
        !isVisible && 'animate-fade-out'
      } ${backdropClassName} transition-all`}
    >
      <div
        ref={modalWrapperRef}
        className={`max-w-2xl  rounded-lg bg-white shadow-xl ${className} transition-all`}
      >
        <div className="relative flex items-center gap-5 p-5">
          {leading && leading}
          {!leading && (
            <IoClose
              size={25}
              onClick={() => handleClose()}
              className="absolute bottom-5 left-5 top-5 cursor-pointer opacity-70 hover:scale-105"
            />
          )}
          <p className="grow text-center font-bold">{title}</p>
          {trailing && trailing}
        </div>
        <Divider className="opacity-50" />
        <div
          className={`relative max-h-[80vh] rounded-lg ${
            !disablePadding && 'p-6'
          } ${!disableScroll ? 'overflow-auto' : 'overflow-hidden'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById('modal-root')!
    );
  } else {
    return null;
  }
};

export default Modal;
