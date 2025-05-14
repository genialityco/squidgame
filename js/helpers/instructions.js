export function showInstructionModal(text) {
  return new Promise((resolve) => {
    const modal = document.getElementById("instructionModal");
    const textContainer = document.getElementById("instructionText");
    const continueBtn = document.getElementById("continueInstruction");

    textContainer.textContent = text;
    modal.style.display = "block";

    continueBtn.onclick = () => {
      modal.style.display = "none";
      resolve();
    };
  });
}
