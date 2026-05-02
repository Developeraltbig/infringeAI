// import React, {
//   memo,
//   useState,
//   lazy,
//   Suspense,
//   useMemo,
//   useEffect,
// } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   useGetProjectStatusQuery,
//   useGetProjectDetailsQuery,
// } from "../features/api/projectApiSlice";
// import { Loader2 } from "lucide-react";
// import Stepper from "./Stepper";
// import InteractiveMappingLoader from "./interactive/InteractiveMappingLoader";
// import FinalizingLoader from "./interactive/FinalizingLoader";

// // Views
// const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
// const MappingView = lazy(() => import("./interactive/MappingView"));
// const TargetSelectionStep = lazy(
//   () => import("./interactive/TargetSelectionStep"),
// );
// const ProcessingState = lazy(() => import("../pages/ProcessingState"));
// const SuccessState = lazy(() => import("./interactive/SuccessState"));
// const FailureState = lazy(() => import("./interactive/FailureState"));

// const ProcessingWizard = memo(({ projectId: propId, onReset }) => {
//   const navigate = useNavigate();
//   const { projectId: paramId } = useParams();
//   const projectId = propId || paramId;

//   const [showTargetGrid, setShowTargetGrid] = useState(false);
//   const [isSkeletonBufferDone, setIsSkeletonBufferDone] = useState(false);

//   const {
//     data: status,
//     isError,
//     error: apiError,
//   } = useGetProjectStatusQuery(projectId, {
//     skip: !projectId,
//     pollingInterval: 2500,
//   });

//   const { data: details, isFetching: isDetailsLoading } =
//     useGetProjectDetailsQuery(projectId, {
//       skip: !projectId,
//       refetchOnMountOrArgChange: true,
//     });

//   // 2-Second Buffer timer (Created for Interactive Polish)
//   useEffect(() => {
//     const timer = setTimeout(() => setIsSkeletonBufferDone(true), 2000);
//     return () => clearTimeout(timer);
//   }, [projectId]);

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

//   if (isError || status?.status === "failed") {
//     return (
//       <FailureState
//         reason={status?.failureReason || apiError?.data?.message}
//         onClose={onReset || (() => navigate("/dashboard/projects"))}
//       />
//     );
//   }

//   if (!status)
//     return (
//       <div className="p-20 flex justify-center">
//         <Loader2 className="animate-spin text-[#ff6b00]" size={40} />
//       </div>
//     );

//   const renderContent = () => {
//     // 🛑 1. Completion check (Always first)
//     if (status.status === "completed") {
//       return (
//         <SuccessState
//           projectId={projectId}
//           data={status}
//           onClose={onReset || (() => navigate("/dashboard/projects"))}
//         />
//       );
//     }

//     // 🟢 2. QUICK & BULK BRANCH (NO SKELETON ALLOWED HERE)
//     // If mode is quick or bulk, go DIRECTLY to ProcessingState
//     if (status.mode === "quick" || status.mode === "bulk") {
//       return <ProcessingState status={status} />;
//     }

//     // 🟠 3. INTERACTIVE BRANCH (Skeleton & Mapping Loaders live here only)
//     if (status.mode === "interactive") {
//       const claimsReady = !!details?.project?.allClaims?.length;
//       const mappingReady = !!details?.project?.results?.pcrAnalysis?.length;

//       // Show Initial Skeleton (Image 1)
//       if (
//         !isSkeletonBufferDone ||
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

//       // Show Progress Loader (Image 2)
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

//       // Actual interactive views
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
//         case "finalizing":
//           return <FinalizingLoader status={status} />;
//         default:
//           return <ProcessingState status={status} />;
//       }
//     }

//     // Fallback
//     return <ProcessingState status={status} />;
//   };

//   return (
//     <div className="w-full flex flex-col items-center animate-scale-up max-w-[1400px] mx-auto px-4 pb-20">
//       {status.mode === "interactive" && status.status !== "completed" && (
//         <div className="w-full animate-fade-in mb-8">
//           <Stepper activeStep={activeStepNumber} />
//         </div>
//       )}
//       <div className="w-full">
//         <Suspense
//           fallback={
//             <div className="p-20 flex justify-center">
//               <Loader2 className="animate-spin text-[#ff6b00]" size={48} />
//             </div>
//           }
//         >
//           {renderContent()}
//         </Suspense>
//       </div>
//     </div>
//   );
// });

