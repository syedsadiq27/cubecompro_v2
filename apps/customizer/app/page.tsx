import { Suspense } from "react";
import { CustomizerLoader } from "@repo/customizer-ui";
import { CustomizerApp } from "@/components/customizer-app";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="relative h-dvh w-full bg-[#ded9d9]">
          <CustomizerLoader label="Starting customizer…" />
        </div>
      }
    >
      <CustomizerApp />
    </Suspense>
  );
}
