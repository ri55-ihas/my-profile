import './style.css'

document.querySelector("#app").innerHTML = `
<div class="card">
<p id="count"></p>
<button id="btnPlus">増やす</button>
<button id="btnMinus">減らす</button>
<button id="btnReset">リセット</button>
</div>
`;

const countEl = document.querySelector('#count');
const btnPlus= document.querySelector('#btnPlus');
const btnMinus = document.querySelector('#btnMinus');
const btnReset = document.querySelector('#btnReset');

let count = 0;

btnPlus.addEventListener('click', () => {
  count += 1;
  countEl.textContent = count;
});

btnMinus.addEventListener('click', () => {
  count -= 1;
  countEl.textContent = count;
});

btnReset.addEventListener('click', () => {
  count = 0;
  countEl.textContent = count;
});