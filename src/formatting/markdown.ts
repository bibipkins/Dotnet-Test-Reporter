import { ICoverage, IResult } from '../data';
import { formatElapsedTime, getStatusIcon } from './common';

export const formatHeader = (header: string): string => `## ${header}\n`;

export const formatFooter = (commit: string): string => `<br/>_✏️ updated for commit ${commit.substring(0, 8)}_`;

export const formatSummaryLink = (owner: string, repo: string, runId: number, jobId: number): string => {
  const url = `https://github.com/${owner}/${repo}/actions/runs/${runId}#summary-${jobId}`;
  return `🔍 click [here](${url}) for more details\n`;
};

export const formatResult = (result: IResult): string => {
  const { total, passed, skipped, success } = result;

  const title = `${getStatusIcon(success)} Tests`;
  const info = `**${passed} / ${total}**${skipped ? ` (${skipped} skipped)` : ''}`;
  const status = `- ${getStatusText(success)} in ${formatElapsedTime(result.elapsed)}`;

  return `${title} ${info} ${status}\n`;
};

export const formatCoverage = (coverage: ICoverage, min: number): string => {
  const { linesCovered, linesTotal, lineCoverage, branchesTotal, branchesCovered, success } = coverage;

  const title = `${min ? getStatusIcon(success) : '📝'} Coverage`;
  const info = `**${lineCoverage}%**`;
  const status = min ? `- ${getStatusText(success)} with ${min}% threshold` : '';

  const lines = `📏 ${linesCovered} / ${linesTotal} lines covered`;
  const branches = `🌿 ${branchesCovered} / ${branchesTotal} branches covered`;

  return `${title} ${info} ${status}\n${lines} ${branches}\n`;
};

const getStatusText = (success: boolean) => (success ? '**passed**' : '**failed**');
