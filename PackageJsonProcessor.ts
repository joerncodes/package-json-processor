import * as path from "path";
import * as fs from "fs";
import PackageJsonError from "./PackageJsonError";

export default class PackageJsonProcessor {
  private psPath: string;
  private psObject: any;

  constructor() {
    this.psPath = path.join(process.cwd(), "package.json");

    let fileContent: string;
    try {
      fileContent = fs.readFileSync(this.psPath, {
        encoding: "utf-8",
      });
    } catch (error: any) {
      throw new PackageJsonError(
        "Could not read package.json",
        "PACKAGE_JSON_NOT_FOUND"
      );
    }

    try {
      this.psObject = JSON.parse(fileContent);
    } catch (error: any) {
      throw new PackageJsonError(
        "Invalid package.json",
        "PACKAGE_JSON_INVALID"
      );
    }
  }
}
