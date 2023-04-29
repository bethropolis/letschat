<script>
    import Header from "./header.svelte";
  import Snackbar from "./ui/snackbar.svelte";
  let activeTab = "ai";
  let textContent = "";
  let imageURL;
  let aiContent = "";
  let characterLimit = 100;
  let msg;
  let title = "Post";
  let navOptions = [
    {
      title: "home",
      icon: "fas fa-home",
      link: "home"
    }
  ]
  const handleTabClick = (tab) => {
    activeTab = tab;
  };

  const handleTextSubmit = () => {
    // Submit text content to server
    console.log("Submitting text content:", textContent);
    // Reset text content field
  };

  const handleImageSubmit = () => {
    // Submit image URL to server
    console.log("Submitting image URL:", imageURL);
    // Reset image URL field
  };

  const handleAISubmit = () => {
    // Submit AI-generated content to server
    console.log("Submitting AI-generated content:", aiContent);
    // Reset AI-generated content field
  };
  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      imageURL = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  const handleSubmit = () => {
    msg = `Submiting  &nbsp<i class="fa fa-spin fa-hourglass-1"></i>`;
    if (activeTab === "text") {
      handleTextSubmit();
    } else if (activeTab === "image") {
      handleImageSubmit();
    } else if (activeTab === "ai") {
      handleAISubmit();
    }
  };

  $: remainingCharacters = characterLimit - textContent.length;
</script>

<main>
  <Header {navOptions} {title}/>
  <div class="tabs">
    <button
      class={activeTab === "text" ? "active" : ""}
      on:click={() => handleTabClick("text")}>Text</button
    >
    <button
      class={activeTab === "image" ? "active" : ""}
      on:click={() => handleTabClick("image")}>Image</button
    >
    <button
      class={activeTab === "ai" ? "active" : ""}
      on:click={() => handleTabClick("ai")}>AI-generated</button
    >
  </div>

  <div class="content">
    {#if activeTab === "image"}
      <div class="image-input">
        {#if !imageURL}
          <div class="upload-container">
            <label for="image-upload" class="upload-button">
              <span><i class="fa fa-upload" /> Upload Image </span></label
            >
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              on:change={handleImageUpload}
              hidden
            />
          </div>
        {/if}

        {#if imageURL}
          <div class="image-container">
            <img src={imageURL} alt="Uploaded Image" class="uploaded-image" />
            <i
              title="remove"
              class="fa fa-times"
              on:click={() => (imageURL = "")}
            />
          </div>
        {/if}
      </div>
    {:else if activeTab === "ai"}
      <div class="ai-input">
        {#if !imageURL}      
        <div class="prompt-container">
          <label for="ai-prompt" class="prompt-label"
            >Enter image description:</label
          >
          <input
            type="text"
            id="ai-prompt"
            bind:value={aiContent}
            class="prompt-input"
            placeholder="Enter image prompt here..."
          />
        </div>
     {/if}

        {#if imageURL}
          <div class="image-preview">
            <img src={imageURL} alt="Selected Image" class="selected-image" />
          </div>
        {/if}
      </div>
    {/if}
    <div class="text-input">
      <textarea
        bind:value={textContent}
        maxlength={characterLimit}
        placeholder=" Enter text here..."
      />
      {#if textContent.length > 0}
        <p class="character-count">{remainingCharacters}</p>
      {/if}
    </div>
  </div>

  <div class="submit">
    <button on:click={handleSubmit} class="btn"
      >Submit
      <!-- a loader -->
    </button>
  </div>
  <Snackbar {msg} />
</main>

<style>
  main {
    margin-bottom: 20px;
  }
  .tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 1em;
  }

  .tabs button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: var(--color-text);
    margin-right: 10px;
    outline: none;
    border-radius: 0;
  }

  .tabs button:hover,
  .tabs button.active {
    border-bottom: 2px solid var(--color-primary);
    color: var(--color-primary);
  }

  .content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    place-content: center;
    margin-bottom: 50px;
  }
  .content-title {
    text-align: center;
    margin-bottom: 50px;
  }

  .content textarea,
  .content input[type="text"] {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    resize: vertical;
    min-height: 100px;
    border-radius: 5px;
    outline: none;
    font-size: 16px;
  }
  .text-input {
    position: relative;
    width: 90%;
    margin: 0 auto;
  }

  .character-count {
    position: absolute;
    bottom: 5px;
    right: 5px;
    margin: 0;
    color: #aaa;
    font-size: 12px;
  }

  /* IMAGE */
  .image-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 32px;
  }

  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px dotted #ccc;
    padding: 24px;
    border-radius: 8px;
    cursor: pointer;
  }

  .upload-container:hover {
    background-color: #f9f9f9;
  }

  .upload-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: white;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .upload-button i {
    font-size: 20px;
    margin-right: 8px;
  }

  .image-container {
    margin-top: 16px;
    position: relative;
    border: 2px dotted #ccc;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    max-width: 200px;
  }

  .uploaded-image {
    max-width: 100%;
    height: auto;
    margin-bottom: 16px;
    object-fit: contain;
  }
  .image-container .fa {
    position: absolute;
    bottom: 0;
    right: 5px;
    font-size: 2em;
    cursor: pointer;
  }

  /* AI */
  .ai-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 32px;
  }

  .prompt-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
    width: 90%;
  }

  .prompt-label {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .prompt-input {
    padding: 8px;
    border-radius: 4px;
    border: 2px solid #ccc;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  .image-preview {
    margin-bottom: 16px;
    width: 100%;
    height: 250px;
    border: 2px dotted #ccc;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .selected-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .select-image-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: #ccc;
  }

  textarea {
    width: 100%;
    height: 250px;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 8px;
    font-size: 16px;
    resize: none;
    margin-bottom: 16px;
    box-sizing: border-box;
  }
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2em;
  }
  button.btn {
    background-color: var(--color-primary);
    color: var(--color-light);
    border: none;
    padding: 10px 20px;
    width: 50%;
    border-radius: calc(var(--spacing-large) / 2);
    cursor: pointer;
  }
  button.btn:hover {
    background-color: var(--color-light);
    color: var(--color-primary);
    outline: 2px solid var(--color-primary);
  }
</style>
