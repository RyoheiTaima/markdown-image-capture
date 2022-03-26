import { Command } from "commander";

const program = new Command();

program
  .name("markdown-image-capture")
  .description("Capture images with image marks specified in markdown file")
  .argument("<path>", "target markdown file path")
  .option("-c, --config <path>", ".micconfig.json path", "./.micconfig.json")
  .parse();

const options = program.opts();
export const command = {
  markdownPath: program.args[0],
  configPath: options.config,
};
