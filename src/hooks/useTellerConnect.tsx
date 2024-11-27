import { useEffect, useCallback } from "react";

const useTellerConnect = (applicationId: string) => {
  useEffect(() => {
    // Dynamically load the Teller Connect script
    const script = document.createElement("script");
    script.src = "https://cdn.teller.io/connect/connect.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Teller Connect after the script has loaded
      const tellerConnect = TellerConnect.setup({
        applicationId,
        products: ["verify"], // Add other products you want to use
        onInit: () => {
          console.log("Teller Connect has initialized");
        },
        onSuccess: (enrollment) => {
          console.log("User enrolled successfully", enrollment.accessToken);
          // Handle the access token or other enrollment data as needed
        },
        onExit: () => {
          console.log("User closed Teller Connect");
        },
      });

      // Store the tellerConnect instance on the window object to make it available for use in the callback
      window.tellerConnect = tellerConnect;
    };

    return () => {
      // Cleanup script when the component is unmounted
      document.body.removeChild(script);
    };
  }, [applicationId]);

  // Return the open function
  return useCallback(() => {
    if (window.tellerConnect) {
      window.tellerConnect.open();
    } else {
      console.error("Teller Connect is not initialized yet.");
    }
  }, []);
};

export default useTellerConnect;
