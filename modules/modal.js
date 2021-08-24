import { modalDiv, gameData } from '../script.js';

export function closeModal() {
  modalDiv.innerHTML = '';
  modalDiv.classList.add('hidden');
  modalDiv.classList.remove('visible');
  modalDiv.style.zIndex = '-5';
  gameData.isModalOpen = false;
}
export function showModal() {
  gameData.isModalOpen = true;
  modalDiv.classList.remove('hidden');
  modalDiv.classList.add('visible');
  modalDiv.style.zIndex = '10';

  const html = `<div class="overlay">
   <div class="modal-box">
     <span class="close-modal">&times;</span>
     <h2 class="modal-title">Hello!</h2>
     <p class="first paragraph">
       It is pretty obvious that inspiration for this project came from
       well known
       <a
         href="https://youtu.be/nANNPAlR2Z4?t=23"
         target="_blank"
         class="youTube-link"
         >'Whack a Mole'</a
       >
       original game. As I began developing, I decided to use as much as
       possible of my personal graphic resources, such as
       <a
         href="https://www.shutterstock.com/image-vector/archery-target-vector-illustration-1239642031"
         class="youTube-link"
         target="_blank"
         >target images</a
       >,
       <a
         href="https://www.shutterstock.com/image-vector/illustration-randomly-grouped-bullet-holes-pierced-1684976872"
         class="youTube-link"
         target="_blank"
         >bullet holes images</a
       >, bullets images, targets x-marks,<a
         href="https://www.shutterstock.com/image-illustration/set-fifteen-red-cross-hairs-bullet-138385712"
         class="youTube-link"
         target="_blank"
         >crosshair image</a
       >
       etc.
     </p>
     <p class="second paragraph">
       Even though this game could be significantly improved by adding
       extra functionality, such as levels, various choices and options for
       user...I rather kept it simple in order to save a valuable time,
       time I'd rather spend building another project and learning and
       practicing new JavaScript skills, as this one in my opinion
       fulfilled it's purpose.
     </p>
     <h2 class="modal-title">Rules</h2>
     <p class="third paragraph">
       Click on the Start button, and after short music intro, targets will
       appear randomly on their spots. Earned points depends on your
       precision. 'Green' circle is 'Bullseye', and it brings 12 points. As
       you progress, targets will appear with progressing speed. Every time
       you miss, you lose one life. Number of lives is represented by
       number of shiny bullets left.
     </p>
     <p class="fourth paragraph">
       Press <kbd>Esc</kbd> button, click <span class="x">X</span> in the
       upper right corner or anywhere outside this window to leave.
       <span class="x">Enjoy</span> the game.
     </p>
   </div>
 </div>`;

  modalDiv.insertAdjacentHTML('beforeend', html);

  const closeModalSpan = document.querySelector('.close-modal');
  closeModalSpan.addEventListener('click', closeModal);
}
