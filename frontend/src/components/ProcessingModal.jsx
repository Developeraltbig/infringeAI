// import React, {
//   memo,
//   useState,
//   lazy,
//   Suspense,
//   useEffect,
//   useMemo,
// } from "react";
// import {
//   useGetProjectStatusQuery,
//   useGetProjectDetailsQuery,
// } from "../features/api/projectApiSlice";
// import { Loader2 } from "lucide-react";
// import Stepper from "../components/Stepper";
// import InteractiveMappingLoader from "./interactive/InteractiveMappingLoader";
// import FinalizingLoader from "./interactive/FinalizingLoader";
// import ProcessingState from "../pages/ProcessingState";

// // Lazy views
// const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
// const MappingView = lazy(() => import("./interactive/MappingView"));
// const TargetSelectionStep = lazy(
//   () => import("./interactive/TargetSelectionStep"),
// );
// const SuccessState = lazy(() => import("./interactive/SuccessState"));
// const FailureState = lazy(() => import("./interactive/FailureState"));

// const ProcessingModal = memo(({ projectId, onClose }) => {
//   const [showTargetGrid, setShowTargetGrid] = useState(false);
//   const [isInitialBufferDone, setIsInitialBufferDone] = useState(false);

//   // 1. Polling and Data fetching
//   const { data: status, isError } = useGetProjectStatusQuery(projectId, {
//     pollingInterval: 2000,
//   });
//   const { data: details, refetch: refetchDetails } = useGetProjectDetailsQuery(
//     projectId,
//     {
//       skip: !projectId,
//       refetchOnMountOrArgChange: true,
//     },
//   );

//   // 2. Step Mapper for Interactive Stepper
//   const activeStepNumber = useMemo(() => {
//     if (!status || status.mode !== "interactive") return 1;
//     const stepMap = {
//       initializing: 1,
//       claimSelection: 2,
//       generatingMapping: 3,
//       targetSelection: 4,
//       productProcessing: 5,
//       finalizing: 5,
//     };
//     return stepMap[status.currentStep] || 2;
//   }, [status]);

//   // 3. 2-Second Visual Buffer (Interactive Only)
//   useEffect(() => {
//     setIsInitialBufferDone(false);
//     const timer = setTimeout(() => setIsInitialBufferDone(true), 2000);
//     return () => clearTimeout(timer);
//   }, [projectId]);

//   useEffect(() => {
//     if (status?.currentStep) refetchDetails();
//   }, [status?.currentStep, refetchDetails]);

//   if (!status)
//     return (
//       <div className="p-20 flex justify-center">
//         <Loader2 className="animate-spin text-[#ff6b00]" size={40} />
//       </div>
//     );

//   const renderContent = () => {
//     // 🛑 TERMINAL STATES
//     if (status.status === "failed" || isError)
//       return <FailureState reason={status?.failureReason} onClose={onClose} />;
//     if (status.status === "completed")
//       return (
//         <SuccessState projectId={projectId} data={status} onClose={onClose} />
//       );

//     // 🟢 BRANCH 1: QUICK & BULK MODE
//     // We exit early here. No skeletons, no buffers, no interactive loaders.
//     if (status.mode === "quick" || status.mode === "bulk") {
//       return <ProcessingState status={status} />;
//     }

//     // 🟠 BRANCH 2: INTERACTIVE MODE (Skeleton and Mapping Guards live here)
//     if (status.mode === "interactive") {
//       const claimsReady = !!details?.project?.allClaims?.length;
//       const mappingReady = !!details?.project?.results?.pcrAnalysis?.length;

//       // 🛡️ Guard A: Initial Skeleton (Image 1)
//       if (
//         !isInitialBufferDone ||
//         status.currentStep === "initializing" ||
//         (status.currentStep === "claimSelection" && !claimsReady)
//       ) {
//         return (
//           <InteractiveMappingLoader
//             step="initializing"
//             patentId={status.patentId}
//             status={status}
//           />
//         );
//       }

//       // 🛡️ Guard B: Mapping Progress (Image 3)
//       if (
//         status.currentStep === "generatingMapping" ||
//         (status.currentStep === "targetSelection" && !mappingReady)
//       ) {
//         return (
//           <InteractiveMappingLoader
//             step="mapping"
//             patentId={status.patentId}
//             claimNumber={status.selectedClaim?.number}
//             status={status}
//           />
//         );
//       }

//       // Routing for Interactive Steps
//       switch (status.currentStep) {
//         case "claimSelection":
//           return (
//             <ClaimsStep
//               projectId={projectId}
//               data={details?.project}
//               onProceed={() => {}}
//             />
//           );
//         case "targetSelection":
//           return !showTargetGrid ? (
//             <MappingView
//               data={details?.project}
//               onProceed={() => setShowTargetGrid(true)}
//             />
//           ) : (
//             <TargetSelectionStep
//               projectId={projectId}
//               data={details?.project}
//               onBack={() => setShowTargetGrid(false)}
//             />
//           );
//         case "productProcessing":
//           return <FinalizingLoader status={status} />;
//         case "finalizing":
//           return <FinalizingLoader status={status} />;
//         default:
//           return (
//             <InteractiveMappingLoader
//               step="mapping"
//               patentId={status.patentId}
//               status={status}
//             />
//           );
//       }
//     }

//     return <ProcessingState status={status} />;
//   };

//   return (
//     <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto px-4 pb-20">
//       {/* Show Stepper ONLY for Interactive mode */}
//       {status.mode === "interactive" && status.status !== "completed" && (
//         <div className="w-full animate-fade-in mb-8">
//           <Stepper activeStep={activeStepNumber} />
//         </div>
//       )}

