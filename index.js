const core = require("@actions/core");
const github = require("@actions/github");

const path = require("path");
const fs = require("fs").promises;

const { getJunitXml } = require("junit-xml");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const githubToken = core.getInput("github_token");
    const reportPath = core.getInput("report_path");
    const reportFilename = core.getInput("report_filename");

    const octokit = github.getOctokit(githubToken);
    const { repo, workflow, runId } = github.context;

    const {
      data: { jobs },
    } = await octokit.actions.listJobsForWorkflowRun({
      // owner
      // repo
      ...repo,
      run_id: runId,
    });

    const report = getReportFrom(workflow, jobs);
    const XML = getJunitXml(report);

    await fs.mkdir(reportPath);
    const fullPath = path.join(reportPath, reportFilename);
    core.info(`Writing XML report to ${fullPath}`);
    await fs.writeFile(fullPath, XML);
  } catch (error) {
    core.setFailed(error.message);
  }
}

function getReportFrom(workflow, jobs) {
  core.info(`${jobs.length} jobs found`);

  const report = {
    name: workflow,
    suites: jobs.map((job) => {
      core.info(`${job.steps.length} steps found for ${job.name}`);
      const suite = {
        name: job.name,
        testCases: job.steps.map(getTestCase(workflow, job)),
      };
      return suite;
    }),
  };

  return report;
}

function getTestCase(workflow, job) {
  return (step) => {
    let testCase = {
      name: step.name,
    };
    switch (step.conclusion) {
      case "failure":
        testCase.failures = [
          { message: `${workflow} - ${job.name} - ${step.name} ` },
        ];
        break;
      case "cancelled":
        break;
      case "skipped":
        testCase.skipped = true;
        break;
      case "success":
        break;
      default:
        break;
    }
    return testCase;
  };
}

run();

module.exports = {
  getReportFrom,
  getJunitXml,
};
