import * as path from "path";
import * as fs from "fs";
import PackageJsonError from "./PackageJsonError";
import semverValid from "semver/functions/valid";
import TDependency from "./TDependency";
import TScript from "./TScript";

/**
 * The PackageJsonProcessor class is used to read, manipulate, and save the `package.json` file in the current working directory.
 *
 * @author Joern Meyer <https://joern.url.lol/🧑‍💻>
 */
export default class PackageJsonProcessor {
  private psPath: string;
  private psObject: any;

  /**
   * The constructor will read the contents of package.json and throw an error if:
   *
   * - it can't be found
   * - it contains invalid JSON
   */
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

  get name(): string {
    return this.psObject.name;
  }

  get description(): string {
    return this.psObject.description;
  }

  get version(): string {
    return this.psObject.version;
  }

  get license(): string {
    return this.psObject.license;
  }

  /**
   * Return the package.json contents as a parsed object
   * @returns any
   */
  getPackageJsonObject(): any {
    return this.psObject;
  }

  /**
   * Set the package's version. Will throw an error if an invalid semver is provided.
   *
   * @param version
   * @returns PackageJsonProcessor
   */
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

  /**
   * @param dependency
   * @returns PackageJsonProcessor
   */
  addDependency(dependency: TDependency): PackageJsonProcessor {
    const { packageName, version } = dependency;

    if (typeof this.psObject.dependencies === "undefined") {
      console.log("yup");
      this.psObject.dependencies = {};
    }

    this.psObject.dependencies[packageName] = version;

    return this;
  }

  /**
   * @param dependency
   * @returns PackageJsonProcessor
   */
  addDevDependency(dependency: TDependency): PackageJsonProcessor {
    const { packageName, version } = dependency;

    if (typeof this.psObject.devDependencies === "undefined") {
      this.psObject.devDependencies = {};
    }

    this.psObject.devDependencies[packageName] = version;

    return this;
  }

  /**
   * @param script
   * @returns PackageJsonProcessor
   */
  addScript(script: TScript): PackageJsonProcessor {
    if (typeof this.psObject.scripts === "undefined") {
      this.psObject.scripts = {};
    }

    const { key, command } = script;

    this.psObject.scripts[key] = command;

    return this;
  }

  /**
   * Save the current contents of the package.json object back to the file.
   */
  save(): void {
    fs.writeFileSync(this.psPath, JSON.stringify(this.psObject, null, 2));
  }
}
