import { useAuth } from "@/contexts/AuthenticationContext";
import { createAccount } from "@/services/accountService";
import { useEffect, useCallback } from "react";

declare global {
  interface Window {
    tellerConnect?: any;
  }
}

const useTellerConnect = (applicationId: string) => {
  const { user, getToken } = useAuth();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.teller.io/connect/connect.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const tellerConnect = (window as any).TellerConnect?.setup({
        applicationId,
        products: ["verify"],
        onSuccess: async (data: any) => {
          const accountLinkRequest = {
            provider: "Teller",
            provider_id: data.accessToken,
            entity_data: {
              enrollment_id: data.enrollment.id,
              institution_id: data.enrollment.institution.id,
              institution_name: data.enrollment.institution.name,
            },
            metadata: {
              user_id: data.user.id,
              signatures: data.signatures,
            },
          };

          try {
            await createAccount(accountLinkRequest, getToken);
          } catch (error) {
            console.error("Error creating account:", error);
          }
        },
      });

      window.tellerConnect = tellerConnect;
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [applicationId, user]);

  return useCallback(() => {
    if (window.tellerConnect) {
      window.tellerConnect.open();
    } else {
      console.error("Teller Connect is not initialized yet.");
    }
  }, []);
};

export default useTellerConnect;
