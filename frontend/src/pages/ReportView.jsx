import React, { useMemo, useState } from "react";
import { ChevronDown, Check, X, Navigation } from "lucide-react";
import { useGetProjectDetailsQuery } from "../features/api/patentApiSlice";

// --- Custom Orange Document Icon SVG ---
const DocIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#ff6b00"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 2V8H20L14 2Z"
      fill="#e66000"
    />
  </svg>
);

// --- Mock Data ---
const reportData = {
  header: {
    patentId: "US6324534B1",
    company: "Alphabet Inc",
    product: "Vertex AI Search",
  },
  tabs: [
    { id: 1, label: "ALPHABET INC:Vertex AI Search", active: true },
    { id: 2, label: "AMAZON.COM, INC.Amazon Product Search", active: false },
    {
      id: 3,
      label: "MICROSOFT CORPORATIONMicrosoft SharePoint Search",
      active: false,
    },
  ],
  // NEW: Mock data for the collapsible section
  otherProducts: [
    {
      id: 1,
      title: "Specification Explanation",
      description:
        "Google Cloud Search Potentially Infringes By Designating A Plurality Of Subsets Via Its Configurable Data Sources (E.G., Drive, Third-Party Apps) And Inputting A Search String Through Its Search UI. However, Infringement Is Unlikely As The Platform Probably Lacks The Claimed Search Hierarchy That Terminat[Es] Upon Finding A Match. Instead, It Likely Uses Parallel Federated Search Across Sources, As Seen In Systems That Search Multiple Https://Www.Elastic.Co/Docs/Manage-Data/Data-Store/Aliases. [Low]",
    },
    {
      id: 2,
      title: "Google Shopping",
      description:
        "Google Shopping Potentially Infringes By Designating Subsets Of Data. Such As Its Product **Indices** And Merchant **Feeds**, And Forming A Search Hierarchy By First Querying Product Titles (First Strategy) Then Descriptions (Second Strategy). A User's Search String Executes This Process. However, The Element Of Terminating Said Search Hierarchy Upon Finding Said At Least One Match Is Likely Not Present, As Google Provides Comprehensive Results, Not Just The First Match Found. Https://Www.Elastic.Co/Guide/En/Elasticsearch/Reference/Current/Searchmultiple-Indices.Html [High]",
    },
  ],
  claimElements: [
    {
      id: 1,
      claimText:
        "designating a plurality of subsets of data records in a database;",
      analysis:
        "Vertex AI Search Allows A User To Create Multiple 'data Stores' Which Function As Designated Subsets Of Data. A Single Search 'app' Can Be Connected To Multiple Data Stores, Enabling What The Documentation Calls 'blended Search'. Each Data Store Can Contain Different Types Of Data (E.G., Website, Structured, Unstructured), Effectively Creating Distinct Subsets Within The Overall Database Accessible To An Application.",
      evidence:
        "The Product Documentation States, 'Custom Search Apps Have A Many-To-Many Relationship With Data Stores. When Multiple Data Stores Are Connected To A Single Custom Search App, This Is Referred To As _blended Search_.' (Source 3). This Explicitly Confirms The Ability To Designate And Use A Plurality Of Data Subsets (Data Stores) Within A Single Application Context.",
      status: "Found",
      sources: [{ name: "Source 3:", url: "Https://Cloud.Google.Com/" }],
    },
    {
      id: 2,
      claimText:
        "designating at least a first and a second search strategy, wherein each search strategy comprises a search methodology preselected to operate upon at least one of the plurality of subsets to search for at least one match;",
      analysis:
        "A User Can Designate Different Search Strategies By Configuring Each Data Store (Subset) With A Unique Search Methodology. This Methodology Is Defined By Settings Such As Which Fields Are 'Indexable' Or 'Searchable' (Source 6), And By Applying Specific Filtering And Boosting Rules (Source 7). For Example, A First Strategy Could Be An API Call To A Data Store With Specific Boosting Rules, And A Second Strategy Could Be An API Call To A Different Data Store With Different Filtering Applied. The Methodology Is 'preselected' When The Data Store Is Configured.",
      evidence:
        "Vertex AI Search Allows Configuration Of Fields As 'Indexable' And 'Searchable' To Control Recall (Source 6). Furthermore, It 'provides A Flexible Filter Expression Syntax To Meet These Filtering And Boosting Requirements' (Source 7). A Feature Request Also Mentions The Underlying API Supports 'boost_spec' To 'influence Search Results' (Source 8). By Configuring Two Different Data Stores With Unique Settings, A User Designates Two Distinct Search Strategies.",
      status: "Found",
      sources: [
        { name: "Source 6:", url: "Https://Cloud.Google.Com/" },
        { name: "Source 7:", url: "Https://Cloud.Google.Com/" },
        { name: "Source 8:", url: "Https://Github.Com/" },
      ],
    },
  ],
};

