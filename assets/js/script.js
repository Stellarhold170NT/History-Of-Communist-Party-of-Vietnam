/* Parse Markdown */
$.ajax({
    url: "./assets/data/text.txt", // Đường dẫn đến file Markdown
    method: "GET", // Phương thức HTTP
    dataType: "text", // Kiểu dữ liệu trả về
    success: function (markdown) {
        // Khi yêu cầu thành công
        const lines = splitTextIntoLines(markdown);
        const levels = countTabs(lines);

        /* Log */
        console.log(levels);
        for (var i = 0; i < lines.length; i++) {
            console.log("LINE: " + lines[i] + " LEVEL: " + levels[i]);
        }

        const htmlContent = parseMarkdown(0, -1, lines, levels).htmlString; // Hàm chuyển Markdown thành HTML
        $("#markdown-content").empty();
        $("#markdown-content").append(htmlContent);

        const fatherheader = document.querySelector(".accordion-header");
        const fathercontent = fatherheader.nextElementSibling;
        fathercontent.style.maxHeight = fathercontent.scrollHeight + "px";
        fathercontent.classList.add("open");
        adjustParentHeight(fatherheader.closest(".accordion")); // Cập nhật chiều cao cha

        const header = document
            .querySelector(".accordion-content")
            .querySelector(".accordion-header");
        const content = header.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add("open");
        adjustParentHeight(header.closest(".accordion")); // Cập nhật chiều cao cha

        console.log(htmlContent);

        addAnimation();
    },
    error: function (xhr, status, error) {
        // Khi có lỗi xảy ra
        console.error("Error loading Markdown file:", error);
    },
});

function parseMarkdown(idx, preLevel, lines, levels) {
    var htmlString = "";
    var lineCount = 0;
    if (idx == lines.length) {
        if (idx == 16) console.log("??");
        return { htmlString, lineCount };
    }
    if (idx > 0 && preLevel == -1 && levels[idx] < levels[idx - 1]) {
        if (idx == 16) console.log("??");
        return { htmlString, lineCount };
    }

    if (preLevel != -1 && preLevel !== levels[idx]) {
        console.log(preLevel + " STOP JUMP");
        return { htmlString, lineCount };
    }

    var line = lines[idx].trim();
    var prefix = getPrefix(line);

    switch (prefix) {
        case "#":
            console.log("Tiêu đề chính:" + line.substring(prefix.length));

            var result = parseMarkdown(idx + 1, -1, lines, levels);
            htmlString = createAccordionElement(
                1,
                line.substring(prefix.length),
                result.htmlString
            );

            lineCount = 1 + result.lineCount;

            result = parseMarkdown(idx + lineCount, 0, lines, levels);
            htmlString += result.htmlString;
            lineCount += result.lineCount;

            console.log("EXTRA LINE = " + result.lineCount);

            console.log("RESULT == " + htmlString);
            console.log("LINE COUNT MAIN: " + lineCount);

            break;
        case "##":
            console.log("Tiêu đề phụ");
            console.log("Tiêu đề phụ:" + line.substring(prefix.length));
            var result = parseMarkdown(idx + 1, -1, lines, levels);
            htmlString = createAccordionElement(
                2,
                line.substring(prefix.length),
                result.htmlString
            );

            lineCount = 1 + result.lineCount;

            result = parseMarkdown(idx + lineCount, 1, lines, levels);
            htmlString += result.htmlString;
            lineCount += result.lineCount;

            console.log("tiêu đề phụ " + htmlString);

            console.log("LINE COUNT ## " + lineCount);

            break;
        case "[desc]":
            console.log("Mô tả");
            idx += 1;
            htmlString = createDescriptionElement(lines[idx]);
            lineCount = 2;

            console.log("To: " + (idx + 1));
            var result = parseMarkdown(idx + 1, -1, lines, levels);
            htmlString += result.htmlString;
            lineCount += result.lineCount;
            break;
        case "[list]":
            console.log("Table");
            var result = parseMarkdown(idx + 1, -1, lines, levels);
            htmlString = createTableElement(result.htmlString);
            lineCount = 1 + result.lineCount;
            break;
        case "_:":
            console.log("Timeline");
            idx += 1;
            var header = lines[idx].trim();
            htmlString = createTimelineElement(
                line.substring(prefix.length),
                header.substring(1)
            );

            lineCount = 2;

            idx += 1;
            var tmp_idx = idx;
            var cnt = 0;
            while (tmp_idx < lines.length) {
                if (lines[tmp_idx].trim().substring(0, 1) == "+") cnt += 1;
                else break;
                tmp_idx += 1;
            }

            console.log("CNT = " + cnt);
            lineCount += cnt;
            if (cnt == 1) {
                var content = lines[idx].trim().substring(1);
                var htmlQuote = "";
                var last = idx + 1;
                if (
                    idx + 1 < lines.length &&
                    lines[idx + 1].trim().startsWith(">")
                ) {
                    htmlQuote = lines[idx + 1].trim().substring(1);
                    last += 1;
                    lineCount += 1;
                }

                htmlString += createRowElement(1, content, htmlQuote);
                console.log("TYPE 1 = " + htmlString);
                var result = parseMarkdown(last, -1, lines, levels);
                htmlString += result.htmlString;
                lineCount += result.lineCount;

                console.log("LINE COUNT CNT1 = " + lineCount);
            } else if (cnt >= 1) {
                var content = "";
                for (var i = idx + 1; i < idx + cnt; i++) {
                    content +=
                        `<p class="desc">` +
                        lines[i].trim().substring(1) +
                        `</p>`;
                }

                console.log("CONTENT = " + content);

                var htmlRow = createAccordionElement(
                    3,
                    lines[idx].trim().substring(1),
                    content
                );

                var htmlQuote = "";
                var last = idx + cnt;
                if (
                    idx + cnt < lines.length &&
                    lines[idx + cnt].trim().startsWith(">")
                ) {
                    htmlQuote = lines[idx + cnt].trim().substring(1);
                    last += 1;
                    lineCount += 1;
                }

                htmlString += createRowElement(2, htmlRow, htmlQuote);

                var result = parseMarkdown(last, -1, lines, levels);
                htmlString += result.htmlString;
                lineCount += result.lineCount;
            }

            break;
        case "+":
            console.log("content");
            break;
    }

    console.log("KET QUA = " + htmlString);
    console.log("LINE COUNT = " + lineCount);
    return { htmlString, lineCount };
}

