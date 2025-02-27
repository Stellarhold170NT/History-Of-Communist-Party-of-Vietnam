# Hệ Thống Mốc Lịch Sử Đảng Cộng Sản Việt Nam

## Giới thiệu
Dự án này nhằm xây dựng một hệ thống trực quan hóa thông minh các mốc sự kiện lịch sử quan trọng của Đảng Cộng sản Việt Nam, từ năm 1850 đến 2030. Hệ thống sử dụng **giải thuật quay lui (backtracking)** để xử lý dữ liệu từ file Markdown, sau đó tạo ra các **accordion component lồng nhau**, giúp người dùng dễ dàng tra cứu và khám phá các sự kiện theo cách trực quan và hiệu quả.

Hệ thống kết hợp mã JavaScript hiện đại với giao diện thân thiện, cung cấp khả năng hiển thị các mốc thời gian, sự kiện, và chi tiết liên quan theo dạng timeline và accordion, tối ưu hóa trải nghiệm người dùng.

---

## Giải thuật quay lui trong hệ thống

### Ý tưởng chính
Giải thuật quay lui được sử dụng để phân tích và sắp xếp các mốc thời gian từ dữ liệu Markdown chứa thông tin lịch sử. Mục tiêu là tạo ra một cấu trúc dữ liệu phân cấp, trong đó các sự kiện được nhóm theo thời kỳ, năm, và chi tiết cụ thể, đồng thời đảm bảo tính chính xác và tối ưu khi hiển thị trên giao diện.

### Các bước thực hiện
1. **Phân tích cú pháp Markdown**:
   - Đọc file Markdown chứa danh sách các mốc sự kiện (ví dụ: tiêu đề `#` cho thời kỳ, `##` cho năm, `###` cho sự kiện cụ thể).
   - Chuyển đổi nội dung thành một cây phân cấp (hierarchical tree) bằng cách sử dụng các cấp độ tiêu đề (`#`, `##`, `###`) để xác định mức độ lồng nhau.

2. **Xây dựng cấu trúc dữ liệu**:
   - Sử dụng giải thuật quay lui để duyệt qua cây phân cấp:
     - Bắt đầu từ cấp cao nhất (thời kỳ).
     - Nếu gặp một cấp thấp hơn (năm hoặc sự kiện), quay lui để gắn dữ liệu vào node cha tương ứng.
     - Lặp lại quá trình cho đến khi toàn bộ dữ liệu được xử lý.
   - Kết quả là một danh sách các đối tượng (objects) chứa thông tin về thời kỳ, năm, và sự kiện, với mối quan hệ cha-con rõ ràng.

3. **Sắp xếp mốc thời gian**:
   - Sử dụng thông tin thời gian (năm, tháng, ngày) từ dữ liệu để sắp xếp các sự kiện theo thứ tự thời gian tăng dần.
   - Với các mốc thời gian phức tạp (ví dụ: "13-15/8/1945"), giải thuật tính toán khoảng cách và độ dài thời gian để hiển thị chính xác trên timeline.

4. **Tạo accordion component lồng nhau**:
   - Từ cấu trúc dữ liệu phân cấp, hệ thống sinh ra các accordion component:
     - Accordion cấp 1: Thời kỳ (ví dụ: "Giai đoạn 1930-1945").
     - Accordion cấp 2: Năm (ví dụ: "1930").
     - Accordion cấp 3: Sự kiện cụ thể (ví dụ: "Thành lập Đảng Cộng sản Việt Nam - 3/2/1930").
   - Các cấp accordion có thể mở rộng/thu gọn để hiển thị chi tiết.

5. **Tối ưu hóa giao diện timeline**:
   - Dựa trên dữ liệu đã xử lý, giải thuật tính toán vị trí (`marginLeft`) và độ dài (`range`) của các mốc thời gian trên trục thời gian (timeline).
   - Xử lý các trường hợp chồng lấn (overlap) bằng cách điều chỉnh hướng (`left` hoặc `right`) và mức độ (`level`) của các nhãn sự kiện.

### Pseudocode
```plaintext
function parseMarkdown(markdownContent):
    let tree = []
    let currentLevel = { level: 0, parent: null }
    
    for each line in markdownContent:
        if line starts with "#":
            let level = count("#")
            let content = extractContent(line)
            let node = { level: level, content: content, children: [] }
            
            // Quay lui để tìm parent
            while currentLevel.level >= level:
                currentLevel = currentLevel.parent
            node.parent = currentLevel
            currentLevel.children.push(node)
            currentLevel = node
    
    return tree

function buildTimeline(tree):
    let events = []
    for each node in tree:
        if node is leaf (sự kiện cụ thể):
            let time = extractTime(node.content)
            let pos = calculatePosition(time)
            events.push({ time: time, pos: pos, level: 0 })
        recursively process node.children
    
    sort events by pos
    assignLevels(events) // Gán mức độ để tránh chồng lấn
    return events

function renderAccordionAndTimeline(events):
    for each event in events:
        createAccordion(event)
        addToTimeline(event)
