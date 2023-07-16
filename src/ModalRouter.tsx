import {
  ReactNode,
  RefAttributes,
  forwardRef,
  useContext,
  useState,
  useImperativeHandle,
  memo,
  createContext,
  useCallback,
  useEffect,
} from "react";

import Modal, { AnimationState, ModalOptions } from "./Modal";
import { ModalPages } from "./utils/types";
import { IoChevronBack } from "@react-icons/all-files/io5/IoChevronBack";
import React from "react";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import ReactDOM from "react-dom";

export type PageRoute = {
  id: string;
  actions?: { [key: string]: ReactNode };
  props?: any;
  indismissable?: boolean;
  modal?: ModalOptions;
  onClose?: () => void;
};

export type RouterHandle = {
  push: (page: PageRoute) => void;
  pop: () => void;
  clear: () => void;
};

export interface IRoutedModal {
  pages: ModalPages;
  onClear?: () => void;
}

const ModalRouter: React.FunctionComponent<
  IRoutedModal & RefAttributes<RouterHandle>
> = forwardRef(({ pages, onClear }, ref) => {
  const { actions } = useContext(ModalActionsContext);
  const [routerStack, setRouterStack] = useState<Stack<PageRoute>>(
    new Stack([])
  );
  const [animationState, setAnimationState] = useState(null);

  const [isBrowser, setIsBrowser] = useState(false);

  const modalContainerRef = React.useRef<any>(null);

  useEffect(() => {
    const backDropHandler = (e: any) => {
      if (
        modalContainerRef.current &&
        !modalContainerRef.current.contains(e.target)
      ) {
        handleClose();
      }
    };

    setIsBrowser(true);
    window.addEventListener("mousedown", backDropHandler);
    return () => window.removeEventListener("mousedown", backDropHandler);
  }, []);

  useImperativeHandle(ref, () => ({
    push(pageRoute) {
      if (routerStack.peek()?.id === pageRoute.id) return;
      if (routerStack.isEmpty()) {
        setAnimationState(AnimationState.OPENING);
        // Wait for the animation to complete, then set the animation state to null
        setTimeout(() => {
          setAnimationState(null);
        }, 300); // The duration of the animation
      }
      setRouterStack(routerStack.add(pageRoute));
    },
    pop() {
      setRouterStack(routerStack.remove());
    },
    clear() {
      handleClose();
    },
  }));

  const handleClose = useCallback(() => {
    if (routerStack.isEmpty()) return;
    const currentPage = routerStack.peek();
    if (currentPage.indismissable) return;
    setAnimationState(AnimationState.CLOSING);

    // Wait for the animation to complete, then clear the router stack
    setTimeout(() => {
      setRouterStack(routerStack.remove());
      setAnimationState(null);
      currentPage.onClose?.();
      if (routerStack.isEmpty()) onClear?.();
    }, 300); // The duration of the animation
  }, []);

  if (routerStack.isEmpty()) return <></>;
  const currentPage = routerStack.peek();
  const modal = (
    <Modal
      {...currentPage.modal}
      animationState={animationState}
      modalContainerRef={modalContainerRef}
      leading={
        currentPage.modal?.leading ??
        (routerStack.size() > 1 ? (
          <IoChevronBack
            size={25}
            onClick={(e) => {
              e.stopPropagation();
              setRouterStack(routerStack.remove());
            }}
            style={{
              cursor: "pointer",
              opacity: 0.7,
            }}
          />
        ) : (
          <IoClose
            size={25}
            onClick={handleClose}
            style={{
              cursor: "pointer",
              opacity: 0.7,
            }}
          />
        ))
      }
      title={currentPage.modal?.title ?? currentPage.id}
      trailing={
        <>
          {currentPage.modal?.trailing}
          {currentPage.actions && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                top: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {Object.entries(currentPage.actions || {}).map(
                ([key, actionComponent], index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (actions[key]) {
                        actions[key]();
                      } else {
                        console.warn(
                          `Action "${key}" does not have a callback defined. \n Use useModalAction('${key}', [yourCallback]) to define a callback for this action.`
                        );
                      }
                    }}
                  >
                    {actionComponent}
                  </div>
                )
              )}
            </div>
          )}
        </>
      }
    >
      {pages[currentPage.id]?.(currentPage.props)}
    </Modal>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(modal, document.getElementById("modal-root")!);
  } else {
    return null;
  }
});

ModalRouter.displayName = "RoutedModal";
export default memo(ModalRouter);
type ActionCallback = () => void;

type ModalActionsContextType = {
  registerAction: (key: string, callback: ActionCallback) => void;
  unregisterAction: (key: string) => void;
  actions: Record<string, ActionCallback>;
};

export const ModalActionsContext = createContext<ModalActionsContextType>({
  registerAction: () => {},
  unregisterAction: () => {},
  actions: {},
});

type ModalActionsProviderProps = {
  children: ReactNode;
};

export const ModalActionsProvider: React.FC<ModalActionsProviderProps> = ({
  children,
}) => {
  const [actions, setActions] = useState<Record<string, ActionCallback>>({});

  const registerAction = useCallback(
    (key: string, callback: ActionCallback) => {
      setActions((prevActions) => ({ ...prevActions, [key]: callback }));
    },
    []
  );

  const unregisterAction = useCallback((key: string) => {
    setActions((prevActions) => {
      const newActions = { ...prevActions };
      delete newActions[key];
      return newActions;
    });
  }, []);

  return (
    <ModalActionsContext.Provider
      value={{ registerAction, unregisterAction, actions }}
    >
      {children}
    </ModalActionsContext.Provider>
  );
};

export const useModalAction = (actionKey: string, callback: ActionCallback) => {
  const { registerAction, unregisterAction } = useContext(ModalActionsContext);

  useEffect(() => {
    registerAction(actionKey, callback);

    return () => {
      unregisterAction(actionKey);
    };
  }, [actionKey, callback, registerAction, unregisterAction]);
};

class Stack<T> {
  items: T[];

  constructor(items: Array<T>) {
    this.items = items;
  }

  // add element to the stack
  add(element: T) {
    this.items.push(element);
    return new Stack(this.items);
  }

  // remove element from the stack
  remove() {
    if (this.items.length > 0) {
      this.items.pop();
    }
    return new Stack(this.items);
  }

  // view the last element
  peek() {
    return this.items[this.items.length - 1];
  }

  // check if the stack is empty
  isEmpty() {
    return this.items.length == 0;
  }

  // the size of the stack
  size() {
    return this.items.length;
  }

  // empty the stack
  clear() {
    this.items = [];
    return new Stack(this.items);
  }
}
