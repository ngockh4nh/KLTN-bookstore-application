const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

// Lấy cuộc trò chuyện từ Local Storage (nếu có)
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
const RASA_ENDPOINT = "http://localhost:5005/webhooks/rest/webhook"; // Thay đổi địa chỉ Rasa server tại đây
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Tạo một phần tử <li> cho cuộc trò chuyện với tin nhắn và className đã cho
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // Trả về phần tử <li> cho cuộc trò chuyện
}

const saveChatHistory = () => {
    // Lưu cuộc trò chuyện vào Local Storage
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    // Định nghĩa các thuộc tính và tin nhắn cho yêu cầu Rasa
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "message": userMessage, "sender": "user_id_here" }), // Thay "user_id_here" bằng ID của người dùng tương ứng
    }

    // Gửi yêu cầu POST đến máy chủ Rasa, nhận phản hồi và hiển thị nó trên chatbox
    fetch(RASA_ENDPOINT, requestOptions)
        .then(res => res.json())
        .then(data => {
            const responseMessage = data[0].text.trim();
            messageElement.textContent = responseMessage;

            // Thêm cuộc trò chuyện vào lịch sử cuộc trò chuyện
            chatHistory.push({ user: userMessage, bot: responseMessage });
            saveChatHistory();
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Rất tiếc! Có lỗi xảy ra. Vui lòng thử lại.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Lấy tin nhắn của người dùng và loại bỏ khoảng trắng thừa
    if (!userMessage) return;

    // Xóa nội dung của textarea và đặt chiều cao về mặc định
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Thêm tin nhắn của người dùng vào chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Hiển thị tin nhắn "Thinking..." trong lúc chờ phản hồi
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Điều chỉnh chiều cao của textarea dựa trên nội dung của nó
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // Nếu phím Enter được nhấn mà không có phím Shift và chiều rộng của cửa sổ lớn hơn 800px, xử lý cuộc trò chuyện
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// Khôi phục lịch sử cuộc trò chuyện khi trang web tải lại
window.addEventListener("load", () => {
    chatHistory.forEach(item => {
        chatbox.appendChild(createChatLi(item.user, "outgoing"));
        chatbox.appendChild(createChatLi(item.bot, "incoming"));
    });
    chatbox.scrollTo(0, chatbox.scrollHeight);
});
