var chart = document.querySelector(".chart-history .chart");
var base = 120;
var startYear = 1850;
var endYear = 2030;
var gapYear = 1200;
var gap = 120;
var baseY = 320;
var list = [];

setTimeout(function () {
    var loader = document.querySelector(".loader");
    loader.classList.remove("loader");
    loader.classList.add("title-chart");
    loader.innerHTML =
        "Sơ đồ khái quát các mốc thời gian quan trọng của Lịch sử Đảng Cộng Sản Việt Nam";
    setTimeout(() => {
        loader.classList.add("show");
    }, 300);
    createChart();

    var chartTimes = document.querySelectorAll(".chart-time");
    chartTimes.forEach((time) => {
        var timeline = time.innerHTML;
        if (
            caculateMarginLeft(timeline).marginLeft ==
            caculateMarginLeft("2/1930").marginLeft
        ) {
            setTimeout(function () {
                time.scrollIntoView({
                    behavior: "smooth", // Cuộn mượt
                    inline: "center",
                    block: "nearest",
                    // block: "center",
                });
            }, 400);
        }
    });

    return;
    const container = document.querySelector(".chart-history .chart");
    const wrapper = document.querySelector(".chart-history");

    // Lấy kích thước thực sau khi scale
    const scaledHeight = container.offsetHeight * 0.8;
    console.log("WRAPPER");
    console.log(scaledHeight);
    // Cập nhật kích thước của wrapper
    wrapper.style.height = `${scaledHeight}px`;
}, 2000);

function createChart() {
    console.log("CHART");
    console.log(chart);
    chart.innerHTML = "";
    chart.appendChild(createLineTime());
    createPoint();

    var tables = document.querySelectorAll("table");
    var cnt = 1;
    if (tables) {
        /* Store Timeline */
        tables.forEach((table) => {
            var rows = table.querySelectorAll("tr");
            rows.forEach((row) => {
                if (row.querySelector(".timeline")) {
                    var timeline = row
                        .querySelector(".timeline")
                        .innerHTML.trim();
                    var header = row
                        .querySelector(".timeline-header")
                        .innerHTML.trim();
                    var caculateX = caculateMarginLeft(timeline).marginLeft;
                    list.push({ time: timeline, pos: caculateX, level: 0 });
                }
            });
        });

        list.sort((a, b) => a.pos - b.pos);
        for (var i = 0; i < list.length; i++) {
            list[i].level = i % 7;
        }

        /* Add to Inteface */
        tables.forEach((table) => {
            console.log("GET TABLE");
            var rows = table.querySelectorAll("tr");
            rows.forEach((row) => {
                if (row.querySelector(".timeline")) {
                    cnt += 1;
                    var timeline = row
                        .querySelector(".timeline")
                        .innerHTML.trim();
                    var header = row
                        .querySelector(".timeline-header")
                        .innerHTML.trim();
                    console.log("TIMELINE-HEADER = " + timeline + " " + header);

                    /*ADD TIMELINE */

                    var caculateX = caculateMarginLeft(timeline);

                    var baseX = caculateX.marginLeft;
                    let index = list.findIndex(
                        (item) => item.time === timeline
                    );
                    var found = 0; // Biến để lưu trạng thái tìm thấy
                    for (let i = index - 1; i >= 0; i--) {
                        if (
                            list[index].pos - list[i].pos < 320 &&
                            list[index].level == list[i].level
                        ) {
                            found = 320 + 7 * 2 + 8 * 2; // Tìm thấy một phần tử thỏa mãn
                            break; // Thoát khỏi vòng lặp
                        }
                    }

                    var heightLineUp = 40 + (index % 7) * 40;
                    var heightLineBottom = 60 + (index % 7) * 60;

                    console.log(
                        "timelinebase " +
                            timeline +
                            " " +
                            baseX +
                            " " +
                            caculateX.range +
                            " " +
                            index +
                            " " +
                            found
                    );
                    var divLineUp = document.createElement("div");
                    divLineUp.classList.add("line-up");
                    divLineUp.style.top = baseY - heightLineUp + "px";
                    divLineUp.style.left = baseX - 1 + "px";
                    divLineUp.style.height = heightLineUp + "px";

                    var divLineBottom = document.createElement("div");
                    divLineBottom.classList.add("line-bottom");
                    divLineBottom.style.top = baseY + "px";
                    divLineBottom.style.left = baseX - 1 + "px";
                    divLineBottom.style.height = heightLineBottom + "px";

                    var divDiamondUp = document.createElement("div");
                    divDiamondUp.classList.add("diamond");
                    divDiamondUp.classList.add("diamond-up");
                    divDiamondUp.style.top = baseY - heightLineUp + "px";
                    divDiamondUp.style.left = baseX - 7 + "px";

                    var divDiamondBottom = document.createElement("div");
                    divDiamondBottom.classList.add("diamond");
                    divDiamondBottom.classList.add("diamond-bottom");
                    divDiamondBottom.style.top =
                        baseY + heightLineBottom + "px";
                    divDiamondBottom.style.left = baseX - 7 + "px";

                    var divChartTime = document.createElement("div");
                    divChartTime.innerHTML = timeline;
                    divChartTime.classList.add("chart-time");
                    divChartTime.style.top = baseY - heightLineUp - 24 + "px";
                    divChartTime.style.left = baseX + "px";

                    var divChartHeader = document.createElement("div");
                    divChartHeader.innerHTML = header;
                    divChartHeader.classList.add("chart-header");
                    divChartHeader.style.top =
                        baseY + heightLineBottom + 10 + "px";
                    divChartHeader.style.left =
                        baseX - 320 - 7 - 8 + found + "px";
                    if (found > 0) divChartHeader.style.textAlign = "left";

                    var divTimeRange = document.createElement("div");
                    divTimeRange.classList.add("time-range");
                    divTimeRange.style.top = baseY + heightLineBottom + "px";
                    divTimeRange.style.left = baseX + "px";
                    divTimeRange.style.width = caculateX.range + "px";

                    chart.appendChild(divLineUp);
                    chart.appendChild(divLineBottom);
                    chart.appendChild(divDiamondUp);
                    chart.appendChild(divDiamondBottom);
                    chart.appendChild(divChartTime);
                    chart.appendChild(divChartHeader);
                    chart.appendChild(divTimeRange);
                }
            });
        });
    } else {
        console.log("CANNOT FIND TABLE");
    }

    console.log("DONE CREATE CHART");
}
function createLineTime() {
    var div = document.createElement("div");
    div.classList.add("linetime");
    return div;
}

