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

  const modalWrapperRef = React.useRef<any>(null);

  useEffect(() => {
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

    setTimeout(() => {
      onClose();
    }, 280); // The duration of the animation
  };

  const modalContainerStyles: React.CSSProperties = {
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.3s ease-out",
  };

  const modalContentStyles: React.CSSProperties = {
    maxWidth: "400px",
    borderRadius: "10px",
    backgroundColor: "white",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
    transition: "all 0.3s ease-out",
    transform: `translateY(${isVisible ? 0 : "20px"})`,
    opacity: isVisible ? 1 : 0,
  };

  const modalHeaderStyles: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px",
  };

  const modalCloseButtonStyles: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    left: "10px",
    cursor: "pointer",
    opacity: 0.7,
  };

  const modalTitleStyles: React.CSSProperties = {
    flexGrow: 1,
    textAlign: "center",
    fontWeight: "bold",
  };

  const modalDividerStyles: React.CSSProperties = {
    opacity: 0.5,
  };

  const modalBodyStyles: React.CSSProperties = {
    maxHeight: "80vh",
    overflow: disableScroll ? "overflow-hidden" : "auto",
    padding: disablePadding ? "0px" : "10px",
    borderRadius: "10px",
  };

  const modalContent = (
    <div style={modalContainerStyles}>
      <div ref={modalWrapperRef} style={modalContentStyles}>
        <div style={modalHeaderStyles}>
          {leading && leading}
          {!leading && (
            <IoClose
              size={25}
              onClick={handleClose}
              style={modalCloseButtonStyles}
            />
          )}
          <p style={modalTitleStyles}>{title}</p>
          {trailing && trailing}
        </div>
        <Divider style={modalDividerStyles} />
        <div style={modalBodyStyles}>{children}</div>
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
