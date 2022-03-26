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
    /!\[(?<pageName>[^_]+)_(?<selector>.+?)\]\((?<savaPath>[^)]+)\)/;

  const result = imageMark.match(parser)?.groups;
  if (!(result && "pageName" in result && "savePath" in result)) {
    throw new InvalidImageMarkError(imageMark);
  }
  return {
    pageName: result.pageName,
    selector: result.selector,
    savePath: result.savePath,
  };
};
