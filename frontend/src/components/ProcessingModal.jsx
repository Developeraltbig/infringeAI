import React, { memo, useState, lazy, Suspense, useCallback } from "react";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "./Stepper"; // 🟢 Import the new Stepper

const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
const MappingView = lazy(() => import("./interactive/MappingView"));
const TargetSelectionStep = lazy(
  () => import("./interactive/TargetSelectionStep"),
); // 👈 New Step for Image 3
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(() => import("./interactive/SuccessState"));

const ProcessingModal = memo(({ projectId, onClose }) => {
  // 1. Local sub-step state for Target Selection phase
  const [showTargetGrid, setShowTargetGrid] = useState(false);

  const { data: status } = useGetProjectStatusQuery(projectId, {
    pollingInterval: 3000,
  });
  const { data: details } = useGetProjectDetailsQuery(projectId, {
    skip:
      !projectId ||
      !["claimSelection", "targetSelection", "completed"].includes(
        status?.currentStep || status?.status,
      ),
  });

  if (!status) return null;

  const showStepper = ["claimSelection", "targetSelection"].includes(
    status.currentStep,
  );

  const renderContent = () => {
    if (status.status === "completed") {
      return (
        <SuccessState
          projectId={projectId}
          data={details?.project}
          onClose={onClose}
        />
      );
    }

    // 🔴 Handle Failure with a "Resume" option if it's just an AI glitch
    // if (status.status === "failed") {
    //   return <FailureState reason={status.failureReason} onClose={onClose} />;
    // }

    switch (status.currentStep) {
      case "claimSelection":
        return (
          <div className="flex flex-col items-center w-full">
            <Stepper activeStep={2} />
            <ClaimsStep
              projectId={projectId}
              data={details?.project}
              onProceed={() => {}}
            />
          </div>
        );

      case "targetSelection":
        // 🧠 Logic: If user hasn't clicked "Select Targets" yet, show Mapping (Image 2)
        // Otherwise, show the Company Grid (Image 3)
        return !showTargetGrid ? (
          <MappingView
            projectId={projectId}
            data={details?.project}
            onProceed={() => setShowTargetGrid(true)}
          />
        ) : (
          <TargetSelectionStep
            projectId={projectId}
            data={details?.project}
            onBack={() => setShowTargetGrid(false)}
          />
        );

      default:
        // Use Step 1 for Enter Patent/Initializing
        return (
          <div className="flex flex-col items-center w-full">
            {/* <Stepper activeStep={1} /> */}
            <ProcessingState status={status} />
          </div>
        );
    }
  };

  return (
    // <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf9f6] backdrop-blur-md p-4">
    //   <div className="w-full h-screen max-w-6xl my-auto animate-scale-up">
    //     <Suspense
    //       fallback={
    //         <Loader2
    //           className="animate-spin text-[#ff6b00] mx-auto"
    //           size={48}
    //         />
    //       }
    //     >
    //       {renderContent()}
    //     </Suspense>
    //   </div>
    // </div>

    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf9f6]/95 backdrop-blur-md p-4 custom-scrollbar">
      <div className="w-full max-w-6xl my-auto flex flex-col items-center">
        {/* 🟢 STEPPER: Hidden during processing/loading states */}
        {/* {showStepper && (
          <div className="w-full max-w-2xl mb-4 animate-fade-in">
            <Stepper
              activeStep={status.currentStep === "claimSelection" ? 2 : 3}
            />
          </div>
        )} */}

        <div className="w-full animate-scale-up">
          <Suspense
            fallback={
              <Loader2
                className="animate-spin text-[#ff6b00] mx-auto"
                size={48}
              />
            }
          >
            {renderContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
});

export default ProcessingModal;
