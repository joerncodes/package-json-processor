import * as path from "path";
import * as fs from "fs";
import PackageJsonError from "./PackageJsonError";
import semverValid from "semver/functions/valid";
import TDependency from "./TDependency";
import TScript from "./TScript";

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

  getPackageJsonObject(): any {
    return this.psObject;
  }

  setVersion(version: string): PackageJsonProcessor {
    if (!semverValid(version)) {
      throw new PackageJsonError(
        `Invalid semver version: ${version}`,
        "INVALID_SEMVER"
      );
    }
    this.psObject.version = version;

    return this;
  }

  addDependency(dependency: TDependency): PackageJsonProcessor {
    const { packageName, version } = dependency;

    if (typeof this.psObject.dependencies === "undefined") {
      console.log("yup");
      this.psObject.dependencies = {};
    }

    this.psObject.dependencies[packageName] = version;

    return this;
  }

  addDevDependency(dependency: TDependency): PackageJsonProcessor {
    const { packageName, version } = dependency;

    if (typeof this.psObject.devDependencies === "undefined") {
      this.psObject.devDependencies = {};
    }

    this.psObject.devDependencies[packageName] = version;

    return this;
  }

  addScript(script: TScript): PackageJsonProcessor {
    if (typeof this.psObject.scripts === "undefined") {
      this.psObject.scripts = {};
    }

    const { key, command } = script;

    this.psObject.scripts[key] = command;

    return this;
  }

  save(): void {
    fs.writeFileSync(this.psPath, JSON.stringify(this.psObject, null, 2));
  }
}
