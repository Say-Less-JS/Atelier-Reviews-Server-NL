import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 1000 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 1 },
  ],
  // A number specifying the number of VUs to run concurrently.

  // A string specifying the total duration of the test run.


  // The following section contains configuration options for execution of this
  // test script in Grafana Cloud.
  //
  // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
  // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.
  //
  // cloud: {
  //   // The ID of the project to which the test is assigned in the k6 Cloud UI.
  //   // By default tests are executed in default project.
  //   projectID: "",
  //   // The name of the test in the k6 Cloud UI.
  //   // Test runs with the same name will be grouped.
  //   name: "script.js"
  // },

  // Uncomment this section to enable the use of Browser API in your tests.
  //
  // See https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/ to learn more
  // about using Browser API in your test scripts.
  //
  // scenarios: {
  //   // The scenario name appears in the result summary, tags, and so on.
  //   // You can give the scenario any name, as long as each name in the script is unique.
  //   ui: {
  //     // Executor is a mandatory parameter for browser-based tests.
  //     // Shared iterations in this case tells k6 to reuse VUs to execute iterations.
  //     //
  //     // See https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ for other executor types.
  //     executor: 'shared-iterations',
  //     options: {
  //       browser: {
  //         // This is a mandatory parameter that instructs k6 to launch and
  //         // connect to a chromium-based browser, and use it to run UI-based
  //         // tests.
  //         type: 'chromium',
  //       },
  //     },
  //   },
  // }
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
// export default function() {
//   http.get(`http://${process.env.DB_HOST}:3000/reviews/1/meta`);
//   sleep(1);
// }

// export default function() {
//   http.get(`http://${process.env.DB_HOST}:3000/reviews/1`);
//   sleep(1);
// }

// export default function() {
//   const payload = JSON.stringify({
//     product_id: 1,
//     rating: 5,
//     summary: "testing post 23",
//     body: "testing post 23 body",
//     recommend: true,
//     reviewer_name: "beagles",
//     reviewer_email: "beagles@gmail.com",
//     photos: ["https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.britannica.com%2F16%2F234216-050-C66F8665%2Fbeagle-hound-dog.jpg&tbnid=TxZas2ani8v5yM&vet=12ahUKEwjg16OeyI6FAxWeZjABHbw-AdcQMygAegQIARBz..i&imgrefurl=https%3A%2F%2Fwww.britannica.com%2Fanimal%2Fbeagle-dog&docid=gJ0ou-8nWSsfKM&w=1600&h=1057&q=beagle&ved=2ahUKEwjg16OeyI6FAxWeZjABHbw-AdcQMygAegQIARBz"]
//   })
//   const headers = {'Content-Type': 'application/json'}
//   http.post(`http://${process.env.DB_HOST}:3000/reviews/1`, payload, {headers});
//   sleep(1);
// }
