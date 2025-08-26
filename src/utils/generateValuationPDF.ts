import { AiValuation } from '@/lib/queries/hooks/types/ai-generate';

interface PDFValuationData {
  valuation: AiValuation;
  propertyType: string;
}

export const generateValuationPDF = async (
  data: PDFValuationData
): Promise<void> => {
  const { valuation, propertyType } = data;

  const html = `
    <html>
      <head>
        <title>Valuation Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #350f9d;
            padding-bottom: 20px;
          }
          .logo { 
            font-size: 32px; 
            font-weight: bold; 
            color: #350f9d; 
            margin-bottom: 10px;
          }
          .section { 
            margin-bottom: 25px; 
          }
          .title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 15px;
            color: #333;
          }
          .value { 
            font-size: 24px; 
            color: #350f9d; 
            font-weight: bold; 
            margin: 10px 0;
          }
          .info { 
            margin: 8px 0; 
          }
          .label { 
            color: #666; 
            font-weight: 500;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          @media print {
            body { margin: 20px; }
            @page { margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">LISTD</div>
          <div style="font-size: 16px; color: #666;">Property Valuation Report</div>
        </div>

        <div class="section">
          <div class="title">Property Information</div>
          <div class="info"><span class="label">Property Type:</span> ${propertyType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
          <div class="info"><span class="label">Location:</span> ${valuation.inputPayload?.location || 'Not specified'}</div>
          ${valuation.inputPayload?.buildingName ? `<div class="info"><span class="label">Building Name:</span> ${valuation.inputPayload.buildingName}</div>` : ''}
          ${valuation.inputPayload?.floorArea ? `<div class="info"><span class="label">Floor Area:</span> ${valuation.inputPayload.floorArea} sqm</div>` : ''}
          ${valuation.inputPayload?.bedrooms ? `<div class="info"><span class="label">Bedrooms:</span> ${valuation.inputPayload.bedrooms}</div>` : ''}
          ${valuation.inputPayload?.bathrooms ? `<div class="info"><span class="label">Bathrooms:</span> ${valuation.inputPayload.bathrooms}</div>` : ''}
        </div>

        <div class="section">
          <div class="title">Valuation Results</div>
          <div class="value">₱${Number(valuation.aiResult?.estimated).toLocaleString()}</div>
          <div class="info"><span class="label">Confidence Level:</span> ${valuation.aiResult?.confidence?.toUpperCase() || 'Medium'}</div>
          <div class="info"><span class="label">Valuation Date:</span> ${new Date(valuation.aiResult?.valuationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        ${
          valuation.manualValuationResult?.marketConditions
            ? `
          <div class="section">
            <div class="title">Market Analysis</div>
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold; color: #666; margin-bottom: 5px;">Market Conditions:</div>
              <div>${valuation.manualValuationResult.marketConditions}</div>
            </div>
          </div>
        `
            : ''
        }

        ${
          valuation.manualValuationResult?.locationFactors?.length > 0
            ? `
          <div class="section">
            <div style="font-weight: bold; color: #666; margin-bottom: 10px;">Location Factors:</div>
            <ul style="margin: 0; padding-left: 20px;">
              ${valuation.manualValuationResult.locationFactors.map(factor => `<li style="margin-bottom: 5px;">${factor}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }

        ${
          valuation.manualValuationResult?.comparableProperties?.length > 0
            ? `
          <div class="section">
            <div style="font-weight: bold; color: #666; margin-bottom: 10px;">Comparable Properties:</div>
            ${valuation.manualValuationResult.comparableProperties
              .slice(0, 3)
              .map(
                comp => `
              <div style="background: #f8f9fa; padding: 10px; margin-bottom: 8px; border-left: 3px solid #350f9d;">
                <strong>${comp.type}</strong> in ${comp.location}<br>
                <strong>₱${comp.price.toLocaleString()}</strong> (${comp.size} sqm)
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        <div class="footer">
          <div>This valuation report is generated by Listd AI Valuation System.</div>
          <div style="margin-top: 5px;">For professional appraisal services, please consult a licensed appraiser.</div>
          <div style="margin-top: 10px;">Report ID: ${valuation.id}</div>
        </div>
      </body>
    </html>
  `;

  // Open in new window and trigger print to PDF
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();

    // Wait for content to load, then print
    setTimeout(() => {
      newWindow.print();
      // Close window after printing
      setTimeout(() => {
        newWindow.close();
      }, 1000);
    }, 500);
  }
};

export const formatCurrency = (
  amount: number,
  currency: string = 'PHP'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
