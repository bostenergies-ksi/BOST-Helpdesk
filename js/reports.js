/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/reports.js
   Reports: date-range report generator
   ═══════════════════════════════════════════════════════ */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildReportPreviewHtml(filtered, from, to, resolved, pending, incomplete) {
  return `
    <div style="margin-top:20px; margin-bottom:18px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h3 style="margin:0 0 6px; font-size:18px; color:#1a2035;">IT Help Desk Report</h3>
          <div style="font-size:13px; color:#4a5568;">Date range: ${escapeHtml(from)} to ${escapeHtml(to)}</div>
        </div>
        <button class="btn btn-outline" onclick="generateReport()" style="white-space:nowrap;">Refresh</button>
      </div>

      <div style="border:1px solid #d9e2ec; border-radius:16px; padding:22px; background:linear-gradient(135deg, #ffffff 0%, #f8fbff 100%); box-shadow:0 10px 25px rgba(15,23,42,0.08);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; padding:16px 18px; border-radius:12px; background:linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%); color:#fff; margin-bottom:18px;">
          <div>
            <div style="font-size:22px; font-weight:800; margin-bottom:4px;">BOST-KSI IT Help Desk Report</div>
            <div style="font-size:13px; opacity:0.95;">Generated from ${escapeHtml(from)} to ${escapeHtml(to)}</div>
          </div>
          <div style="font-size:13px; text-align:right; opacity:0.95;">Generated on ${new Date().toLocaleString()}</div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:12px; margin-bottom:20px;">
          <div style="border:1px solid #e2e8f0; border-left:4px solid #2d5be3; border-radius:10px; padding:12px; background:#f8fbff; box-shadow:0 2px 8px rgba(37,99,235,0.06);">
            <div style="font-size:12px; color:#64748b; text-transform:uppercase; margin-bottom:6px; font-weight:700;">Total</div>
            <div style="font-size:24px; font-weight:800; color:#1e3a8a;">${filtered.length}</div>
          </div>
          <div style="border:1px solid #e2e8f0; border-left:4px solid #10b981; border-radius:10px; padding:12px; background:#f8fffb; box-shadow:0 2px 8px rgba(16,185,129,0.06);">
            <div style="font-size:12px; color:#64748b; text-transform:uppercase; margin-bottom:6px; font-weight:700;">Resolved</div>
            <div style="font-size:24px; font-weight:800; color:#047857;">${resolved}</div>
          </div>
          <div style="border:1px solid #e2e8f0; border-left:4px solid #f59e0b; border-radius:10px; padding:12px; background:#fffaf2; box-shadow:0 2px 8px rgba(245,158,11,0.06);">
            <div style="font-size:12px; color:#64748b; text-transform:uppercase; margin-bottom:6px; font-weight:700;">Pending</div>
            <div style="font-size:24px; font-weight:800; color:#b45309;">${pending}</div>
          </div>
          <div style="border:1px solid #e2e8f0; border-left:4px solid #ef4444; border-radius:10px; padding:12px; background:#fff7f7; box-shadow:0 2px 8px rgba(239,68,68,0.06);">
            <div style="font-size:12px; color:#64748b; text-transform:uppercase; margin-bottom:6px; font-weight:700;">Incomplete</div>
            <div style="font-size:24px; font-weight:800; color:#b91c1c;">${incomplete}</div>
          </div>
        </div>

        <div class="report-table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Reporter</th>
                <th>Department</th>
                <th>Issue</th>
                <th>Resolution</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned</th>
                <th>Time Resolved</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(t => `
                <tr>
                  <td><strong>${escapeHtml(t.id)}</strong></td>
                  <td>${escapeHtml(t.date)}</td>
                  <td>${escapeHtml(t.reporter)}</td>
                  <td>${escapeHtml(t.dept)}</td>
                  <td>${escapeHtml(t.issue)}</td>
                  <td>${escapeHtml(t.resolution)}</td>
                  <td><span class="badge badge-${escapeHtml(t.status.toLowerCase())}">${escapeHtml(t.status)}</span></td>
                  <td><span class="badge badge-${escapeHtml(t.priority.toLowerCase())}">${escapeHtml(t.priority)}</span></td>
                  <td>${escapeHtml(t.assigned)}</td>
                  <td>${escapeHtml(t.timeResolved)}</td>
                  <td>${escapeHtml(t.comments)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function buildReportDocument(filtered, from, to, resolved, pending, incomplete) {
  const rows = filtered.map(t => `
    <tr>
      <td>${escapeHtml(t.id)}</td>
      <td>${escapeHtml(t.date)}</td>
      <td>${escapeHtml(t.time)}</td>
      <td>${escapeHtml(t.reporter)}</td>
      <td>${escapeHtml(t.dept)}</td>
      <td>${escapeHtml(t.issue)}</td>
      <td>${escapeHtml(t.resolution)}</td>
      <td>${escapeHtml(t.status)}</td>
      <td>${escapeHtml(t.priority)}</td>
      <td>${escapeHtml(t.assigned)}</td>
      <td>${escapeHtml(t.timeResolved)}</td>
      <td>${escapeHtml(t.comments)}</td>
    </tr>
  `).join('');

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const monthName = fromDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IT Help Desk Report</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      background: #fff;
      color: #1a1a1a;
      line-height: 1.5;
    }
    .report-sheet {
      max-width: 100%;
      margin: 0;
      background: #fff;
      padding: 0;
    }
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 2px solid #1a3a52;
    }
    .header-left h1 {
      font-size: 18px;
      font-weight: 700;
      color: #2563eb;
      margin: 0 0 2px;
    }
    .header-left p {
      font-size: 12px;
      color: #666;
      margin: 0;
    }
    .header-right {
      text-align: right;
      font-size: 12px;
      color: #333;
    }
    .header-right div {
      margin-bottom: 2px;
    }
    .title-section {
      text-align: center;
      margin: 10px 0;
    }
    .title-section h2 {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 4px;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .title-section .subtitle {
      font-size: 12px;
      color: #666;
      margin: 0;
    }
    .divider {
      border-top: 2px solid #000;
      margin: 8px 0;
    }
    .info-section {
      margin: 12px 0;
      padding: 10px;
      background: #f8f9fa;
      border-left: 4px solid #2563eb;
    }
    .info-section .info-row {
      margin: 4px 0;
      font-size: 12px;
    }
    .info-row strong {
      font-weight: 700;
      color: #1a1a1a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 11px;
    }
    th {
      background: #003d7a;
      color: #fff;
      font-weight: 700;
      padding: 8px 5px;
      text-align: left;
      border: 1px solid #003d7a;
      word-wrap: break-word;
      min-width: 50px;
    }
    td {
      padding: 6px 5px;
      border: 1px solid #ccc;
      text-align: left;
      word-wrap: break-word;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background: #f5f5f5;
    }
    tr:hover td {
      background: #f0f0f0;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 12px 0;
    }
    .summary-card {
      border: 1px solid #ddd;
      padding: 8px;
      background: #f5f5f5;
      text-align: center;
      font-size: 11px;
    }
    .summary-card .label {
      font-weight: 700;
      color: #666;
      font-size: 10px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .summary-card .value {
      font-size: 20px;
      font-weight: 700;
      color: #003d7a;
    }
    @media print {
      body { background: #fff; padding: 20px; margin: 0; }
      .report-sheet { border: none; box-shadow: none; max-width: 100%; padding: 0; }
      @page { size: landscape; margin: 0.5in; }
    }
  </style>
</head>
<body>
  <div class="report-sheet">
    <div class="report-header">
      <div class="header-left">
        <h1>BOST-KSI IT HELP DESK</h1>
        <p>Bulk Energy Storage & Transportation Ltd. Co</p>
      </div>
      <div class="header-right">
        <div><strong>From:</strong> ${escapeHtml(from)}</div>
        <div><strong>To:</strong> ${escapeHtml(to)}</div>
      </div>
    </div>

    <div class="title-section">
      <h2>IT. INCIDENT REPORTS FOR KUMASI DEPOT</h2>
      <div class="divider"></div>
    </div>

    <div class="info-section">
      <div class="info-row"><strong>MONTH:</strong> ${monthName}</div>
      <div class="info-row"><strong>DATE:</strong> ${escapeHtml(from)} TO ${escapeHtml(to)}</div>
      <div class="info-row" style="margin-top: 6px;"><strong>DEFINITION:</strong></div>
      <div style="font-size: 12px; color: #555; margin-top: 2px;">The period within which IT systems are down and unable to function at The Kumasi Depot. The difference in time recorded when the system is down and when it gets back up, measured in hours.</div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Time</th>
          <th>Reporter</th>
          <th>Dept</th>
          <th>Issue</th>
          <th>Resolution</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Assigned</th>
          <th>Time Resolved</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
}

function openReportWindow(filtered, from, to, resolved, pending, incomplete) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    showToast('⚠️ Please allow popups to open the report window');
    return false;
  }

  printWindow.document.open();
  printWindow.document.write(buildReportDocument(filtered, from, to, resolved, pending, incomplete));
  printWindow.document.close();
  printWindow.focus();
  return true;
}

function downloadWordReport(filtered, from, to, resolved, pending, incomplete) {
  const html = buildReportDocument(filtered, from, to, resolved, pending, incomplete);
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `helpdesk-report-${from}-to-${to}.doc`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate a summary report for the selected date range.
 * Renders stat cards + filtered ticket table into #report-result.
 */
async function generateReport(format = 'preview') {
  const from = document.getElementById('r-from').value;
  const to   = document.getElementById('r-to').value;
  const el   = document.getElementById('report-result');

  if (!from || !to) {
    showToast('⚠️ Please select a date range');
    return;
  }

  if (from > to) {
    showToast('⚠️ "From" date must be before "To" date');
    return;
  }

  const allTickets = await getAllTickets();
  const filtered   = allTickets.filter(t => t.date >= from && t.date <= to);
  const resolved   = filtered.filter(t => t.status === 'Resolved').length;
  const pending    = filtered.filter(t => t.status === 'Pending').length;
  const incomplete = filtered.filter(t => t.status === 'Incomplete').length;

  if (filtered.length === 0) {
    el.innerHTML = '<div class="empty-state">No tickets found in this date range</div>';
    return;
  }

  el.innerHTML = buildReportPreviewHtml(filtered, from, to, resolved, pending, incomplete);

  if (format === 'preview') {
    showToast('✓ Report preview ready');
    return;
  }

  if (format === 'word') {
    downloadWordReport(filtered, from, to, resolved, pending, incomplete);
    showToast('✓ Word file downloaded');
    return;
  }

  if (format === 'pdf') {
    showToast('📄 Opened report for PDF export');
    openReportWindow(filtered, from, to, resolved, pending, incomplete);
    return;
  }

  if (format === 'print') {
    showToast('🖨️ Report opened for printing');
    openReportWindow(filtered, from, to, resolved, pending, incomplete);
  }
}
