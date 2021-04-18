// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })

Cypress.Commands.add("login", (login, password) => {
    cy.get("#kc-form-login").within(() => {
        cy.get("input[tabindex=1]").type(login);
        cy.get("input[tabindex=2]").type(password);
        cy.get("input[tabindex=4]").click();
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
    site_state.url = link;
    site_state.testing_date = Cypress.moment().format('MMM DD, YYYY');
})

Cypress.Commands.add("check_tables", (site_state) => {
    cy.get("main").then(($body, $site_state) => {
        let t = [];
        let site = site_state;
        if ($body.find("table").length) {
            if ($body.find(".v-slide-group__wrapper").length) {
                cy.get(".v-slide-group__wrapper .v-tab").as("tab_buttons").click({
                    multiple: true
                });
                cy.get("main table > tbody").each(($tab, index0, $tables) => {
                    cy.get("main table > tbody").children().then((tr1) => {
                        if (tr1.length <= 2) t.push("Table number " + (index0 + 1) + " is empty");
                        else t.push("Table number " + (index0 + 1) + " has content");
                    })
                })
                site.table = t;
            } else {
                cy.get("main table > tbody").each(($tab, index0, $tables) => {
                    cy.get("main table > tbody").children().then((tr1) => {
                        if (tr1.length <= 2) t.push("Table number " + (index0 + 1) + " is empty");
                        else t.push("Table number " + (index0 + 1) + " has content");
                    })
                })
                site.table = t;
            }
        } else {
            site_state.table = "None";
        }
    })
})

Cypress.Commands.add("check_tables_epr", (site_state) => {
    cy.get("div.container").then(($body, $site_state) => {
        var t = [];
        var site = site_state;
        if ($body.find("table").length) {
            cy.get("div.container table > tbody").as("table_body")
            cy.get("@table_body").each(($tabs, index0, $tab) => {
                cy.get("@table_body").eq(index0).children().then((tr) => {
                        cy.get("@table_body").eq(index0).children();
                        if (tr.length <= 1) t.push("Table number " + (index0 + 1) + " is empty");
                        else t.push("Table number " + (index0 + 1) + " has content");
                    })
                site.table = t;
            })
        } else {
            site_state.table = "None";
        }
    })
})

Cypress.Commands.add("wait_for_requests", (alias, site_state) => {
    cy.wait(alias, {
        timeout: 40000
    }).then((xhr) => {
        if (xhr.status < 599 && xhr.status > 400) {
            site_state.late_errors.push(xhr.url + " : " + xhr.status + "  " + xhr.statusMessage);
        }
    })
})

Cypress.Commands.add("find_errors", (site_state) => {
    cy.window().then((win) => {
        cy.stub(win.console, 'error', ($obj) => {
            console.log($obj.name + " : " + $obj.message);
	    if($obj.message != undefined){
    	        site_state.late_errors.push($obj.name + " : " + $obj.message);
	    }
	    else{
		site_state.late_errors.push($obj);
	    }
        });
    });
})

Cypress.Commands.add("find_popup_alerts", (site_state) => {
    cy.on('window:alert', ($obj) => {
            console.log($obj);
            site_state.late_errors.push($obj);
    });
})

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
})

Cypress.Commands.add("select_year", (alias = "GET", site_state, year_index) => {
    cy.get("div.navbar-collapse").first().get("ul.navbar-nav").first().as("header_menu");
    cy.get("@header_menu").children().eq(0).as("curr_opt").click();
    //cy.wait_for_requests(alias, site_state);
    cy.get("@curr_opt").children().last().then(() => {
	cy.get("@curr_opt").children().last().children("li").not(".required").eq(year_index).click();
    });
})

Cypress.Commands.add("click_navbar_elems", (alias = "GET", site_state) => {
    cy.get("div.navbar-collapse").first().get("ul.navbar-nav").first().as("header_menu");
    cy.get("@curr_opt").click();
    //cy.wait_for_requests(alias, site_state);
    cy.wait(2000);
    cy.get("@header_menu").get("ul.nav > li.dropdown", {
        timeout: 40000
    }).children().each(($li, index_li, $ul) => {
        $li[0].click();
    });
})

Cypress.Commands.add("save_data", (obj, base, year = 2021) => {
    var suburl = obj.url.replace(base, "");
    base = base.replace("//", "");
    base = base.replaceAll("/", "_");
    suburl = suburl.replaceAll("/", "_")
    var path = "data/" + base;
    var json_path = path + "/" + suburl + "/" + String(year) + "/" + suburl + "_" + Cypress.moment().format("MM_DD_YYYY_h:mm") + ".json";
    cy.exec("mkdir -p " + path);
    cy.exec("mkdir -p " + path + "/" + suburl + "/");
    cy.exec("mkdir -p " + path + "/" + suburl + "/" + String(year) + "/");
    cy.writeFile(json_path, obj);
})
