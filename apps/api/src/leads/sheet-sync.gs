function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const secret = PropertiesService.getScriptProperties().getProperty(
    'SYNC_SECRET'
  );
  if (secret && data.secret !== secret) {
    return json_({ ok: false, error: 'unauthorized' });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const range = sheet.getDataRange();
  const values = range.getDisplayValues();
  if (values.length < 2) {
    return json_({ ok: false, error: 'empty' });
  }

  const headers = values[0].map(function (h) {
    return String(h).toLowerCase().replace(/[^a-z0-9]+/g, '');
  });
  const emailCol = indexOf_(headers, ['email']);
  const timeCol = indexOf_(headers, ['timestamp', 'date', 'submitted']);
  let statusCol = indexOf_(headers, ['status', 'stage', 'funnel']);
  if (emailCol < 0 || timeCol < 0) {
    return json_({ ok: false, error: 'columns' });
  }
  if (statusCol < 0) {
    statusCol = values[0].length;
    sheet.getRange(1, statusCol + 1).setValue('Status');
  }

  const email = String(data.email || '')
    .trim()
    .toLowerCase();
  const submittedAt = String(data.submittedAt || '').trim();
  const status = String(data.status || '').trim();

  for (var i = 1; i < values.length; i++) {
    const rowEmail = String(values[i][emailCol] || '')
      .trim()
      .toLowerCase();
    const rowTime = String(values[i][timeCol] || '').trim();
    if (rowEmail === email && rowTime === submittedAt) {
      sheet.getRange(i + 1, statusCol + 1).setValue(status);
      return json_({ ok: true, row: i + 1 });
    }
  }

  return json_({ ok: false, error: 'not_found' });
}

function indexOf_(headers, aliases) {
  for (var i = 0; i < headers.length; i++) {
    for (var j = 0; j < aliases.length; j++) {
      if (
        headers[i].indexOf(aliases[j]) >= 0 ||
        aliases[j].indexOf(headers[i]) >= 0
      ) {
        return i;
      }
    }
  }
  return -1;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON
  );
}
