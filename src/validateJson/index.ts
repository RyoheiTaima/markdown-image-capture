import { JsonObject, Config, JsonPrimitive, JsonArray } from "../types";
import { PropertyNotFoundError, InvalidPropertyError } from "../exceptions";
import { isObject } from "../utils";

export const validateJson = (json: JsonObject): Config => {
  validateBrowserType(json);
  validateLogin(json);
  validatePages(json);
  validateStyle(json);
  return json as unknown as Config;
};

const validateBrowserType = (json: JsonObject) => {
  const browserTypes = ["chromium", "firefox", "webkit"];

  if (!("browserType" in json)) {
    throw new PropertyNotFoundError("browswerType");
  }

  if (
    typeof json.browserType !== "string" ||
    !browserTypes.includes(json.browserType)
  ) {
    throw new InvalidPropertyError(
      "browswerType",
      json.browserType,
      browserTypes
    );
  }
};

const validateLogin = (json: JsonObject) => {
  if ("login" in json) {
    if (!isObject(json.login)) {
      throw new InvalidPropertyError("login", json.login, ["JsonObject"]);
    }
    validatePagesUrl(json.login);
    validatePagesActions(json.login);
  }
};

const validatePages = (json: JsonObject) => {
  if (!("pages" in json)) {
    throw new PropertyNotFoundError("pages");
  }

  if (!isObject(json.pages)) {
    throw new InvalidPropertyError("pages", json.pages, ["JsonObject"]);
  }

  for (const [_, page] of Object.entries(json.pages)) {
    validatePagesUrl(page);
    validatePagesActions(page);
  }
};

const validatePagesUrl = (page: JsonObject | JsonPrimitive | JsonArray) => {
  if (!(isObject(page) && "url" in page)) {
    throw new PropertyNotFoundError("url");
  }

  if (!(typeof page.url === "string")) {
    throw new InvalidPropertyError("url", page.url, ["string"]);
  }
};

const validatePagesActions = (page: JsonObject | JsonPrimitive | JsonArray) => {
  if (!(isObject(page) && "actions" in page && Array.isArray(page.actions))) {
    throw new PropertyNotFoundError("actions");
  }

  for (const action of page.actions) {
    validatePagesActionsType(action);
    validatePagesActionsSelector(action);
    validatePagesActionsValue(action);
  }
};

const validatePagesActionsType = (action: JsonObject | JsonPrimitive) => {
  const actionTypes = ["click", "fill", "wait"];

  if (!(isObject(action) && "type" in action)) {
    throw new PropertyNotFoundError("type");
  }

  if (!(typeof action.type === "string" && actionTypes.includes(action.type))) {
    throw new InvalidPropertyError("type", action.type, actionTypes);
  }
};

const validatePagesActionsSelector = (action: JsonObject | JsonPrimitive) => {
  if (!(isObject(action) && "selector" in action)) {
    throw new PropertyNotFoundError("selector");
  }

  if (!(typeof action.selector === "string")) {
    throw new InvalidPropertyError("selector", action.selector, ["string"]);
  }
};

const validatePagesActionsValue = (action: JsonObject | JsonPrimitive) => {
  const stateTypes = ["hidden", "visible"];

  if (!(isObject(action) && "type" in action)) {
    throw new PropertyNotFoundError("type");
  }

  if (action.value) {
    if (typeof action.value !== "string") {
      throw new InvalidPropertyError("value", action.value, stateTypes);
    }

    if (action.type === "wait" && !stateTypes.includes(action.value)) {
      throw new InvalidPropertyError("value", action.value, stateTypes);
    }
  }
};

const validateStyle = (json: JsonObject) => {
  if (!("style" in json)) {
    throw new PropertyNotFoundError("style");
  }

  validateStyleOutline(json.style);
};

const validateStyleOutline = (
  style: JsonObject | JsonPrimitive | JsonArray
) => {
  if (!(isObject(style) && "outline" in style)) {
    throw new PropertyNotFoundError("outline");
  }

  validateStyleOutlineColor(style.outline);
  validateStyleOutlineStyle(style.outline);
  validateStyleOutlineWidth(style.outline);
};

const validateStyleOutlineColor = (
  outline: JsonObject | JsonPrimitive | JsonArray
) => {
  if (!(isObject(outline) && "color" in outline)) {
    throw new PropertyNotFoundError("color");
  }

  if (!(typeof outline.color === "string")) {
    throw new InvalidPropertyError("color", outline.color, ["string"]);
  }
};

const validateStyleOutlineStyle = (
  outline: JsonObject | JsonPrimitive | JsonArray
) => {
  const outlineStyles = [
    "auto",
    "none",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
  ];

  if (!(isObject(outline) && "style" in outline)) {
    throw new PropertyNotFoundError("style");
  }

  if (
    !(
      typeof outline.style === "string" && outlineStyles.includes(outline.style)
    )
  ) {
    throw new InvalidPropertyError("style", outline.style, outlineStyles);
  }
};

const validateStyleOutlineWidth = (
  outline: JsonObject | JsonPrimitive | JsonArray
) => {
  if (!(isObject(outline) && "width" in outline)) {
    throw new PropertyNotFoundError("width");
  }

  if (!(typeof outline.width === "string")) {
    throw new InvalidPropertyError("width", outline.width, ["string"]);
  }
};
