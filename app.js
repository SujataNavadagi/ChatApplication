const chatInput =document.querySelector(".chat-input textarea") 
const sendChatBtn =document.querySelector(".chat-input span") 
const chatbox =document.querySelector(".chatbox") 
const chatbotToggler =document.querySelector(".chatbot-toggler") 
const chatbotCloseBtn =document.querySelector(".close-btn") 

let userMessage;
const API_KEY ="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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi =(message, className) =>{
    //create a chat <li> element with passed message and className
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent=className === "outgoing" ? `<p></p>`:`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) =>{
    const API_URL ="https://api.openai.com/v1/chat/completions";
    const messageElement=incomingChatLi.querySelector("p")

    const requestOptions ={
        method  : "POST",
        headers : {
            "Content-type": "application/json",
            "Authorization" :`Bearer ${API_KEY}`
        },
        body : JSON.stringify({
            model : "gpt-3.5-turbo",
            messages : [{role:"user", content: userMessage}]
        })
    }
    //send post request to API, get responce
    fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! someting went wrong try again. ";
    }).finally(()=> chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat =()=>{
    userMessage =chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height =`${inputInitHeight}px`;

    //Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

setTimeout(()=>{
    //display thinking message while waiting for message
    const incomingChatLi = createChatLi("Thinking...", "incoming")
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
},600);
}

chatInput.addEventListener("input", ()=>{
    //Adjust the height of the input textarea based on its content
    chatInput.style.height =`${inputInitHeight}px`;
    chatInput.style.height =`${chatInput.scrollHeight}px`;
});


chatInput.addEventListener("keydown", (e)=>{
    //if enter key is pressed without shift key and the window
    //width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", ()=> document.body.classList.remove("show-chatbot"))
chatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"))