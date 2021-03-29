describe("Checking epr", () => {
    var site_state = [];
    var n = 50
    var start = 0
    var end = n + start
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
            cy.readFile("cypress/integration/data/epr_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k + start];
                site_state[k].url = link;
                cy.get_stat_dur(link, site_state[k])
                site_state[k].testing_date = Cypress.moment().format('MMM DD, YYYY')
            })
            cy.readFile("cypress/integration/data/epr_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k]
                site_state[k].url = link;
                cy.visit(link)
                cy.login("login", "password")
                cy.wait(1000)
                cy.find_errors(site_state[k])
                cy.wait(6000)
                cy.check_tables_epr(site_state[k])
                cy.writeFile("cypress/integration/data/epr_test2.json", site_state)
            })
        })
    }
})