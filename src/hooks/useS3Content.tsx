import AWS from "aws-sdk";
import { classAttr } from "../utils";

const useS3Content = () => {
  // Configuring AWS
  AWS.config.region = "eu-central-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:31ebe2ab-fc9d-4a2c-96a9-9dee9a9db8b9",
  });

  const albumBucketName = "dataspan.frontend-home-assignment";
  const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: albumBucketName },
  });

  // Function to retrieve data from S3
  const fetchDataFromS3 = async (url: string) => {
    const encodedUrl = url.split("/").map(encodeURIComponent).join("/"); // Encode each path component separately
    const fullKey = `${albumBucketName}/${encodedUrl}`; // Construct full key
    // console.log("Full Key:", fullKey); // Log full key
    try {
      const s3Object = await s3
        .getObject({ Bucket: albumBucketName, Key: encodedUrl })
        .promise();
      return s3Object.Body;
    } catch (error) {
      console.error("Error fetching data from S3:", error);
      return null;
    }
  };

  function getImageKey(imageUrl: string) {
    const filenameWithoutExtension =
      imageUrl
        ?.split("/")
        .pop()
        ?.replace(/\.[^.]+$/, "") || "";

    return filenameWithoutExtension;
  }

  async function readBlobAsText(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          const buffer = Buffer.from(reader.result);
          resolve(buffer.toString("utf-8"));
        } else {
          reject(new Error("Failed to read Blob as text."));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  async function generateImageResponse(subRoute: string, mainKey: string) {
    const label = `bone-fracture-detection/${subRoute}/labels/${mainKey}.txt`;
    // console.log({label})
    const labelContentResponse = await fetchDataFromS3(label);
    // console.log({ labelContentResponse }); // Check the response from AWS S3
  
    let labelContent = "";
  
    if (labelContentResponse instanceof Uint8Array) {
      try {
        // Convert Uint8Array to string using TextDecoder
        labelContent = new TextDecoder().decode(labelContentResponse);
      } catch (error) {
        console.error("Error converting Uint8Array to text:", error);
      }
    }
  
    // console.log({ labelContent }); 
    const dataPoints = labelContent.split('\n').map(line => line.trim()).filter(line => line); 
    // console.log({ dataPoints });
  
    // Convert string of floats separated by spaces to an array of floats
    const floatArray = dataPoints.flatMap(point => point.split(' ').map(parseFloat));

    // console.log({ floatArray });

    return floatArray;
  }


  return { fetchDataFromS3, getImageKey, generateImageResponse };
};

export default useS3Content;