function createPoint() {
    var smallOffset = 3;
    var jump = 10;

    var startTimeline = 1850;
    var endTimeline = 2030;

    var idx = startTimeline;
    var cnt = 0;
    while (idx <= endTimeline) {
        var marginLeft = base + cnt * gapYear - smallOffset;
        console.log("CREATE POINT");

        var div = document.createElement("div");
        div.classList.add("point");
        div.style.left = marginLeft + "px";
        chart.append(div);

        /* Create year */
        var marginLeftYear = base + cnt * gapYear;
        var divYear = document.createElement("div");
        divYear.classList.add("year");
        divYear.innerHTML = idx;
        divYear.style.left = marginLeftYear + "px";
        chart.append(divYear);

        idx += 10;
        cnt += 1;
    }
}

function caculateMarginLeft(inputStr) {
    inputStr = inputStr.trim();

    // Kiểm tra khoảng thời gian "1958-1963"
    if (inputStr.includes("-") && !inputStr.includes("/")) {
        let [start, end] = inputStr.split("-");
        var a = parseInt(start.trim());
        var b = parseInt(end.trim());
        return {
            marginLeft: (a - startYear) * gap + base,
            range: (b - a) * gap,
        };
        // return {
        //     start: { day: 0, month: 0, year: parseInt(start.trim()) },
        //     end: { day: 0, month: 0, year: parseInt(end.trim()) },
        // };
    }

    // Kiểm tra dạng "a/b/c" hoặc "a/b"
    if (inputStr.includes("/")) {
        let parts = inputStr.split("/").map(Number);
        if (parts.length === 3) {
            // Dạng a/b/c -> (Ngày, Tháng, Năm)
            var a = parseInt(parts[0]);
            var b = parseInt(parts[1]);
            var c = parseInt(parts[2]);

            return {
                marginLeft:
                    (c - startYear) * gap +
                    (b * gap) / 12 +
                    Math.min(31, a) / (12 * gap) +
                    base,
                range: 0,
            };
        } else if (parts.length === 2) {
            // Dạng a/b -> (Ngày = 0, Tháng, Năm)
            var a = parseInt(parts[0]);
            var b = parseInt(parts[1]);
            return {
                marginLeft: (b - startYear) * gap + (a * gap) / 12 + base,
                range: 0,
            };
        }
    }

    // Kiểm tra dạng năm "1958"
    if (!isNaN(inputStr)) {
        return {
            marginLeft: (parseInt(inputStr) - startYear) * gap + base,
            range: 0,
        };
    }

    // Nếu không khớp với bất kỳ mẫu nào
    return null;
}
