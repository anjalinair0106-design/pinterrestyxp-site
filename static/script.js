let chart;

function normalizeHashtag(tag) {
    const trimmed = tag.trim();
    if (!trimmed) return "";
    const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    return normalized.toLowerCase();
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

function setFormStatus(message, isError = false) {
    const status = document.getElementById("formStatus");
    status.innerText = message;
    status.classList.toggle("error", isError);
    status.classList.toggle("success", !isError);
}

function parseCommaSeparatedTags(value) {
    return value
        .split(",")
        .map((item) => normalizeHashtag(item))
        .filter(Boolean);
}

function parseTrendValues(value) {
    return value
        .split(",")
        .map((item) => Number.parseInt(item.trim(), 10))
        .filter((item) => !Number.isNaN(item));
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
        if (!response.ok) {
            throw new Error(data.error || "Unable to analyze this hashtag.");
        }

        updateScore(data.popularity, `Performance snapshot for ${hashtag}.`);
        renderRelatedTags(data.related || []);
        showChart(data.trend || []);
    } catch (error) {
        updateScore("--", error.message || "Something went wrong while analyzing this hashtag.");
        renderRelatedTags([]);
        showChart([0, 0, 0, 0, 0, 0, 0]);
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

async function saveHashtag() {
    const tag = normalizeHashtag(document.getElementById("newTag").value);
    const popularityValue = Number.parseInt(document.getElementById("newPopularity").value, 10);
    const related = parseCommaSeparatedTags(document.getElementById("newRelated").value);
    const trend = parseTrendValues(document.getElementById("newTrend").value);
    const isTrending = document.getElementById("newTrending").checked;
    const saveButton = document.getElementById("saveButton");

    if (!tag) {
        setFormStatus("Enter a hashtag before saving.", true);
        return;
    }

    if (Number.isNaN(popularityValue) || popularityValue < 0 || popularityValue > 100) {
        setFormStatus("Popularity must be a whole number between 0 and 100.", true);
        return;
    }

    if (trend.length !== 7) {
        setFormStatus("Trend data must include exactly 7 numbers.", true);
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
    setFormStatus("Saving hashtag to the database...");

    try {
        const response = await fetch("/hashtags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tag,
                popularity: popularityValue,
                related,
                trend,
                isTrending
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Unable to save this hashtag.");
        }

        document.querySelector(".add-form").reset();
        setFormStatus(data.message || `${tag} saved successfully.`);
        document.getElementById("hashtag").value = data.tag || tag;
        await loadTrending();
        await analyze();
    } catch (error) {
        setFormStatus(error.message || "Something went wrong while saving this hashtag.", true);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Save Hashtag";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".search-form").addEventListener("submit", (event) => {
        event.preventDefault();
        analyze();
    });

    document.querySelector(".add-form").addEventListener("submit", (event) => {
        event.preventDefault();
        saveHashtag();
    });

    showChart([0, 0, 0, 0, 0, 0, 0]);
    loadTrending();
});
