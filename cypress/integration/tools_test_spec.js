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
            cy.route("https://icms-dev.cern.ch/tools-api/**").as("gets");
            cy.readFile("cypress/fixtures/tools_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                cy.get_stat_dur(link, site_state[k]);
            })
            cy.readFile("cypress/fixtures/tools_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                cy.visit(link)
		cy.login("arhayrap", "Arch1916F")
		cy.wait(2000)
                //cy.wait(4000)
                cy.get("main", {
                    timeout: 40000
                })
		cy.wait_for_requests("@gets", site_state[k]);
		//cy.wait_for_requests("@gets", site_state[k]);
		//cy.wait_for_requests("@gets", site_state[k]);
		//cy.wait_for_requests("@gets", site_state[k]);
		cy.find_errors(site_state[k])
		cy.find_popup_alerts(site_state[k])
                cy.check_tables(site_state[k])
		//cy.reload();
                console.log(site_state);
            })
            cy.save_data(site_state[k], base);
            cy.writeFile("data/tools_out.json", site_state);
        })
    }
})
