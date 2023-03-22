

let result;
let search = new URLSearchParams(document.location.search).get("search")? new URLSearchParams(document.location.search).get("search") : "";
let infobook = new URLSearchParams(document.location.search).get("info")? new URLSearchParams(document.location.search).get("info") : "";


try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${search}`)
    result = await response.json()
   //console.log("result", JSON.stringify(result, null, 2))
   } catch (err) {
    console.error("Fail", err)
}

console.log(result)

function setSearchInput(form) {

    //create Elements
    const input = form.querySelector("input");
    const label = form.querySelector("label");

    //set Attributes and values to the Elements
    label.setAttribute("for","search");
    label.innerHTML = "Suche ";
    input.setAttribute("placeholder","Suche nach Büchern/Autoren/...");
    input.setAttribute("name","search");
    input.setAttribute("id","search");
    input.value = search;

    //Append to form

    return form;
}

//create input Elements in document body
setSearchInput(document.querySelector(".form_search"))


const books = result.docs.map(element => {
     return`
        
        <h2 class="title">${element.title}</h2>
        <p class="author">von ${element.author_name}</p>
       `
});

const divelement = document.createElement("div");

books.forEach((element,i) => {
    const article = document.createElement("article");
    article.classList.add("book");
    article.setAttribute("id", `${result.docs[i].key.replace("/works/","")}`)
    article.innerHTML = element;
    article.style.backgroundImage = `url('https://covers.openlibrary.org/b/olid/${result.docs[i].cover_edition_key}-M.jpg')`
    divelement.classList.add("main");
    divelement.append(article);

});

document.body.append(divelement)

document.querySelectorAll(".book").forEach((element) => {
    element.addEventListener("click", (event) => {
        window.location = `..?info=${element.id}`;
    })
})


if(infobook) {

    let result2 = "";

    try {
        let response = await fetch(`https://openlibrary.org/works/${infobook}.json`)
        result2 = await response.json()
       } catch (err) {
        console.error("Fail", err)
    }



    console.log(infobook)
    console.log(result2)



    document.body.append(await g(result2, infobook));
}

async function g(result2, id) {
    
    const article = document.createElement("article");
    article.setAttribute("id", id);
    article.classList.add("infopage");

    let authors = result2.authors? await getAuthorInfos(result2.authors): undefined;
    console.log(authors)
    let aList = authors? authors.map(author => `<a class='link ${author.key.replace("/authors/","")}'>${author.name}</a>`).join("  ") : "kein Autor angegeben";

    console.log(authors);

    const page = `
    <h1 class="title">${result2.title}</h1>
    <p class="authors">${aList}</p>
    <p class="description">${result2.description? result2.description : "keine beschreibung"}</p>
    `

    article.innerHTML = (page);
    return article;
}

async function getAuthorInfos(authors) {
    let result2 = [];

    for(const author of authors) {
        try {
            let response = await fetch(`https://openlibrary.org${author["author"].key}.json`)
            result2.push(await response.json());
           } catch (err) {
            console.error("Fail", err)
        }
    }
    return result2;
}