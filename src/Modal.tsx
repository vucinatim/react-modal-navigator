import { useState, useEffect } from "react";

import { IoClose } from "react-icons/io5";
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
    window.addEventListener("mousedown", backDropHandler);
    return () => window.removeEventListener("mousedown", backDropHandler);
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    // Wait for the animation to complete, then call onClose
    console.log("on TransitionEnd");
    setTimeout(() => {
      console.log("onClose");
      onClose();
    }, 280); // The duration of the animation
  };

  const modalContent = (
    <div
      style={{
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div
        ref={modalWrapperRef}
        style={{
          maxWidth: "400px",
          borderRadius: "10px",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.25)",
          transition: "all 0.3s ease-out",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            padding: "5px",
          }}
        >
          {leading && leading}
          {!leading && (
            <IoClose
              size={25}
              onClick={() => handleClose()}
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                cursor: "pointer",
                opacity: 0.7,
              }}
            />
          )}
          <p
            style={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {title}
          </p>
          {trailing && trailing}
        </div>
        <Divider
          style={{
            opacity: 0.5,
          }}
        />
        <div
          style={{
            maxHeight: "80vh",
            overflow: disableScroll ? "overflow-hidden" : "auto",
            padding: disablePadding ? "0px" : "10px",
            borderRadius: "10px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")!
    );
  } else {
    return null;
  }
};

export default Modal;
