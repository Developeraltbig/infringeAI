import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";

export const generateDocx = async (project) => {
  const cleanId = project.patentId?.replace(/^patent\/|\/en$/gi, "") || "N/A";

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // --- Header Title ---
          new Paragraph({
            text: "PATENT INFRINGEMENT ANALYSIS REPORT",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // --- Patent Info Table ---
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: "Patent ID", bold: true }),
                    ],
                  }),
                  new TableCell({ children: [new Paragraph(cleanId)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: "Analysis Date", bold: true }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph(new Date().toLocaleDateString())],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { before: 400 } }),

          // --- Loop through AI Results ---
          ...project.results.finalClaimChart.flatMap((item) => [
            new Paragraph({
              text: `PRODUCT: ${item.productName}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Likelihood: ", bold: true }),
                new TextRun({
                  text: item.infringementScore === "H" ? "High" : "Moderate",
                  color: "FF6B00",
                  bold: true,
                }),
              ],
              spacing: { after: 200 },
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                // Table Header
                new TableRow({
                  tableHeader: true,
                  children: [
                    new TableCell({
                      shading: { fill: "FF6B00" },
                      children: [
                        new Paragraph({
                          text: "Claim Element",
                          bold: true,
                          color: "FFFFFF",
                        }),
                      ],
                    }),
                    new TableCell({
                      shading: { fill: "FF6B00" },
                      children: [
                        new Paragraph({
                          text: "Analysis",
                          bold: true,
                          color: "FFFFFF",
                        }),
                      ],
                    }),
                    new TableCell({
                      shading: { fill: "FF6B00" },
                      children: [
                        new Paragraph({
                          text: "Status",
                          bold: true,
                          color: "FFFFFF",
                        }),
                      ],
                    }),
                  ],
                }),
                // Data Rows
                ...item.claimChart.map(
                  (row) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph(row.claimElement)],
                        }),
                        new TableCell({
                          children: [new Paragraph(row.productAnalysis)],
                        }),
                        new TableCell({
                          children: [new Paragraph(row.identified)],
                        }),
                      ],
                    }),
                ),
              ],
            }),
            new Paragraph({ text: "", spacing: { after: 400 } }),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Infringement_Report_${cleanId}.docx`);
};
