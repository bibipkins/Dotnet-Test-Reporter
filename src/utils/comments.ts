import * as github from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { formatFooter, formatHeader, formatSummaryLink } from './markdown';

type ListCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

export const publishComment = async (
  token: string,
  title: string,
  message: string,
  postNew: boolean
): Promise<void> => {
  const { owner, repo, issueNumber, commit, runId, jobName } = getConfiguration();

  if (!token || !owner || !repo || !issueNumber) {
    console.log('Failed to post a comment');
    return;
  }

  const octokit = github.getOctokit(token);
  const jobs = await octokit.rest.actions.listJobsForWorkflowRun({ owner, repo, run_id: runId });
  const currentJob = jobs.data?.jobs?.find(job => job.name === jobName);

  const header = formatHeader(title);
  const summaryLink = currentJob ? formatSummaryLink(owner, repo, runId, currentJob.id) : '';
  const footer = commit ? formatFooter(commit) : '';
  const body = `${header}${message}${summaryLink}${footer}`;

  const issues = octokit.rest.issues;
  const comments = await issues.listComments({ owner, repo, issue_number: issueNumber });
  const existingComment = findExistingComment(comments, header);

  if (existingComment && !postNew) {
    await issues.updateComment({ owner, repo, comment_id: existingComment.id, body });
  } else {
    await issues.createComment({ owner, repo, issue_number: issueNumber, body });
  }
};

const getConfiguration = () => {
  const {
    job,
    runId,
    payload: { pull_request, repository, after }
  } = github.context;

  const issueNumber = pull_request?.number;
  const [owner, repo] = repository?.full_name?.split('/') || [];

  return { owner, repo, issueNumber, commit: after, runId, jobName: job };
};

const findExistingComment = (comments: ListCommentsResponse, header: string) => {
  return comments.data.find(comment => {
    const isBotUserType = comment.user?.type === 'Bot';
    const startsWithHeader = comment.body?.startsWith(header);

    return isBotUserType && startsWithHeader;
  });
};
