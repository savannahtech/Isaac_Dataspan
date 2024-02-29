import styled from "styled-components";
import { Link as LinkRouter } from "react-router-dom";

export const FilterOptionsButton = styled.button`
  height: 29px;
  padding: 4px, 13px, 4px, 13px;
  background-color: transparent;
  border-radius: 25px;
  border: 1px;
  gap: 10px;
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
  border-width: 2px;
  border-style: solid;
`;

export const Link = styled(LinkRouter)`
  text-decoration: none;
  border: none;
  color: black;
`

export const FlexSeperate = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
