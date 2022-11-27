import * as core from '@actions/core';
import { CoverageType, IActionInputs, ICoverage, IResult } from '../data';

const inputs = {
  token: 'github-token',
  title: 'comment-title',
  postNewComment: 'post-new-comment',
  resultsPath: 'results-path',
  coveragePath: 'coverage-path',
  coverageType: 'coverage-type',
  coverageThreshold: 'coverage-threshold'
};

const outputs = {
  total: 'tests-total',
  passed: 'tests-passed',
  failed: 'tests-failed',
  skipped: 'tests-skipped',
  lineCoverage: 'coverage-line',
  linesTotal: 'coverage-lines-total',
  linesCovered: 'coverage-lines-covered',
  branchCoverage: 'coverage-branch',
  branchesTotal: 'coverage-branches-total',
  branchesCovered: 'coverage-branches-covered'
};

export const getActionInputs = (): IActionInputs => {
  const token = core.getInput(inputs.token) || process.env['GITHUB_TOKEN'] || '';

  return {
    token,
    title: core.getInput(inputs.title),
    postNewComment: core.getBooleanInput(inputs.postNewComment),
    resultsPath: core.getInput(inputs.resultsPath),
    coveragePath: core.getInput(inputs.coveragePath),
    coverageType: core.getInput(inputs.coverageType) as CoverageType,
    coverageThreshold: Number(core.getInput(inputs.coverageThreshold))
  };
};

export const setResultOutputs = (results: IResult): void => {
  core.setOutput(outputs.total, results.total);
  core.setOutput(outputs.passed, results.passed);
  core.setOutput(outputs.failed, results.failed);
  core.setOutput(outputs.skipped, results.skipped);
};

export const setCoverageOutputs = (coverage: ICoverage): void => {
  core.setOutput(outputs.lineCoverage, coverage.lineCoverage);
  core.setOutput(outputs.linesTotal, coverage.linesTotal);
  core.setOutput(outputs.linesCovered, coverage.linesCovered);
  core.setOutput(outputs.branchCoverage, coverage.branchCoverage);
  core.setOutput(outputs.branchesTotal, coverage.branchesTotal);
  core.setOutput(outputs.branchesCovered, coverage.branchesCovered);
};

export const setActionFailed = (message: string): void => {
  core.setFailed(message);
};
