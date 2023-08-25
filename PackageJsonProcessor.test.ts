import fs from "fs";
import PackageJsonProcessor from "./PackageJsonProcessor";
import packageJsonString from "./fixtures/packageJsonString";
import PackageJsonError, { isPackageJsonError } from "./PackageJsonError";

describe("PackageJsonManager", () => {
  const readFileSyncSpy = jest.spyOn(fs, "readFileSync");

  describe("finding package.json file", () => {
    beforeEach(() => {
      readFileSyncSpy.mockClear();
    });

    it("starts by reading the package.json file", () => {
      readFileSyncSpy.mockReturnValueOnce(packageJsonString);
      new PackageJsonProcessor();
      expect(readFileSyncSpy).toHaveBeenCalledTimes(1);
    });

    it("throws an error if package.json is not found", () => {
      readFileSyncSpy.mockImplementationOnce(() => {
        throw new Error();
      });

      expect.assertions(2);

      try {
        new PackageJsonProcessor();
      } catch (error: any) {
        expect(isPackageJsonError(error)).toBeTruthy();
        expect((error as PackageJsonError).errorType).toBe(
          "PACKAGE_JSON_NOT_FOUND"
        );
      }
    });

    it("throws an error if package.json is not valid JSON", () => {
      readFileSyncSpy.mockReturnValueOnce("test");

      expect.assertions(2);

      try {
        new PackageJsonProcessor();
      } catch (error: any) {
        expect(isPackageJsonError(error)).toBeTruthy();
        expect((error as PackageJsonError).errorType).toBe(
          "PACKAGE_JSON_INVALID"
        );
      }
    });
  });

  describe("getter functions", () => {
    it("can return the parsed package.json object", () => {
      readFileSyncSpy.mockReturnValueOnce(packageJsonString);
      const processor = new PackageJsonProcessor();
      const packageJsonObject = processor.getPackageJsonObject();

      expect(packageJsonObject.version).toBe(packageJsonObject.version);
    });
  });

  describe("set version", () => {
    it("will throw an error if the version is an invalid semver", () => {
      readFileSyncSpy.mockReturnValueOnce(packageJsonString);
      const processor = new PackageJsonProcessor();

      expect.assertions(3);
      try {
        processor.setVersion("1.0.0.1.0");
      } catch (error: any) {
        expect(isPackageJsonError(error)).toBeTruthy();
        expect((error as PackageJsonError).message).toContain("1.0.0.1.0");
        expect((error as PackageJsonError).errorType).toBe("INVALID_SEMVER");
      }
    });
  });

  describe("saving package.json", () => {
    const writeFileSyncSpy = jest.spyOn(fs, "writeFileSync");
    it("can save the package.json object", () => {
      readFileSyncSpy.mockReturnValueOnce(packageJsonString);
      writeFileSyncSpy.mockImplementationOnce(() => {});

      const processor = new PackageJsonProcessor();
      processor.setVersion("1.0.1");
      processor.save();

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      const argument = writeFileSyncSpy.mock.calls[0][1];
      expect((argument as string).indexOf("1.0.1") !== -1).toBeTruthy();
    });
  });

  describe("adding dependencies", () => {
    it("can add dependencies", () => {
      readFileSyncSpy.mockReturnValueOnce(packageJsonString);

      const processor = new PackageJsonProcessor();
      expect(processor.getPackageJsonObject().dependencies).not.toHaveProperty(
        "a-test"
      );

      processor.addDependency({
        packageName: "a-test",
        version: "^1.0.0",
      });

      expect(processor.getPackageJsonObject().dependencies).toHaveProperty(
        "a-test"
      );
    });
    it("can add devDependencies", () => {
      readFileSyncSpy.mockReturnValueOnce(packageJsonString);

      const processor = new PackageJsonProcessor();
      expect(
        processor.getPackageJsonObject().devDependencies
      ).not.toHaveProperty("a-test");

      processor.addDevDependency({
        packageName: "a-test",
        version: "^1.0.0",
      });

      expect(processor.getPackageJsonObject().devDependencies).toHaveProperty(
        "a-test"
      );
    });
  });

  describe("adding scripts", () => {
    it("can add scripts", () => {
      readFileSyncSpy.mockReturnValueOnce(packageJsonString);

      const processor = new PackageJsonProcessor();
      expect(processor.getPackageJsonObject().scripts).not.toHaveProperty(
        "testytest"
      );

      processor.addScript({ key: "testytest", command: "jest --watch" });
      expect(processor.getPackageJsonObject().scripts).toHaveProperty(
        "testytest"
      );
    });
  });
});
