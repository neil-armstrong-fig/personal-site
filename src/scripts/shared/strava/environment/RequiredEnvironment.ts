export function requiredEnvironment(name: string): string {
  const value = process.env[name];

  if (value === undefined || value === "") {
    throw new Error(`${name} is not set. Add it to the ignored .env file.`);
  }

  return value;
}
