describe("Checking epr", () => {
    var site_state = [];
    var y = 0;
    var years = [2015, 2016, 2017, 2018, 2019, 2020, 2021];
    var n = 50;
    var base = "https://icms-dev.cern.ch/epr/";
    for (var j = 0; j < n; j++) {
        site_state.push({
            url: "",
            status: 0,
            duration: 0,
            table: "",
            late_errors: [],
            testing_date: ""
        });
    }
    for (let k = 0; k < n; k++) {
        it("Logs in and visits the page", () => {
            cy.intercept('POST', 'https://icms-dev.cern.ch/epr/api/**').as('posts');
            cy.readFile("cypress/fixtures/epr_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                cy.get_stat_dur(link, site_state[k]);
            });
            cy.readFile("cypress/fixtures/epr_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                cy.visit(links[k]);
            });
	    cy.login("login", "password");
            cy.wait(4000);
            cy.get("body > div.container", {
                timeout: 50000
            });
	    cy.find_popup_alerts(site_state[k]);
	    cy.select_year("@posts", site_state[k], y);
	    cy.click_navbar_elems("@posts", site_state[k]);
            cy.check_tables_epr(site_state[k]);
            cy.writeFile("data/epr_out.json", site_state);
            cy.save_data(site_state[k], base, years[y]);
            console.log(site_state);
        });
    }
});
