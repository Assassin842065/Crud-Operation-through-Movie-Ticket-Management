let addbtn=document.querySelector(".add-btn");
let modelContainer=document.querySelector(".model-container");
let mainContainer=document.querySelector(".main-container");
let textarea=document.querySelector(".text-area");
let modalprioritycolor=document.querySelectorAll(".priority-color");
let removebtn=document.querySelector(".remove-btn");
let prioritycard=document.querySelectorAll(".priority-card");
let priorityCardCont=document.querySelector(".priority-action-container");
let colorsArr=["pink","yellow","orange","black"];
let addflag=false;
let removeflag=false;
let ticketcolor="pink";
let lockclass="fa-lock";
let unlockclass="fa-lock-open";
let ticketArr=[];

if(localStorage.getItem("Jira-Ticket")){
  ticketArr=JSON.parse(localStorage.getItem("Jira-Ticket"));
  ticketArr.forEach(ticketObj=> {
     createTicket(ticketObj.color,ticketObj.id,ticketObj.text);
  });
}


//navbar
addbtn.addEventListener("click",(e)=>{
      addflag=!addflag;
      if(addflag){
        modelContainer.style.display="flex";
      }else{
        modelContainer.style.display="none";
      }
})

removebtn.addEventListener("click",(e)=>{
  removeflag=!removeflag;
})

prioritycard.forEach(card => {
  card.addEventListener("click",(e)=>{
    let headcolor=card.classList[1];
    let alltickets=document.querySelectorAll(".ticket-container");
    alltickets.forEach((ticket)=>{
        let tcolor=ticket.children[0].classList[1];
        if(tcolor==headcolor){
          ticket.style.display="block";
        }else{
          ticket.style.display="none";
        }
    })
  })
});

priorityCardCont.addEventListener("dblclick",(e)=>{
  let alltickets=document.querySelectorAll(".ticket-container");
  alltickets.forEach((ticket)=>{
      ticket.style.display="block";
  })
})

//modal-container
modelContainer.addEventListener("keydown",(e)=>{
    let key=e.key;
    if(key=="Shift"){
        createTicket(ticketcolor,undefined,textarea.value);
        addflag=false;
        modelContainer.style.display="none";
        textarea.value="";      
    }
})

modalprioritycolor.forEach((color)=>{
  color.addEventListener("click",(e)=>{
    modalprioritycolor.forEach((colorEle,idx)=>{
      colorEle.classList.remove("border");
    })
    color.classList.add("border");
    ticketcolor=color.classList[1];
  })
})


function createTicket(color,tid,text){
    let id=tid || shortid();
    let divEle=document.createElement("div");
    divEle.innerHTML=`
        <div class="ticket-color ${color}"></div>
        <div class="ticket-id">${id}</div>
        <div class="task-container" spellcheck="false">${text}</div>
        <div class="ticket-lock">
                <i class="fas fa-lock"></i>
        </div>
    `;
    divEle.setAttribute("class","ticket-container");
    mainContainer.appendChild(divEle);

    if(!tid){
      ticketArr.push({color,id,text});
      localStorage.setItem("Jira-Ticket",JSON.stringify(ticketArr));
    }

    handleRemoval(divEle,id);
    handleColors(divEle,id);
    handleLock(divEle,id);
}

function handleRemoval(ticket,id) {
   ticket.addEventListener("click",(e)=>{
    if(removeflag){
      let idx=getTicketIdx(id);
      ticketArr.splice(idx,1);
      localStorage.setItem("Jira-Ticket",JSON.stringify(ticketArr));
      ticket.remove();
    }
   })
}

function handleColors(ticket,id) {
   let ticketColorHead=ticket.children[0];
   ticketColorHead.addEventListener("click",(e)=>{
    let currColor=ticketColorHead.classList[1];
    let currColorIdx=colorsArr.findIndex((color)=>{
      return currColor===color;
    })
    let nextColorIdx=(currColorIdx+1)%colorsArr.length;
    let nextColor=colorsArr[nextColorIdx];
    ticketColorHead.classList.remove(currColor);
    ticketColorHead.classList.add(nextColor);

      let idx=getTicketIdx(id);
      ticketArr[idx].color=nextColor;
      localStorage.setItem("Jira-Ticket",JSON.stringify(ticketArr));
   })
}

function handleLock(ticket,id) {
  let ticketlockCont=ticket.children[3];
  let taskarea=ticket.children[2];
  let ticketlock=ticketlockCont.children[0];
  ticketlock.addEventListener("click",(e)=>{
      if(ticketlock.classList.contains(lockclass)){
        ticketlock.classList.remove(lockclass);
        ticketlock.classList.add(unlockclass);
        taskarea.setAttribute("contentEditable","true");
      }else{
        ticketlock.classList.remove(unlockclass);
        ticketlock.classList.add(lockclass);
        taskarea.setAttribute("contentEditable","false");
      }

      let idx=getTicketIdx(id);
      ticketArr[idx].text=taskarea.innerText;
      localStorage.setItem("Jira-Ticket",JSON.stringify(ticketArr));
  })
}

function getTicketIdx(id) {
   let idx=ticketArr.findIndex((ticketObj)=>{
    return ticketObj.id==id;
   })
   return idx;
}












