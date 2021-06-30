document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-article").forEach((ele) => {
    ele.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      fetch(`/articles/${id}`, {
        method: "DELETE",
      }).then((res) => {
        console.log(res);
        window.location.href = "/";
      });
    });
  });
});
