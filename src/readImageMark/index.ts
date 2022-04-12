import { promises as fs } from "fs";

import { InvalidImageMarkError } from "../exceptions";
import { ImageParam } from "./types";

export const readImageMark = async (path: string): Promise<ImageParam[]> => {
  const file = await fs.readFile(path, "utf8");
  return extractImageMark(file).map((im) => parseImageMark(im));
};

const extractImageMark = (s: string): string[] => {
  const imageMarkPattern = /!\[.+?\]\([^)]+\)/g;
  return s.match(imageMarkPattern) || [];
};

const parseImageMark = (imageMark: string): ImageParam => {
  const parser =
    /!\[(?<pageName>[^_]+)(?:_(?<selector>.+?))?\]\((?<savePath>[^)]+)\)/;

  const result = imageMark.match(parser)?.groups;
  if (!result) {
    throw new InvalidImageMarkError(imageMark);
  }
  return {
    pageName: result.pageName,
    selector: result.selector?.replace("/", "//"),
    savePath: result.savePath,
  };
};
