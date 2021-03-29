describe("Checking tools", () => {
    var site_state = [];
    var n = 34
    for (var j = 0; j < n; j++) {
        site_state.push({
            url: "",
            status: 0,
            duration: 0,
            table: "",
            late_errors: [],
            testing_date: ""
        })
    }

    for (let k = 0; k < n; k++) {

        it("Logs in and tests the pages", () => {
            cy.readFile("cypress/integration/data/tools_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k]
                site_state[k].url = link;
                cy.get_stat_dur(link, site_state[k])
                site_state[k].testing_date = Cypress.moment().format('MMM DD, YYYY')
            })

            cy.readFile("cypress/integration/data/tools_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k]
                site_state[k].url = link;
                cy.visit(link)
                cy.login("login", "password")
                cy.wait(1000)
                cy.find_errors(site_state[k])
                if (k == 25) {
                    cy.wait(10000)
                } else if (k == 24) {
                    cy.wait(5000)
                } else {
                    cy.wait(4000)
                }
                cy.check_tables(site_state[k])
            })
        })
    }
})