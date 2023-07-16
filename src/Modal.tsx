import Divider from "./utils/Divider";
import React from "react";
import "./styles.css";

export enum AnimationState {
  OPENING,
  CLOSING,
}

export type ModalOptions = Omit<
  ModalProps,
  "modalContainerRef" & "animationState"
>;

export interface ModalProps extends React.PropsWithChildren {
  title?: string;
  leading?: JSX.Element;
  trailing?: JSX.Element;
  disablePadding?: boolean;
  disableScroll?: boolean;
  modalContainerRef?: React.RefObject<HTMLDivElement>;
  animationState?: AnimationState;
  style?: {
    modalContainer?: React.CSSProperties;
    modalContent?: React.CSSProperties;
    modalHeader?: React.CSSProperties;
    modalLeading?: React.CSSProperties;
    modalTrailing?: React.CSSProperties;
    modalTitle?: React.CSSProperties;
    modalDivider?: React.CSSProperties;
    modalBody?: React.CSSProperties;
    openAnimation?: React.CSSProperties;
    closeAnimation?: React.CSSProperties;
  };
}

const Modal: React.FC<ModalProps> = ({
  leading,
  trailing,
  children,
  title,
  disablePadding,
  disableScroll,
  modalContainerRef,
  animationState,
  style,
}) => {
  const modalAnimationOpen: React.CSSProperties = animationState ===
    AnimationState.OPENING && {
    animation: `modalOpen 0.3s forwards`,
  };

  const modalAnimationClose: React.CSSProperties = animationState ===
    AnimationState.CLOSING && {
    animation: `modalClose 0.3s forwards`,
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
    ...modalAnimationOpen,
    ...modalAnimationClose,
  };

  const modalContentStyles: React.CSSProperties = {
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    backgroundColor: "white",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
    transition: "all 0.3s ease-out",
    ...modalAnimationOpen,
    ...modalAnimationClose,
  };

  const modalHeaderStyles: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "20px",
  };

  const modalTitleStyles: React.CSSProperties = {
    flexGrow: 1,
    textAlign: "center",
    fontWeight: "bold",
  };

  const modalLeadingStyles: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "20px",
    transform: "translateY(-50%)",
  };

  const modalTrailingStyles: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    right: "20px",
    transform: "translateY(-50%)",
  };

  const modalDividerStyles: React.CSSProperties = {
    opacity: 0.1,
  };

  const modalBodyStyles: React.CSSProperties = {
    maxHeight: "80vh",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: disableScroll ? "overflow-hidden" : "auto",
    padding: disablePadding ? "0px" : "40px",
    borderRadius: "0 0 20px 20px",
    backgroundColor: "#f7f7f7",
  };

  return (
    <div style={{ ...style?.modalContainer, ...modalContainerStyles }}>
      <div
        ref={modalContainerRef}
        style={{ ...style?.modalContent, ...modalContentStyles }}
      >
        <div style={{ ...style?.modalHeader, ...modalHeaderStyles }}>
          {leading && (
            <div style={{ ...style?.modalLeading, ...modalLeadingStyles }}>
              {leading}
            </div>
          )}
          <p style={{ ...style?.modalTitle, ...modalTitleStyles }}>{title}</p>
          {trailing && (
            <div style={{ ...style?.modalTrailing, ...modalTrailingStyles }}>
              {trailing}
            </div>
          )}
        </div>
        <Divider style={{ ...style?.modalDivider, ...modalDividerStyles }} />
        <div style={{ ...style?.modalBody, ...modalBodyStyles }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
