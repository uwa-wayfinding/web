import { S3Client } from "@aws-sdk/client-s3";
import { serverEnv } from "../env";

export  const s3Client = new S3Client({
    region: 'auto',
    endpoint: serverEnv.R2_ENDPOINT,
    credentials: {
      accessKeyId: serverEnv.R2_ACCESS_KEY,
      secretAccessKey: serverEnv.R2_SECRET_KEY,
    },
  })