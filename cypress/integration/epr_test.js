describe("Checking tools", () => {
    var site_state = [];
    var y = 3 // year index
    var years = [2015, 2016, 2017, 2018, 2019, 2020, 2021]
    var n = 17
    var start = 0
    var base = "https://icms-dev.cern.ch/epr/"
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
    for (let k = start; k < n; k++) {
        it("Logs in and tests the pages", () => {
            cy.readFile("cypress/integration/data/institutes.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                site_state[k].url = link;
                cy.get_stat_dur(link, site_state[k]);
                site_state[k].testing_date = Cypress.moment().format('MMM DD, YYYY');
            })
            cy.readFile("cypress/integration/data/institutes.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                site_state[k].url = link;

                cy.visit(links[k]);
                cy.server();
                cy.route('POST', 'https://icms-dev.cern.ch/epr/**').as('posts');
                cy.login("arhayrap", "Arch1916F");
                cy.wait(4000);

                cy.get("body > div.container", {
                    timeout: 40000
                });
                cy.get("div.navbar-collapse").first().get("ul.navbar-nav").first().as("header_menu");
                cy.get("@header_menu").children().eq(0).as("curr_opt").click();

                cy.wait_for_requests("@posts", site_state[k]);

                cy.get("@curr_opt").children().last().then(() => {
                    cy.get("@curr_opt").children().last().children("li").not(".required").eq(y).click();
                })

                cy.wait_for_requests("@posts", site_state[k]);
                cy.wait(2000)

                cy.get("@header_menu").get("ul.nav > li.dropdown", {
                    timeout: 40000
                }).children().each(($li, index_li, $ul) => {
                    $li[0].click()
                })
                cy.check_tables_epr(site_state[k])
                cy.writeFile("cypress/integration/data/testing_institutes.json", site_state);
                cy.save_data(site_state[k], base, years[y]);
                console.log(site_state);
            })
        })
    }
})