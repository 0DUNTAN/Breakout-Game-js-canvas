const  timer= document.getElementById('timer')

function removeZoom() {
  timer.classList.remove('zoom');
}



function countDown() {
  timer.classList.toggle('zoom');
  
    
  setTimeout(() => {
    timer.innerHTML = `
      <strong class="yellow">2</strong>
    `;
        
    timer.classList.toggle('zoom');
    
    
    
      setTimeout(() => {
        timer.innerHTML = `
          <strong class="yellow">1</strong>
        `;

        timer.classList.add('zoom');
      }, 1000);

  }, 1000);
}


countDown();