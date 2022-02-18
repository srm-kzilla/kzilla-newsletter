import * as sst from "@serverless-stack/resources";
import * as iam from "aws-cdk-lib/aws-iam";

export default class KzillaNewsletterStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    //Creating an IAM permission to access AWS SSM stored parameters
    const ssmIamPermission = new iam.PolicyStatement({
      actions: ["ssm:*"],
      effect: iam.Effect.ALLOW,
      resources: ["*"],
    });

    // Create a HTTP API
    const api = new sst.Api(this, "KzillaNewsletterApi", {
      routes: {
        "GET /unsubscribe": {
          function: {
            functionName: scope.stage + "-newsletterHandler",
            handler: "src/newsletter.handler",
            timeout: 120,
            permissions: [ssmIamPermission],
            retryAttempts: 0,
          },
        },
      },
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
