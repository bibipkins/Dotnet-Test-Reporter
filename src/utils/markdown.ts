import { ITestCoverage, ITestResult } from '../data';

export const formatTestResults = (results: ITestResult): string => {
  const status = formatResultStatus(results);
  const summary = formatResultSummary(results);

  return status + summary;
};

export const formatTestCoverage = (coverage: ITestCoverage, min: number): string => {
  const status = fromatCoverageStatus(coverage, min);
  const summary = formatCoverageSummary(coverage);
  const footer = min ? `_minimum coverage needed: ${min}%_\n\n` : '';

  return status + summary + footer;
};

const formatResultStatus = (results: ITestResult): string => {
  const success = results.failed === 0;

  const successStatus = ':green_circle: &nbsp;Tests Passed';
  const failStatus = ':red_circle: &nbsp;Tests Failed';
  const status = success ? successStatus : failStatus;
  const delimiter = ' &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; ';
  const time = `:stopwatch: ${formatElapsedTime(results.elapsed)}`;

  return `### ${status}${delimiter}${time}\n`;
};

const formatResultSummary = (results: ITestResult): string => {
  const { total, passed, failed, skipped } = results;
  const tableHeader = ':memo: Total | :heavy_check_mark: Passed | :x: Failed | :warning: Skipped';
  const tableBody = `${total} | ${passed} | ${failed} | ${skipped}`;

  return `${tableHeader}\n--- | --- | --- | ---\n${tableBody}\n\n`;
};

const formatElapsedTime = (elapsed: number): string => {
  const secondsDelimiter = 1000;
  const minutesDelimiter = 120000;

  if (elapsed >= minutesDelimiter) {
    return `${Math.round(elapsed / 6000) / 10}min`;
  } else if (elapsed >= secondsDelimiter) {
    return `${Math.round(elapsed / 100) / 10}s`;
  } else {
    return `${elapsed}ms`;
  }
};

const fromatCoverageStatus = (coverage: ITestCoverage, min: number): string => {
  const success = coverage.lineCoverage >= min;

  const defaultStatus = 'Coverage';
  const successStatus = ':green_circle: &nbsp;Coverage Passed';
  const failStatus = ':red_circle: &nbsp;Coverage Failed';
  const status = `${success ? successStatus : failStatus}`;

  return `### ${min ? status : defaultStatus}\n`;
};

const formatCoverageSummary = (coverage: ITestCoverage): string => {
  const { linesTotal, linesCovered, lineCoverage, branchCoverage, methodCoverage } = coverage;
  const tableHeader = ':memo: Total | :straight_ruler: Line&nbsp;&nbsp;&nbsp; | :herb: Branch | :wrench: Method';
  const total = `${linesCovered} / ${linesTotal}`;
  const tableBody = `${total} | ${lineCoverage}% | ${branchCoverage}% | ${methodCoverage}%`;

  return `${tableHeader}\n--- | --- | --- | ---\n${tableBody}\n\n`;
};
