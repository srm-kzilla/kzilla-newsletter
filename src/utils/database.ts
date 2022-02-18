import { Db, MongoClient } from "mongodb";
import { AWSError, SSM } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

const mongoClient = MongoClient;
const ssm = new SSM();

let cachedDb: Db | null = null;
let ssmResponse: PromiseResult<SSM.GetParameterResult, AWSError>;

export const connectToMongoDb = async (): Promise<Db> => {
  if (cachedDb) return cachedDb;

  ssmResponse = await ssm
    .getParameter({
      Name: "/kzilla-newsletter/MONGODB_URI",
      WithDecryption: true,
    })
    .promise();

  const client = await mongoClient.connect(
    ssmResponse.Parameter?.Value as string
  );

  cachedDb = await client.db();
  return cachedDb;
};
