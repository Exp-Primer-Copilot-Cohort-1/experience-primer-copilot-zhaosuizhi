function skillsMember() {
    var member = document.getElementById("member");
    var memberSkills = document.getElementById("memberSkills");
    var memberSkillsBtn = document.getElementById("memberSkillsBtn");
    if (memberSkills.style.display === "none") {
        memberSkills.style.display = "block";
        memberSkillsBtn.innerHTML = "Hide Skills";
        member.style.height = "auto";
    } else {
        memberSkills.style.display = "none";
        memberSkillsBtn.innerHTML = "Show Skills";
        member.style.height = "250px";
    }
}