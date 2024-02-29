import React, { useState, useEffect } from "react";
import AWS, { config, S3 } from "aws-sdk";
import styled from "styled-components";
import Modal from "../Modal.component";
import useS3Content from "../../hooks/useS3Content";
import { classAttr } from "../../utils";

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
  filters: number[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  repo,
  setPagination,
  page,
  filters,
}) => {
  const [data, setData] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState({
    url: "",
    show: false,
  });
  const { generateImageResponse, getImageKey } = useS3Content();
  const [filterList, setFilterlist] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let url = repo === "" ? "train" : repo;
      if (url === "value") url = "valid";
      const folderPath = `bone-fracture-detection/${url}/thumbnails`;

      //   console.log("Fetching data for page:", page);

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

        // console.log("Response:", response);

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
    // Clear filter list before updating
    setFilterlist([]);
  
    // Draw polygons on images load
    const handleImagesLoad = async () => {
      for (let index = 0; index < data.length; index++) {
        const points = await generateImageResponse(
          repo === "value" ? "valid" : repo,
          getImageKey(data[index].Key)
        );
            
        // Check if filters array is empty or if points[0] includes any of the filters
        if (filters.length === 0 || filters.includes(points[0])) {
          drawPolygon(data[index].Key, points, classAttr[points[0]]?.color || "", repo);
          setFilterlist((e) => [...e, index]);
        }
      }
    };
  
    handleImagesLoad();
  }, [data, filters]); // Include filterList in the dependency array
  
  useEffect(()=>{
    console.log({visible})
  }, [visible])

  // Function to draw polygon using SVG
  const drawPolygon = (index: string, points: number[], color: string, repo: string) => {
    const svgContainer = document.getElementById(`svg-container-${index}-${repo}`);
    if (svgContainer) {
      // Clear existing polygons
      svgContainer.innerHTML = "";
  
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      const scaledPoints = scalePointsToContainer(points, 1, 1); // Function to scale polygon points
      polygon.setAttribute("points", scaledPoints.join(" "));
      polygon.setAttribute("fill", color); // Set fill color
      polygon.setAttribute("stroke-opacity", "2");
      svgContainer.appendChild(polygon);
    }
  };
  

  // Function to scale polygon points to fit within the image container
    const scalePointsToContainer = (points: number[], imageWidth: number, imageHeight: number): number[] => {
        const scaledPoints = points.map((point, index) => {
        // Scale x-coordinate
        if (index % 2 === 0) {
            return (point / imageWidth) * 100; // Scale based on image width
        } else { // Scale y-coordinate
            return (point / imageHeight) * 100; // Scale based on image height
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
            filterList.map((item, index) => (
            <div
              style={{ overflow: "hidden", width: 100 }}
              key={`${data[item].Key}-${repo}-1-${index}`}
            >
              <div style={{ position: "relative", height: 100, width: 100 }} key={`${data[item].Key}-${repo}-2-${index}`} onClick={() =>
                    setVisible({
                      show: true,
                      url: `https://s3.eu-central-1.amazonaws.com/dataspan.frontend-home-assignment/${encodeURIComponent(
                        data[item].Key
                      )}`,
                    })
                  }>
                <img
                  id={`img-${index}`}
                  src={`https://s3.eu-central-1.amazonaws.com/dataspan.frontend-home-assignment/${encodeURIComponent(
                    data[item]?.Key
                  )}`}
                  style={{ height: 100, width: 100 }}
                  alt={`Image ${index}`}
                />
                <svg
                  id={`svg-container-${data[index]?.Key}-${repo}`}
                  key={`${data[item]?.Key}`}
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100" // Update viewBox to 100x100
                  style={{ position: "absolute", top: 0, left: 0 }}
                ></svg>
              </div>
              <FileName>{getImageKey(data[item].Key)}</FileName>
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
