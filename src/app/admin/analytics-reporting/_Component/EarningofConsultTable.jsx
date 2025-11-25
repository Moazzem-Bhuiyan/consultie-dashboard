import { Table } from "antd";

export default function EarningofConsultTable() {
  const data = Array.from({ length: 10 }).map((_, inx) => ({
    key: inx + 1,
    consultantName: `Consultant ${inx + 1}`,
    totalEarnings: `$${(inx + 1) * 1000}`,
    completedProjects: Math.floor(Math.random() * 50) + 1,
    rating: (Math.random() * 5).toFixed(1),
    dataIndex: "status",
    status: inx % 2 === 0 ? "Recived" : "Pending",
    email: "consultant" + (inx + 1) + "@example.com",
    client: `Client ${Math.floor(Math.random() * 100) + 1}`,
  }));
  const columns = [
    {
      title: "Consultant Name",
      dataIndex: "consultantName",
      key: "consultantName",
    },
    {
      title: "Status",
      dataIndex: "status",
    },

    // {
    //   title: "Completed Projects",
    //   dataIndex: "completedProjects",
    //   key: "completedProjects",
    // },
    {
      title: "Client",
      dataIndex: "client",
      key: "rating",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Total Earnings",
      dataIndex: "totalEarnings",
      key: "totalEarnings",
    },
    // {
    //   title: "Rating",
    //   dataIndex: "rating",
    //   key: "rating",
    // },
  ];
  return (
    <div>
      {/* Table Section */}
      <div className="w-full space-y-5 rounded-xl border bg-white p-6 shadow-lg xl:w-full">
        <h1 className="text-xl">Recent Earnings of consultants</h1>
        <Table dataSource={data} columns={columns} pagination={false} />
      </div>
    </div>
  );
}