function splitTextIntoLines(inputText) {
    return inputText.split("\n").filter((line) => line.trim() !== "");
}

function countTabs(lines) {
    return lines.map((line) => (line.match(/    /g) || []).length); // Đếm số \t xuất hiện
}

function getPrefix(line) {
    const match = line.match(/^\S+/);
    return match ? match[0] : null;
}

// Create Element
function createAccordionElement(level, header, content) {
    if (level == 3) {
        return (
            `<div class="accordion">
                            <div class="accordion-header">
                                <p class="desc">
                                    ` +
            header +
            `
                                </p>
                            </div>
                            <div class="accordion-content"> ` +
            content +
            `</div> </div>`
        );
    } else
        return (
            `<div class="accordion">
                            <div class="accordion-header">
                                <h2>
                                    ` +
            header +
            `
                                </h2>
                            </div>
                            <div class="accordion-content"> ` +
            content +
            `</div> </div>`
        );
}
function createDescriptionElement(content) {
    return `<p class="desc">` + content + `</p>`;
}

function createTableElement(content) {
    return `<table>` + content + `</table>`;
}

function createTimelineElement(timeline, header) {
    console.log("TIMELINE: " + timeline + " " + header);
    return (
        `<tr> <td> <div class="timeline"> ` +
        timeline +
        `</div> </td> ` +
        `<td> <div
                                                        class="timeline-header"
                                                    >` +
        header +
        ` </div> </td>` +
        `</tr>`
    );
}

