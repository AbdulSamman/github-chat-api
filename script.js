const form = document.querySelector("form");
const titleInput = document.getElementById("titleInput");
const textInput = document.getElementById("txtbody");
const msgContainer = document.getElementById("postContainer");
const body = document.querySelector("body");

const apiUrl = `https://dci-chat-api.herokuapp.com/messages`;

async function getMsg() {
  const response = await fetch(apiUrl);
  const data = await response.json();

  data.forEach(async (msg) => {
    const post = await renderMsg(msg.from, msg.message, msg.id);

    msgContainer.appendChild(post);
  });
}
const colorGenerator = () => {
  let color = "#";
  const letters = "0123456789ABCDEF";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

async function renderMsg(from, message, id) {
  try {
    const post = document.createElement("div");
    post.classList.add(`rounded`, `mb-2`, `p-3`, `text-light`);

    post.style.backgroundColor = "#5885AF";
    post.style.boxShadow = `
    inset 1em 1em 1em -1em white,
    inset -1em -1em 1em -1em black`;
    const titleElement = document.createElement("h2");

    const contentElement = document.createElement("p");
    const objAvatar = await githubAvatar(from);
    let githubName = "";

    const avatarImgCon = document.createElement("div");
    avatarImgCon.classList.add("avatarImgCon");
    const avatarImg = document.createElement("img");
    avatarImg.src = "";

    if (objAvatar.name && objAvatar.avatar_url) {
      githubName = objAvatar.name;
      titleElement.textContent = githubName;
      avatarImg.src = objAvatar.avatar_url;
      post.style.backgroundColor = "#189AB4";
    } else {
      titleElement.textContent = from;
      avatarImg.style.display = "none";
      const imgNotUser = document.createElement("div");
      imgNotUser.classList.add("imgNotUser");
      const spanNotUser = document.createElement("div");
      spanNotUser.classList.add("spanNotUser");
      spanNotUser.textContent = from[0];
      spanNotUser.style.color = `${colorGenerator()}`;
      imgNotUser.style.border = `5px solid ${colorGenerator()}`;
      avatarImgCon.appendChild(imgNotUser);
      imgNotUser.appendChild(spanNotUser);
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add(`btn`, `btn-outline-danger`);

    deleteButton.textContent = "X";

    contentElement.textContent = message;

    avatarImg.style.border = `5px solid ${colorGenerator()}`;

    post.id = "post" + id;

    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      deleteMsg(id);
      post.style.display = "none";
    });
    post.appendChild(avatarImgCon);
    avatarImgCon.appendChild(avatarImg);
    post.appendChild(titleElement);
    post.appendChild(contentElement);

    avatarImgCon.appendChild(deleteButton);
    return post;
  } catch (error) {
    console.log("renderMSG konnten nicht geladen werden");
  }
}

getMsg();

form.addEventListener("submit", createMsg);

async function createMsg(event) {
  event.preventDefault();

  const fromMsg = titleInput.value;
  const txtMsg = textInput.value;

  //console.log(fromMsg, txtMsg);
  //object erstellen genau wie object(data) -> JSON.stringify
  //payload ist ->  requist(option)
  const payLoad = {
    from: fromMsg,
    message: txtMsg,
    userId: 1,
  };

  //Daten an Server schicken
  //{verschiedene einstellungen für fetch }-> (creating sources)
  const response = await fetch(`https://dci-chat-api.herokuapp.com/new`, {
    method: `POST`,
    body: JSON.stringify(payLoad), //--> JSON.stringify ("form":"value")
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  // Daten bekommen
  const data = await response.json();
  const newMsg = await renderMsg(data.from, data.message, data.id);
  msgContainer.prepend(newMsg);
}

//delete messages
async function deleteMsg(id) {
  const response = await fetch(`https://dci-chat-api.herokuapp.com/` + id, {
    method: `DELETE`,
  });
  const data = await response.json();
}

async function githubAvatar(githubUser) {
  try {
    const response = await fetch(`https://api.github.com/users/${githubUser}`, {
      headers: {
        Authorization: "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",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("getHub error");
  }
}
