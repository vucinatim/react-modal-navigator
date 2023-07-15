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

import Modal from "./Modal";
import { ModalPages } from "./utils/types";
import { IoChevronBack } from "react-icons/io5";
import React from "react";

export type PageRoute = {
  id: string;
  title?: string;
  actions?: { [key: string]: ReactNode };
  props?: any;
  indismissable?: boolean;
  disablePadding?: boolean;
  disableScroll?: boolean;
};

export type RouterHandle = {
  push: (page: PageRoute) => void;
  back: () => void;
  clear: () => void;
};

export interface IRoutedModal {
  pages: ModalPages;
  onClose?: () => void;
}

const ModalRouter: React.FunctionComponent<
  IRoutedModal & RefAttributes<RouterHandle>
> = forwardRef(({ pages, onClose }, ref) => {
  const { actions } = useContext(ModalActionsContext);
  const [routerStack, setRouterStack] = useState<Stack<PageRoute>>(
    new Stack([])
  );
  const [isVisible, setIsVisible] = useState(true);

  useImperativeHandle(ref, () => ({
    push(pageRoute) {
      if (routerStack.peek()?.id === pageRoute.id) return;
      setRouterStack(routerStack.add(pageRoute));
    },
    back() {
      setRouterStack(routerStack.remove());
    },
    clear() {
      setIsVisible(false);

      // Wait for the animation to complete, then clear the router stack
      setTimeout(() => {
        setRouterStack(routerStack.clear());
        setIsVisible(true); // Reset visibility for the next use
      }, 300); // The duration of the animation
    },
  }));

  if (routerStack.isEmpty()) return <></>;
  const currentPage = routerStack.peek();
  return (
    <Modal
      onClose={() => {
        if (currentPage.indismissable) return;
        onClose?.call(null);
        setRouterStack(routerStack.clear());
      }}
      leading={
        routerStack.size() > 1 ? (
          <IoChevronBack
            size={25}
            onClick={(e) => {
              e.stopPropagation();
              setRouterStack(routerStack.remove());
            }}
            style={{
              position: "absolute",
              bottom: "5px",
              left: "5px",
              top: "5px",
              opacity: 0.7,
              cursor: "pointer",
            }}
          />
        ) : undefined
      }
      title={currentPage.title ?? currentPage.id}
      trailing={
        currentPage.actions && (
          <div
            style={{
              position: "absolute",
              bottom: "5px",
              right: "5px",
              top: "5px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
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
        )
      }
      disablePadding={currentPage.disablePadding}
      disableScroll={currentPage.disableScroll}
    >
      {pages[currentPage.id]?.(currentPage.props)}
    </Modal>
  );
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
