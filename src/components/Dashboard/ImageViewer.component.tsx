import React, { useState, useEffect } from "react";
import AWS, { config, S3 } from "aws-sdk";
import styled from "styled-components";
import Modal from "../Modal.component";
import useS3Content from "../../hooks/useS3Content";

interface Image {
  Key: string;
}

interface ImageViewerProps {
  repo: string;
  setPagination: React.Dispatch<
    React.SetStateAction<{
      current_images: number;
      total_images: number;
      currentPage: number;
    }>
  >;
  page: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  repo,
  setPagination,
  page,
}) => {
  const [data, setData] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState({
    url: "",
    show: false,
  });
  const { generateImageResponse, getImageKey } = useS3Content();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let url = repo === "" ? "train" : repo;
      if (url === "value") url = "valid";
      const folderPath = `bone-fracture-detection/${url}/thumbnails`;

      console.log("Fetching data for page:", page);

      config.update({
        region: "eu-central-1",
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: "eu-central-1:31ebe2ab-fc9d-4a2c-96a9-9dee9a9db8b9",
        }),
      });

      const s3 = new S3({ apiVersion: "2006-03-01" });

      try {
        const response: any = await s3
          .listObjectsV2({
            Bucket: "dataspan.frontend-home-assignment",
            Prefix: folderPath,
          })
          .promise();

        console.log("Response:", response);

        if (response.Contents && response.Contents.length > 0) {
          const fileData: Image[] = response.Contents.map(
            (item: S3.Object) => ({
              Key: item.Key || "", // Ensure Key is defined
            })
          );

          const maxItemsPerPage = 200; // Number of images per page
          const startIndex = (page - 1) * maxItemsPerPage; // Calculate the start index based on the page number
          const slicedData = fileData.slice(
            startIndex,
            startIndex + maxItemsPerPage
          );

          setData(slicedData);

          setPagination((e) => ({
            ...e,
            current_images: slicedData.length,
            total_images: response.KeyCount || 0,
          }));
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data from S3:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repo, page]); // Include page in the dependency array

  useEffect(() => {
    // Draw polygons on images load
    const handleImagesLoad = async () => {
      console.log({ repo });
      for (let index = 0; index < data.length; index++) {
        const points = await generateImageResponse(
          repo,
          getImageKey(data[index].Key)
        );

        console.log({points})

        drawPolygon(index, points);
      }
    };

    handleImagesLoad();
  }, [data]);

  // Function to draw polygon using SVG
  const drawPolygon = (index: number, points: number[]) => {
    const svgContainer = document.getElementById(`svg-container-${index}`);
    if (svgContainer) {
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      const scaledPoints = scalePointsToContainer(points); // Function to scale polygon points
      polygon.setAttribute("points", scaledPoints.join(" "));
      polygon.setAttribute("fill", "red"); // Set fill color
      polygon.setAttribute("stroke-opacity", "2");
      svgContainer.appendChild(polygon);
    }
  };

  // Function to scale polygon points to fit within the container
  const scalePointsToContainer = (points: number[]): number[] => {
    const scaledPoints = points.map((point, index) => {
      if (index % 2 === 0) {
        return parseFloat((point * 100).toFixed(2));
      } else {
        return parseFloat((point * 100).toFixed(2));
      }
    });
    return scaledPoints;
  };

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {loading ? (
          <p>Loading images...</p>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <div style={{ overflow: "hidden", width: 100 }} key={index}>
              <div style={{ position: "relative", height: 100, width: 100 }}>
                <img
                  id={`img-${index}`}
                  src={`https://s3.eu-central-1.amazonaws.com/dataspan.frontend-home-assignment/${encodeURIComponent(
                    item.Key
                  )}`}
                  style={{ height: 100, width: 100 }}
                  alt={`Image ${index}`}
                  onClick={() =>
                    setVisible({
                      show: true,
                      url: `https://s3.eu-central-1.amazonaws.com/dataspan.frontend-home-assignment/${encodeURIComponent(
                        item.Key
                      )}`,
                    })
                  }
                />
                <svg
                  id={`svg-container-${index}`}
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100" // Update viewBox to 100x100
                  style={{ position: "absolute", top: 0, left: 0 }}
                ></svg>
              </div>
              <FileName>{getImageKey(item.Key)}</FileName>
            </div>
          ))
        ) : (
          <p>No data found in the specified folder.</p>
        )}
      </div>
      <Modal visible={visible} setVisible={setVisible} />
    </>
  );
};

const FileName = styled.span`
  font-family: "Montserrat";
  font-size: 12px;
  font-weight: 300;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default ImageViewer;