const ReportView = () => {
  // NEW: State to manage the open/closed status of the accordion
  const [isOtherProductsOpen, setIsOtherProductsOpen] = useState(false);

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 p-4 animate-fade-in pb-20">
      {/* 1. Top Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">
          Patent Infringement Claim Chart
        </h1>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <DocIcon /> {reportData.header.patentId}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <DocIcon /> {reportData.header.company}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <DocIcon /> {reportData.header.product}
          </div>
        </div>
      </div>

      {/* 2. Target Selection Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 overflow-x-auto hide-scrollbar">
        {reportData.tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-full border whitespace-nowrap cursor-pointer transition-colors text-[11px] font-semibold tracking-wider uppercase ${
              tab.active
                ? "bg-[#fff5eb] border-[#ff6b00] text-gray-800"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {tab.label}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                tab.active ? "bg-orange-100" : "bg-red-50"
              }`}
            >
              {tab.active ? (
                <Check size={10} className="text-[#ff6b00]" strokeWidth={4} />
              ) : (
                <X size={10} className="text-red-500" strokeWidth={4} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Collapsible Accordion Container */}
      <div className="flex flex-col shadow-sm rounded-xl border border-gray-100">
        {/* Accordion Header (Clickable) */}
        <div
          onClick={() => setIsOtherProductsOpen(!isOtherProductsOpen)}
          className={`bg-white p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${
            isOtherProductsOpen
              ? "rounded-t-xl border-b border-gray-100"
              : "rounded-xl"
          }`}
        >
          <h3 className="text-[15px] font-bold text-gray-900">
            Other Alphabet Inc. Products Analysed (
            {reportData.otherProducts.length})
          </h3>
          <ChevronDown
            size={20}
            className={`text-gray-900 transition-transform duration-300 ${isOtherProductsOpen ? "rotate-180" : ""}`}
            strokeWidth={2.5}
          />
        </div>

        {/* Accordion Expanded Body */}
        {isOtherProductsOpen && (
          <div className="bg-[#fcfcfc] rounded-b-xl flex flex-col divide-y divide-gray-100/50">
            {reportData.otherProducts.map((product) => (
              <div key={product.id} className="p-6 md:p-8 flex flex-col gap-3">
                {/* Stylized Number */}
                <span
                  className="text-3xl font-light text-[#ffb076] leading-none select-none mb-1"
                  style={{ fontFamily: "serif" }}
                >
                  {product.id}
                </span>

                {/* Title */}
                <h4 className="text-[14px] font-bold text-gray-900">
                  {product.title}
                </h4>

                {/* Description */}
                <p className="text-[13.5px] text-gray-500 leading-relaxed mb-1">
                  {product.description}
                </p>

                {/* Link */}
                <button className="text-[13.5px] font-bold text-gray-900 text-left hover:underline w-fit">
                  View Product Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Main Claim Chart Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col mt-2">
        {/* Chart Header (Orange) */}
        <div className="bg-[#ff6b00] px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium tracking-wide">
            Vertex AI Search
          </h2>
          <div className="border border-white/30 px-4 py-1.5 rounded text-white text-sm font-medium">
            High Likelihood
          </div>
        </div>

        {/* Chart Body (Rows) */}
        <div className="flex flex-col p-6 gap-6 bg-[#fafbfc]">
          {reportData.claimElements.map((row, index) => (
            <div
              key={row.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 ${
                index !== reportData.claimElements.length - 1
                  ? "border-b border-gray-200/60"
                  : ""
              }`}
            >
              <div className="lg:col-span-3">
                <p className="text-[14px] font-semibold text-gray-900 leading-relaxed">
                  {row.claimText}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-2">
                {index === 0 && (
                  <span className="text-[13px] font-bold text-gray-900 mb-1">
                    Product Analysis
                  </span>
                )}
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {row.analysis}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-2">
                {index === 0 && (
                  <span className="text-[13px] font-bold text-gray-900 mb-1">
                    Evidence
                  </span>
                )}
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                  {row.evidence}
                </p>

                <div className="bg-[#fffcf7] border border-[#ffeed3] rounded-xl p-5 flex flex-col gap-3 mt-auto">
                  <span className="text-[12px] font-bold text-gray-800">
                    Referenced Sources:
                  </span>
                  <div className="flex flex-col gap-2">
                    {row.sources.map((source, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white border border-gray-100 rounded flex items-center justify-between p-2 shadow-sm"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-[12px] font-medium text-gray-700 whitespace-nowrap">
                            {source.name}
                          </span>
                          <span className="text-[12px] text-gray-400 truncate">
                            {source.url}
                          </span>
                        </div>
                        <button className="text-[#ff6b00] hover:text-orange-700 p-1 shrink-0">
                          <Navigation size={14} className="rotate-45" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 flex flex-col gap-2">
                {index === 0 && (
                  <span className="text-[13px] font-bold text-gray-900 mb-1">
                    Status
                  </span>
                )}
                <div className="bg-white border border-gray-200 rounded px-4 py-2 text-[13px] text-gray-700 text-center shadow-sm w-fit lg:w-full">
                  {row.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportView;