// export default ProcessingWizard;
import React, {
  memo,
  useState,
  lazy,
  Suspense,
  useMemo,
  useEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "./Stepper";
import InteractiveMappingLoader from "./interactive/InteractiveMappingLoader";
import FinalizingLoader from "./interactive/FinalizingLoader";

// Views
const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
const MappingView = lazy(() => import("./interactive/MappingView"));
const TargetSelectionStep = lazy(
  () => import("./interactive/TargetSelectionStep"),
);
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(() => import("./interactive/SuccessState"));
const FailureState = lazy(() => import("./interactive/FailureState"));

const ProcessingWizard = memo(({ projectId: propId, onReset }) => {
  const navigate = useNavigate();
  const { projectId: paramId } = useParams();
  const projectId = propId || paramId;

  const [showTargetGrid, setShowTargetGrid] = useState(false);
  const [isInitialBufferDone, setIsInitialBufferDone] = useState(false);

  // 1. Status Polling
  const {
    data: status,
    isError,
    error: apiError,
  } = useGetProjectStatusQuery(projectId, {
    skip: !projectId,
    pollingInterval: 2500,
  });

  // 2. Details Query - 🟢 FIX: We do NOT use isFetching to trigger loaders
  // isFetching is true every 2 seconds during polling, which causes the BLINKING.
  const { data: details, isLoading: isFirstLoad } = useGetProjectDetailsQuery(
    projectId,
    {
      skip: !projectId,
    },
  );

  // 2-Second Buffer timer (Interactive Only)
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialBufferDone(true), 2000);
    return () => clearTimeout(timer);
  }, [projectId]);

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

  if (isError || status?.status === "failed") {
    return (
      <FailureState
        reason={status?.failureReason || apiError?.data?.message}
        onClose={onReset || (() => navigate("/dashboard/projects"))}
      />
    );
  }

  if (!status)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-[#ff6b00]" size={40} />
      </div>
    );

  const renderContent = () => {
    // 🛑 1. Completion check
    if (status.status === "completed") {
      return (
        <SuccessState
          projectId={projectId}
          data={status}
          onClose={onReset || (() => navigate("/dashboard/projects"))}
        />
      );
    }

    // 🟢 2. QUICK & BULK BRANCH (The Express Lane)
    // No Skeleton logic, no isInitialBufferDone check.
    // This stops the blinking/skeleton in Quick mode.
    if (status.mode === "quick" || status.mode === "bulk") {
      return <ProcessingState status={status} />;
    }

    // 🟠 3. INTERACTIVE BRANCH
    if (status.mode === "interactive") {
      const claimsReady = !!details?.project?.allClaims?.length;
      const mappingReady = !!details?.project?.results?.pcrAnalysis?.length;

      // 🛡️ SKELETON GUARD: Only show if it's actually the start OR if data is physically missing
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

      // // 🛡️ MAPPING GUARD: Only show if data is physically missing from the cache
      // // We removed 'isFetching' here to stop the blinking.
      // if (
      //   status.currentStep === "generatingMapping" ||
      //   (status.currentStep === "targetSelection" && !mappingReady)
      // ) {
      //   return (
      //     <InteractiveMappingLoader
      //       step="mapping"
      //       patentId={status.patentId}
      //       claimNumber={status.selectedClaim?.number}
      //       status={status}
      //     />
      //   );
      // }

      // Actual interactive views
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
          return <ProcessingState status={status} />;
      }
    }

    return <ProcessingState status={status} />;
  };

  return (
    <div className="w-full flex flex-col items-center animate-scale-up max-w-[1400px] mx-auto px-4 pb-20">
      {status.mode === "interactive" && status.status !== "completed" && (
        <div className="w-full animate-fade-in mb-8">
          <Stepper activeStep={activeStepNumber} />
        </div>
      )}
      <div className="w-full">
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
    </div>
  );
});

export default ProcessingWizard;
