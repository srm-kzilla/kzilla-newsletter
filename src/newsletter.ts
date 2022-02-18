import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { connectToMongoDb } from "./utils/database";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const db = await connectToMongoDb();

    const email = event.queryStringParameters
      ? event.queryStringParameters["email"]
      : undefined;
    if (!email)
      throw {
        isCustom: true,
        statusCode: 400,
        message: "No email was passed with this request.",
      };
    console.info("Email received: ", email);

    const user = await db
      .collection("mass-mail")
      .findOne<{ email: string; name: string }>(
        { email },
        {
          projection: {
            _id: 0,
            email: 1,
            name: 1,
          },
        }
      );
    if (!user)
      throw {
        isCustom: true,
        statusCode: 404,
        message:
          "We could not find any registered user with this email address.",
      };

    await db.collection("mass-mail").deleteOne({ email });
    console.info(`Email address ${email} has been unsubscribed.`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: `We have successfully removed ${email} from our mailing list. We at SRMKZILLA thank our patrons like you for using our products and attending our events.`,
    };
  } catch (error) {
    console.error(error);
    if ((error as any).isCustom) {
      const { statusCode, message } = error as any;
      return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: false,
          message,
        }),
      };
    }
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: false,
        message:
          "We faced an expected error. Please contact the SRMKZILLA team at technical@srmkzilla.net if this issue persits.",
      }),
    };
  }
};
