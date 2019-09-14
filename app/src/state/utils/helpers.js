export function downloadFile(data, fileName) {
  const blob = new Blob([data], {
    type: 'application/csv;charset=utf-8;',
  });

  if (window.navigator.msSaveBlob) {
    // FOR IE BROWSER
    navigator.msSaveBlob(blob, fileName);
  } else {
    // FOR OTHER BROWSERS
    const link = document.createElement('a');
    const csvUrl = URL.createObjectURL(blob);
    link.href = csvUrl;
    link.style = 'visibility:hidden';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
