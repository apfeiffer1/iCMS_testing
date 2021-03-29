Cypress.Commands.add("login", (login, password) => {
    cy.get("#kc-form-login").within(() => {
        cy.get("input[tabindex=1]").type(login)
        cy.get("input[tabindex=2]").type(password)
        cy.get("input[tabindex=4]").click()
    })
})

Cypress.Commands.add("get_stat_dur", (link, site_state) => {
    cy.request(link).then((resp) => {
        if (expect(resp).to.have.property("status")) {
            site_state.status = resp.status;
        }
        if (expect(resp).to.have.property("duration")) {
            site_state.duration = resp.duration;
        }
    })
})

Cypress.Commands.add("find_errors", (site_state) => {
    cy.window().then((win) => {
        cy.stub(win.console, 'error', ($obj) => {
            site_state.late_errors.push($obj.name + " : " + $obj.message);
        })
    })
})

Cypress.Commands.add("check_tables", (site_state) => {
    cy.get("main").then(($body, $site_state) => {
        var t = []
        var site = site_state
        if ($body.find("table").length) {
            cy.get("main").find("table").as("table_body")
            cy.get("@table_body").each(($tabs, index0, $tab) => {
                cy.get("@table_body").get("tbody > tr")
                    .then((tr) => {
                        if (tr.length <= 2) t.push("Table number " + (index0 + 1) + " is empty")
                        else t.push("Table number " + (index0 + 1) + " has content")
                    })
                site.table = t;
            })
        } else {
            site_state.table = "None";
        }
    })
})

Cypress.Commands.add("check_tables_epr", (site_state) => {
    cy.get(".container").then(($body, $site_state) => {
        var t = []
        var site = site_state
        if ($body.find("table").length) {
            cy.get(".container").find("table").as("table_body")
            if ($body.find("table").length) {
                cy.get("@table_body").get("table").each(($tabs, index0, $tab) => {
                    cy.get("@table_body").get("table").eq(index0).children().first().children()
                        .then((tr) => {
                            cy.get("@table_body").get("table").eq(index0).children().first().children()
                            if (tr.length <= 1) t.push("Table number " + (index0 + 1) + " is empty")
                            else t.push("Table number " + (index0 + 1) + " has content")
                        })
                    site.table = t;
                })
            } else {
                cy.get("@table_body").each(($tabs, index0, $tab) => {
                    cy.get("@table_body").get("tbody > tr")
                        .then((tr) => {
                            if (tr.length <= 1) t.push("Table number " + (index0 + 1) + " is empty")
                            else t.push("Table number " + (index0 + 1) + " has content")
                        })
                    site.table = t;
                })
            }
        } else {
            site_state.table = "None";
        }
    })
})