function createRowElement(type, content, quote) {
    var htmlQuote =
        quote.trim() == "" ? "" : `<div class="quote">` + quote + `</div>`;
    if (type == 1) {
        return (
            `<tr>
                                                <td>
                                                    <div
                                                        class="vertical-line"
                                                    ></div>
                                                </td>

                                                <td>  <p class="timeline-desc">` +
            content +
            `</p> </td> ` +
            htmlQuote +
            `</td>` +
            `
                                                </tr>`
        );
    } else if (type == 2) {
        return (
            `<tr>
                                                <td>
                                                    <div
                                                        class="vertical-line"
                                                    ></div>
                                                </td>

                                                <td> ` +
            content +
            `</td> ` +
            `<td> ` +
            htmlQuote +
            ` </td>` +
            `
                                                </tr>`
        );
    }
}

/* Animation */

function addAnimation() {
    const getStartedButton = document.querySelector(".get-started");
    const contentContainer = document.querySelector(".content-container");
    getStartedButton.addEventListener("click", () => {
        contentContainer.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });

    // Adjust row height
    document.querySelectorAll("tr").forEach((row) => {
        row.dataset.base_height = row.offsetHeight;
        adjustTdHeight(row, row.offsetHeight);
    });

    // Chọn tất cả các tiêu đề accordion
    const headers = document.querySelectorAll(".accordion-header");

    headers.forEach((header) => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const parentAccordion = header.closest(".accordion"); // Accordion cha

            // Nếu đang mở thì thu nhỏ
            console.log("MAXHEIGHT = " + content.style.maxHeight);
            if (
                content.style.maxHeight !== "0px" &&
                content.style.maxHeight !== ""
            ) {
                console.log("THU NHỎ");
                // content.style.maxHeight = 0;
                // content.classList.remove("open");

                parentAccordion
                    .querySelectorAll(".accordion-content")
                    .forEach((otherContent) => {
                        // var table = otherContent.querySelector("table");
                        // if (table) {
                        otherContent.style.maxHeight = 0;
                        otherContent.classList.remove("open");
                        // }
                    });

                setTimeout(() => {
                    const table = parentAccordion.querySelector("table");
                    if (table) {
                        table.querySelectorAll("tr").forEach((row) => {
                            adjustTdHeight(row, row.dataset.base_height);
                        });
                    }
                }, 500);

                adjustParentHeight(parentAccordion); // Cập nhật chiều cao cha
            } else {
                console.log("MỞ RỘNG");
                // Thu nhỏ tất cả nội dung trong accordion cha
                // parentAccordion
                //     .querySelectorAll(".accordion-content")
                //     .forEach((otherContent) => {
                //         otherContent.style.maxHeight = null;
                //         otherContent.classList.remove("open");
                //     });

                // Mở rộng nội dung được chọn
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add("open");
                adjustParentHeight(parentAccordion); // Cập nhật chiều cao cha
            }
        });
    });
}

function adjustParentHeight(accordion) {
    let totalHeight = 0;

    // Tính tổng chiều cao của tất cả các accordion-content đang mở
    accordion
        .querySelectorAll(".accordion-content.open")
        .forEach((openContent) => {
            totalHeight += openContent.scrollHeight;
        });

    console.log(totalHeight + "px");
    const content = accordion.querySelector(".accordion-content");
    console.log("CONTENT " + content);
    content.style.maxHeight = totalHeight + "px";
    const parentContent = accordion.closest(".accordion-content");
    const tableRow = accordion.closest("tr");
    if (parentContent) {
        adjustParentHeight(parentContent.closest(".accordion"));
    }

    if (tableRow) {
        // console.log("H2" + accordion.offsetHeight);
        // adjustTdHeight(tableRow, accordion.offsetHeight);
        requestAnimationFrame(function () {
            var accordionHeight = Math.min(
                tableRow.offsetHeight,
                accordion.offsetHeight
            ); // Lấy chiều cao đúng của accordion

            if (tableRow) {
                adjustTdHeight(tableRow, accordionHeight);
            }
        });
    }
}

function adjustTdHeight(row, height) {
    var tds = row.querySelectorAll("td");
    var trHeight = Math.max(height, 40); // Lấy chiều cao của tr

    // Đặt chiều cao của mỗi td bằng chiều cao của tr
    tds.forEach(function (td) {
        td.style.height = trHeight + "px";
    });
}
