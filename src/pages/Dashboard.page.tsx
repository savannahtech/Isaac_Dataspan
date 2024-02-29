import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LeftNavigation from "../components/Dashboard/LeftNavigation.component";
import Workspace from "../components/Dashboard/Workspace.component";

const Dashboard = () => {
  const [filters, setFilters] = useState<number[]>([]);

  useEffect(() => {
    console.log({ filters });
  }, [filters]);

  return (
    <Container>
      <LeftNavigation filters={filters} setFilters={setFilters} />
      <Workspace filters={filters} />
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: row;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export default Dashboard;
