'use strict';
const p = console.log;
const pageObjects = {};
const po = pageObjects;
{
  po.home= 'table#home';
  po.homeRows= 'table#home tr';
  po.homeStreet='table#home tr input#home-street-1';
  po.homeStreet2='table#home tr input#home-street-2';
  po.homeStreets = 'table#home tr input[id^=home-street-]';
  po.homeState='select#home-state';
  po.homeZip='input#home-zip';
  po.billing='table#billing';
  po.billingRows='table#billing tr';
  po.billingSameAsHome='table#billing input[type=checkbox]';
  po.billingStreet='table#billing input#billing-street-1';
  po.billingStreet2='table#billing input#billing-street-2';
  po.billingStreetn='table#billing input#billing-street-';
  po.billingStreets='table#billing tr input[id^=billing-street-';
  po.billingState='select#billing-state';
  po.billingZip='input#billing-zip';
  po.StreetText = num => `Street${num}`;
  po.HomeStreetText = row => $(`${po.home} input#home-street-${row}`).val();
  po.newStreet = nextStreetNum => `input#home-street-${String(nextStreetNum)}`;
  po.billingStreetHTML = row => `table#billing input#billing-street-${row}`;
  po.addressLineHTML = (newRowText, addressType, streetRowNum) => {
    const boldIt = streetRowNum > 2;
    var [boldStart, boldEnd] = bolder(boldIt);
    return `${boldStart}${newRowText}${boldEnd}&nbsp;<input type=text id=${addressType}-street-${String(streetRowNum)}>`;
  };
  po.billingNewRowHTML = (billingNewRowText, billingNewRowNum, boldIt = false) => {
    var [boldStart, boldEnd] = bolder(boldIt);
    return `${boldStart}${billingNewRowText}${boldEnd}&nbsp;<input type=text id=billing-street-${String(billingNewRowNum)}>`;
  };
  po.billingHTML = (streetNumLabel, streetNum) => {
    return `<b>Street${streetNumLabel}</b><input id=billing-street-${streetNum}>`;
  };
};

const bolder = (boldIt = false) => {
   let boldStart, boldEnd;
   [boldStart, boldEnd] = boldIt ? ['<b>', '</b>'] : ['', ''];
   return ([boldStart, boldEnd]);
};

