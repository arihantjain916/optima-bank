// "use client";
// import { Suspense } from "react";
// import { OtpPage } from "@/components/mfa/OtpPage";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function OtpHome() {
//   const params = useSearchParams();
//   const [response, setResponse] = useState("");

//   useEffect(() => {
//     const responseParam = params.get("email");
//     if (responseParam) {
//       const decodedResponse = decodeURIComponent(responseParam);
//       setResponse(decodedResponse);
//     }
//   }, [params]);

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <OtpPage email={response} />
//     </Suspense>
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OtpPage } from "@/components/mfa/OtpPage";

export default function OtpHome() {
  const params = useSearchParams();
  const responseParam = params.get("email");
  if (!responseParam) return <p>Invalid verification request.</p>;
  const decodedResponse = decodeURIComponent(responseParam);
  return (
    <Suspense>
      <OtpPage email={decodedResponse!} />
    </Suspense>
  );
}
