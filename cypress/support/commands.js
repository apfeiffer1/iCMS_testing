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
Cypress.Commands.add("unify", (obj1, obj2, site_state) => {
    let obj = obj1.concat(obj2.slice(1));
    for (var i = 0; i < obj.length; ++i) {
        for (var j = i + 1; j < obj.length; ++j) {
            if (obj[i] == obj[j]) {
                obj.splice(j, 1);
            }
        }
    }
    site_state.table = obj;
})

Cypress.Commands.add("check_tables", (site_state) => {
    cy.get("main").then(($body, $site_state) => {
        let t = [];
        let t_tabs = [
            [],
            []
        ];
        let site = site_state;
        if ($body.find("table").length) {
            if ($body.find(".v-slide-group__wrapper").length) {
                cy.get(".v-slide-group__wrapper").each(($wrapper, index1, $wrappers) => {
                    cy.get(".v-slide-group__wrapper .v-tab").as("tab_buttons").each(($button, index2, $buttons) => {
                        cy.get("@tab_buttons").eq(index2).click()
                        if ($body.find("div.v-window table > tbody").length) {
                            cy.get("main").find("div.v-window table > tbody").each(($tab, index3, $tables) => {
                                cy.get("main div.v-window table > tbody").eq(index3).children().then((tr1) => {
                                    if (tr1.length <= 2) {
                                        t_tabs[index2].push("Table named " + $button.get(0).innerText + " is empty")
                                    } else {
                                        t_tabs[index2].push("Table named " + $button.get(0).innerText + " has content")
                                    }
                                })
                            })
                        }
                        cy.get("main div.v-card").each(($tab, index3, $tables) => {
                            if ($tab.find("div.v-window").length == 0 && $tab.find("table > tbody").length) {
                                cy.get("main div.v-card").eq(index3).get("table > tbody").children().then((tr1) => {
                                    console.log("inside")
                                    if (tr1.length <= 2) {
                                        t_tabs[index2].push("Table number " + (index3) + " is empty")
                                    } else t_tabs[index2].push("Table number " + (index3) + " has content")
                                })
                            }
                        })
                        cy.unify(t_tabs[0], t_tabs[1], site)
                    })
                })
            } else {
                cy.get("main table > tbody").each(($tab, index0, $tables) => {
                    cy.get("main table > tbody").children().then((tr1) => {
                        if (tr1.length <= 2) t.push("Table number " + (index0 + 1) + " is empty")
                        else t.push("Table number " + (index0 + 1) + " has content")
                    })
                })
                site.table = t;
            }
        } else {
            site_state.table = "None";
        }
    })
})

Cypress.Commands.add("wait_for_requests", (tag, site_state) => {
    console.log("here!")
    cy.wait(tag, {
        timeout: 40000
    }).then((xhr) => {
        console.log(xhr.status)
        if (xhr.status == 404 || xhr.status == 403) {
            console.log("entered!!")
            site_state.late_errors.push(xhr.url + " : " + xhr.status + "  " + xhr.statusMessage)
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