$(document).ready(function(){
  $("select#home-state").change(function(){
    homeBillingLinked() && copyHomeStateToBilling(this);
  });
  $("input#home-zip").change(function(){
    homeBillingLinked() && copyHomeZipToBilling(this);
  });
  for(let streetNumber=1; streetNumber <= 2; streetNumber++) {
    $(`input#home-street-${streetNumber}`).change(function () {
      homeBillingLinked() && copyHomeStreetnToBilling(this, streetNumber);
    })
  }
});
const addStreetAddressLine = () => { // eslint-disable-line no-unused-vars
  const streetRowCount = $(po.homeStreets).length;
  const nextStreetNum = streetRowCount + 1;
  const maxStreetLines = 5;
  if(streetRowCount >= maxStreetLines) p('max streets reached');
  else {
    createNewAddressLine(po.home, nextStreetNum);
    homeBillingLinked() && createNewAddressLine(po.billing, nextStreetNum);
    $(po.newStreet(nextStreetNum)).change(function() {
      homeBillingLinked() && copyHomeStreetnToBilling(this,nextStreetNum);
    });
  }
};
const createNewAddressLine = (table, streetRowNum) => {
  const newRowText = po.StreetText(streetRowNum);
  const addressTableHTML = $(table)[0];
  const skipHTMLRows = 3;
  const billingOffset = table === po.billing ? 1 : 0;
  const addressType = table === po.billing ? 'billing' : 'home'
  const zeroIndexOffset = 1;
  const newRowNumber = skipHTMLRows + (streetRowNum - zeroIndexOffset) - billingOffset;
  const newHTMLRow = addressTableHTML.insertRow(newRowNumber);
  newHTMLRow.insertCell(0).innerHTML = po.addressLineHTML(newRowText, addressType, streetRowNum);
};
const removeStreetAddressLine = () => {  // eslint-disable-line no-unused-vars
  const homeRows = $(po.homeRows);
  const streetRowCount = $(po.homeStreets).length;
  const skipTableRows = 2;
  const homeRowToRemove = skipTableRows + streetRowCount;
  const billingOffset = 1;
  const billingRowToRemove = homeRowToRemove - billingOffset
  const billingRows = $(po.billingRows);
  if(streetRowCount > 2) {
    homeRows.eq(homeRowToRemove).remove();
    homeBillingLinked() && billingRows.eq(billingRowToRemove).remove();
  }
  else p('minimum is 2 address lines');
};
const copyHomeToBilling = () => {  // eslint-disable-line no-unused-vars
  let homeRowsCount, billingRowsCount;
  const checkboxStatus = $(po.billingSameAsHome).prop('checked');
  if(checkboxStatus) {
    copyHomeStateToBilling(po.homeState);
    copyHomeZipToBilling();
    [homeRowsCount, billingRowsCount] = countStreets();
    p(`homeRowsCount = ${homeRowsCount}, billingRowsCount = ${billingRowsCount}`)
    const streetDiffCount = homeRowsCount - billingRowsCount;
    if (streetDiffCount > 0) addNewHomeAddressLinesToBilling(streetDiffCount);
    else if(streetDiffCount < 0) resetBillingAddressLines();
    else p(`SAME (${streetDiffCount})`);
    copyAddressLineValues();
  }
};
const addNewHomeAddressLinesToBilling = (numStreets) => {
  const firstLineNum = 3;
  for(let extraHomeStreet = firstLineNum; extraHomeStreet < numStreets + firstLineNum; extraHomeStreet++) {
    const billingNewRowNum = extraHomeStreet;
    const billingNewRowText = po.StreetText(extraHomeStreet);
    const billingTable = $(po.billing)[0];
    const billingNewRow = billingTable.insertRow(firstLineNum + billingNewRowNum - 2);
    const boldIt = billingNewRowNum > 2 ? true : false
    billingNewRow.insertCell(0).innerHTML =
    po.billingNewRowHTML(billingNewRowText, billingNewRowNum, boldIt);
  }
};
const resetBillingAddressLines = () => {
  const billingTable = $(po.billing)[0];
  deleteExistingAddressLines(billingTable);
  createNewAddressLines(billingTable);
};
const deleteExistingAddressLines = (billingTable) => {
  const numLines = $(po.billingStreets).length;
  for (let i = 1; i <= numLines; i++) {
    const topRow = 2;
    billingTable.deleteRow(topRow);
  }
};
const createNewAddressLines = (billingTable) => {
  for (let streetNum = 1; streetNum <= 2; streetNum++) {
    const billingNewRow = billingTable.insertRow(streetNum + 1);
    const streetNumText = streetNum == 1 ? '' : streetNum
    const streetNumLabel = `Street${streetNumText}`;
    billingNewRow.insertCell(0).innerHTML = po.billingNewRowHTML(streetNumLabel, streetNum);
  }
};
const copyAddressLineValues = () => {
  const numLines = $(po.homeStreets).length;
  for (let row = 1; row <= numLines; row++) {
    const homeStreetValue = po.HomeStreetText(row);
    const billingStreet = $(po.billingStreetHTML(row))[0];
    billingStreet.value = homeStreetValue;
  }
};
const homeBillingLinked = () => document.querySelector(po.billingSameAsHome).checked;

const copyHomeStateToBilling = (homeState) => {
  const selectedHomeState = $(homeState).children("option:selected").val();
  $(po.billingState).val(selectedHomeState);
};
const copyHomeZipToBilling = () => {
  const homeZip = $(po.homeZip).val();
  $(po.billingZip).val(homeZip);
};
const copyHomeStreetnToBilling = (homeStreetLine,lineNumber) => {
  const homeStreet = $(homeStreetLine).val();
  $(po.billingStreetn + lineNumber).val(homeStreet);
};
const countStreets = () => {
  const homeStreetsRowCount = document.querySelectorAll(po.homeStreets).length;
  const billingStreetsRowCount = document.querySelectorAll(po.billingStreets).length;
  return [homeStreetsRowCount, billingStreetsRowCount];
};