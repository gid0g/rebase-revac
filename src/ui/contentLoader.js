import ContentLoader from "react-content-loader";
import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@mui/material";

export const MyLoader = () => (
  <ContentLoader
    speed={5}
    width={100}
    height={33}
    viewBox="0 0 404 75"
    backgroundColor="rgb(0,0,0)"
    foregroundColor="rgb(0,0,0)"
    backgroundOpacity={0.06}
    foregroundOpacity={0.12}
    // {...props}
  >
    <rect x="118" y="91" rx="0" ry="0" width="1" height="0" />
    <rect x="4" y="-21" rx="0" ry="0" width="336" height="110" />

    <rect x="121" y="183" rx="0" ry="0" width="237" height="19" />
    <rect x="123" y="216" rx="0" ry="0" width="235" height="18" />
    <rect x="271" y="170" rx="0" ry="0" width="1" height="21" />
    <rect x="219" y="35" rx="0" ry="0" width="4" height="32" />
  </ContentLoader>
);

export const TableRowsLoader = ({ rowsNum, colsNum }) => {
  return [...Array(rowsNum)].map((row, rowIndex) => (
    <TableRow key={rowIndex}>
      {[...Array(colsNum)].map((col, colIndex) => (
        <TableCell key={colIndex}>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      ))}
    </TableRow>
  ));
};