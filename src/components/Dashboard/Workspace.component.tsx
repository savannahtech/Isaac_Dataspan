import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FlexSeperate, Link } from "../../styles/index.style";
import {
  Link as NavLink,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import useS3Content from "../../hooks/useS3Content";
import ImageViewer from "./ImageViewer.component";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Workspace = () => {
  const s3 = useS3Content();
  const routes = [
    { to: "/", name: "All groups" },
    { to: "/train", name: "Train" },
    { to: "/value", name: "Value" },
    { to: "/test", name: "Test" },
  ];

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigation = useNavigate();
  const currentPage = parseInt(params.get("page") || "1", 10);
  const currentRoute = location.pathname;
  const [url, setUrl] = useState(currentRoute);
  const [pagination, setPagination] = useState({
    current_images: 0,
    total_images: 0,
    currentPage: currentPage || 1,
  });
  const [pages, setPages] = useState<number[]>([]);

  useEffect(() => {
    console.log("Route changed to:", location.pathname);
    retrieveData();
    setUrl(location.pathname);
    const currentPage = parseInt(params.get("page") || "1", 10);
    setPagination(e=> ({...e, currentPage }))
  }, [location]);

  useEffect(() => {
    generatePageNumbers(pagination.current_images, pagination.total_images);
  }, [pagination]);

  const retrieveData = async () => {
    try {
      const content = await s3.generateImageResponse('train', 'fracture-of-the-humeral-capitellum-milch-type-1-1-1-_jpg.rf.4c16d0817782b56497b9f18bca2b0fdd')
      console.log({ content });
    } catch (e) {
      console.error("An error occured while retrieving data: ", e);
    }
  };

  const generatePageNumbers = (currentImages: number = 0, totalImages: number = 0) => {
    const pagesToShow = [];
    const totalPages = Math.ceil(totalImages / 200); // Calculate total pages including remainder
  
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
    setPages(pagesToShow);
  };
  
  

  return (
    <Container>
      <FlexSeperate style={{ alignItems: "flex-end" }}>
        <Title>Bone-fracture-detection</Title>
        <PageSize>
          <span style={{ fontWeight: 600 }}>{pagination.current_images}</span>{" "}
          of <span style={{ fontWeight: 600 }}>{pagination.total_images}</span>{" "}
          images
        </PageSize>
      </FlexSeperate>
      <div style={{ display: "flex" }}>
        {routes.map((data, index) => (
          <RouterLink
            to={data.to}
            style={{
              color: currentRoute === data.to ? "#FFD75C" : "black",
              backgroundColor:
                currentRoute === data.to ? "#fffbef" : "transparent",
              borderBottomColor:
                currentRoute === data.to ? "#FFD75C" : "#d1d1d6",
            }}
            key={index}
          >
            {data.name}
          </RouterLink>
        ))}
        <span style={{ flex: 1, borderBottom: "1px solid #d1d1d6" }} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flex: 1,
          overflowY: "scroll",
        }}
      >
        <ImageViewer
          repo={url.replace("/", "")}
          setPagination={setPagination}
          page={pagination.currentPage}
        />
      </div>
      {pagination.current_images > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          }}
        >
          {pagination.currentPage - 1 > 0 && (
            <FaChevronLeft
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigation(url + "?page=" + (pagination.currentPage - 1))
              }
            />
          )}

          <PaginateContainer>
            {pages.map((data, index) => (
              <ActivePage
                style={{
                  color: data === pagination.currentPage ? "white" : "black",
                  backgroundColor:
                    pagination.currentPage !== data ? "transparent" : "#ffd75c",
                }}
                key={index}
                onClick={() => navigation(url + "?page=" + data)}
              >
                {data}
              </ActivePage>
            ))}
          </PaginateContainer>
          {pagination.currentPage + 1 < pages.length && (
            <FaChevronRight
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigation(url + "?page=" + (pagination.currentPage + 1))
              }
            />
          )}
        </div>
      )}
      <div style={{ display: "flex" }}></div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Title = styled.div`
  font-family: "Montserrat", sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 39px;
  letter-spacing: 0em;
  text-align: left;
  color: #041d32;
`;

const PageSize = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: left;
`;

const RouterLink = styled(NavLink)`
  padding: 5px 12px;
  border: 0px 0px 1px 0px;
  gap: 10px;
  font-family: "Montserrat";
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  letter-spacing: 0em;
  border-bottom: 1px solid #d1d1d6;
  color: black;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: black;
    border-bottom-color: #ffd75c;
    background-color: #fffbef;
  }
`;

const PaginateContainer = styled.div`
  display: flex;
  border-radius: 20px;
  background-color: #d1d1d6;
  height: 40px;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: black;
  /* gap: 10px; */
`;

const ActivePage = styled.button`
  font-family: "Montserrat";
  display: flex;
  font-size: 16px;
  font-weight: 600;
  background-color: #ffd75c;
  flex-direction: column;
  border-radius: 20px;
  height: 40px;
  width: 40px;
  display: "flex";
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ease-in-out 0.5s;

  &:hover {
    background-color: black;
    color: white;
  }
`;

export default Workspace;
