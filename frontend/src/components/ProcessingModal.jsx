// import React, { memo, useState, lazy, Suspense, useMemo } from "react";
// import {
//   useGetProjectStatusQuery,
//   useGetProjectDetailsQuery,
// } from "../features/api/projectApiSlice";
// import { Loader2 } from "lucide-react";
// import Stepper from "./Stepper";

// // Lazy loaded views
// const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
// const MappingView = lazy(() => import("./interactive/MappingView"));
// const TargetSelectionStep = lazy(
//   () => import("./interactive/TargetSelectionStep"),
// );
// const ProcessingState = lazy(() => import("../pages/ProcessingState"));
// const SuccessState = lazy(() => import("./interactive/SuccessState"));
// const FailureState = lazy(() => import("./interactive/FailureState")); // 🟢 Added

// const ProcessingModal = memo(({ projectId, onClose }) => {
//   // 1. Local sub-step state for Target Selection phase
//   const [showTargetGrid, setShowTargetGrid] = useState(false);

//   // 2. 🔌 API Sync
//   const { data: status, isError: isApiError } = useGetProjectStatusQuery(
//     projectId,
//     {
//       skip: !projectId,
//       pollingInterval: 3000,
//     },
//   );

//   const { data: details } = useGetProjectDetailsQuery(projectId, {
//     skip:
//       !projectId ||
//       !["claimSelection", "targetSelection", "completed"].includes(
//         status?.currentStep || status?.status,
//       ),
//   });

//   // 3. 🧠 Logic: UI Decision Making
//   const isFailed = useMemo(
//     () => status?.status === "failed" || isApiError,
//     [status, isApiError],
//   );
//   const isComplete = useMemo(() => status?.status === "completed", [status]);

//   if (!status) return null;

//   const renderContent = () => {
//     // 🔴 Handle Failure First
//     if (isFailed) {
//       return (
//         <FailureState
//           reason={status?.error || status?.failureReason || "Connection Error"}
//           onClose={onClose}
//         />
//       );
//     }

//     // 🟢 Handle Completion
//     if (isComplete) {
//       return (
//         <SuccessState
//           projectId={projectId}
//           data={details?.project}
//           onClose={onClose}
//         />
//       );
//     }

//     // 🟠 Handle Active Steps
//     switch (status.currentStep) {
//       case "claimSelection":
//         return (
//           <div className="flex flex-col items-center w-full">
//             <Stepper activeStep={2} />
//             <ClaimsStep
//               projectId={projectId}
//               data={details?.project}
//               onProceed={() => {}}
//             />
//           </div>
//         );

//       case "targetSelection":
//         // Logic: Switch between Mapping UI and 50 Company Grid UI
//         return !showTargetGrid ? (
//           <MappingView
//             projectId={projectId}
//             data={details?.project}
//             onProceed={() => setShowTargetGrid(true)}
//           />
//         ) : (
//           <TargetSelectionStep
//             projectId={projectId}
//             data={details?.project}
//             onBack={() => setShowTargetGrid(false)}
//           />
//         );

//       default:
//         // Processing Loader (Image 2 style)
//         return <ProcessingState status={status} />;
//     }
//   };

//   return (
//     // <div className="fixed inset-1  z-[99] flex items-center justify-center bg-[#faf9f6] overflow-y-auto custom-scroller backdrop-blur-md p-4 ">
//     //   <div className="max-w-6xl  flex flex-col items-center justify-center">
//     //     {/* 🚀 Main Content Wrapper with Animation */}
//     //     <div className="w-full animate-scale-up">
//     //       <Suspense
//     //         fallback={
//     //           <div className="p-20 flex flex-col items-center justify-center bg-white rounded-[45px] shadow-xl border border-gray-100">
//     //             <Loader2
//     //               className="animate-spin text-[#ff6b00] mb-4"
//     //               size={48}
//     //             />
//     //             <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
//     //               Assembling Intelligence...
//     //             </span>
//     //           </div>
//     //         }
//     //       >
//     //         {/*
//     //            Wrapping in a card here ensures that during Lazy Loading,
//     //            the UI doesn't look transparent or broken.
//     //         */}
//     //         <div className="bg-white rounded-[15px]  border border-gray-100 ">
//     //           {renderContent()}
//     //         </div>
//     //       </Suspense>
//     //     </div>
//     //   </div>
//     // </div>

//     <div className="w-full flex flex-col items-center animate-fade-in">
//       <Suspense fallback={<Loader2 className="animate-spin text-[#ff6b00]" />}>
//         {renderContent()}
//       </Suspense>
//     </div>
//   );
// });

// export default ProcessingModal;

import React, { memo, useState, lazy, Suspense, useMemo } from "react";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "../components/Stepper";

const ClaimsStep = lazy(() => import("../components/interactive/ClaimsStep"));
const MappingView = lazy(() => import("../components/interactive/MappingView"));
const TargetSelectionStep = lazy(
  () => import("../components/interactive/TargetSelectionStep"),
);
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(
  () => import("../components/interactive/SuccessState"),
);
const FailureState = lazy(
  () => import("../components/interactive/FailureState"),
);

const ProcessingModal = memo(({ projectId, onClose }) => {
  const [showTargetGrid, setShowTargetGrid] = useState(false);

  const { data: status, isError } = useGetProjectStatusQuery(projectId, {
    pollingInterval: 3000,
  });
  const { data: details } = useGetProjectDetailsQuery(projectId, {
    skip:
      !projectId ||
      !["claimSelection", "targetSelection", "completed"].includes(
        status?.currentStep || status?.status,
      ),
  });

  if (!status)
    return (
      <div className="p-20 text-center text-gray-400">Loading state...</div>
    );

  const renderContent = () => {
    if (status.status === "failed" || isError)
      return <FailureState reason={status?.failureReason} onClose={onClose} />;
    if (status.status === "completed")
      return (
        <SuccessState
          projectId={projectId}
          data={details?.project}
          onClose={onClose}
        />
      );

    switch (status.currentStep) {
      case "claimSelection":
        return (
          <div className="flex flex-col gap-6">
            <Stepper activeStep={2} />
            <ClaimsStep
              projectId={projectId}
              data={details?.project}
              onProceed={() => {}}
            />
          </div>
        );
      case "targetSelection":
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
        return <ProcessingState status={status} />;
    }
  };

  return (
    /* 🟢 THE FIX: Standard width, no fixed overlay. Respects Dashboard padding. */
    <div className="w-full flex flex-col items-center">
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
