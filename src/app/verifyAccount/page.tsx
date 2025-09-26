import VerifyAccount from "@/components/verify-account/Verify_Account";
import React, { Suspense } from "react";

export default function VerifyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      }
    >
      <VerifyAccount />
    </Suspense>
  );
}
