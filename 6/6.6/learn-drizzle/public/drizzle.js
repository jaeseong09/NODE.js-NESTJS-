import { comments } from "../drizzle/schema";

// 사용자 이름을 눌렀을 떄 댓글 로딩
document.querySelectorAll("#user-list tr").forEach((el) => {
  el.addEventListener("click", function () {
    const id = el.querySelector("td").textContent;
    getComment(id);
  });
});
async function getUser() {
  try {
    const res = await axios.get("/users");
    const users = res.data;
    console.log(users);
    const tbody = document.querySelector("#user-list tbody");
    tbody.innerHTML = "";
    users.map(function (user) {
      const row = document.createElement("tr");
      row.addEventListener("click", () => {
        getComment(user.id);
      });
      // 로우 셀 추가
      let td = document.createElement("td");
      td.textContent = user.id;
      row.appendChild(td);
      td = document.createElement("td");
      td.textContent = user.name;
      row.appendChild(td);
      td = document.createElement("td");
      td.textContent = user.age;
      row.appendChild(td);
      td = document.createElement("td");
      td.textContent = user.married ? "기혼" : "미혼";
      row.appendChild(td);
      tbody.appendChild(row);
    });
  } catch (err) {
    console.log(err);
  }
}
// 댓글 로딩
async function getComment(id) {
  try {
    const res = await axios.get(`/users/${id}/comments`);
    const comment = res.data;
    const tbody = document.querySelector("#comment-list tbody");
    tbody.innerHTML = "";
    comments.map(function (comment) {
      //로우 셀 추가
      const row = document.createElement("tr");
      let td = document.createElement("td");
      td.textContent = comment.id;
      row.appendChild(td);
      td = document.createElement("td");
      td.textContent = comment.user.name;
      row.appendChild(td);
      td = document.createElement("td");
      td.textContent = comment.comment;
      row.appendChild(td);
      const edit = document.createElement("button");
      edit.textContent = "수정";
      edit.addEventListener("click", async () => {
        // 수정 클릭 시
        const newComment = prompt("바꿀 내용을 입력하세요");
        if (!newComment) {
          return alert("내용을 반드시 입력해야합니다");
        }
        try {
          await axios.patch(`/comments/${comment.id}`, { comment: newComment });
          getComment(id);
        } catch (err) {
          console.log(err);
        }
      });
      const remove = document.createElement("button");
      remove.textContent = "삭제";
      remove.addEventListener("click", async () => {
        // 삭제 클릭 시
        try {
          await axios.delete(`/comments/${comment.id}`);
          getComment(id);
        } catch (err) {
          console.error(err);
        }
      });
      // 버튼 추가
      td = document.createElement("td");
      td.appendChild(edit);
      row.appendChild(td);
      td = document.createElement("td");
      td.appendChild(remove);
      row.appendChild(td);
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}
// 사용자 등록 시
