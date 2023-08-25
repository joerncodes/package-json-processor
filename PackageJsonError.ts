import TPackageJsonErrorType from "./TPackageJsonErrorType";

export function isPackageJsonError(error: any): error is PackageJsonError {
  const validTypes = [
    "PACKAGE_JSON_NOT_FOUND",
    "PACKAGE_JSON_INVALID",
    "INVALID_SEMVER",
  ];
  return (
    typeof error.errorType === "string" && validTypes.includes(error.errorType)
  );
}

export default class PackageJsonError extends Error {
  errorType: TPackageJsonErrorType;

  constructor(message: string, errorType: TPackageJsonErrorType) {
    super(message);
    this.errorType = errorType;
  }
}
