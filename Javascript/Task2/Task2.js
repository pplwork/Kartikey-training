// Write a program that shows a form on web browser, with fields email, password, sex (drop down with option of male, female, other), Role ( Radio button with option of Admin and User), Permissions (Checkbox with option Perm1, Perm2, Perm3, Perm4), Submit button.

// On clicking Submit button, following validation should take place
// 1. All fields should be filled.
// 2. Email should be valid
// 3. password should be min 6 character with MIX of Upercase, lowercase, digits
// 4. Atleast 2 permissions should be ticked.

// If all validation pass, the form and submit button should disapper and all the filled in details in the form should appear with a Confirm Button.

const checkPass = (pass) => {
  if (pass.length < 6) return false;
  // if has 1 or more lowercase, and one or more uppercase and one or more digits then valid
  if (/[a-z]+/.test(pass) && /[A-Z]+/.test(pass) && /[0-9]+/.test(pass))
    return true;
  return false;
};

const form = document.querySelector("form");
const userData = document.querySelector("#userData");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  const sex = form.sex.value;
  const role = form.role.value;
  const permissions = Array.from(
    form.querySelectorAll("input[name='permission']:checked")
  ).map((ele) => ele.value);
  if (!checkPass(password)) {
    alert(
      "Password should be min 6 character with MIX of Upercase, lowercase, digits"
    );
    return;
  }
  if (permissions.length < 2) {
    alert("Not Enough Permissions Selected ( Min 2 )");
    return;
  }
  form.classList.toggle("hidden");
  userData.querySelector("#userEmail").textContent = `Email : ${email}`;
  userData.querySelector(
    "#userPassword"
  ).textContent = `Password : ${password}`;
  userData.querySelector("#userSex").textContent = `Sex : ${sex}`;
  userData.querySelector("#userRole").textContent = `Role : ${role}`;
  let permissionList = document.createElement("ul");
  permissions.forEach((permission) => {
    let li = document.createElement("li");
    li.textContent = permission;
    permissionList.appendChild(li);
  });
  userData.querySelector("#userPermissions").innerHTML =
    "<p>Permissions : </p>";
  userData.querySelector("#userPermissions").appendChild(permissionList);
  userData.classList.toggle("hidden");
});
