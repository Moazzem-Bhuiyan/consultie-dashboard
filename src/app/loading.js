import { ConfigProvider } from "antd";
import { Spin } from "antd";

export default function loading() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1b71a7",
        },
      }}
    >
      <div className="flex-center h-[75vh]">
        <Spin size="large" />
      </div>
    </ConfigProvider>
  );
}