//       <Suspense
//         fallback={
//           <div className="p-20 flex justify-center">
//             <Loader2 className="animate-spin text-[#ff6b00]" size={48} />
//           </div>
//         }
//       >
//         {renderContent()}
//       </Suspense>
//     </div>
//   );
// });

// export default ProcessingModal;
import React, {
  memo,
  useState,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "../components/Stepper";
import InteractiveMappingLoader from "./interactive/InteractiveMappingLoader";
import FinalizingLoader from "./interactive/FinalizingLoader";
import ProcessingState from "../pages/ProcessingState";

// Lazy loaded views for code splitting
const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
const MappingView = lazy(() => import("./interactive/MappingView"));
const TargetSelectionStep = lazy(
  () => import("./interactive/TargetSelectionStep"),
);
const SuccessState = lazy(() => import("./interactive/SuccessState"));
const FailureState = lazy(() => import("./interactive/FailureState"));

const ProcessingModal = memo(({ projectId, onClose }) => {
  const [showTargetGrid, setShowTargetGrid] = useState(false);
  const [isInitialBufferDone, setIsInitialBufferDone] = useState(false);

  // 🟢 Track last step to prevent infinite refetch loops
  const lastStepRef = useRef("");

  // 1. Status Polling (Every 3 seconds)
  const { data: status, isError } = useGetProjectStatusQuery(projectId, {
    pollingInterval: 3000,
  });

  // 2. Details Query - Destructure isFetching as isDetailsLoading
  const {
    data: details,
    refetch: refetchDetails,
    isFetching: isDetailsLoading,
  } = useGetProjectDetailsQuery(projectId, {
    skip: !projectId,
  });

  // 🟢 3. STEP MAPPER: Directs the Stepper circle highlighting
  const activeStepNumber = useMemo(() => {
    if (!status || status.mode !== "interactive") return 1;
    const stepMap = {
      initializing: 1,
      claimSelection: 2,
      generatingMapping: 3,
      targetSelection: 4,
      productProcessing: 5,
      finalizing: 5,
    };
    return stepMap[status.currentStep] || 2;
  }, [status]);

  // 4. Initial 2-Second skeleton buffer timer
  useEffect(() => {
    setIsInitialBufferDone(false);
    const timer = setTimeout(() => setIsInitialBufferDone(true), 2000);
    return () => clearTimeout(timer);
  }, [projectId]);

  // 🟢 5. STABILITY FIX: Trigger refetch only when backend step actually moves forward
  useEffect(() => {
    if (status?.currentStep && status.currentStep !== lastStepRef.current) {
      refetchDetails();
      lastStepRef.current = status.currentStep;
    }
  }, [status?.currentStep, refetchDetails]);

  if (!status)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-[#ff6b00]" size={40} />
      </div>
    );

  const renderContent = () => {
    // 🛑 TERMINAL STATES (Fail/Success)
    if (status.status === "failed" || isError)
      return <FailureState reason={status?.failureReason} onClose={onClose} />;

    if (status.status === "completed")
      return (
        <SuccessState projectId={projectId} data={status} onClose={onClose} />
      );

    // 🟢 BRANCH 1: QUICK & BULK (Direct to Processing Modal)
    if (status.mode === "quick" || status.mode === "bulk") {
      return <ProcessingState status={status} />;
    }

    // 🟠 BRANCH 2: INTERACTIVE (With specific loaders)
    if (status.mode === "interactive") {
      const claimsReady = !!details?.project?.allClaims?.length;
      const mappingReady = !!details?.project?.results?.pcrAnalysis?.length;

      // 🛡️ Guard A: Initial Skeleton (Step 2 Prep)
      if (
        !isInitialBufferDone ||
        status.currentStep === "initializing" ||
        (status.currentStep === "claimSelection" && !claimsReady)
      ) {
        return (
          <InteractiveMappingLoader
            step="initializing"
            patentId={status.patentId}
            status={status}
          />
        );
      }

      // 🛡️ Guard B: Mapping Progress (Step 3/4 Transition)
      // Checks both data presence AND if the network is currently fetching
      if (
        status.currentStep === "generatingMapping" ||
        (status.currentStep === "targetSelection" &&
          (!mappingReady || isDetailsLoading))
      ) {
        return (
          <InteractiveMappingLoader
            step="mapping"
            patentId={status.patentId}
            claimNumber={
              status.selectedClaim?.number ||
              details?.project?.selectedClaim?.number
            }
            status={status}
          />
        );
      }

      // 🚀 MAIN WORKFLOW ROUTING
      switch (status.currentStep) {
        case "claimSelection":
          return (
            <ClaimsStep
              projectId={projectId}
              data={details?.project}
              onProceed={() => {}}
            />
          );

        case "targetSelection":
          return !showTargetGrid ? (
            <MappingView
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

        case "productProcessing":
        case "finalizing":
          return <FinalizingLoader status={status} />;

        default:
          return (
            <InteractiveMappingLoader
              step="mapping"
              patentId={status.patentId}
              status={status}
            />
          );
      }
    }

    return <ProcessingState status={status} />;
  };

  return (
    <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto px-4 pb-20">
      {/* 🟢 GLOBAL PERSISTENT STEPPER */}
      {status.mode === "interactive" && status.status !== "completed" && (
        <div className="w-full animate-fade-in mb-8">
          <Stepper activeStep={activeStepNumber} />
        </div>
      )}

      {/* Dynamic View Area */}
      <Suspense
        fallback={
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-[#ff6b00]" size={48} />
          </div>
        }
      >
        {renderContent()}
      </Suspense>
    </div>
  );
});

export default ProcessingModal;
