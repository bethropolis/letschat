<script>
  export let msg;
  export let actions = [];
  export let progress = false;

  let visible = false;

  const showSnackbar = () => {
    visible = true;
    if (!progress) {
      setTimeout(() => {
        visible = false;
      }, 2000);
    }
  };

  const handleActionClick = (action) => {
    action.handler();
    visible = false;
  };

  $: if (msg) showSnackbar();
</script>

{#if visible}
  <div class="snackbar">
    <p>{@html msg}</p>
    {#if actions.length > 0}
      <div class="actions">
        {#each actions as action}
          <button on:click={() => handleActionClick(action)}
            >{action.label}</button
          >
        {/each}
      </div>
    {/if}
    {#if progress}
      <div class="progress" />
    {/if}
  </div>
{/if}

<style>
  .snackbar {
    position: fixed;
    display: flex;
    flex-direction: row;
    align-items: center;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-dark);
    color: var(--color-light);
    padding: 10px;
    border-radius: 5px;
    opacity: 0.8;
    transition: opacity 0.3s ease;
    z-index: 99;
  }

  .snackbar p {
    margin: 0;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .actions button {
    background-color: transparent;
    color: var(--color-light);
    border: 1px solid var(--color-light);
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
  }

  .actions button:hover {
    background-color: var(--color-light);
    color: #333;
  }

  .progress {
    width: 100%;
    height: 5px;
    background-color: var(--color-primary);
    border-radius: 5px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
</style>
