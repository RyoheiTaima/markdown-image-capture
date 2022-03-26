import { promises as fs } from "fs";

import { JsonObject } from "../types";

const readJson = async (path: string): Promise<JsonObject> => {
  const file = await fs.readFile(path, "utf8");
  const json = JSON.parse(file);

  return json;
};

export const readJsonWithDefault = async (
  path: string
): Promise<JsonObject> => {
  const defaultJson = {
    browserType: "chromium",
    style: {
      outline: {
        color: "#FF0000",
        style: "solid",
        width: "3px",
      },
    },
  };
  const json = await readJson(path);
  return { ...defaultJson, ...json };
};
