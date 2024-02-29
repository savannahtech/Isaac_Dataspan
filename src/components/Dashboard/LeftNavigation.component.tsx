import React, { useState } from "react";
import styled from "styled-components";
import { FilterOptionsButton, FlexSeperate } from "../../styles/index.style";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDotFilled } from "react-icons/rx";
import "rsuite/dist/rsuite.min.css";
import { RangeSlider, Slider } from "rsuite";
import "../../styles/custom-range-slider.css";
import { classAttr } from "../../utils";

const LeftNavigation = ({
  filters,
  setFilters,
}: {
  filters: number[];
  setFilters: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const [filterSelection, setFilterSelection] = useState({
    selectAll: false,
    deselectAll: false,
  });
  const [min_max, setMinMax] = useState<any>([0, 4])

  const filterOptions = [
    {
      label: "Elbow Positive",
      color: "#FDB03E",
    },
    {
      label: "Fingers positive",
      color: "#BADA55",
    },
  ];

  return (
    <Container>
      <Logo src={require("../../assets/logo.png")} alt="Logo" />
      <FilterHeader>Classes filter</FilterHeader>
      <div>
        <FilterSelectButton
          style={{ color: filterSelection.selectAll ? "#2081D2" : "#D1D1D6" }}
          onClick={() =>
            setFilterSelection({ selectAll: true, deselectAll: false })
          }
        >
          Select all
        </FilterSelectButton>
        <FilterSelectButton
          style={{
            color: filterSelection.deselectAll ? "#2081D2" : "#D1D1D6",
            marginLeft: 10,
          }}
          onClick={() =>
            setFilterSelection({ selectAll: false, deselectAll: true })
          }
        >
          Deselect all
        </FilterSelectButton>
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}
      >
        {Object.keys(classAttr).map((key) => (
          <FilterOptionsButton
            style={{
              borderColor: classAttr[key].color,
              backgroundColor: filters.includes(classAttr[key].classId)
                ? classAttr[key].color
                : "transparent",
              color: filters.includes(classAttr[key].classId)
              ? 'white'
              : "black",
            }}
            onClick={() =>
              setFilters((e) =>
                e.includes(classAttr[key].classId)
                  ? e.filter((item) => item !== classAttr[key].classId)
                  : [...e, classAttr[key].classId]
              )
            }
            key={key}
          >
            <RxDotFilled size={22} color={filters.includes(classAttr[key].classId)
                ? 'white'
                : classAttr[key].color} />{" "}
            {classAttr[key].name}
          </FilterOptionsButton>
        ))}
      </div>
      <FilterHeader>Polygon range</FilterHeader>
      <FlexSeperate style={{ marginTop: 10 }}>
        <FilterRangeText>
          min <span style={{ fontWeight: "bold" }}>{min_max[0]}</span>
        </FilterRangeText>
        <FilterRangeText>
          max <span style={{ fontWeight: "bold" }}>{min_max[1]}</span>
        </FilterRangeText>
      </FlexSeperate>
      <div style={{ position: "relative" }}>
        <RangeSlider
          progress
          style={{ marginTop: 16 }}
          className="custom-range-slider"
          defaultValue={min_max}
          min={0}
          max={4}
            
            onChange={(value) => {
              setMinMax(value)
            }}
        />
      </div>
      <FlexSeperate style={{ marginTop: 30 }}>
        <ClearButton>
          <RiDeleteBin6Line size={18} />
          Clear Filters
        </ClearButton>
        <FilterSelectButton style={{ color: "#808080" }}>
          Need help?
        </FilterSelectButton>
      </FlexSeperate>
    </Container>
  );
};

const Container = styled.div`
  width: 332px;
  border-radius: 10px;
  border: 1px solid #d1d1d6;
  height: 100%;
  padding: 15px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Logo = styled.img`
  width: 242px;
  height: 65px;
`;

const FilterHeader = styled.h4`
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
  color: #041d32;
  margin-top: 40px;
`;

const FilterSelectButton = styled.button`
  border: none;
  background: transparent;
  font-family: "Montserrat", sans-serif;
  padding: 0;
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0em;
  cursor: pointer;
`;

const FilterRangeText = styled.span`
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0em;
`;

const ClearButton = styled.button`
  border: none;
  padding: 5px 7%.5;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
  gap: 6px;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.5s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default LeftNavigation;
