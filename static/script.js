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
            li.innerText = tag.startsWith("#") ? tag : "#" + tag;
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
document.getElementById("hashtag").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        analyze();
    }
});