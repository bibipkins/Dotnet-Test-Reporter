import { ITestResult } from './data';
import { findFiles, parseTestResults, setActionFailed, setResultsOutputs } from './utils';

export const processTestResults = async (resultsPath: string): Promise<ITestResult> => {
  const aggregatedResult = getDefaultTestResult();
  const filePaths = findFiles(resultsPath, '.trx');

  if (!filePaths.length) {
    throw Error(`No test results found in ${resultsPath}`);
  }

  for (const path of filePaths) {
    await processResult(path, aggregatedResult);
  }

  setResultsOutputs(aggregatedResult);

  if (!aggregatedResult.success) {
    setActionFailed('Tests Failed');
  }

  return aggregatedResult;
};

const processResult = async (path: string, aggregatedResult: ITestResult): Promise<void> => {
  const result = await parseTestResults(path);

  if (!result) {
    throw Error(`Failed parsing ${path}`);
  }

  console.log(`Processed ${path}`);
  mergeTestResults(aggregatedResult, result);
};

const mergeTestResults = (result1: ITestResult, result2: ITestResult): void => {
  result1.success = result1.success && result2.success;
  result1.elapsed += result2.elapsed;
  result1.total += result2.total;
  result1.passed += result2.passed;
  result1.failed += result2.failed;
  result1.skipped += result2.skipped;
};

const getDefaultTestResult = (): ITestResult => ({
  success: true,
  elapsed: 0,
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0
});
