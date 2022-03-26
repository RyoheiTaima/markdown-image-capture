export type JsonPrimitive = boolean | number | string | null;
export type JsonArray = JsonPrimitive[] | JsonObject[];
export type JsonObject = {
  [key: string]: JsonPrimitive | JsonObject | JsonArray;
};

export interface Config {
  name: string;
  browserType: BrowserType;
  login?: Page;
  pages: Record<string, Page>;
  style: { outline: Outline };
}

export type BrowserType = "chromium" | "firefox" | "webkit";

export interface Page {
  url: string;
  actions: (ClickAction | FillAction | WaitAction)[];
  preAccessedPageName?: string;
}

export interface ClickAction {
  type: "click";
  selector: string;
}

export interface FillAction {
  type: "fill";
  selector: string;
  value: string;
}

export interface WaitAction {
  type: "wait";
  selector: string;
  value: "attached" | "visible" | undefined;
}

export interface Outline {
  color: string;
  style:
    | "auto"
    | "none"
    | "dotted"
    | "dashed"
    | "solid"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";
  width: string;
}
