import React from "react";
import { Skeleton } from "antd";

const TableSkeleton = () => {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          active
          title={false}
          paragraph={{ rows: 1, width: ["100%"] }}
          style={{ marginBottom: 16 }}
        />
      ))}
    </div>
  );
};

export default TableSkeleton;
