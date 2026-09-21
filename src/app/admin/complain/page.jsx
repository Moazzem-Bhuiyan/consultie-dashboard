import React from "react";
import FeedbackTable from "./FeedbackTable";

export const metadata = {
  title: "complain - Admin",
  description: "complain page for Admin",
};

export default function page() {
  return (
    <div>
      <h1>Complain</h1>
      <FeedbackTable />
    </div>
  );
}
