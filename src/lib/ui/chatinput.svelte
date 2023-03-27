<script>
  let message = "";
  let isExpanded = false;

  const toggleExpansion = () => {
    isExpanded = !isExpanded;
  };

  const sendMessage = () => {
    if (message.trim()) {
      console.log(`Sending message: ${message}`);
      message = "";
    }
  };
</script>

<div class="chat-input"> 
  {#if isExpanded}
    <div class="attachment-options">
      <button><i class="fas fa-image"></i></button>
      <button><i class="fas fa-music"></i></button>
      <button><i class="fas fa-file"></i></button>
    </div>
  {/if}
  
  <div class="input-wrapper">
    <button class="add-attachment" on:click={toggleExpansion}>
      <i class="fas fa-plus"></i>
    </button>
    <textarea
      class={isExpanded ? "expanded" : ""}
      placeholder="Type your message here..."
      bind:value={message}
    ></textarea>
    <button class="send-button" on:click={sendMessage}>
      <i class="fas fa-paper-plane"></i>
    </button>
  </div>
</div>

<style>
  .chat-input {
    position: fixed;
    display: grid;
    grid-template-columns: repeat(1fr auto,2);
    background-color: white;
    padding: 8px;
    height: fit-content;
    width: 100%;
    bottom: 0;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    border-radius: 30px;
  }

  .add-attachment {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: #d4d4d4;
    border: none;
    cursor: pointer;
    margin-right: 8px;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: color 0.2s ease-in-out;
  }

  .add-attachment:hover {
    color: var(--color-primary);
  }

  .send-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-primary);
    color: white;
    border: none;
    cursor: pointer;
    margin-right: 8px;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease-in-out;
  }

  .send-button:hover {
    background-color: #7289da;
  }
  .send-button:active{
    transform: scale(.9);
  }

  textarea {
    flex: 1;
    font-size: 1rem;
    padding: 10px 16px;
    border: none;
    background-color: #f0f0f0;
    border-radius: 30px;
    outline: none;
    resize: none;
    transition: all 0.2s ease-in-out;
  }

  textarea.expanded {
    height: 80px;
  }

  .attachment-options {
    display: flex;
    justify-content: space-evenly;
    height: 70px;
    align-items: center;
  }

  .attachment-options button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: var(--color-icon);
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: color 0.2s ease-in-out;
  }

  </style>