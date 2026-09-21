import React from "react";
import { Skeleton, Card } from "antd";

const SkeletonCard = ({ width = 300, rows = 3 }) => {
  return (
    <Card style={{ width: width, borderRadius: 12 }}>
      <Skeleton active avatar paragraph={{ rows: rows }} />
    </Card>
  );
};

export default SkeletonCard;
