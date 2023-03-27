<script>
  export let isOpen = false;

  const toggleSheet = () => {
    isOpen = !isOpen;
  };
</script>

<div class="bottom-sheet {isOpen ? 'open' : ''}">
  <div class="bottom-sheet-handle" on:click={toggleSheet} />
  <slot />
</div>

<style>
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    padding: 20px;
    transition: transform 0.3s ease-out;
    transform: translateY(100%);
  }

  .bottom-sheet.open {
    transform: translateY(0);
  }

  .bottom-sheet-handle {
    width: 40px;
    height: 5px;
    border-radius: 5px;
    background-color: gray;
    margin: 10px auto;
    cursor: pointer;
  }
</style>
