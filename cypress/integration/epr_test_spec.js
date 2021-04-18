describe("Checking epr", () => {
    var site_state = [];
    var y = 0
    var years = [2015, 2016, 2017, 2018, 2019, 2020, 2021]
    var n = 1
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
    for (let k = 0; k < n; k++) {
        it("Logs in and visits the page", () => {
            //cy.server();
            cy.intercept('POST', 'https://icms-dev.cern.ch/epr/api/**').as('posts');
            //cy.intercept('GET', 'https://icms-dev.cern.ch/epr/**').as('gets');
            cy.readFile("cypress/fixtures/epr_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                cy.get_stat_dur(link, site_state[k]);
            })
            cy.readFile("cypress/fixtures/epr_links.json").then(($link_obj) => {
                let links = $link_obj[0]["links"];
                let link = links[k];
                cy
		.visit(links[k])
                .login("arhayrap", "Arch1916F")
                .wait(4000);
		//.wait("@gets")//.then(() => {
                cy.get("body > div.container", {
                    timeout: 50000
                })
		//cy.on("window:load", ()=>{
		    .find_popup_alerts(site_state[k])
		    .select_year("@posts", site_state[k], y)
		    //.wait_for_requests("@posts", site_state[k])
		    .click_navbar_elems("@posts", site_state[k])
            	    .check_tables_epr(site_state[k])
            	    .writeFile("data/epr_out.json", site_state)
            	    .save_data(site_state[k], base, years[y])
            	    console.log(site_state)
		//})

		//})
            })
        })
    }
})
