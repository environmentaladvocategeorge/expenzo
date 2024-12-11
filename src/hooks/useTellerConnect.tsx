import { createAccount } from "@/services/accountService";
import { useEffect, useCallback } from "react";

declare global {
  interface Window {
    tellerConnect?: any;
  }
}

const useTellerConnect = (applicationId: string, getToken: any) => {
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
        onSuccess: async (enrollment: any) => {
          console.log("User enrolled successfully", enrollment);

          const accountLinkRequest = {
            provider: "Teller",
            provider_id: enrollment.accessToken,
            entity_data: {
              enrollment_id: enrollment.id,
              institution_id: enrollment.institution.id,
              institution_name: enrollment.institution.name,
            },
            metadata: {
              user_id: enrollment.user.id,
              signatures: enrollment.signatures,
            },
          };

          try {
            const data = await createAccount(accountLinkRequest, getToken);
            console.log("Account created successfully:", data);
          } catch (error) {
            console.error("Error creating account:", error);
          }
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
