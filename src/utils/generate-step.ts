import fs from "fs";
import * as glob from "glob";
import path from "path";

const featuresFiles = "./tests/feature/**/*.feature";

const outputFile = path.join(
  process.cwd(),
  "./tests/step-definition/generated-steps.ts"
);

const files = glob.sync(featuresFiles);

const steps = new Set<string>();

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");

  const matches = content.match(
    /^\s*(Given|When|Then|And)\s.+/gm
  );

  matches?.forEach((step) => {
    steps.add(step.trim());
  });
}

let output = `import { Given, When, Then, And } from '@wdio/cucumber-framework';\n\n`;

steps.forEach((step) => {
  const cleanStep = step
    .replace(/^(Given|When|Then|And)\s/, "")
    .trim();

  let keyword = step.split(" ")[0];

  if (keyword === "And") {
    keyword = "Then";
  }

  output += `
${keyword}('${cleanStep}', async () => {

});
`;
});

fs.writeFileSync(outputFile, output);

console.log(`Generated ${steps.size} steps`);
console.log(`Written to: ${outputFile}`);