import styled from "styled-components";
import { Link } from "react-router-dom";
import React, { useState } from "react";

const StyledNav = styled.nav`
  width: 320px;
`;

const StyledUl = styled.ul`
  display: table;
  margin: 0 auto;
  padding: 0;
  width: 80%;
  text-align: center;
`;

interface liProps {
  isSelected: boolean;
}
const StyledLi = styled.li<React.HTMLProps<HTMLLIElement> & liProps>`
  display: table-cell;
  min-width: 50px;
  ${(props) => props.isSelected && "border-bottom: 3px solid #92D050;"}
  &:hover {
    color: #e7da66;
    border-bottom: 3px solid #f0e475;
  }
`;

const StyledSpan = styled.span`
  display: block;
  width: 100%;
  color: #555;
  padding-bottom: 5px;
`;

const NavigationItem = (props: {
  to: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const { to, label, isSelected, onClick } = props;
  return (
    <StyledLi isSelected={isSelected} onClick={onClick}>
      <Link to={to} style={{ textDecoration: "none" }}>
        <StyledSpan>{label}</StyledSpan>
      </Link>
    </StyledLi>
  );
};

export const Navigation = () => {
  const [current, setCurrent] = useState("/");

  return (
    <StyledNav>
      <StyledUl>
        <NavigationItem
          to={"/"}
          label={"Home"}
          onClick={() => setCurrent("/")}
          isSelected={current === "/"}
        />
        <NavigationItem
          to={"/ngword"}
          label={"NG words"}
          onClick={() => setCurrent("/ngword")}
          isSelected={current === "/ngword"}
        />
        <NavigationItem
          to={"/option"}
          label={"option"}
          onClick={() => setCurrent("/option")}
          isSelected={current === "/option"}
        />
      </StyledUl>
    </StyledNav>
  );
};
