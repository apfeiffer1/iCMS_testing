describe('My First Test', () => {

let links = [];
it("Gets the links", () => {
    cy.visit("https://icms.cern.ch/tools/")
    cy.login("login", "password")
	cy.get("header > div > .text--secondary > button[aria-haspopup=true]").as("header_menu").each(($j, index0, $jdiv)=>{
	cy.log("index is -> ", index0)
	cy.get("@header_menu").eq(index0).click({ force: true }).trigger("mouseover")
	cy.wait(1000)
	if(index0 == 0 || index0 == 1){
	cy.get("#app > div[role='menu']").children().eq(0).get("div").then(()=>{
	    cy.get("#app > div[role='menu']").children().eq(0).get("div").as("drop").get("a[role='menuitem']").each(($a, index1, $ah)=>{
		console.log("dropdown pass")
		links.push($a[0].href)
	    })
	})
	}
	cy.wait(1000)
	if(index0 == 0 || index0 == 2 || index0 == 3){
		cy.get("#app > div[role='menu']").children().eq(0).get("div").as("drop")
		cy.get("@drop").get(".v-list-group--no-action").as("add_drop")
		    .each(($d, index2, $divs)=>{
		cy.get("@add_drop").eq(index2).children().first().click()
		cy.get("@add_drop").eq(index2).children().last().children().each(($i, index3, $adiv)=>{
		console.log("additional drop pass for index:", index2)
		links.push($i[0].href)
		})
		    })
	}
	
	cy.reload()
	})
    cy.writeFile("cypress/fixtures/tools_links.json", [{"links": links}])
    console.log(links)
})

})