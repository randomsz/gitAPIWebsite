const USERNAME = "johnpapa";// Replace with the GitHub username
let perPage = document.getElementById("perPage").value;// repositories to be shown per page

console.log("perPage  " + perPage);
let currPage = "1";
var repoUrl = `https://api.github.com/users/${USERNAME}/repos?per_page=${perPage}`;

var firstUrl = "";
var prevUrl = "";
var nextUrl = "";
var lastUrl = "";

// fetch(`https://api.github.com/users/${USERNAME}`,{headers:{"AUTHORIZATION":"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"}})
fetch(`https://api.github.com/users/${USERNAME}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("response is not ok");
        }
        return response.json();
    })
    .then(data => {
        // console.log(data);
        fillUserInfo(data);
    })
    .catch(error => {
        console.error(error);
    })

function fillUserInfo(data) {
    document.getElementById("userImage").src = data.avatar_url;
    document.getElementById("name").innerHTML = data.name;
    document.getElementById("bio").innerHTML = `${data.bio || "No bio available"}`;
    document.getElementById("git").innerHTML = data.html_url;
    document.getElementById("location").innerHTML = `<strong>Location:</strong> ${data.location || "NA"}`;
    document.getElementById("twitter").innerHTML = `<strong>Twitter:</strong> ${data.twitter_username || "NA"}`;
}

// console.log(global_data);
function fetchUserRepos() {
    //console.log("repoUrl   " + repoUrl);
    fetch(repoUrl)
    .then((response) => {
        // console.log("response.headers =", response.headers.get("link"));
        if (!response.ok) {
            throw new Error("response not ok");
        }
        paginate(response);
        return response.json();
    })
    .then((data) => {
        //console.log(data);
        addUserRepos(data);
    })
    .catch((error) => {
        console.error(error);
    });
}

fetchUserRepos();

function addUserRepos(data) {
    document.getElementById("content").innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        var repo = document.createElement("div");
        repo.className = "repo";

        var name = document.createElement("div");
        name.className = "name";

        var desc = document.createElement("div");
        desc.className = "desc";

        var lang = document.createElement("div");
        lang.className = "lang";

        name.innerHTML = data[i].name;
        desc.innerHTML = `${data[i].description || "No description available."}`;


        repo.appendChild(name);
        repo.appendChild(desc);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', data[i].languages_url, false);
        xhr.send(null);
        if (xhr.status === 200) {
            // console.log("@@@@@ " + xhr.response);
            //console.log(xhr.response.headers);
            var obj = JSON.parse(xhr.response);
            //console.log("##### " + JSON.stringify(xhr.response));
            repo.appendChild(lang);
            for (var key in obj) {
                var lang_element = document.createElement("div");
                lang_element.innerHTML = key;
                lang_element.className = "langElement";
                lang.appendChild(lang_element);
            }
        } else {
            throw new Error('Request failed: ' + xhr.statusText);
        }
        document.getElementById("content").appendChild(repo);
        
    }
}

function paginate(response){
    const firstPattern = /(?<=<)([\S]*)(?=>; rel="first")/i;
    const prevPattern = /(?<=<)([\S]*)(?=>; rel="prev")/i;
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
    const lastPattern = /(?<=<)([\S]*)(?=>; rel="Last")/i;
    //const lastPattern = /&page=(\d+)>; rel="last"/i;

    //const nextPattern = `rel=\"next\"`;
    //let pagesRemaining = true;

    const linkHeader = response.headers.get("link");
    console.log("linkHeader  " + response.headers.get("link"));

    //first page
    isfirstPage = linkHeader && linkHeader.includes(`rel=\"first\"`);
    // console.log(isfirstPage);
    if (isfirstPage) {
      document.getElementById("firstBtn").style.visibility="visible";

      url = linkHeader.match(firstPattern)[0];
    //   console.log(url);
      firstUrl = url;
    }
    else
    {
        document.getElementById("firstBtn").style.visibility="hidden";   
    }

    //previous button
    isPrevPage = linkHeader && linkHeader.includes(`rel=\"prev\"`);
    // console.log(isPrevPage);
    if (isPrevPage) {
      document.getElementById("prevBtn").style.visibility="visible";

      url = linkHeader.match(prevPattern)[0];
    //   console.log(url);
      prevUrl = url;
    }
    else
    {
        document.getElementById("prevBtn").style.visibility="hidden";   
    }

    //next button
    isNextPage = linkHeader && linkHeader.includes(`rel=\"next\"`);
    // console.log(isNextPage);
    if (isNextPage) {
      document.getElementById("nextBtn").style.visibility="visible";

      url = linkHeader.match(nextPattern)[0];
      //console.log(url);
      nextUrl = url;
    }
    else
    {
        document.getElementById("nextBtn").style.visibility="hidden";   
    }

    //last button
    isLastPage = linkHeader && linkHeader.includes(`rel=\"last\"`);
    // console.log(isLastPage);
    if (isLastPage) {
      document.getElementById("lastBtn").style.visibility="visible";

      url = linkHeader.match(lastPattern)[0];
    //   console.log(url);
      lastUrl = url;
    }
    else
    {
        document.getElementById("lastBtn").style.visibility="hidden";   
    }

    //set current page
    if(!isPrevPage && !isNextPage){
        currPage = 1;
    }
    else if(isPrevPage){
       console.log("prevUrl   "+prevUrl);

        //take out last number from prevUrl
        //current page is number + 1
        // currPage = Number(prevUrl.slice(-1)) + 1;
        currPage = Number(prevUrl.substring(prevUrl.lastIndexOf("=")+1)) + 1;
    }
    else if(isNextPage){
        //console.log("nextUrl   " + nextUrl);

        //take out last number from prevUrl
        //current page is number - 1
        currPage = Number(nextUrl.substring(nextUrl.lastIndexOf("=")+1)) - 1;

    }
    //console.log("%%%%%%% " + currPage);
    document.getElementById("currentPage").innerHTML = currPage;

}

function onClickFirst() {
    // document.getElementById("content").innerHTML = "";
    repoUrl = firstUrl;
    fetchUserRepos();
}

function onClickPrev() {
    // document.getElementById("content").innerHTML = "";
    repoUrl = prevUrl;
    fetchUserRepos();
}

function onClickNext() {
    // document.getElementById("content").innerHTML = "";
    repoUrl = nextUrl;
    fetchUserRepos();
}

function onClickLast() {
    // document.getElementById("content").innerHTML = "";
    repoUrl = lastUrl;
    fetchUserRepos();
}

function updatePerPage(value) {
    const intValue = parseInt(value);
    if (!isNaN(intValue) && intValue > 0 && intValue <= 100) {
      perPage = intValue;
      repoUrl = `https://api.github.com/users/${USERNAME}/repos?per_page=${perPage}`;
      fetchUserRepos();
    } else {
      alert("Please enter a valid integer from 1 - 100.");
    }
  }
