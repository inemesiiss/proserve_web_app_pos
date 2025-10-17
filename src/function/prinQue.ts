// src/utils/printQueue.ts
export function printQueueTicket(queueNumber: string) {
  const printWindow = window.open("", "_blank", "width=300,height=400");

  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Queue Ticket</title>
        <style>
          @page {
            size: 58mm auto; /* common thermal printer width */
            margin: 5mm;
          }
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
          }
          h2 {
            font-size: 16px;
            margin: 8px 0;
          }
          h1 {
            font-size: 60px;
            margin: 12px 0;
            color: #000;
          }
          .footer {
            font-size: 12px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <h2>🏥 PROQUEUE</h2>
        <h1>${queueNumber}</h1>
        <div class="footer">Please wait for your number</div>
      </body>
    </html>
  `);

  printWindow.document.close();

  // Auto print then close
  printWindow.print();
  printWindow.close();
}
