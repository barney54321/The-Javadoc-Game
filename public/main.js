const playButton = document.getElementById("play");
const scoreDiv = document.getElementById("score");
const pagesDiv = document.getElementById("pages");
const box = $("#box");

const startInput = document.getElementById("start");
const goalInput = document.getElementById("goal");

box.hide();

let clicks = 0;
let pages = [];
let goal = "";

function buttonClick(link) {
    // Remove the ../.. from the link
    const cut = link.substring(5);

    // Load the page
    load(cut);

    // Update clicks
    clicks += 1;

    // Update the score at the top
    scoreDiv.innerText = "Clicks: " + clicks;
}

async function load(docURL) {
    box.hide();

    pages.push(docURL.replaceAll("\/", ".").replace("\.html", "").replace(".java", "java"));

    $.ajax({
        url: "/api/doc/" + encodeURIComponent(docURL),
        type: "GET",
        success: (res) => {
            box.empty();

            // Turn string into DOM elements
            const html = $.parseHTML(res.doc);
            box.append(html);

            // Remove headers and footnotes
            $(".topNav").remove();
            $(".subNav").remove();
            $(".bottomNav").remove();
            $(".legalCopy").remove();

            // Remove images
            $("img").remove();

            // Change links to act as buttons
            const links = $("a");

            $.each(links, (index, item) => {
                let link = $(item);
                let href = link.attr("href");

                if (href != undefined) {
                    link.click(() => {
                        buttonClick(href);
                    });
                }

                link.removeAttr("href");
            });

            let pageText = "Pages: " + pages[0];

            for (let i = 1; i < pages.length; i++) {
                pageText += ", " + pages[i];
            }

            pagesDiv.innerText = pageText;

            box.show();

            if (docURL.replaceAll("\/", ".").replace("\.html", "").replace(".java", "java").includes(goal)) {
                alert("Congratulations. You have reached the goal in " + clicks + " clicks");
            }
        },
        error: (err) => {
            alert("Something is horribly broken");
            console.log(err);
        }
    });
}

async function setup() {

    pages = [];

    goal = goalInput.value;

    const transformed = startInput.value.replaceAll("\.", "/");

    clicks = 0;
    scoreDiv.innerText = "Clicks: " + clicks;
    load(transformed + ".html");
    playButton.innerText = "Reset";
}

playButton.addEventListener("click", setup);
