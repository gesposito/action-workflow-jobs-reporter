const { getReportFrom, getJunitXml } = require("./index");

const data = {
  total_count: 1,
  jobs: [
    {
      id: 1133363344,
      run_id: 260956307,
      run_url:
        "https://api.github.com/repos/gesposito/action-workflow-retry/actions/runs/260956307",
      node_id: "MDg6Q2hlY2tSdW4xMTMzMzYzMzQ0",
      head_sha: "dbc7f6f9990b89d3eda457d1174d8b183d75b8a2",
      url:
        "https://api.github.com/repos/gesposito/action-workflow-retry/actions/jobs/1133363344",
      html_url:
        "https://github.com/gesposito/action-workflow-retry/runs/1133363344",
      status: "completed",
      conclusion: "failure",
      started_at: "2020-09-18T10:31:52Z",
      completed_at: "2020-09-18T10:31:57Z",
      name: "error",
      steps: [
        {
          name: "Set up job",
          status: "completed",
          conclusion: "success",
          number: 1,
          started_at: "2020-09-18T12:31:52.000+02:00",
          completed_at: "2020-09-18T12:31:54.000+02:00",
        },
        {
          name: "Run actions/checkout@v2",
          status: "completed",
          conclusion: "success",
          number: 2,
          started_at: "2020-09-18T12:31:54.000+02:00",
          completed_at: "2020-09-18T12:31:56.000+02:00",
        },
        {
          name: "Run npm run error",
          status: "completed",
          conclusion: "failure",
          number: 3,
          started_at: "2020-09-18T12:31:56.000+02:00",
          completed_at: "2020-09-18T12:31:57.000+02:00",
        },
        {
          name: "Post Run actions/checkout@v2",
          status: "completed",
          conclusion: "success",
          number: 6,
          started_at: "2020-09-18T12:31:57.000+02:00",
          completed_at: "2020-09-18T12:31:57.000+02:00",
        },
        {
          name: "Complete job",
          status: "completed",
          conclusion: "success",
          number: 7,
          started_at: "2020-09-18T12:31:57.000+02:00",
          completed_at: "2020-09-18T12:31:57.000+02:00",
        },
      ],
      check_run_url:
        "https://api.github.com/repos/gesposito/action-workflow-retry/check-runs/1133363344",
    },
  ],
};

describe("Report", () => {
  let report;

  test("Returns a JSON report from Workflow jobs", async () => {
    report = getReportFrom("workflow name", data.jobs);
    expect(report).toMatchSnapshot();
  });

  test("Returns a JUnit XML report from Workflow jobs", async () => {
    const xml = getJunitXml(report);
    expect(xml).toMatchSnapshot();
  });
});
