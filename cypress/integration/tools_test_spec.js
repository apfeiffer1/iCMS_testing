describe("Checking tools", () => {
    var site_state = [];
    var base = "https://icms-dev.cern.ch/tools/";
    var n = 33;
    for (var j = 0; j < n; j++) {
        site_state.push({
            url: "",
            status: 0,
            duration: 0,
            table: [],
            late_errors: [],
            testing_date: ""
        });
    }
    for (let k = 0; k < n; k++) {
        it("Logs in and tests the pages", () => {
            cy.server();
            cy.route("**/tools-api/restplus/**").as("gets");
	    cy.readFile("cypress/fixtures/tools_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                cy.get_stat_dur(link, site_state[k]);
            });
            cy.readFile("cypress/fixtures/tools_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                cy.visit(link);
            });
	    cy.login("login", "password");
	    cy.wait_for_requests("@gets", site_state[k]);
            cy.find_errors(site_state[k]);
	    cy.wait(10000);
	    cy.check_tables(site_state[k]);
            console.log(site_state);
            cy.save_data(site_state[k], base);
            cy.writeFile("data/tools_out.json", site_state);
        });
    }
});
