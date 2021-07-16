document.getElementById("add").addEventListener("submit", (e) => {
  e.preventDefault();
  let name = e.target.name.value;
  let age = e.target.age.value;
  let breed = e.target.breed.value;
  fetch("/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name,
      age,
      breed,
    }),
  }).then(() => location.reload());
});

document.getElementById("update").addEventListener("submit", (e) => {
  e.preventDefault();
  let name = e.target.name.value;
  let age = e.target.age.value;
  let breed = e.target.breed.value;
  fetch("/" + e.target.id.value, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name,
      age,
      breed,
    }),
  }).then(() => location.reload());
});

Array(...document.getElementsByClassName("delete")).forEach((ele) =>
  ele.addEventListener("click", (e) => {
    fetch("/" + e.target.dataset.id, {
      method: "DELETE",
    }).then(() => location.reload());
  })
);

Array(...document.getElementsByClassName("edit")).forEach((ele) =>
  ele.addEventListener("click", (e) => {
    document.getElementById("update").name.value = e.target.dataset.name;
    document.getElementById("update").breed.value = e.target.dataset.breed;
    document.getElementById("update").age.value = e.target.dataset.age;
    document.getElementById("update").id.value = e.target.dataset.id;
  })
);
