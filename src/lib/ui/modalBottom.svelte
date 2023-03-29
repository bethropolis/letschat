<script>
  export let isOpen = true;
  let startY = 0;
  let startHeight = 0;
  let handle = null;
  let max = false;

  const toggleSheet = () => {
    if(handle){
      handle.parentNode.style.height = `fit-content`;
    }
    isOpen = !isOpen;

  };
  const resize  = ()=>{
    if(!handle)return;
    if(!max) return;
       handle.parentNode.style.height = `fit-content`;
 
  }

  const handleTouchStart = (event) => {
    event.preventDefault();
    startY = event.touches[0].clientY;
    startHeight = handle.parentNode.offsetHeight;
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (event) => {
      const deltaY = startY - event.touches[0].clientY;
      const newHeight = startHeight + deltaY;
      if (newHeight >= 500) return max=true;
      handle.parentNode.style.height = `${newHeight}px`;
      requestAnimationFrame(() => {
        handle.parentNode.style.height = `${newHeight}px`;
      });
    
  
  };

  const handleTouchEnd = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };
</script>
<main>
<div class="bottom-sheet {isOpen ? 'open' : ''}" on:dblclick={resize}>
  <div class="bottom-sheet-handle" on:touchstart={handleTouchStart} on:click={toggleSheet} bind:this={handle}></div>
  <slot />
</div>
 </main>
<style>
  main{
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 99;
  }
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-post);
    padding: 10px 30px 30px;
    border-radius: 24px 24px 0 0;
    transition: transform 0.3s ease-out;
    transform: translateY(100%);
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    font-weight: 500;
    user-select: none;
    overflow: hidden;
  }

  .bottom-sheet.open {
    transform: translateY(0);
  }

  .bottom-sheet-handle {
    width: 40px;
    height: 5px;
    border-radius: 5px;
    background-color: var(--color-icon);
    margin: 10px auto 30px;
    cursor: pointer;
    pointer-events: auto;
  }
</style>