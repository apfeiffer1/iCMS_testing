describe("Checking tools", ()=>{

it("Logs in and tests the website", ()=>{
	cy.visit("https://icms-dev.cern.ch/tools/")
	cy.login()
	cy.wait(1000)
	cy.readFile("cypress/fixtures/tools_links.json").then(($link_obj)=>{
	    let links = $link_obj[0]["links"];
	    let site_state = [];
	    for(var j = 0; j < links.length; j++){site_state.push({url:"", status:0, duration: 0, table: "", late_errors: "", testing_date: ""})}
	    cy.wrap(site_state).each(($state, i, $site_state)=>{
		let link = links[i]
		cy.request(link).then((resp, site_state)=>{
		    $site_state[i].url = link;
		    if(expect(resp).to.have.property("status")){
			$site_state[i].status = resp.status;
		    }
		    if(expect(resp).to.have.property("duration")){
			$site_state[i].duration = resp.duration;
		    }
		})
		cy.visit(link)
		cy.wait(2000)
		
		cy.window().then((win) => {
		    cy.stub(win.console, 'error', ($obj)=>{
			$site_state[i].late_errors = $obj.name + " : " + $obj.message;
		    })
		})
		if(i == 25){cy.wait(7500)}
		else if(i == 24){cy.wait(4000)}
		else{cy.wait(2000)}
		cy.get("main").then(($body, site_state)=>{
		    var t = []
		    if($body.find("table").length){
			cy.get("main").find("table").as("table_body")
			cy.get("@table_body").each(($tabs, index0, $tab)=>{
			cy.get("@table_body").get("tbody > tr")
			.then((tr)=>{
				if(tr.length <= 2) t.push("Table number " + (index0+1) + " is empty")
				else t.push("Table number " + (index0+1) + " has content")
			})
			$site_state[i].table = t;
		    })
		    }
		    else{
			$site_state[i].table = "None";
		    }
		})
		site_state[i].testing_date = Cypress.moment().format('MMM DD, YYYY')
	    })
	    cy.writeFile("cypress/fixtures/separate_test.json", site_state)
	})
    })
})
