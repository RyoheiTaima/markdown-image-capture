import { JsonPrimitive, JsonArray, JsonObject } from "./types";

export class PropertyNotFoundError extends Error {
  constructor(propertyName: string, message?: string) {
    super(message);

    this.message = `${propertyName} property in config need to be specified.`;
    this.name = "PropertyNotFoundError";
  }
}

export class InvalidPropertyError extends Error {
  constructor(
    propertyName: string,
    propertyValue: JsonPrimitive | JsonArray | JsonObject,
    corrects: string[],
    message?: string
  ) {
    super(message);

    this.message = `${propertyName} property in config can't be specified ${propertyValue}. The property can be specifed ${corrects.join(
      ", "
    )}.`;
    this.name = "InvalidPropertyError";
  }
}

export class InvalidImageMarkError extends Error {
  constructor(imageMark: string, message?: string) {
    super(message);

    this.message = `Parameters in ${imageMark} is too few.`;
    this.name = "InvalidImageMarkError";
  }
}
