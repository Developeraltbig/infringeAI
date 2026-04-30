export const promptTemplates = {
  /* ---------- UPDATED: Exa highlight triage with 3 queries ------------- */
  exaHighlightTriagePrompt: (company, patentClaim) => `
You are preparing a rapid infringement triage for products of ${company}.

Query design Methodology
Write **THREE** comprehensive search strings (≤12 words each) that are most likely to surface pages describing features which map to the key elements of the patent claim shown below. 

Since you're limited to 3 queries, each must:
- Cover broader technical capabilities
- Capture multiple claim elements per query
- Use product-vernacular, never claim language
- Be highly targeted to likely infringing features

You are allowed to do up to 350-word free form brainstorming to iteratively reach the best 3 final queries and the brainstorming you can keep in the beginning before the json output. Note that the json output should not have the brainstorming in it. 

Exact JSON Format Needed:
{
  "queries":[ "...", "...", "..." ]
}

PATENT CLAIM:
${patentClaim}
`,

  /* ---------- Stage Q-1 : discovery20 - Enhanced ------------- */
  quickModeDiscovery20Prompt: (firstClaim, pcrResult, biblioData) => `
You are an elite patent infringement analyst with deep expertise in IP licensing and technology mapping. Given a patent claim and its contextual reading, you will conduct an exhaustive analysis to identify the 20 best potentially infringing products across different companies.

CRITICAL CONSTRAINT: You MUST NOT include any products from the patent assignee(s): ${biblioData?.assignees?.join(", ") || "None specified"}. Any products from these companies/entities are strictly excluded from your analysis.

INPUTS:
- Patent Claim: The exact claim language
- Patent Claim Reading: Contextual understanding from specification
- Patent Assignees to Exclude: ${biblioData?.assignees?.join(", ") || "None specified"}

YOUR MISSION: Through rigorous analysis spanning 1500+ words, systematically identify, evaluate, and select 20 products with highest infringement potential, ensuring NONE are from the patent assignee(s). For each product, provide a 5-6 word dense description capturing its key infringing aspect.

ANALYTICAL FRAMEWORK:

**PHASE 1: Deep Patent Understanding & Hypothesis Generation (300-400 words)**
First, dissect the patent claim to understand:
- Core inventive concept and technical problem solved
- Critical claim elements that define novelty
- Broadest reasonable interpretation of key terms
- Technology domain intersections (e.g., software+hardware, AI+sensors)

Generate 6-8 distinct infringement hypotheses considering:
- Direct implementations in obvious industries
- Cross-industry applications (same tech, different context)
- Embedded implementations within larger systems
- Consumer vs. enterprise variations
- Hardware vs. software vs. hybrid implementations
- Emerging technology adaptations

For each hypothesis, identify the claim elements most critical for infringement and potential product categories.

**PHASE 2: Comprehensive Product Discovery (500-600 words)**
Now, cast the widest possible net. Brainstorm 80+ specific products that could potentially infringe, including:

- Industry leaders' flagship products (EXCLUDING ${biblioData?.assignees?.join(", ") || "the assignee(s)"})
- Specialized solutions from mid-tier companies
- Components within larger systems
- Platform features that might infringe
- Both US and international companies with US market presence
- Products across all identified hypotheses
- Recent product launches and established products
- Products where infringement might be non-obvious but technically present

List actual product names with companies. Think broadly across ALL your hypotheses.

**PHASE 3: Strategic Filtering & Analysis (400-500 words)**
Apply strategic filters to identify the strongest candidates:
- Which products likely implement ALL essential claim elements?
- Which have the clearest evidence of the novel aspects?
- Which would be easiest to prove infringement for?
- Which represent the highest commercial value?
- Which span different technology implementations (for diversity)?

Consider:
- Public documentation availability
- Technical architecture alignment
- Market significance
- Company diversity (aim for multiple companies)
- Include at least 2-3 "close siblings" (similar products/approaches)

**PHASE 4: Final Selection of Top 20 with Descriptions (300-400 words)**
Select your 20 products based on:
1. **Technical alignment**: How closely does the product match ALL claim elements?
2. **Novelty coverage**: Does it clearly implement the inventive aspects?
3. **Evidence potential**: Can infringement be demonstrated with public information?
4. **Commercial significance**: Market size, revenue potential
5. **Diversity balance**: Mix of obvious and non-obvious implementations
6. **Company spread**: Prefer different companies, but include strong products from same company if warranted
7. **Non-assignee confirmation**: Product is NOT from patent assignee(s)

For each product, craft a 5-6 word description that:
- Captures the KEY infringing technical aspect
- Uses product-specific terminology
- Highlights the claim-relevant feature
- Is dense and technical, not generic

Ensure your 20 selections include:
- At least 4-6 "close siblings" with similar technical approaches
- Mix of large enterprise and specialized solutions
- Both obvious and creative implementations
- Products where evidence gathering will be feasible

After your comprehensive analysis of 1500 words which you need to give unstructured free form, then in this exact JSON format you should provide the 20 products with descriptions needed:

{
  "candidates": [
    {
      "company": "Real Company Name1",
      "product": "ProductName1",
      "description": "implements claim's X via Y feature"
    },
    {
      "company": "Real Company Name2",
      "product": "ProductName2", 
      "description": "performs patented method through Z capability"
    },
    ... (exactly 20 items - each with product name and 5-6 word technical description)
  ]
}

Note that the JSON should not include any freeform analysis in it but that's needed before the JSON itself.

PATENT CLAIM:
${firstClaim}

PCR ANALYSIS:
${JSON.stringify(pcrResult, null, 2)}
`,

  quickModeHighlightPrompt: (product, patentClaim) => `
You are a precision search specialist for patent infringement evidence gathering. Your task is to craft two optimal search queries that will surface technical documentation and implementation details for ${product}.

CRITICAL REQUIREMENTS:
- Queries must use product-specific terminology and natural language
- NO patent claim language or legal terms but the nuance of what's to be found in the product to map to the claim elements should be there
- Focus on technical features, capabilities, and implementations
- Each query should target different aspects or documentation types in a way we can comprehensively locate various evidence to map the claim to the product
- Maximum 10 words per query
- Queries should be likely to surface official docs, technical blogs, or detailed reviews

QUERY STRATEGY:
1. First query: Target core technical features/architecture
2. Second query: Target specific capabilities/implementations relevant to the patent domain

Consider searching for:
- Technical specifications and architecture
- Feature descriptions and capabilities
- Implementation details and workflows
- API documentation or developer guides
- Official product documentation
- Technical deep-dives or whitepapers

You are allowed to do up to 200-word free form brainstorming to iteratively reach the best 2 final queries and the brainstorming you can output in the beginning before the json output. Note that the json output should not have the brainstorming in it. 

Exact JSON Format Needed:
{
  "queries": [
    "specific technical search query here",
    "different angle search query here"
  ]
}

PRODUCT CONTEXT:
Product: ${product}

PATENT CLAIM (for context only - do not use claim language in queries):
${patentClaim}`,

  quickModeSelectTop5Prompt: (patentClaim, snippetsData) => `
You are a senior patent infringement analyst making final product selections based on evidence gathered. You have snippets from web searches for 20 candidate products. Your task is to analyze this evidence and select the 5 strongest infringement candidates.

**CRITICAL: Company Name Determination**
The input data may contain incorrect company names from search metadata (like author names instead of actual companies). 
IGNORE the potentially incorrect company names in the input data and use your knowledge to determine the ACTUAL company that makes each product.
For each selected product, output the REAL company name based on your knowledge, not the input data.

ANALYTICAL FRAMEWORK (Use 600 words on the analytical free form brainstorming):

**PHASE 1: Evidence Quality Assessment**
For each of the 20 products, evaluate the highlight snippets:
- Technical detail level (vague mentions vs. specific implementations)
- Relevance to claim elements (direct mapping vs. tangential)
- Source credibility (official docs vs. third-party mentions)
- Coverage completeness (how many claim elements are evidenced)

**PHASE 2: Scoring Methodology**
Assign each product a composite score (1-5) based on:
- Claim element coverage (40%): How many critical elements have evidence?
- Evidence strength (30%): How specific and technical is the evidence?
- Implementation clarity (20%): How clearly does the product implement the invention?
- Documentation quality (10%): How authoritative are the sources?

Score interpretation:
- 5: Exceptional evidence, clear implementation of all elements
- 4: Strong evidence, most elements clearly present
- 3: Moderate evidence, key elements likely present
- 2: Weak evidence, some elements possibly present
- 1: Minimal evidence, unclear implementation

**PHASE 3: Strategic Selection**
From the 20 candidates, select your final 5 based on:
1. **Highest evidence scores**: Prioritize products with strongest proof
2. **Claim coverage diversity**: Ensure different aspects of the claim are covered
3. **Company diversity**: Prefer different companies when scores are similar
4. **Evidence actionability**: Can a claim chart be built from this evidence?
5. **Commercial significance**: Tie-break using market importance

**PHASE 4: Justification Development**
For each selected product (top 5 only), craft a precise 10-15 word justification that:
- Highlights the strongest evidence found
- Maps to specific claim elements
- Indicates implementation confidence
- Avoids vague statements

After your comprehensive analytical free form brainstorming of 600 words which you need to give unstructured free form, then in this exact JSON format you should provide the 20 product names needed:

JSON FORMAT:
{
  "finalProducts": [
    { 
      "product": "ProductName1", 
      "company": "CompanyName1", 
      "avgScore": 4.5, 
      "reason": "Clear implementation of [specific elements] with documented evidence of [key technical feature]" 
    },
    { 
      "product": "ProductName2", 
      "company": "CompanyName2", 
      "avgScore": 4.3, 
      "reason": "Strong evidence showing [specific implementation] directly mapping to claim limitations X and Y" 
    },
    ... (exactly 5 items, ordered by score)
  ]
}

PATENT CLAIM:
${patentClaim}

CANDIDATE PRODUCTS WITH EVIDENCE (20 products):
${snippetsData}

REMEMBER: You are selecting the best 5 from 20 candidates. Your selections will proceed to full claim chart development. Choose products where the evidence strongly supports building a comprehensive infringement analysis. Be precise, evidence-driven, and strategic in your final selection.`,

  /* ---------- NEW: 80-word runner-up summary for interactive mode ------------- */
  runnerUpSummary80Prompt: (
    productName,
    company,
    patentClaim,
    highlightSnips,
  ) => `
Create one dense paragraph **≤80 words** describing potential infringement by ${productName} (${company}).

MANDATORY CONTENT  
- Map at least TWO claim elements to concrete product features (use product terms).  
- State ONE element that is likely **Not Present**.  
- End with Confidence tag [High|Medium|Low].  
- Include ONE https:// hyperlink (may come from highlight snippets).

Return raw text only.

PATENT CLAIM: ${patentClaim}

TOP HIGHLIGHT SNIPPETS:
${highlightSnips}
`,

  /* ---------- NEW: Product selection prompts split by company count ------------- */
  productSelectionPrompt_single: (patentData, company, prelimAnalysis) => {
    const jsonExample = {
      results: [
        {
          company,
          selectedProduct: "Winner_Product",
          otherProducts: [
            {
              product: "RunnerUp_1",
              exaScore: 4.3,
            },
            {
              product: "RunnerUp_2",
              exaScore: 4.0,
            },
          ],
        },
      ],
    };

    return `
You must choose ONE best product ("selectedProduct") **and** exactly TWO runner-ups from ${company}.

WORKFLOW  
A. Brainstorm up to **6–8** candidate products.  
B. For each candidate run the 3 Exa highlight queries (snippets are supplied).  
C. Compute mean relevance score → **exaScore** (1-5, one decimal).  
D. Rank by exaScore + technical judgement.  
E. Pick winner + two runner-ups.  

OUTPUT (JSON only, no prose):
${JSON.stringify(jsonExample, null, 2)}

Constraints  
- Do NOT mention claim language.  
- exaScore mandatory one-decimal.  

PATENT CLAIM:
${patentData.firstClaim}

PCR:
${JSON.stringify(patentData.pcrResult, null, 2)}

PRELIM ANALYSIS:
${prelimAnalysis}
`;
  },

  productSelectionPrompt_double: (
    patentData,
    selectedCompanies,
    prelimAnalysis,
  ) => {
    const jsonExample = {
      results: selectedCompanies.map((company) => ({
        company,
        selectedProduct: "Winner_Product",
        otherProducts: [
          {
            product: "RunnerUp_1",
            exaScore: 4.3,
          },
          {
            product: "RunnerUp_2",
            exaScore: 4.0,
          },
        ],
      })),
    };

    return `
You must choose ONE best product ("selectedProduct") **and** exactly TWO runner-ups for each of the two companies.

WORKFLOW  
A. For each company, brainstorm up to **6–8** candidate products.  
B. For each candidate run the 3 Exa highlight queries (snippets are supplied).  
C. Compute mean relevance score → **exaScore** (1-5, one decimal).  
D. Rank by exaScore + technical judgement.  
E. Pick winner + two runner-ups per company.  

OUTPUT (JSON only, no prose):
${JSON.stringify(jsonExample, null, 2)}

Constraints  
- Do NOT mention claim language.  
- exaScore mandatory one-decimal.  
- Every company gets exactly 3 entries (1 winner + 2 runner-ups).

PATENT CLAIM:
${patentData.firstClaim}

PCR:
${JSON.stringify(patentData.pcrResult, null, 2)}

PRELIM ANALYSIS:
${prelimAnalysis}
`;
  },

  productSelectionPrompt_triple: (
    patentData,
    selectedCompanies,
    prelimAnalysis,
  ) => {
    const jsonExample = {
      results: selectedCompanies.map((company) => ({
        company,
        selectedProduct: "Winner_Product",
        otherProducts: [
          {
            product: "RunnerUp_1",
            exaScore: 4.3,
          },
          {
            product: "RunnerUp_2",
            exaScore: 4.0,
          },
        ],
      })),
    };

    return `
You must choose ONE best product ("selectedProduct") **and** exactly TWO runner-ups for each of the three companies.

WORKFLOW  
A. For each company, brainstorm up to **6–8** candidate products.  
B. For each candidate run the 3 Exa highlight queries (snippets are supplied).  
C. Compute mean relevance score → **exaScore** (1-5, one decimal).  
D. Rank by exaScore + technical judgement.  
E. Pick winner + two runner-ups per company.  

OUTPUT (JSON only, no prose):
${JSON.stringify(jsonExample, null, 2)}

Constraints  
- Do NOT mention claim language.  
- exaScore mandatory one-decimal.  
- Every company gets exactly 3 entries (1 winner + 2 runner-ups).

PATENT CLAIM:
${patentData.firstClaim}

PCR:
${JSON.stringify(patentData.pcrResult, null, 2)}

PRELIM ANALYSIS:
${prelimAnalysis}
`;
  },

  // Helper function to select the right product selection prompt
  getProductSelectionPrompt: (
    patentData,
    selectedCompanies,
    prelimAnalysis,
  ) => {
    const companyCount = selectedCompanies.length;

    if (companyCount === 1) {
      return promptTemplates.productSelectionPrompt_single(
        patentData,
        selectedCompanies[0],
        prelimAnalysis,
      );
    } else if (companyCount === 2) {
      return promptTemplates.productSelectionPrompt_double(
        patentData,
        selectedCompanies,
        prelimAnalysis,
      );
    } else if (companyCount === 3) {
      return promptTemplates.productSelectionPrompt_triple(
        patentData,
        selectedCompanies,
        prelimAnalysis,
      );
    } else {
      throw new Error(
        `Invalid company count: ${companyCount}. Must be 1, 2, or 3.`,
      );
    }
  },

  pcrPrompt: (firstClaim, fullDescription) => `
You are my patent claim reader. You read a patent claim in a step by step way in great detail while taking relevant context from the specifications. While reading the claim, try to think what it means, what each element in claim actually means (to know this, take context from the spec). Keep on thinking about the patent claim and explain it end to end with 100% support from spec. 

Give me all the output in the following JSON format:

{
  "claimReading": [
    {
      "claimElement": "element text here",
      "specExplanation": "contextual explanation from specification here",
      "specSupport": "\\"First exact quote from spec\\" \\"Second relevant quote if needed\\" \\"Third quote if necessary\\""
    },
    {
      "claimElement": "next element text",
      "specExplanation": "its contextual explanation",
      "specSupport": "\\"Exact quote supporting this element\\" \\"Another relevant quote\\""
    }
  ]
}

CRITICAL INSTRUCTIONS:
- claimElement: Break down the claim into logical elements (preamble, each limitation, etc.)
- specExplanation: Provide your contextual understanding of what this element means based on the specification
- specSupport: Include 1-3 direct quotes from the specification that best support this claim element. Each quote should be: 
o Exactly as written in the spec (no rephrasing)
o Only 1-2 lines each (most relevant portion)
o Enclosed in double quotes
o Multiple quotes separated by spaces within the single specSupport value
o Choose the most directly relevant passages that define or describe the claim element
Make sure each claim element is captured with both its contextual explanation AND direct supporting quotes from the specification. It's very important to give the entire claim in this step by step way. Respond in 500 words but make the best use of these words. To re-iterate, our objective is to understand the patent claim in good depth using relevant context and direct evidence from the patent spec.
Take a deep breath and think step by step.

PATENT CLAIM:
${firstClaim}

---
FULL DESCRIPTION (SPECIFICATION):
${fullDescription}

---
`,

  targetCompanyPrompt: (firstClaim, pcrResult, biblioData) => `
Given the patent claim and its detailed breakdown (Patent Claim Reading), act as an expert infringement analyst. Your task is to identify the top 50 US-available companies that have the highest potential for infringement. Make sure the list of companies should not include ${biblioData.assignees}.

ANALYSIS PROCESS:
For each company, perform deep analysis:
1. Identify SPECIFIC PRODUCTS from that company that could potentially infringe
2. Focus on actual product features and capabilities, not general company outlook
3. Consider how specific product functionalities map to the patent claims
4. Think about products like: consumer devices, software applications, cloud services, hardware components, etc.

After your detailed analysis, provide ONLY a JSON response with trimmed reasoning (MAX 10 words) focusing on the most relevant product(s).

Your entire response MUST be ONLY a single, raw JSON object in the following format. Do not include any text before or after the JSON, and do not use markdown.

{
  \"targetCompanies\": [
    {
      \"name\": \"Company Name\",
      \"reasoning\": \"ProductX's specific feature for claim element (max 10 words)\"
    },
    {
      \"name\": \"Another Company\",
      \"reasoning\": \"ProductY implements claimed method via feature (max 10 words)\"
    }
  ]
}

IMPORTANT: The reasoning should mention the SPECIFIC PRODUCT NAME and its relevant feature, not general company capabilities. Keep reasoning UNDER 10 words but make it product-specific.

PATENT CLAIM: 
${firstClaim}

---
PATENT CLAIM READING (PCR):
${JSON.stringify(pcrResult, null, 2)} 

---
`,

  prelimAnalysisPrompt: (firstClaim, pcrResult) => `
Given the patent claim and patent claim reading (i.e. the understanding of patent claim in respect of spec), you will use your extensive latent knowledge space to perform few critical tasks the same way as an infringement analyst does: 1. Understand the patent claim in good technical detail with relevant context from the patent claim reading 2. Come up with 5-8 hypothesis of potentially infringing products of variety based on how the patent claim is supposed to be implemented (with help from patent claim reading). Try to make sure hypothesis are kind of distinct to each other to ensure that we cover the whole breadth and depth of product types. Also give one actual real-world example of product per hypothesis. Identify what aspect of the patent claim would be critical for infringement identification. Be concise, factual, and limit your answer in 300 words. Take a deep breath and think step by step.

PATENT CLAIM: 
${firstClaim}

---
PATENT CLAIM READING (PCR):
${JSON.stringify(pcrResult, null, 2)} 

---
`,

  infringementStorylinePrompt: (productName, patentData) => `
Given the patent claim, patent claim reading (in light of spec) and target product, you will use your extensive latent knowledge space to perform a critical task the same way as an infringement analyst does: Start brainstorming about making a one on one mapping between the patent claim elements and target product features (based on your latent knowledge about the product). While brainstorming for the mapping, go step by step for the patent claim, covering the claim elements in their entirety and the required functional or structural claim limitations. You will perform this brainstorming 3 times 1) In the first time, map the claim elements to the product features which are clearly obviously present in the product. Write the scenario or possibility related to it. Don't just say that this maps but also give the scenario in which the product is infringing, also which claim terms refer to which product feature term (like what's it called in the product documentations and since claim language can be different from product language). Also show it like a real-life use case or in a language that the product's actual user or creator may also understand. Sometimes, while infringing on a product, you may also need to remember what other products may be used in conjunction (with the main infringing product) while infringement and to make the claim mapping story work. 2) In the second time, think about the claim elements that can be mapped to any of the target product features based on a broad interpretation of the claim element (take support from patent claim reading on how to interpret the product features with the claim elements, when required, but try to map only the claim elements). If the product is potentially infringing, this is where the analysis ends and you don't need to go to step 3. If not, then go to step 3 as 3) In the third round, think about the claim elements which can't be mapped based on your latent knowledge. Here, talk about what might need further investigation or what can't look likely even with further investigation. At the end, talk about what was located, what can be broadly considered and what couldn't be located. Complete this entire analysis in 550 words but make the best use of your output tokens. Take a deep breath and think step by step.

PATENT CLAIM:
${patentData.firstClaim}
---
PATENT CLAIM READING (PCR):
${JSON.stringify(patentData.pcrResult, null, 2)}
---
TARGET PRODUCT:
${productName}
`,

  webQueriesPrompt: (productName, storyline, patentData) => `
I am giving you a patent claim and its possible infringement storyline against a target product. I want to validate this storyline as well as identify further investigation information. I need you to write 3 comprehensive semantic web queries that I can search on a semantic web browser to confirm these. 

To create the most effective queries, you will follow this step by step brainstorming (taking 500 words before ):
1. First deeply understand the patent claim and infringement storyline
2. Identify the THREE most critical aspects that need validation
3. Create one comprehensive query for each critical aspect

IMPORTANT: Since you're limited to 3 queries, each must be:
- Broader and more comprehensive than before
- Cover multiple related features in one search
- Focus on the most crucial claim elements
- Use product language, not claim language

Each query should be 8 to 12 words in length (slightly longer for comprehensiveness).

Take a deep breath and think step by step. 

You are allowed to do up to 500-word free form brainstorming to iteratively reach the best 3 final queries and the brainstorming you can keep in the beginning before the json output. Note that the json output should not have the brainstorming in it. 

Exact JSON Format Needed:
{
  "webQueries": [
    "How does...",
    "What is...",
    "Does..."
  ]
}

PATENT CLAIM:
${patentData.firstClaim}
---
INFRINGEMENT STORYLINE FOR "${productName}":
${storyline}
`,

  claimChartAPrompt: (productName, storyline, patentData) => `
As an infringement finalizer, your task is to analyse the given patent claim and infringement hypothesis against a target product. Based on the given knowledge and your common sense, you finalize infringement analysis. Some pointers on how to finalize infringement: Mapping the claim step by step, focusing on functional or structural aspects based on the claim type. For functional claims, ignore structural limitations. For structural claims, consider them. Make a minimalistic claim mapping, considering only essential elements for infringement. Infringement hypothesis may seem to talk about more than essential mapping, but we need the essential aspects only. Be aware of claim language very well, for instance, if a claim element says "A or B to be done, then if A is found and B is not found in the product, that claim element is mapping. The phrases "at least one of…", "or", "and", etc. play important role in claim interpretation. Read the patent claim like a genius infringement specialist to understand this for claim construction as per Markman hearing. Ensure the mapping follows the claim sequence and is not random. Also, while writing the mapping, write the product analysis in a descriptive and scenario type way to understand how the product could align with the claim element (depending on found, not found, or unknown). Decide which claim elements are "Found", "Not Found", or "Unknown". Be clear in your decisions. Overturn suggestions in the given hypothesis if needed to provide an honest and reasonable mapping. Provide an infringement score (HL score) as either "H" (high likelihood, novelty found, and a good amount of claim found, say more than 80%) or "L" (low likelihood, either novelty not found or major portion of claim not found) in the following JSON format at the end:
{
  "infringementScore": "H"
}
or
{
  "infringementScore": "L"
}
Keep your response concise, accurate, and factual. Limit your answer to 450 words (comprising both the brainstorming and the JSON output at the end) while making the best use of them. Take a deep breath and think step by step.

PATENT CLAIM:
${patentData.firstClaim}
---
INFRINGEMENT STORYLINE FOR "${productName}":
${storyline}
`,

  linkRelevanceFilterPrompt: (productName, patentClaim, webResults) => `
You are a patent infringement analyst tasked with filtering web search results to find only those specifically about the target product: "${productName}".

CRITICAL REQUIREMENTS:
1. Select ONLY links that are specifically about "${productName}" - not other products from the same company
2. EXCLUDE research papers, academic articles, or theoretical discussions
3. EXCLUDE generic company pages or unrelated products
4. EXCLUDE news articles that only mention the product in passing
5. PREFER official product documentation, technical specifications, user manuals, API docs, support pages

US PREFERENCE REQUIREMENTS:
6. STRONGLY PREFER US-based product pages (domains ending in .com, hosted in US, or clearly serving US market)
7. The main product page/official product documentation MUST be from a US source if available
8. Supporting evidence (technical details, API docs, support articles) can be from non-US sources if they provide better technical information
9. For identical content, always choose the US version over international versions
10. Look for indicators like: USD pricing, US addresses, "United States" mentions, .com domains, US phone numbers

HEIGHTENED QUALITY BAR:
Since we're selecting only 8 URLs, prioritize:
- Official technical documentation over marketing pages
- Deep technical content over surface-level descriptions
- Sources with specific implementation details
- Pages that directly describe claim-relevant features

INPUTS PROVIDED:
- Target Product: ${productName}
- Patent Claim: ${patentClaim}
- Web Search Results with highlights showing what content each link contains

YOUR TASK:
Analyze each search result and determine if it contains specific, actionable information about "${productName}" that could be used for patent claim mapping. With our reduced URL count, only select the HIGHEST QUALITY sources.

WEB SEARCH RESULTS:
${webResults}

You are allowed to do up to 350-word free form brainstorming to identify the best 8 links and the brainstorming you can keep in the beginning before the json output. Note that the json output should not have the brainstorming in it. 

Exact JSON Format Needed:
Return a JSON object with two arrays.  
\`selectedUrls\` **must contain exactly 8 objects**.
Set a MINIMUM relevanceScore of 7 for selection.

\`\`\`json
{
  "selectedUrls":[
    { "url":"...", "relevanceReason":"...", "relevanceScore":9, "isUSSource":true }
  ],
  "excludedUrls":[ { "url":"...", "exclusionReason":"..." } ]
}
\`\`\`

SELECTION PRIORITY (in order) - SELECT ONLY TOP 8:
1. US-based official product pages (main product info, features, specs) - Score 9-10
2. US-based technical documentation - Score 8-9
3. US-based API/Developer docs - Score 8-9
4. US-based user manuals/guides - Score 7-8
5. Non-US technical documentation (if provides unique/better technical detail) - Score 7-8
6. US-based support articles about specific features - Score 7
7. US-based technical blog posts from the company - Score 7

IMPORTANT: 
- You MUST provide exactly 8 URLs in selectedUrls
- Only select URLs with relevanceScore >= 7
- The FIRST URL should be the main US product page if available
- Quality over quantity - better to have 8 excellent sources than 10 mediocre ones
`,

  finalClaimChartPrompt: (
    patentClaim,
    infringementAnalysis,
    webResultsText,
    selectedUrls,
  ) => `
You are a senior patent infringement analyst creating a final evidence-based claim chart. You must be extremely strict about using ONLY evidence that specifically relates to the product being analyzed.

CRITICAL RULES:
1. **Product Specificity**: ONLY use evidence that explicitly mentions and describes the specific product from the infringement analysis. Do NOT use:
   - Information about different products from the same company
   - Generic company technology descriptions
   - Research papers or academic sources
   - Theoretical implementations or possibilities
   
2. **Evidence Standards**: 
   - "Found" determinations can be based on explicit statements OR reasonable inferences from product-specific evidence
   - Consider implicit evidence: if documentation shows A→B→C and the claim requires B, you can infer B exists
   - Technical implications count: if a product does X, and X necessarily requires Y, you can determine Y is present
   - If evidence is ambiguous or could refer to multiple products, mark as "Unknown"
   
3. **Source Verification**:
   - Prioritize official product documentation, manuals, technical specs
   - Use only current information about the actual product implementation
   - Marketing language can be considered if it describes specific technical features

PROVIDED INPUTS:
1. Patent Claim - The exact claim language being analyzed
2. Infringement Analysis - Preliminary analysis from Claim Chart A (identifies the specific product)
3. Web Results - Full text content from verified product-specific sources
4. Selected URLs - The 8 URLs selected as Source 1-8

YOUR TASK:
Create a claim chart where EVERY assertion is backed by product-specific evidence from the web results. Consider both explicit statements and reasonable technical inferences.

IMPORTANT: The product being analyzed is identified in the Infringement Analysis. Use ONLY evidence about that specific product.

SOURCE MAPPING:
${selectedUrls ? selectedUrls.map((url, index) => `Source ${index + 1}: ${url}`).join("\n") : "No URL mapping available"}

You are allowed to do up to 350-word free form brainstorming to think and finalize the best mapping possible which we can actually use ourselves or take inspiration from but the brainstorming you can keep in the beginning before the json output. Note that the json output should not have the brainstorming in it. 

Exact JSON Format Needed:
\`\`\`json
{
  "claimChart": [
    {
      "claimElement": "[Exact claim element text - do not paraphrase]",
      "productAnalysis": "[Describe how THIS SPECIFIC PRODUCT implements (or doesn't) this element. Include explicit evidence and reasonable inferences from the web results. Be specific about which product features map to the claim element. If no evidence found, explain what was searched for but not found.]",
      "identified": "[Found | Not Found | Unknown]",
      "supportingEvidence": "[Quote or describe evidence from web results that supports the determination, including implicit/inferential evidence. Always reference the URL by its Source number (Source 1 … Source 8) that matches its index in selectedUrls. Example: 'The product uses machine learning algorithms for prediction (see Source 3)' or 'No product-specific evidence found']",
      "sourceNumbers": [3, 8]  // Array of source numbers referenced in supportingEvidence
    }
  ],
  "infringementScore": "[H | M | L]",
  "urlMapping": {
    "1": "${selectedUrls && selectedUrls[0] ? selectedUrls[0] : ""}",
    "2": "${selectedUrls && selectedUrls[1] ? selectedUrls[1] : ""}",
    "3": "${selectedUrls && selectedUrls[2] ? selectedUrls[2] : ""}",
    "4": "${selectedUrls && selectedUrls[3] ? selectedUrls[3] : ""}",
    "5": "${selectedUrls && selectedUrls[4] ? selectedUrls[4] : ""}",
    "6": "${selectedUrls && selectedUrls[5] ? selectedUrls[5] : ""}",
    "7": "${selectedUrls && selectedUrls[6] ? selectedUrls[6] : ""}",
    "8": "${selectedUrls && selectedUrls[7] ? selectedUrls[7] : ""}"
  }
}
\`\`\`

CRITICAL: You MUST include the urlMapping object with all 8 source URLs exactly as provided above.

IDENTIFIED STATUS GUIDELINES:
- "Found": Clear evidence (explicit or reasonably inferrable) in web results that THIS product implements the element
- "Not Found": Evidence suggests the product does NOT have this element, or no evidence exists despite thorough search
- "Unknown": Insufficient product-specific information to make a determination

INFRINGEMENT SCORE GUIDELINES (THREE-TIER SYSTEM):
- "H" (High likelihood): The product appears to implement ALL key novel aspects AND >80% of claim elements are "Found"
- "M" (Medium likelihood): The product implements SOME key novel aspects AND 50-80% of claim elements are "Found", OR key novelty is found but significant elements are "Unknown"
- "L" (Low likelihood): Either the key novel aspects are NOT found OR <50% of claim elements are "Found"

Remember: While explicit evidence is preferred, reasonable technical inferences from product-specific sources are acceptable. Never extrapolate beyond what can be reasonably inferred from the specific product documentation. Always reference the URL by its Source number (Source 1 … Source 8) that matches its index in selectedUrls.

Patent claim: ${patentClaim}
Infringement Analysis (identifies the product): ${infringementAnalysis}
Web Results: ${webResultsText}
`,
};
