console.log("JS LOADED");

let chart;

function analyze() {
    const hashtag = document.getElementById("hashtag").value;
    document.getElementById("score").innerText = "Analyzing...";

    fetch("/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ hashtag })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("score").innerText = data.popularity;

        const list = document.getElementById("related");
        list.innerHTML = "";

        data.related.forEach(tag => {
    const li = document.createElement("li");

    const hashtagText = tag.startsWith("#") ? tag : "#" + tag;

    // Create text span
    const span = document.createElement("span");
    span.innerText = hashtagText;

    // Create copy button
    const copyBtn = document.createElement("button");
    copyBtn.innerText = "📋";
    copyBtn.style.marginLeft = "10px";

    // Copy functionality
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(hashtagText);
        copyBtn.innerText = "✅"; // feedback
        setTimeout(() => {
            copyBtn.innerText = "📋";
        }, 1000);
    };

    li.appendChild(span);
    li.appendChild(copyBtn);

    list.appendChild(li);
});

        showChart(data.trend);
    });
}

function showChart(trendData) {
    const ctx = document.getElementById('trendChart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
            datasets: [{
                label: 'Trend',
                data: trendData
            }]
        }
    });
}

function loadTrending() {
    fetch("/trending")
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("trendingList");
        list.innerHTML = "";

        data.trending.forEach(tag => {
            const li = document.createElement("li");
            li.innerText = tag;
            li.onclick = () => {
               document.getElementById("hashtag").value = tag;
               analyze();
    };
            list.appendChild(li);
        });
    })
    .catch(err => console.error("Error loading trending:", err));
}

document.addEventListener("DOMContentLoaded", function() {

    // Enter key support
    document.getElementById("hashtag").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            analyze();
        }
    });

    // Load trending hashtags
    loadTrending();
});