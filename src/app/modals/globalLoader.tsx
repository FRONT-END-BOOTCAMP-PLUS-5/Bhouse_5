'use client';

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const GlobalLoader: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}>
      <div className="spinner"></div>
    </div>
  );
};

export default GlobalLoader;
