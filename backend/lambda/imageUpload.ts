import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

interface Request {
	headers: {[key: string]: string | undefined} 
	body: string
}

export const handler = async (event: Request) => {
  try {
		const s3 = new S3Client();

    const contentType = event.headers["content-type"] || "application/octet-stream";
    const email = event.headers["x-user-email"];

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({message: "Missing email in header"})
      }
    }
    
    const fileBuffer = Buffer.from(event.body, "base64");

    const params: PutObjectCommandInput = {
      Bucket: "puppr.yanceydev.com",
      Key: `photos/${email}`,
      Body: fileBuffer,
      ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({url: `https://s3.us-east-1.amazonaws.com/puppr.yanceydev.com/photos/${email}`})
    };
  } 
	catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
