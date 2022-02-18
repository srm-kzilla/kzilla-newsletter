import KzillaNewsletterStack from "./KzillaNewsletterStack";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
  });

  new KzillaNewsletterStack(app, "kzilla-newsletter-stack");

  // Add more stacks
}
