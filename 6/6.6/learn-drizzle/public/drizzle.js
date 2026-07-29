// 이 파일은 <script src="/drizzle.js">로 (type="module" 없이) 로드되므로
// ESM import 문을 쓰면 브라우저에서 문법 오류가 발생한다.
// 게다가 이 import는 서버 전용 drizzle 스키마 파일을 가리키고 있어 정적 파일로 제공되지도 않는다.
// (원래 있던 `import { comments } from "../drizzle/schema";`는 오타/버그였으므로 제거함)

// 서버에서 nunjucks로 최초 렌더링된 사용자 목록(tr)에 클릭 이벤트를 바인딩한다.
document.querySelectorAll("#user-list tr").forEach((el) => {
  el.addEventListener("click", function () {
    const id = el.querySelector("td").textContent;
    getComment(id);
  });
});

// 사용자 목록을 서버에서 다시 받아와 테이블을 그리는 함수
// (사용자 등록 후 목록을 갱신할 때 호출된다)
async function getUser() {
  try {
    const res = await axios.get("/users");
    const users = res.data;
    console.log(users);
    const tbody = document.querySelector("#user-list tbody");
    tbody.innerHTML = ""; // 기존 행을 비우고 새로 그림
    users.map(function (user) {
      const row = document.createElement("tr");
      // 새로 추가된 행에도 클릭 시 댓글을 불러오도록 이벤트 등록
      row.addEventListener("click", () => {
        getComment(user.id);
      });
      // 로우 셀 추가 (아이디, 이름, 나이, 결혼 여부 순서)
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
// 특정 사용자의 댓글 목록을 불러와 테이블을 그리는 함수
async function getComment(id) {
  try {
    const res = await axios.get(`/users/${id}/comments`);
    const comment = res.data; // 서버에서 받아온 댓글 배열
    const tbody = document.querySelector("#comment-list tbody");
    tbody.innerHTML = ""; // 기존 행을 비우고 새로 그림
    // 실제로 화면에 그려야 할 데이터는 위에서 받아온 `comment`(단수)이므로 이를 순회해야 한다.
    comment.map(function (comment) {
      // 로우 셀 추가 (아이디, 작성자, 댓글, 수정 버튼, 삭제 버튼 순서)
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
      // 수정 버튼: 클릭하면 새 내용을 입력받아 PATCH 요청으로 댓글을 수정
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
          getComment(id); // 수정 후 해당 사용자의 댓글 목록 갱신
        } catch (err) {
          console.log(err);
        }
      });
      // 삭제 버튼: 클릭하면 DELETE 요청으로 댓글을 삭제
      const remove = document.createElement("button");
      remove.textContent = "삭제";
      remove.addEventListener("click", async () => {
        // 삭제 클릭 시
        try {
          await axios.delete(`/comments/${comment.id}`);
          getComment(id); // 삭제 후 해당 사용자의 댓글 목록 갱신
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
// 오타 수정: HTML에는 id="user-form"으로 되어 있는데 "user-from"으로 되어 있어
// getElementById가 null을 반환하고 addEventListener 호출 시 에러가 나던 부분.
document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.username.value;
  const age = e.target.age.value;
  const married = e.target.married.checked;
  if (!name) {
    return alert("이름을 입력하세요");
  }
  if (!age) {
    return alert("나이를 입력하세요");
  }
  try {
    await axios.post("/users", { name, age, married });
    getUser(); // 등록 성공 후 사용자 목록 갱신
  } catch (err) {
    console.error(err);
  }
  // 입력 폼 초기화
  e.target.username.value = "";
  e.target.age.value = "";
  e.target.married.checked = false;
});

// 댓글 등록 시
document
  .getElementById("comment-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;
    if (!id) {
      return alert("아이디를 입력하세요");
    }
    if (!comment) {
      return alert("댓글을 입력하세요");
    }
    try {
      await axios.post("/comments", { id, comment });
      getComment(id); // 등록 성공 후 해당 사용자의 댓글 목록 갱신
    } catch (err) {
      console.error(err);
    }
    // 입력 폼 초기화
    e.target.userid.value = "";
    e.target.comment.value = "";
  });
