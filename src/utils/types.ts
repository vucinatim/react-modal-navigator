import { ReactNode } from "react";

export type ModalPages = {
    [key: string]: (props: any) => ReactNode;
  };