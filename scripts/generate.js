import fs from "fs";
import path from "path";
import numberToWords from "number-to-words";
import pascalcase from "pascalcase";
import prettier from "prettier";

// FOR `"type": "module"`
import url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_ICONS_PATH = path.resolve(
  __dirname,
  "../node_modules/@tabler/icons/icons/"
);
const DIST_PATH = path.resolve(__dirname, "../");
const DESTINATION_ICONS_PATH = path.resolve(__dirname, "../icons");

const TABLER_ICONS_VERSION = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package-lock.json"), "utf8")
)["dependencies"]["@tabler/icons"]["version"];

const ICON_NAMES = fs
  .readdirSync(SOURCE_ICONS_PATH)
  .filter((file) => file.endsWith(".svg"))
  .map((x) => x.split(".")[0]);

const { format } = prettier;
const PRETTIER_OPTIONS = await prettier.resolveConfig(__dirname);

const createComponentName = (originalName) => {
  return originalName
    .split(/(\d+)/)
    .filter((x) => x != "")
    .map((x) => {
      if (/\d/g.test(x)) {
        return pascalcase(numberToWords.toWords(x));
      } else {
        return pascalcase(x);
      }
    })
    .join("");
};

const generateComponents = async () => {
  ICON_NAMES.forEach((originalName) => {
    const svgFileContents = fs.readFileSync(
      path.resolve(SOURCE_ICONS_PATH, `${originalName}.svg`),
      "utf8"
    );

    const [, svgContent] = /<svg[^>]*>([\s\S]*?)<\/svg>/.exec(svgFileContents);
    let source = fs
      .readFileSync(
        path.resolve(__dirname, "./ComponentTemplate.svelte"),
        "utf8"
      )
      .replace(/%%TABLER_ICON_VERSION%%/g, TABLER_ICONS_VERSION)
      .replace(/%%SVG_CONTENT%%/g, svgContent);

    const componentName = createComponentName(originalName);
    fs.writeFileSync(
      path.resolve(DESTINATION_ICONS_PATH, `${componentName}.svelte`),
      format(source, { parser: "html", ...PRETTIER_OPTIONS })
    );
  });
};

const createIndexFile = async () => {
  const exports = ICON_NAMES.map((originalName) => {
    const componentName = createComponentName(originalName);
    return `export { default as ${componentName} } from "./icons/${componentName}.svelte"`;
  });

  fs.writeFileSync(
    path.resolve(DIST_PATH, "index.js"),
    format(exports.join("\n"), {
      parser: "babel",
      ...PRETTIER_OPTIONS,
    })
  );
};

const createTypesFile = async () => {
  const imports = `import { SvelteComponentTyped } from "svelte";\n`;
  const exports = ICON_NAMES.map((originalName) => {
    const componentName = createComponentName(originalName);
    return `\
            export class ${componentName} extends SvelteComponentTyped<{
                class?: string;
            }> {}\
        `;
  });

  fs.writeFileSync(
    path.resolve(DIST_PATH, "index.d.ts"),
    format(imports + exports.join("\n"), {
      parser: "typescript",
      ...PRETTIER_OPTIONS,
    })
  );
};

const createDocFile = async () => {
  const rows = ICON_NAMES.map((originalName) => {
    const componentName = createComponentName(originalName);
    return `| ${componentName} | ${originalName} |`;
  });

  fs.writeFileSync(
    path.resolve(__dirname, "../ICON_INDEX_DOC.md"),
    format(
      fs.readFileSync(
        path.resolve(__dirname, "./ICON_INDEX_DOC_TEMPLATE.md"),
        "utf8"
      ) + rows.join("\n"),
      {
        parser: "markdown",
        ...PRETTIER_OPTIONS,
      }
    )
  );
};

if (!fs.existsSync(DESTINATION_ICONS_PATH)) {
  fs.mkdirSync(DESTINATION_ICONS_PATH);
}

// remove old files
fs.readdirSync(DESTINATION_ICONS_PATH)
  .filter((file) => file.endsWith(".svelte"))
  .forEach((file) => fs.unlinkSync(path.join(DESTINATION_ICONS_PATH, file)));
fs.readdirSync(DIST_PATH)
  .filter(
    (file) =>
      file === "index.js" ||
      file === "index.d.ts" ||
      file === "ICON_INDEX_DOC.md"
  )
  .forEach((file) => fs.unlinkSync(path.join(DIST_PATH, file)));

generateComponents();
createIndexFile();
createTypesFile();
createDocFile();
