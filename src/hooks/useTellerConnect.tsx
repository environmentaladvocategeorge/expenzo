import { useEffect, useCallback } from "react";

declare global {
  interface Window {
    tellerConnect?: any;
  }
}

const useTellerConnect = (applicationId: string) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.teller.io/connect/connect.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const tellerConnect = (window as any).TellerConnect?.setup({
        applicationId,
        products: ["verify"],
        onInit: () => {
          console.log("Teller Connect has initialized");
        },
        onSuccess: (enrollment: any) => {
          console.log("User enrolled successfully", enrollment);
        },
        onExit: () => {
          console.log("User closed Teller Connect");
        },
      });

      window.tellerConnect = tellerConnect;
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [applicationId]);

  return useCallback(() => {
    if (window.tellerConnect) {
      window.tellerConnect.open();
    } else {
      console.error("Teller Connect is not initialized yet.");
    }
  }, []);
};

export default useTellerConnect;
