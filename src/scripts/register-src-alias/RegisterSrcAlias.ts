import {registerHooks} from "node:module";
import type {ResolveFnOutput, ResolveHookContext} from "node:module";
import {fileURLToPath, pathToFileURL} from "node:url";

type NextResolve = (specifier: string, context?: Partial<ResolveHookContext>) => ResolveFnOutput;

// Lets scripts run under plain Node import source with the same `@src/*` alias as tsconfig.json, and import
// extensionless TypeScript modules, so a script never needs a `../src/...` path. Node loads this file before the
// hook exists, so it must import nothing but Node built-ins, and its own location fixes the source root.
const SRC_ROOT = fileURLToPath(new URL("../../", import.meta.url));

registerHooks({
  resolve(specifier: string, context: ResolveHookContext, nextResolve: NextResolve): ResolveFnOutput {
    if (specifier.startsWith("@src/")) {
      return resolveWithTypeScript(
        pathToFileURL(`${SRC_ROOT}${specifier.slice("@src/".length)}`).href,
        context,
        nextResolve,
      );
    }

    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      return resolveWithTypeScript(specifier, context, nextResolve);
    }

    return nextResolve(specifier, context);
  },
});

function resolveWithTypeScript(
  specifier: string,
  context: ResolveHookContext,
  nextResolve: NextResolve,
): ResolveFnOutput {
  try {
    return nextResolve(specifier, context);
  } catch (error) {
    if (!isModuleNotFound(error) || /\.[cm]?[jt]s$/.test(specifier)) {
      throw error;
    }

    return nextResolve(`${specifier}.ts`, context);
  }
}

function isModuleNotFound(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ERR_MODULE_NOT_FOUND";
}
