let chart;

function normalizeHashtag(tag) {
    const trimmed = tag.trim();
    if (!trimmed) return "";
    return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

function setLoadingState(isLoading) {
    const button = document.getElementById("analyzeButton");
    button.disabled = isLoading;
    button.textContent = isLoading ? "Analyzing..." : "Analyze";
    button.setAttribute("aria-busy", String(isLoading));
}

function updateScore(score, caption) {
    document.getElementById("score").innerText = score;
    document.getElementById("scoreCaption").innerText = caption;
}

function renderRelatedTags(tags) {
    const list = document.getElementById("related");
    list.innerHTML = "";
    list.classList.remove("empty-state");

    if (!tags.length) {
        list.classList.add("empty-state");
        list.innerHTML = "<li>No related hashtags found.</li>";
        return;
    }

    tags.forEach((tag) => {
        const hashtagText = normalizeHashtag(tag);

        const li = document.createElement("li");
        li.className = "related-item";

        const span = document.createElement("span");
        span.className = "related-tag";
        span.innerText = hashtagText;

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "copy-btn";
        copyBtn.setAttribute("aria-label", `Copy ${hashtagText}`);
        copyBtn.innerText = "Copy";

        copyBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(hashtagText);
                copyBtn.innerText = "Done";
                setTimeout(() => {
                    copyBtn.innerText = "Copy";
                }, 900);
            } catch (error) {
                copyBtn.innerText = "Error";
                setTimeout(() => {
                    copyBtn.innerText = "Copy";
                }, 1200);
            }
        };

        li.appendChild(span);
        li.appendChild(copyBtn);
        list.appendChild(li);
    });
}

function showChart(trendData) {
    const canvas = document.getElementById("trendChart");
    const ctx = canvas.getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Trend",
                data: trendData,
                borderColor: "#d95d39",
                backgroundColor: "rgba(217, 93, 57, 0.14)",
                fill: true,
                borderWidth: 3,
                tension: 0.36,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#9f2d16"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#5f6a72"
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(24, 32, 39, 0.08)"
                    },
                    ticks: {
                        color: "#5f6a72"
                    }
                }
            }
        }
    });
}

async function analyze() {
    const input = document.getElementById("hashtag");
    const hashtag = normalizeHashtag(input.value);

    if (!hashtag) {
        updateScore("--", "Enter a hashtag first.");
        input.focus();
        return;
    }

    input.value = hashtag;
    setLoadingState(true);
    updateScore("...", "Crunching the current hashtag estimate.");

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ hashtag })
        });

        const data = await response.json();
        updateScore(data.popularity, `Performance snapshot for ${hashtag}.`);
        renderRelatedTags(data.related || []);
        showChart(data.trend || []);
    } catch (error) {
        updateScore("--", "Something went wrong while analyzing this hashtag.");
    } finally {
        setLoadingState(false);
    }
}

async function loadTrending() {
    try {
        const response = await fetch("/trending");
        const data = await response.json();

        const list = document.getElementById("trendingList");
        list.innerHTML = "";

        data.trending.forEach((tag) => {
            const li = document.createElement("li");

            const button = document.createElement("button");
            button.type = "button";
            button.className = "trend-item";
            button.innerText = tag;
            button.setAttribute("aria-label", `Analyze trending hashtag ${tag}`);
            button.onclick = () => {
                document.getElementById("hashtag").value = tag;
                analyze();
            };

            li.appendChild(button);
            list.appendChild(li);
        });
    } catch (error) {
        const list = document.getElementById("trendingList");
        list.innerHTML = "<li>Unable to load trending hashtags right now.</li>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".search-form").addEventListener("submit", (event) => {
        event.preventDefault();
        analyze();
    });

    showChart([0, 0, 0, 0, 0, 0, 0]);
    loadTrending();
});
