import * as fs from "fs";
import PackageJsonProcessor from "./PackageJsonProcessor";
import packgeJsonString from "./fixtures/packageJsonString";
import PackageJsonError, { isPackageJsonError } from "./PackageJsonError";

jest.mock("fs");
describe("PackageJsonManager", () => {
  describe("finding package.json file", () => {
    const readFileSyncSpy = jest.spyOn(fs, "readFileSync");

    beforeEach(() => {
      readFileSyncSpy.mockClear();
    });

    it("starts by reading the package.json file", () => {
      readFileSyncSpy.mockReturnValueOnce(packgeJsonString);
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
});
