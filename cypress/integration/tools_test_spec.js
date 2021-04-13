describe("Checking tools", () => {
    var site_state = [];
    var base = "https://icms-dev.cern.ch/tools/";
    var n = 5;
    for (var j = 0; j < n; j++) {
        site_state.push({
            url: "",
            status: 0,
            duration: 0,
            table: [],
            late_errors: [],
            testing_date: ""
        })
    }

    for (let k = 0; k < n; k++) {

        it("Logs in and tests the pages", () => {
            cy.readFile("cypress/integration/data/tools_links_exp.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                site_state[k].url = link;
                cy.get_stat_dur(link, site_state[k]);
                site_state[k].testing_date = Cypress.moment().format('MMM DD, YYYY');
            })

            cy.readFile("cypress/integration/data/tools_links_exp.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k]
                site_state[k].url = link;
                cy.visit(link)
                cy.server()
                cy.route("**/tools-api/**").as("gets")
                cy.login("login", "password")
                cy.wait_for_requests("@gets", site_state[k])
                cy.find_errors(site_state[k])
                cy.wait(4000)
                cy.get("main", {
                    timeout: 40000
                });
                cy.wait(2000)
                cy.check_tables(site_state[k])
                console.log(site_state)
            })
            cy.save_data(site_state[k], base)
            cy.writeFile("cypress/integration/data/tools_out_exp.json", site_state);
        })
    }
})
